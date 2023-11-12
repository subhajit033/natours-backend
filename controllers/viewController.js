const Tour = require('../models/tourModel');
const APPError = require('../utils/appError');
const getOverview = async (req, res, next) => {
  /**
   * 1) get the tour data from db
   * 2)fill the template with data
   */
  try {
    const tours = await Tour.find();
    res.status(200).render('overview', {
      title: 'All Tours',
      tours,
    });
  } catch (err) {
    next(new APPError(err.message, 400));
  }
};

const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.tourName }).populate({
      path: 'reviews',
      select: '-tour',
    });
    
    res.status(200).render('tour', {
      title: tour.name,
      tour: tour,
    });
  } catch (err) {
    next(new APPError(err.message, 400));
  }
};

const getLogin = (req, res)=>{
  res.status(200).render('login')
}

module.exports = { getOverview, getTour, getLogin };
