const { Cita, Usuario } = require('../Models');
const createController = require('./resource.controller');
const repository = require('../repository/cita.repository');
const validator = require('../validators/cita.validator');

async function validateParticipants(values, appointmentId) {
  const existingAppointment = appointmentId
    ? await Cita.findByPk(appointmentId)
    : null;

  if (appointmentId && !existingAppointment) return;

  const patientId = values.paciente_id ?? existingAppointment?.paciente_id;
  const specialistId = values.especialista_id ?? existingAppointment?.especialista_id;
  const [patient, specialist] = await Promise.all([
    Usuario.findByPk(patientId, { attributes: ['id', 'rol'] }),
    Usuario.findByPk(specialistId, { attributes: ['id', 'rol', 'activo'] }),
  ]);

  if (!patient || patient.rol !== 'paciente') {
    throw Object.assign(new Error('La cita debe estar asociada a un usuario con rol de paciente.'), {
      statusCode: 400,
    });
  }

  if (!specialist || specialist.rol !== 'especialista') {
    throw Object.assign(new Error('La cita debe estar asociada a un usuario con rol de especialista.'), {
      statusCode: 400,
    });
  }

  const specialistChanged = specialistId !== existingAppointment?.especialista_id;
  if (!specialist.activo && (!existingAppointment || specialistChanged)) {
    throw Object.assign(new Error('No se pueden asignar citas nuevas a un especialista inactivo.'), {
      statusCode: 400,
    });
  }
}

module.exports = createController(Cita, repository, validator, {
  beforeCreate: (values) => validateParticipants(values),
  beforeUpdate: (values, id) => validateParticipants(values, id),
});