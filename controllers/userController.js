const APPError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const path = require('path');
const { uploadOnCloud } = require('../utils/cloudinary');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `../../natours/client/src/assets/users`);
//   },
//   filename: (req, file, cb) => {
//     //file = req.file
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

//here we are using memoryStorage because after this we have to resize the image, so its a good practice to first store in memory
//and then in disk
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new APPError('Not an image, please upload image', 400), false);
  }
};

const upload = multer({
  // dest: `./public/temp`,
  storage: multerStorage,
  fileFilter: multerFilter,
});
//this photo is the key of postman , from where the file is coming from
const uploadUsersPhoto = upload.single('photo');

const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  const outputPath = path.join(
    __dirname,
    '..',
    'public',
    'temp',
    req.file.filename
  );
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(outputPath);
  next();
};

const uploadUserImg = async (req, res, next) => {
  //error i am getting because because, i am neglecting the prev middleware, if there is no file , but here we are trying to access
  //it req.file.filename
  //also i have set useState file = "" initialy so thst is converting to link, thats why getting error
  //solved:- initialy put it null
  if (!req.file) return next();
  try {
    const response = await uploadOnCloud(req.file.filename);
    console.log(response);
    if (!response) {
      return next(new APPError('Error while uploading photo on cloud', 400));
    }
    req.body.photo = response;
  } catch (err) {
    return next(new APPError(err.message, 400));
  }
  next();
};

const getAllUsers = getAll(User);

const createUser = createOne(User);

const getSpecificUser = getOne(User);
//don't update password with this
const updateUser = updateOne(User);

const deleteUser = deleteOne(User);

const filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
const updateMe = async (req, res, next) => {
  /**
   * update when user is already logged in
   * 1) create error if user post password data
   * 2) update password
   */
  console.log(req.file);
  console.log(req.body);

  try {
    const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
    if (req.body.password || req.body.passwordconfirm)
      return next(new APPError('The route is not for updates password', 400));

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(new APPError(err.message, 400));
  }
};
const getMe = async (req, res, next) => {
  //DRY
  req.params.id = req.user.id;
  next();
};

const deleteMe = async (req, res, next) => {
  const deletedUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getBookedTours = async (req, res, next) => {
  try {
    const stats = await Booking.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $lookup: {
          from: 'tours', // Assuming the name of the tours collection is 'tours'
          localField: 'tour',
          foreignField: '_id',
          as: 'tourDetails',
        },
      },
      {
        $lookup: {
          from: 'users', // Assuming the name of the users collection is 'users'
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },

      {
        $project: {
          'userDetails.name': 1, // Include only the 'name' field from the 'users' collection
          'tourDetails.name': 1, // Include the 'tour' field
          'tourDetails.imageCover': 1,
          price: 1, // Include the 'price' field
          bookedAt: 1, // Include the 'bookedAt' field
          paid: 1, // Include the 'paid' field
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      bookedTours: stats,
    });
  } catch (err) {
    next(new APPError(err.message, 400));
  }
};
module.exports = {
  getAllUsers,
  createUser,
  getSpecificUser,
  deleteUser,
  updateUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUsersPhoto,
  resizeUserPhoto,
  uploadUserImg,
  getBookedTours,
};
