const Booking = require('../models/Booking');

// @desc    नई बुकिंग बनाएँ
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const {
      farmerName,
      farmerPhone,
      bookingType,
      serviceType,
      serviceDate,
      startDate,
      durationOrQuantity,
      machineId,
      storageId,
      areaInKatha,
      quantityQuintals,
    } = req.body;

    const newBooking = await Booking.create({
      farmerName,
      farmerPhone,
      bookingType: bookingType || (machineId ? 'Machine' : 'Storage'),
      serviceType: serviceType || (machineId ? 'Machine_Rent' : 'Storage_Space'),
      serviceDate: serviceDate || startDate || new Date(),
      startDate: startDate || serviceDate || new Date(),
      durationOrQuantity:
        Number(durationOrQuantity) ||
        Number(areaInKatha) ||
        Number(quantityQuintals) ||
        1,
      machineId: machineId || undefined,
      storageId: storageId || undefined,
      areaInKatha: areaInKatha ? Number(areaInKatha) : undefined,
      quantityQuintals: quantityQuintals ? Number(quantityQuintals) : undefined,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'बुकिंग सफलतापूर्वक दर्ज कर ली गई है',
      data: newBooking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    सभी बुकिंग्स प्राप्त करें
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('machineId')
      .populate('storageId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    बुकिंग स्थिति अपडेट करें (स्वीकार / रद्द)
// @route   PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Confirmed', 'Cancelled', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'अमान्य स्टेटस। केवल Confirmed, Cancelled, या Pending मान्य हैं।',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'बुकिंग नहीं मिली',
      });
    }

    res.status(200).json({
      success: true,
      message: `बुकिंग स्थिति बदलकर ${status} कर दी गई है`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};