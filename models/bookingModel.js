const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user'],
  },
  price: {
    type: Number,
    required: [true, 'booking must have a price'],
  },
  bookedAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

//preventing user from buy same tour twice
bookingSchema.index({ tour: 1, user: 1 }, { unique: true });

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name imageCover',
  }).populate('user');

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
