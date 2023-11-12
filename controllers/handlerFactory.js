const APPError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const getAll = (Model) => {
  return async (req, res, next) => {
    let query;
    try {
      //Execute query
      const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sorting()
        .limitFields()
        .paginate();
      //to allow to access for nested review
      query = features.query;
      if (req.params.tourId) {
        query = query.find({ tour: req.params.tourId });
      }
      const doc = await query;
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc,
        },
      });
    } catch (err) {
      next(new APPError(err.message, 400));
    }
  };
};

const deleteOne = (Model) => {
  return async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) {
        return next(new APPError('no document found with that ID', 404));
      }
      res.status(204).json({
        status: 'success',
        message: 'Document deleted sucessfully',
        data: null,
      });
    } catch (err) {
      next(new APPError(err.message, 400));
    }
  };
};

const updateOne = (Model) => {
  return async (req, res, next) => {
    try {
      const updatedDocs = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedDocs) {
        return next(new APPError('no tour found with that ID', 404));
      }
      res.status(200).json({
        message: 'success',
        data: {
          data: updatedDocs,
        },
      });
    } catch (err) {
      next(new APPError(err.message, 400));
    }
  };
};

const createOne = (Model) => {
  return async (req, res, next) => {
    try {
      const newDocs = await Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          data: newDocs,
        },
      });
    } catch (err) {
      next(new APPError(err.message, 400));
    }
  };
};

const getOne = (Model, populateOptions) => {
  return async (req, res, next) => {
    let query;
    try {
      if (req.params.slug) {
        query = Model.findOne({ slug: req.params.slug });
      } else {
        query = Model.findById(req.params.id);
      }
      if (populateOptions) {
        query = query.populate(populateOptions);
      }
      //wrong id(a little change in id) will give success result if not handled
      const doc = await query;
      if (!doc) {
        return next(new APPError('no document found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    } catch (err) {
      
      next(new APPError(err.message, 400));
    }
  };
};

module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
