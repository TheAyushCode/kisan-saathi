const Owner = require('../models/Owner');
const Booking = require('../models/Booking');
const Machine = require('../models/Machine');
const Storage = require('../models/Storage');

// 1. सिंपल मालिक रजिस्ट्रेशन (मोबाइल नंबर प्राइमरी)
exports.registerOwner = async (req, res) => {
  try {
    const { name, phone, password, district, block } = req.body;

    if (!name || !phone || !password || !district || !block) {
      return res.status(400).json({ success: false, message: 'कृपया सभी विवरण सही से भरें।' });
    }

    const cleanPhone = phone.trim();
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ success: false, message: 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।' });
    }

    const existing = await Owner.findOne({ phone: cleanPhone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉगिन करें।' });
    }

    const owner = await Owner.create({
      name: name.trim(),
      phone: cleanPhone,
      password,
      district,
      block: block.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'पंजीकरण सफल रहा!',
      data: {
        _id: owner._id,
        name: owner.name,
        phone: owner.phone,
        district: owner.district,
        block: owner.block,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. मालिक लॉगिन (मोबाइल नंबर और पासवर्ड से)
exports.loginOwner = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'मोबाइल नंबर और पासवर्ड दर्ज करें।' });
    }

    const owner = await Owner.findOne({ phone: phone.trim() });
    if (!owner || owner.password !== password) {
      return res.status(401).json({ success: false, message: 'गलत मोबाइल नंबर या पासवर्ड।' });
    }

    res.status(200).json({
      success: true,
      message: 'लॉगिन सफल रहा',
      data: {
        _id: owner._id,
        name: owner.name,
        phone: owner.phone,
        district: owner.district,
        block: owner.block,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. पासवर्ड भूलने पर स्क्रीन OTP जनरेट करें
exports.sendForgotPasswordOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.trim().length !== 10) {
      return res.status(400).json({ success: false, message: 'कृपया अपना 10 अंकों का पंजीकृत मोबाइल नंबर दर्ज करें।' });
    }

    const owner = await Owner.findOne({ phone: phone.trim() });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'यह मोबाइल नंबर मालिक पोर्टल पर पंजीकृत नहीं है।' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    owner.resetOtp = otp;
    owner.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await owner.save();

    res.status(200).json({
      success: true,
      message: `पंजीकृत नंबर ${phone} के लिए OTP तैयार हो गया है।`,
      demoOtp: otp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. स्क्रीन OTP सत्यापित करके नया पासवर्ड सेट करें
exports.resetOwnerPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'मोबाइल नंबर, OTP और नया पासवर्ड सभी आवश्यक हैं।' });
    }

    const owner = await Owner.findOne({ phone: phone.trim() });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'मालिक का खाता नहीं मिला।' });
    }

    if (!owner.resetOtp || owner.resetOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'गलत OTP दर्ज किया गया है।' });
    }

    if (owner.resetOtpExpiry && new Date() > owner.resetOtpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP की समय-सीमा समाप्त हो गई है। नया OTP मँगाएँ।' });
    }

    owner.password = newPassword;
    owner.resetOtp = null;
    owner.resetOtpExpiry = null;
    await owner.save();

    res.status(200).json({
      success: true,
      message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. मालिक की मशीनों के किसान अनुरोध व हिस्ट्री
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