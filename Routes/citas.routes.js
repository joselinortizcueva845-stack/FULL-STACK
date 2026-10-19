const express = require('express');
const citaController = require('../controllers/cita.controller');

const router = express.Router();

router.get('/', citaController.list);
router.post('/', citaController.create);
router.get('/:id', citaController.findById);
router.patch('/:id', citaController.update);
router.delete('/:id', citaController.remove);
router.put('/:id', citaController.update);
router.patch('/:id', citaController.update);

module.exports = router;