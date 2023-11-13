const APPError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
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
  dest: `./public/temp`,
  storage: multerStorage,
  fileFilter: multerFilter,
});
const uploadUsersPhoto = upload.single('photo');

const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./public/temp/${req.file.filename}`);
  next();
};

const uploadUserImg = async (req, res, next) => {
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
};
