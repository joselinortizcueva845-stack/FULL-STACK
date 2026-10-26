const { badRequest } = require('../validators/validation.utils');

function validateLogin(req, res, next) {
  const values = req.body;

  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    badRequest('El cuerpo debe ser un objeto JSON.');
  } else if (typeof values.email !== 'string' || !values.email.trim()) {
    badRequest('El correo electrónico es obligatorio.');
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    badRequest('El correo electrónico no es válido.');
  } else if (typeof values.password !== 'string' || !values.password.trim()) {
    badRequest('La contraseña es obligatoria.');
  }

  return next();
}

module.exports = { validateLogin };
