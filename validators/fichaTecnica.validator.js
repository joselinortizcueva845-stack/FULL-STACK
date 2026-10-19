const { validateFields, validateIds, validateTextFields } = require('./validation.utils');

function validateInput(values, options) {
  validateFields(values, ['usuario_id', 'tipo_sangre', 'alergias', 'condiciones_previas'], ['usuario_id'], options);
  validateIds(values, ['usuario_id']);
  validateTextFields(values, ['tipo_sangre', 'alergias', 'condiciones_previas']);
  return values;
}

module.exports = { validateInput };