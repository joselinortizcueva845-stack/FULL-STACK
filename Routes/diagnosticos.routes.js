const express = require('express');
const diagnosticoController = require('../controllers/diagnostico.controller');

const router = express.Router();

router.get('/', diagnosticoController.list);
router.post('/', diagnosticoController.create);
router.get('/:id', diagnosticoController.findById);
router.patch('/:id', diagnosticoController.update);
router.delete('/:id', diagnosticoController.remove);

module.exports = router;