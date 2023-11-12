const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

router.use('/:tourId/reviews', reviewRouter);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/distances/:latlng/unit/:unit').get(getDistances);
router
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/').get(getAllTours).post(createNewTour);
router.get('/:slug', getSpecificTours);

router
  .route('/:id')

  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
//protect gives access to the website contebt only to logged in user

module.exports = router;
