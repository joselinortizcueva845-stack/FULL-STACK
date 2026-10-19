const { badRequest } = require('../validators/validation.utils');

function createController(model, repository, validator, hooks = {}) {
  function getId(value) {
    const id = Number(value);
    if (!Number.isInteger(id) || id < 1) badRequest('El identificador debe ser un entero positivo.');
    return id;
  }

  return {
    async list(req, res, next) {
      try {
        res.json(await repository.list());
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      try {
        const values = validator.validateInput(req.body);
        if (hooks.beforeCreate) await hooks.beforeCreate(values);
        res.status(201).json(await repository.create(values));
      } catch (error) {
        next(error);
      }
    },

    async findById(req, res, next) {
      try {
        const item = await repository.findById(getId(req.params.id));
        if (!item) return res.status(404).json({ error: 'Registro no encontrado.' });
        return res.json(item);
      } catch (error) {
        return next(error);
      }
    },

    async update(req, res, next) {
      try {
        const values = validator.validateInput(req.body, { partial: true });
        if (!Object.keys(values).length) badRequest('Indica al menos un campo para actualizar.');
        if (hooks.beforeUpdate) await hooks.beforeUpdate(values);
        const item = await repository.update(getId(req.params.id), values);
        if (!item) return res.status(404).json({ error: 'Registro no encontrado.' });
        return res.json(item);
      } catch (error) {
        return next(error);
      }
    },

    async remove(req, res, next) {
      try {
        if (!await repository.remove(getId(req.params.id))) {
          return res.status(404).json({ error: 'Registro no encontrado.' });
        }
        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = createController;