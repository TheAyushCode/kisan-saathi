const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  createBooking,
  updateBookingStatus
} = require('../controllers/bookingController');

router.route('/')
  .get(getAllBookings)
  .post(createBooking);

router.route('/:id/status')
  .patch(updateBookingStatus);

module.exports = router;