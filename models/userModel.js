const mongoose = require('mongoose');
const validator = require('validator');
const APPError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'please enter a email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email address'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'user role should be user or guide or admin',
    },
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'password cannot be empty'],
    minlength: [8, 'password must contain minimum 8 character'],
    //to hide password in every req
    select: false,
  },
  passwordconfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      //if become false then it will show error message
      //This will only works on SAVE or CREATE !! not work for findOneandUpdate this type of method
      validator: function (pass) {
        return pass === this.password;
      },
      message: 'password does not match , try again',
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});
//pre save middleware -> a pre middleware on save(runs before save a document)
//we are using this keyword here so we can't able to use arrow function

userSchema.pre(/^find/, function (next) {
  //this point to the
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    return next(new APPError(error.message, 500));
  }
  //passwordconfirm  only needed for validation check , we don't want to store it in our database
  //delete password confirm field
  this.passwordconfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//instances method

// userSchema.methods.setPasswordChangesAt = function () {
//   this.passwordChangedAt = Date.now();
// };

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  //false means password not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  //10 miniutes for password reset
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
