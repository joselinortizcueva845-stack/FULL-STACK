const { Cita } = require('../Models');

const attributes = Object.keys(Cita.rawAttributes);

async function list() {
	return Cita.findAll({ attributes, order: [['id', 'DESC']] });
}

async function findById(id) {
	return Cita.findByPk(id, { attributes });
}

async function create(values) {
	const cita = await Cita.create(values);
	return findById(cita.id);
}

async function update(id, values) {
	const [updatedRows] = await Cita.update(values, { where: { id } });
	return updatedRows ? findById(id) : undefined;
}

async function remove(id) {
	return (await Cita.destroy({ where: { id } })) > 0;
}

module.exports = { list, findById, create, update, remove };