const { promisify } = require('node:util');
const { randomBytes, scrypt: scryptCallback } = require('node:crypto');
const createController = require('./resource.controller');
const model = require('../Models').Usuario;
const repository = require('../repository/usuario.repository');
const validator = require('../validators/usuario.validator');

const scrypt = promisify(scryptCallback);

async function hashPassword(values) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(values.password, salt, 64);
  values.password = `scrypt$${salt}$${hash.toString('hex')}`;
}

module.exports = createController(model, repository, validator, {
  beforeCreate: hashPassword,
  beforeUpdate: async (values) => {
    if (values.password !== undefined) await hashPassword(values);
  },
});