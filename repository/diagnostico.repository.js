const { Diagnostico } = require('../Models');

const attributes = Object.keys(Diagnostico.rawAttributes);

async function list() {
	return Diagnostico.findAll({ attributes, order: [['id', 'DESC']] });
}

async function findById(id) {
	return Diagnostico.findByPk(id, { attributes });
}

async function create(values) {
	const diagnostico = await Diagnostico.create(values);
	return findById(diagnostico.id);
}

async function update(id, values) {
	const [updatedRows] = await Diagnostico.update(values, { where: { id } });
	return updatedRows ? findById(id) : undefined;
}

async function remove(id) {
	return (await Diagnostico.destroy({ where: { id } })) > 0;
}

module.exports = { list, findById, create, update, remove };