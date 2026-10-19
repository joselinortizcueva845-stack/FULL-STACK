const { validateFields, validateIds, validateTextFields } = require('./validation.utils');

function validateInput(values, options) {
  validateFields(values, ['cita_id', 'observaciones', 'receta_medica'], ['cita_id'], options);
  validateIds(values, ['cita_id']);
  validateTextFields(values, ['observaciones', 'receta_medica']);
  return values;
}

module.exports = { validateInput };