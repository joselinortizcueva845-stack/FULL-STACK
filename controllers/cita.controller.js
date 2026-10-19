module.exports = require('./resource.controller')(
  require('../Models').Cita,
  require('../repository/cita.repository'),
  require('../validators/cita.validator'),
);