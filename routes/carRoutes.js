const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

router
  .route('/')
  .get(carController.getAllUser)
  .post(carController.createUser);

router
  .route('/:id')
  .get(carController.getUser)
  .patch(carController.updateUser)
  .delete(carController.deleteUser);

module.exports = router;
