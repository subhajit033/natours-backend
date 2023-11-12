const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour Must Have a Name'],
      unique: true,
      trim: true,
      //available only for string data types
      maxlength: [40, 'A Tour name must have less or equal 40 characters'],
      minlength: [10, 'A Tour name must have more or equal 40 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      // this is a short-hand of the below validators
      required: [true, 'A tour must have difficulty'],
      //only for string
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium and difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour Must Have Price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this keyword only works when we are creating a new document , not when we are updating the doc
          return val < this.price;
        },
        message: 'Discount price {VALUE} should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour Must Have a description'],
      //remove all the white spaces in the begining and at end
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: {
      type: [String],
      //type will be array of strings
    },
    createdAt: {
      type: Date,
      default: Date.now(), //return time in millisecond
      //mongodb immediately convert the time in to date
      select: false,
      //to hide this property in this every request
    },
    startLocation: {
      //GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
        },
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    //embbed documents, always use array
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: {
            values: ['Point'],
          },
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    startDates: {
      type: [Date],
    },
    slug: {
      type: String,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//indexes

// tourSchema.index({price:1})

//compound index
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.index({ slug: 1 });
//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
//document middleware : runs before .save() and .create() as it is a middleware so first the data came in this middleware , then
//post request made actually
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower: true, trim: true})
  next();
})

// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// })

//QUERY MIDDLEWARE -> this hook will work on query like find, sort, select
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  next();
});

//Aggregation middleware

// tourSchema.pre('aggregate', function (next) {
//   //pipeline() is the pipeline we defined in aggregation function and it is a array oviously, as the match stage required at first
//   //thats why we are using unshift
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
// });
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
