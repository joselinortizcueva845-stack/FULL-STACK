const { FichaTecnica } = require('../Models');

const attributes = Object.keys(FichaTecnica.rawAttributes);

async function list() {
	return FichaTecnica.findAll({ attributes, order: [['id', 'DESC']] });
}

async function findById(id) {
	return FichaTecnica.findByPk(id, { attributes });
}

async function create(values) {
	const ficha = await FichaTecnica.create(values);
	return findById(ficha.id);
}

async function update(id, values) {
	const [updatedRows] = await FichaTecnica.update(values, { where: { id } });
	return updatedRows ? findById(id) : undefined;
}

async function remove(id) {
	return (await FichaTecnica.destroy({ where: { id } })) > 0;
}

module.exports = { list, findById, create, update, remove };