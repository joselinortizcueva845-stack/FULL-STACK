const { promisify } = require('node:util');
const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require('node:crypto');
const jwt = require('jsonwebtoken');
const createController = require('./resource.controller');
const model = require('../Models').Usuario;
const repository = require('../repository/usuario.repository');
const validator = require('../validators/usuario.validator');

const scrypt = promisify(scryptCallback);

async function hashPassword(values) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(values.password, salt, 64);
  values.password = `scrypt$${salt}$${hash.toString('hex')}`;
}

async function verifyPassword(password, encodedPassword) {
  if (typeof encodedPassword !== 'string') return false;

  const parts = encodedPassword.split('$');
  if (
    parts.length !== 3 ||
    parts[0] !== 'scrypt' ||
    !/^[a-f0-9]{32}$/i.test(parts[1]) ||
    !/^[a-f0-9]{128}$/i.test(parts[2])
  ) {
    return false;
  }

  const expectedHash = Buffer.from(parts[2], 'hex');
  const actualHash = await scrypt(password, parts[1], expectedHash.length);
  return timingSafeEqual(expectedHash, actualHash);
}

const controller = createController(model, repository, validator, {
  beforeCreate: hashPassword,
  beforeUpdate: async (values) => {
    if (values.password !== undefined) await hashPassword(values);
  },
});

controller.login = async function login(req, res, next) {
  try {
    const usuario = await repository.findByEmail(req.body.email.trim());
    if (!usuario || !await verifyPassword(req.body.password, usuario.password)) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const { password, ...usuarioAutenticado } = usuario.get({ plain: true });
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurada.');
    }

    const token = jwt.sign(
      {
        id: usuarioAutenticado.id,
        email: usuarioAutenticado.email,
        rol: usuarioAutenticado.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
    );

    return res.json({
      message: 'Inicio de sesión exitoso.',
      usuario: usuarioAutenticado,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = controller;