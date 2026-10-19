const { badRequest, validateFields, validateTextFields } = require('./validation.utils');

function validateInput(values, options) {
  validateFields(values, ['nombre', 'email', 'password', 'rol'], ['nombre', 'email', 'password', 'rol'], options);
  validateTextFields(values, ['nombre', 'email', 'password', 'rol']);

  if (values.nombre !== undefined && !values.nombre.trim()) badRequest('El nombre es obligatorio.');
  if (values.email !== undefined && !/^\S+@\S+\.\S+$/.test(values.email)) {
    badRequest('El correo electrónico no es válido.');
  }
  if (values.password !== undefined && values.password.length < 8) {
    badRequest('La contraseña debe tener al menos 8 caracteres.');
  }
  if (values.rol !== undefined && !['paciente', 'especialista', 'admin'].includes(values.rol)) {
    badRequest('El rol no es válido.');
  }

  return values;
}

module.exports = { validateInput };