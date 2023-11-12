const express = require('express');
const {protect} = require('../controllers/authController')
const {getCheckOutSession, setTourUser, createBookingCheckout} = require('../controllers/bookingController')
const router = express.Router();

router.get('/checkout-session/:tourSlug', protect, getCheckOutSession);
router.get('/createBooking', setTourUser, createBookingCheckout);

module.exports = router;