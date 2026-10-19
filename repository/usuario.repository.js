const { Usuario } = require('../Models');

const attributes = Object.keys(Usuario.rawAttributes).filter((attribute) => attribute !== 'password');

async function list() {
	return Usuario.findAll({ attributes, order: [['id', 'DESC']] });
}

async function findById(id) {
	return Usuario.findByPk(id, { attributes });
}

async function create(values) {
	const usuario = await Usuario.create(values);
	return findById(usuario.id);
}

async function update(id, values) {
	const [updatedRows] = await Usuario.update(values, { where: { id } });
	return updatedRows ? findById(id) : undefined;
}

async function remove(id) {
	return (await Usuario.destroy({ where: { id } })) > 0;
}

module.exports = { list, findById, create, update, remove };