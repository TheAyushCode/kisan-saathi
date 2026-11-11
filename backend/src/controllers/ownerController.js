const Owner = require('../models/Owner');
const Booking = require('../models/Booking');
const Machine = require('../models/Machine');
const Storage = require('../models/Storage');

// नया मालिक रजिस्टर करें
exports.registerOwner = async (req, res) => {
  try {
    const { name, phone, password, district, block } = req.body;

    const existing = await Owner.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'यह मोबाइल नंबर पहले से पंजीकृत है।' });
    }

    const owner = await Owner.create({ name, phone, password, district, block });
    res.status(201).json({
      success: true,
      message: 'पंजीकरण सफल रहा',
      data: { _id: owner._id, name: owner.name, phone: owner.phone, district: owner.district, block: owner.block },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// मालिक लॉगिन
exports.loginOwner = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const owner = await Owner.findOne({ phone });
    if (!owner || owner.password !== password) {
      return res.status(401).json({ success: false, message: 'गलत मोबाइल नंबर या पासवर्ड।' });
    }

    res.status(200).json({
      success: true,
      message: 'लॉगिन सफल रहा',
      data: { _id: owner._id, name: owner.name, phone: owner.phone, district: owner.district, block: owner.block },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// इस मालिक की मशीनों के किसान अनुरोध व हिस्ट्री
exports.getOwnerBookings = async (req, res) => {
  try {
    const { phone } = req.params;

    const machines = await Machine.find({ ownerPhone: phone });
    const storages = await Storage.find({ operatorPhone: phone });

    const machineIds = machines.map((m) => m._id);
    const storageIds = storages.map((s) => s._id);

    const bookings = await Booking.find({
      $or: [{ machineId: { $in: machineIds } }, { storageId: { $in: storageIds } }],
    })
      .populate('machineId')
      .populate('storageId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};