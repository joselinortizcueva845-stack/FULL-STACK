const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const usuarioMiddleware = require('../middleware/usuario.middleware');

const router = express.Router();

router.post('/login', usuarioMiddleware.validateLogin, usuarioController.login);
router.get('/', usuarioController.list);
router.post('/', usuarioController.create);
router.get('/:id', usuarioController.findById);
router.patch('/:id', usuarioController.update);
router.delete('/:id', usuarioController.remove);

module.exports = router;