const express = require('express');

const router = express.Router();

router.use('/usuarios', require('./usuarios.routes'));
router.use('/fichas_tecnicas', require('./fichasTecnicas.routes'));
router.use('/citas', require('./citas.routes'));
router.use('/diagnosticos', require('./diagnosticos.routes'));

module.exports = router;