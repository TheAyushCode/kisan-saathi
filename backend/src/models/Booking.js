const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: true
  },
  farmerPhone: {
    type: String,
    required: true
  },
  bookingType: {
    type: String,
    required: true,
    enum: ['machine', 'storage']
  },
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    default: null
  },
  storageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
    default: null
  },
  serviceDate: {
    type: Date,
    required: true
  },
  durationOrQuantity: {
    type: String,
    required: true // उदाहरण: '4 घंटे' या '50 क्विंटल'
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);