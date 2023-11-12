const express = require('express');

const router = express.Router();
const {
  getAllUsers,
  createUser,
  getSpecificUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUsersPhoto,
  resizeUserPhoto
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  isLoggedIn,
  logOut,
} = require('../controllers/authController');



router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logOut);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.get('/rememberMe', isLoggedIn);

//position of middleware matters
router.use(protect);
//secure all the routes by authentication after this middleware

router.patch('/updatePassword', updatePassword);
router.get('/me', getMe, getSpecificUser);
router.patch('/updateMe', uploadUsersPhoto, resizeUserPhoto,  updateMe);
router.delete('/deleteMe', deleteMe);

//rest format routes
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSpecificUser).patch(updateUser).delete(deleteUser);
module.exports = router;
