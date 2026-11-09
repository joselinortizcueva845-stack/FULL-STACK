const { badRequest, validateFields, validateTextFields } = require('./validation.utils');

const daysOfWeek = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
];
const weekdays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
const weekendDays = ['sabado', 'domingo'];

function validateAvailability(schedule) {
  if (schedule === null) return;

  if (
    typeof schedule !== 'object' ||
    Array.isArray(schedule) ||
    Object.getPrototypeOf(schedule) !== Object.prototype
  ) {
    badRequest('La disponibilidad debe ser un objeto con horarios semanales.');
  }

  const unknownDays = Object.keys(schedule).filter((day) => !daysOfWeek.includes(day));
  if (unknownDays.length) {
    badRequest(`Días no permitidos en la disponibilidad: ${unknownDays.join(', ')}`);
  }

  for (const [day, hours] of Object.entries(schedule)) {
    if (hours === null) continue;

    if (
      typeof hours !== 'object' ||
      Array.isArray(hours) ||
      Object.getPrototypeOf(hours) !== Object.prototype ||
      Object.keys(hours).some((key) => !['inicio', 'fin'].includes(key)) ||
      typeof hours.inicio !== 'string' ||
      typeof hours.fin !== 'string'
    ) {
      badRequest(`El horario de ${day} debe indicar inicio y fin.`);
    }

    const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    if (!timePattern.test(hours.inicio) || !timePattern.test(hours.fin)) {
      badRequest(`Las horas de ${day} deben tener formato HH:mm.`);
    }

    if (hours.inicio >= hours.fin) {
      badRequest(`La hora de fin de ${day} debe ser posterior a la de inicio.`);
    }
  }
}

function validateWeekdaySchedule(schedule) {
  if (!schedule || typeof schedule !== 'object' || Array.isArray(schedule)) {
    badRequest('La disponibilidad del especialista es obligatoria.');
  }

  const firstDay = schedule.lunes;
  if (!firstDay) {
    badRequest('Configura el horario de lunes a viernes.');
  }

  for (const day of weekdays) {
    const hours = schedule[day];
    if (!hours || hours.inicio !== firstDay.inicio || hours.fin !== firstDay.fin) {
      badRequest('El especialista debe tener el mismo horario de lunes a viernes.');
    }
  }

  for (const day of weekendDays) {
    if (schedule[day] !== null) {
      badRequest('No se permiten horarios de atención los fines de semana.');
    }
  }
}

function validateInput(values, options) {
  validateFields(
    values,
    [
      'nombre',
      'email',
      'dni',
      'password',
      'rol',
      'especialidad',
      'disponibilidad',
      'activo',
    ],
    ['nombre', 'email', 'password', 'rol'],
    options,
  );
  validateTextFields(values, [
    'nombre',
    'email',
    'dni',
    'password',
    'rol',
    'especialidad',
  ]);

  if (values.nombre !== undefined && !values.nombre.trim()) badRequest('El nombre es obligatorio.');
  if (values.nombre !== undefined && values.nombre.length > 100) {
    badRequest('El nombre no puede superar 100 caracteres.');
  }
  if (values.email !== undefined && !/^\S+@\S+\.\S+$/.test(values.email)) {
    badRequest('El correo electrónico no es válido.');
  }
  if (values.email !== undefined && values.email.length > 100) {
    badRequest('El correo electrónico no puede superar 100 caracteres.');
  }
  if (values.dni !== undefined && !/^\d{5,20}$/.test(values.dni)) {
    badRequest('El DNI debe contener entre 5 y 20 dígitos.');
  }
  if (
    values.rol === 'paciente' &&
    (typeof values.dni !== 'string' || !values.dni.trim())
  ) {
    badRequest('El DNI es obligatorio para pacientes.');
  }
  if (values.password !== undefined && !values.password.trim()) {
    badRequest('La contraseña es obligatoria.');
  }
  if (values.password !== undefined && values.password.length < 8) {
    badRequest('La contraseña debe tener al menos 8 caracteres.');
  }
  if (values.rol !== undefined && !['paciente', 'especialista', 'admin'].includes(values.rol)) {
    badRequest('El rol no es válido.');
  }
  if (values.especialidad !== undefined && values.especialidad !== null && values.especialidad.length > 120) {
    badRequest('La especialidad no puede superar 120 caracteres.');
  }
  if (
    values.rol === 'especialista' &&
    (typeof values.especialidad !== 'string' || !values.especialidad.trim())
  ) {
    badRequest('La especialidad es obligatoria para especialistas.');
  }
  if (values.disponibilidad !== undefined) {
    validateAvailability(values.disponibilidad);
    validateWeekdaySchedule(values.disponibilidad);
  }
  if (values.rol === 'especialista' && values.disponibilidad === undefined) {
    badRequest('La disponibilidad de lunes a viernes es obligatoria para especialistas.');
  }
  if (values.activo !== undefined && typeof values.activo !== 'boolean') {
    badRequest('El estado activo debe ser verdadero o falso.');
  }

  return values;
}

module.exports = { validateInput };