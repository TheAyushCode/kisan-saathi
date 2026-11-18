const Owner = require('../models/Owner');
const Booking = require('../models/Booking');
const Machine = require('../models/Machine');
const Storage = require('../models/Storage');
const nodemailer = require('nodemailer');

// अस्थायी रूप से रजिस्ट्रेशन OTP स्टोर करने के लिए मेमोरी मैप
const pendingRegistrations = new Map();

// ईमेल भेजने का हेल्पर फ़ंक्शन
const sendEmailOtp = async (toEmail, otp, purpose = 'पंजीकरण सत्यापन') => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[Email Demo Mode] To: ${toEmail} | Purpose: ${purpose} | OTP: ${otp}`);
    return false; // असली ईमेल कॉन्फ़िगर नहीं है, डेमो मोड चलेगा
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"किसान साथी बिहार" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `किसान साथी बिहार - ${purpose} OTP (${otp})`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #065f46; border-radius: 12px; max-width: 500px;">
        <h2 style="color: #065f46;">🌾 किसान साथी बिहार (मालिक पोर्टल)</h2>
        <p>नमस्ते,</p>
        <p>आपके <strong>${purpose}</strong> के लिए सत्यापन कोड (OTP) नीचे दिया गया है:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #065f46; background: #ecfdf5; padding: 12px; text-align: center; border-radius: 8px; margin: 16px 0;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #64748b;">यह OTP अगले 10 मिनट तक मान्य है। इसे किसी के साथ साझा न करें।</p>
      </div>
    `,
  });

  return true;
};

// 1. नया मालिक रजिस्टर करने से पहले ईमेल पर OTP भेजें
exports.sendRegisterEmailOtp = async (req, res) => {
  try {
    const { name, email, phone, password, district, block } = req.body;

    if (!name || !email || !phone || !password || !district || !block) {
      return res.status(400).json({ success: false, message: 'कृपया सभी विवरण भरें।' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await Owner.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'यह ईमेल आईडी पहले से पंजीकृत है।' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingRegistrations.set(cleanEmail, {
      name,
      email: cleanEmail,
      phone: phone.trim(),
      password,
      district,
      block,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const emailSent = await sendEmailOtp(cleanEmail, otp, 'नया खाता पंजीकरण');

    res.status(200).json({
      success: true,
      message: emailSent
        ? `आपके ईमेल (${cleanEmail}) पर सत्यापन OTP भेज दिया गया है।`
        : `ईमेल (${cleanEmail}) पर सत्यापन कोड जनरेट हो गया है।`,
      demoOtp: emailSent ? null : otp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. ईमेल OTP सत्यापित करके मालिक का खाता बनाएँ
exports.verifyAndRegisterOwner = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const record = pendingRegistrations.get(cleanEmail);
    if (!record) {
      return res.status(400).json({ success: false, message: 'पंजीकरण सत्र समाप्त हो गया है। कृपया पुनः प्रयास करें।' });
    }

    if (Date.now() > record.expiresAt) {
      pendingRegistrations.delete(cleanEmail);
      return res.status(400).json({ success: false, message: 'OTP की समय-सीमा समाप्त हो गई है। नया OTP मँगाएँ।' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'गलत OTP दर्ज किया गया है।' });
    }

    const owner = await Owner.create({
      name: record.name,
      email: record.email,
      phone: record.phone,
      password: record.password,
      district: record.district,
      block: record.block,
      isEmailVerified: true,
    });

    pendingRegistrations.delete(cleanEmail);

    res.status(201).json({
      success: true,
      message: 'ईमेल सत्यापन और पंजीकरण सफल रहा!',
      data: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        district: owner.district,
        block: owner.block,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. मालिक लॉगिन (ईमेल और पासवर्ड से)
exports.loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'ईमेल और पासवर्ड दर्ज करें।' });
    }

    const owner = await Owner.findOne({ email: email.trim().toLowerCase() });
    if (!owner || owner.password !== password) {
      return res.status(401).json({ success: false, message: 'गलत ईमेल आईडी या पासवर्ड।' });
    }

    res.status(200).json({
      success: true,
      message: 'लॉगिन सफल रहा',
      data: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        district: owner.district,
        block: owner.block,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. पासवर्ड भूलने पर ईमेल पर OTP भेजें
exports.sendForgotPasswordEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'कृपया अपनी पंजीकृत ईमेल आईडी दर्ज करें।' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const owner = await Owner.findOne({ email: cleanEmail });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'यह ईमेल आईडी मालिक पोर्टल पर पंजीकृत नहीं है।' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    owner.resetOtp = otp;
    owner.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await owner.save();

    const emailSent = await sendEmailOtp(cleanEmail, otp, 'पासवर्ड रीसेट');

    res.status(200).json({
      success: true,
      message: emailSent
        ? `आपके ईमेल (${cleanEmail}) पर पासवर्ड रीसेट OTP भेज दिया गया है।`
        : `आपके ईमेल (${cleanEmail}) के लिए OTP जनरेट हो गया है।`,
      demoOtp: emailSent ? null : otp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. ईमेल OTP वेरिफाई करके नया पासवर्ड सेट करें
exports.resetOwnerPasswordByEmail = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'ईमेल, OTP और नया पासवर्ड सभी आवश्यक हैं।' });
    }

    const owner = await Owner.findOne({ email: email.trim().toLowerCase() });
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
      message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है! अब आप लॉगिन कर सकते हैं।',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. मालिक की मशीनों के किसान अनुरोध व हिस्ट्री
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