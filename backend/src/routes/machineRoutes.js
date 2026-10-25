const express = require('express');
const router = express.Router();
const { getAllMachines, createMachine, getMachineById } = require('../controllers/machineController');

router.route('/')
  .get(getAllMachines)
  .post(createMachine);

router.route('/:id')
  .get(getMachineById);

module.exports = router;