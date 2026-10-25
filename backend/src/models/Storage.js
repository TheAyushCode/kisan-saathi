const mongoose = require('mongoose');
const BIHAR_DISTRICTS = require('../config/districts');

const storageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // उदाहरण: 'प्राथमिक कृषि साख समिति (PACS) गोदाम'
  },
  type: {
    type: String,
    required: true,
    enum: ['PACS Warehouse', 'Cold Storage', 'State Warehousing (BSWC)', 'Private Godown']
  },
  district: {
    type: String,
    required: true,
    enum: BIHAR_DISTRICTS
  },
  block: {
    type: String,
    required: true
  },
  totalCapacityQuintals: {
    type: Number,
    required: true
  },
  availableCapacityQuintals: {
    type: Number,
    required: true
  },
  suitableForCrops: [{
    type: String,
    enum: ['आलू (Potato)', 'मखाना (Makhana)', 'लीची (Litchi)', 'मक्का (Maize)', 'धान/चावल (Paddy/Rice)', 'गेहूँ (Wheat)', 'प्याज (Onion)']
  }],
  temperatureRange: {
    type: String,
    default: 'सामान्य गोदाम (Ambient)'
  },
  ratePerQuintalMonth: {
    type: Number,
    required: true
  },
  sharedTransportAvailable: {
    type: Boolean,
    default: true
  },
  operatorPhone: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Storage', storageSchema);