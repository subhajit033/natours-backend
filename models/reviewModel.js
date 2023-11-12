const mongoose = require('mongoose');
const Tour = require('./tourModel');
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'review can not be empty'],
    },
    rating: {
      type: Number,
      required: [true, 'You have to give rating'],
      min: [1, 'cannot be less than 1'],
      max: [5, 'cannot be greater than 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review Must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review Must have an author'],
    },
  },
  //virtual populate
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //this refers to current model

  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      //set to default
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

//preventing duplicate review
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post('save', function () {
  //here this refers to cuurrent document i.e goin to be saved in database
  //the statics method is always called on model not on instances but model is declared after this, it is a problem
  //this.constructor() refers to the current model (it is a way)
  //which review document is saved just now , tourId of that, so that review should change
  this.constructor.calcAverageRatings(this.tour);
});

//query middleware

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  //await this.findOne(); does not work here because the query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
