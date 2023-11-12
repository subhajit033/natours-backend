const express = require('express');
const {
  getAllReview,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getSpecificReview,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

//only authenticate user and post reviews and not admin and tour guide
// tour/123456/reviews

router.use(protect);
// router.use(restrictTo('user'))

router
  .route('/')
  .get(getAllReview)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .get(getSpecificReview);
module.exports = router;
