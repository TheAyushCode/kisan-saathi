const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'मालिक का नाम आवश्यक है'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'मोबाइल नंबर आवश्यक है'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'पासवर्ड आवश्यक है'],
    },
    district: {
      type: String,
      required: [true, 'ज़िला आवश्यक है'],
    },
    block: {
      type: String,
      required: [true, 'प्रखंड आवश्यक है'],
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Owner = mongoose.model('Owner', ownerSchema);

// पुराने email_1 index को हटाने के लिए ताकि बिना ईमेल के सिंपल रजिस्ट्रेशन हो सके
Owner.collection.dropIndex('email_1').catch(() => {});

module.exports = Owner;