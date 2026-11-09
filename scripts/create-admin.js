const { promisify } = require('node:util');
const { randomBytes, scrypt: scryptCallback } = require('node:crypto');
const readline = require('node:readline');
const { sequelize, Usuario } = require('../Models');

const scrypt = promisify(scryptCallback);

function ask(question) {
  const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    prompt.question(question, (answer) => {
      prompt.close();
      resolve(answer);
    });
  });
}

function askPassword(question) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('Ejecuta este comando desde una terminal interactiva.');
  }

  return new Promise((resolve, reject) => {
    process.stdout.write(question);
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    let password = '';

    function finish(error) {
      process.stdin.removeListener('keypress', handleKeypress);
      process.stdin.setRawMode(false);
      process.stdout.write('\n');

      if (error) {
        reject(error);
      } else {
        resolve(password);
      }
    }

    function handleKeypress(character, key = {}) {
      if (key.ctrl && key.name === 'c') {
        finish(new Error('Operación cancelada.'));
        return;
      }

      if (key.name === 'return' || key.name === 'enter') {
        finish();
        return;
      }

      if (key.name === 'backspace') {
        if (password.length) {
          password = password.slice(0, -1);
          process.stdout.write('\b \b');
        }
        return;
      }

      if (character && !key.ctrl && !key.meta) {
        password += character;
        process.stdout.write('*');
      }
    }

    process.stdin.on('keypress', handleKeypress);
  });
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');

  return scrypt(password, salt, 64).then(
    (hash) => `scrypt$${salt}$${hash.toString('hex')}`,
  );
}

async function createAdmin() {
  if (!process.env.JWT_SECRET) {
    throw new Error('Configura JWT_SECRET en el archivo .env del backend.');
  }

  await sequelize.authenticate();
  await sequelize.sync();

  const existingAdmin = await Usuario.findOne({
    where: { rol: 'admin' },
    attributes: ['id', 'email'],
  });

  if (existingAdmin) {
    console.log(`Ya existe una cuenta administradora (${existingAdmin.email}).`);
    return;
  }

  const nombre = (await ask('Nombre de la persona administradora: ')).trim();
  const email = (await ask('Correo electrónico: ')).trim();

  if (!nombre) {
    throw new Error('El nombre es obligatorio.');
  }

  if (nombre.length > 100) {
    throw new Error('El nombre no puede superar 100 caracteres.');
  }

  if (email.length > 100 || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('Ingresa un correo electrónico válido de hasta 100 caracteres.');
  }

  const existingUser = await Usuario.findOne({
    where: { email },
    attributes: ['id'],
  });

  if (existingUser) {
    throw new Error('Ese correo ya pertenece a una cuenta.');
  }

  const password = await askPassword('Contraseña (mínimo 8 caracteres): ');
  if (!password.trim() || password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres.');
  }

  const encodedPassword = await hashPassword(password);
  const admin = await Usuario.create({
    nombre,
    email,
    password: encodedPassword,
    rol: 'admin',
  });

  console.log(`Cuenta administradora creada correctamente para ${admin.email}.`);
}

createAdmin()
  .catch((error) => {
    console.error(`No se pudo crear la cuenta administradora: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
