module.exports = require('./resource.controller')(
  require('../Models').FichaTecnica,
  require('../repository/fichaTecnica.repository'),
  require('../validators/fichaTecnica.validator'),
);