const express = require('express');
const router = express.Router();
const { registerOwner, loginOwner, getOwnerBookings } = require('../controllers/ownerController');

router.post('/register', registerOwner);
router.post('/login', loginOwner);
router.get('/:phone/bookings', getOwnerBookings);

module.exports = router;