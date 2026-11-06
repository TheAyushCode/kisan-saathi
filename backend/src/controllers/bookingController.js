const Booking = require('../models/Booking');

// 1. सभी बुकिंग प्राप्त करें
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('machineId')
      .populate('storageId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. नई बुकिंग दर्ज करें
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({
      success: true,
      message: 'बुकिंग अनुरोध सफलतापूर्वक दर्ज किया गया ✅',
      data: booking
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 3. बुकिंग स्टेटस अपडेट करें (Pending -> Confirmed / Cancelled)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'बुकिंग नहीं मिली' });
    }

    res.status(200).json({
      success: true,
      message: `बुकिंग स्थिति को '${status}' में अपडेट किया गया`,
      data: booking
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};