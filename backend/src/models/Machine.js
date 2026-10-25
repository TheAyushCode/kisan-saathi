const mongoose = require('mongoose');
const BIHAR_DISTRICTS = require('../config/districts');

const machineSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  ownerPhone: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true // उदाहरण: 'Mahindra 575 DI' या 'Shaktiman Rotavator'
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Tractor (ट्रैक्टर)', 
      'Rotavator (रोटावेटर)', 
      'Harvester (कंबाइन हार्वेस्टर)', 
      'Laser Land Leveler (लेज़र लेवलर)', 
      'Happy Seeder (हैप्पी सीडर)', 
      'Zero Tillage Machine (ज़ीरो टिलेज)', 
      'Thresher (थ्रेशर)', 
      'Paddy Transplanter (धान रोपाई मशीन)', 
      'Power Tiller (पावर टिलर)', 
      'Solar Pump Set (सोलर पंप)'
    ]
  },
  ratePerHour: {
    type: Number,
    required: true
  },
  ratePerKatha: {
    type: Number,
    default: 0
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
  isSubsidized: {
    type: Boolean,
    default: false // बिहार कृषि यंत्र अनुदान योजना से प्राप्त
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.8
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Machine', machineSchema);