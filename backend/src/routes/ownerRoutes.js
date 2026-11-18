const express = require('express');
const router = express.Router();
const {
  sendRegisterEmailOtp,
  verifyAndRegisterOwner,
  loginOwner,
  sendForgotPasswordEmailOtp,
  resetOwnerPasswordByEmail,
  getOwnerBookings,
} = require('../controllers/ownerController');

router.post('/register/send-otp', sendRegisterEmailOtp);
router.post('/register/verify', verifyAndRegisterOwner);
router.post('/login', loginOwner);
router.post('/forgot-password/send-otp', sendForgotPasswordEmailOtp);
router.post('/forgot-password/reset', resetOwnerPasswordByEmail);
router.get('/:phone/bookings', getOwnerBookings);

module.exports = router;