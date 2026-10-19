const express = require('express');
const usuarioController = require('../controllers/usuario.controller');

const router = express.Router();

router.get('/', usuarioController.list);
router.post('/', usuarioController.create);
router.get('/:id', usuarioController.findById);
router.patch('/:id', usuarioController.update);
router.delete('/:id', usuarioController.remove);

module.exports = router;