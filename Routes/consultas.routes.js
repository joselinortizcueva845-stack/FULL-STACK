const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use('/usuarios', require('./usuarios.routes'));
router.use(authenticate);
router.use('/fichas_tecnicas', require('./fichasTecnicas.routes'));
router.use('/citas', require('./citas.routes'));
router.use('/diagnosticos', require('./diagnosticos.routes'));

module.exports = router;