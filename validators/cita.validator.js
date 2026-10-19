const { badRequest, validateFields, validateIds, validateTextFields } = require('./validation.utils');

function validateInput(values, options) {
  validateFields(
    values,
    ['paciente_id', 'especialista_id', 'fecha_hora', 'motivo', 'estado'],
    ['paciente_id', 'especialista_id', 'fecha_hora'],
    options,
  );
  validateIds(values, ['paciente_id', 'especialista_id']);
  validateTextFields(values, ['fecha_hora', 'motivo', 'estado']);

  if (values.fecha_hora !== undefined && !values.fecha_hora.trim()) {
    badRequest('La fecha y hora son obligatorias.');
  }
  if (values.estado !== undefined && !['pendiente', 'completada', 'cancelada'].includes(values.estado)) {
    badRequest('El estado de la cita no es válido.');
  }

  return values;
}

module.exports = { validateInput };