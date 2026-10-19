module.exports = require('./resource.controller')(
  require('../Models').Diagnostico,
  require('../repository/diagnostico.repository'),
  require('../validators/diagnostico.validator'),
);