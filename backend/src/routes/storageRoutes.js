const express = require('express');
const router = express.Router();
const { getAllStorage, createStorage, getStorageById } = require('../controllers/storageController');

router.route('/')
  .get(getAllStorage)
  .post(createStorage);

router.route('/:id')
  .get(getStorageById);

module.exports = router;