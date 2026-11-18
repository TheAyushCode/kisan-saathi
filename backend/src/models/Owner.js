const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'मालिक का नाम आवश्यक है'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'ईमेल आईडी आवश्यक है'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'मोबाइल नंबर आवश्यक है'],
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
    isEmailVerified: {
      type: Boolean,
      default: true,
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

// पुराने phone_1 unique index को हटाने के लिए ताकि डुप्लीकेट फ़ोन एरर न आए
Owner.collection.dropIndex('phone_1').catch(() => {});

module.exports = Owner;