const express = require('express');
const router = express.Router();
const {
  registerOwner,
  loginOwner,
  sendForgotPasswordOtp,
  resetOwnerPassword,
  getOwnerBookings,
} = require('../controllers/ownerController');

router.post('/register', registerOwner);
router.post('/login', loginOwner);
router.post('/forgot-password/send-otp', sendForgotPasswordOtp);
router.post('/forgot-password/reset', resetOwnerPassword);
router.get('/:phone/bookings', getOwnerBookings);

module.exports = router;