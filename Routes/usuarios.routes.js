const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middleware/auth.middleware');
const usuarioMiddleware = require('../middleware/usuario.middleware');

const router = express.Router();

router.post('/login', usuarioMiddleware.validateLogin, usuarioController.login);
router.use(authMiddleware.authenticate);
router.get('/', usuarioController.list);
router.post('/', usuarioController.create);
router.get('/:id', usuarioController.findById);
router.patch('/:id', usuarioController.update);
router.delete('/:id', usuarioController.remove);

module.exports = router;