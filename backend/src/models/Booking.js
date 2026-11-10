const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    farmerName: {
      type: String,
      required: [true, 'किसान का नाम आवश्यक है'],
      trim: true,
    },
    farmerPhone: {
      type: String,
      required: [true, 'मोबाइल नंबर आवश्यक है'],
      trim: true,
    },
    bookingType: {
      type: String,
      default: 'Machine',
    },
    serviceType: {
      type: String,
      default: 'Machine_Rent',
    },
    serviceDate: {
      type: Date,
      default: Date.now,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    durationOrQuantity: {
      type: Number,
      default: 1,
    },
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine',
      required: false,
    },
    storageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Storage',
      required: false,
    },
    areaInKatha: {
      type: Number,
      default: 0,
    },
    quantityQuintals: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);