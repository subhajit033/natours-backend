const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const APPError = require('../utils/appError');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,duration';
  next();
};

//ROUTE HANDLER
const getAllTours = getAll(Tour);

const getSpecificTours = getOne(Tour, {
  path: 'reviews',
  select: '-tour',
});

const createNewTour = createOne(Tour);

const updateTour = updateOne(Tour);

const deleteTour = deleteOne(Tour);

const getTourStats = async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          countratings: { $sum: '$ratingsQuantity' },
          countTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { countratings: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);
    res.status(200).json({
      status: 'success',

      data: {
        tour: stats,
      },
    });
  } catch (err) {
    next(new APPError(err.message, 400));
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; //2021
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          //to get month from date()
          _id: { $month: '$startDates' },
          countTours: { $sum: 1 },
          //to create a array of tour in that month
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      //to exclude the id parameter from response
      {
        $project: { _id: 0 },
      },
      {
        $sort: { countTours: -1 },
      },
      {
        $limit: 6,
      },
    ]);
    res.status(200).json({
      status: 'success',

      data: {
        tour: plan,
      },
    });
  } catch (err) {
    next(new APPError(err.message, 400));
  }
};

//tour-within/:distance/center/:latlng/unit/:unit
//tour-within/400/center/22.476383453536346, 88.41492064570656/unit/mi

const getToursWithin = async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    return next(new APPError('Please provide in the format like this', 400));
  }
  //mongodb expect radius in radians (divide the distance by radius of earth and you get it)
  //mi == unit in mile other wise in kilometer
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    //geo special query take langitude first and latitude second (a bit different)
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
};

const getDistances = async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    return next(new APPError('Please provide in the format like this', 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          //calculate distance from this point
          coordinates: [lng * 1, lat * 1],
        },
        //it create distance filed in every document and return distances in meters
        distanceField: 'distance',
        //convert it to km
        distanceMultiplier: 0.001,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'Success',

    data: {
      data: distances,
    },
  });
};

module.exports = {
  getAllTours,
  createNewTour,
  updateTour,
  deleteTour,
  getSpecificTours,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
};
