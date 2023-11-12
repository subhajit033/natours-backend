const Review = require('../models/reviewModel');
const APPError = require('../utils/appError');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlerFactory');

const getAllReview = getAll(Review);

const getSpecificReview = getOne(Review);

const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const createReview = createOne(Review);

const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);
module.exports = {
  getAllReview,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getSpecificReview,
};
