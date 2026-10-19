const express = require('express');
const fichaTecnicaController = require('../controllers/fichaTecnica.controller');

const router = express.Router();

router.get('/', fichaTecnicaController.list);
router.post('/', fichaTecnicaController.create);
router.get('/:id', fichaTecnicaController.findById);
router.patch('/:id', fichaTecnicaController.update);
router.delete('/:id', fichaTecnicaController.remove);

module.exports = router;