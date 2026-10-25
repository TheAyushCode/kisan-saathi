const mongoose = require('mongoose');
const BIHAR_DISTRICTS = require('../config/districts');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'किसान का नाम आवश्यक है'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'मोबाइल नंबर आवश्यक है'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें']
  },
  district: {
    type: String,
    required: [true, 'ज़िला चुनना आवश्यक है'],
    enum: {
      values: BIHAR_DISTRICTS,
      message: '{VALUE} बिहार का मान्य ज़िला नहीं है'
    }
  },
  block: {
    type: String,
    required: [true, 'प्रखंड (Block) आवश्यक है'],
    trim: true
  },
  panchayat: {
    type: String,
    trim: true,
    default: ''
  },
  village: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['farmer', 'equipment_owner', 'storage_operator', 'pacs_member', 'admin'],
    default: 'farmer'
  },
  // कृषि संबंधी विवरण (Agricultural Details)
  landSizeKatha: {
    type: Number,
    default: 0,
    min: [0, 'ज़मीन का क्षेत्रफल ऋणात्मक नहीं हो सकता']
  },
  primaryCrops: [{
    type: String,
    enum: [
      'धान (Paddy)', 'गेहूँ (Wheat)', 'मक्का (Maize)', 'मखाना (Makhana)', 
      'लीची (Shahi Litchi)', 'आलू (Potato)', 'सरसों/तोरिया (Mustard)', 
      'दलहन/चना/मसूर (Pulses)', 'गन्ना (Sugarcane)', 'सब्जियाँ (Vegetables)', 'अन्य'
    ]
  }],
  kisanRegistrationNumber: {
    type: String, // बिहार डीबीटी कृषि पंजीकरण संख्या (13 डिजिट)
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);