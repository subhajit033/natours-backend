const Tour = require('../models/tourModel');
const APPError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SEC_KEY);
const { createOne } = require('../controllers/handlerFactory');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const getCheckOutSession = async (req, res, next) => {
  /**
   * 1) get currently booked tour
   * 2)create a checkout session
   * 3)send it to client
   */
  try {
    const tour = await Tour.findOne({ slug: req.params.tourSlug });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        // {
        //   name: `${tour.name} Tour`,
        //   description: tour.summary,
        //   //change in production
        //   images: [
        //     'https://th.bing.com/th/id/OIP.YHFMsettT35moUDjgKMmVgHaE8?pid=ImgDet&rs=1',
        //   ],
        //   amount: tour.price,
        //   currency: 'INR',
        //   quantity: 1,
        // },

        //new in stripe
        {
          price_data: {
            currency: 'INR',
            unit_amount: tour.price * 100,
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [
                'https://th.bing.com/th/id/OIP.YHFMsettT35moUDjgKMmVgHaE8?pid=ImgDet&rs=1',
              ],
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      //not a secure way, in deployed websoute we can integrate stripe webkooks for payment success
      success_url: `http://localhost:5173`,
      cancel_url: `http://localhost:5173/${req.params.tourSlug}`,
      //customer_name: req.user.name,
      customer_email: req.user.email,
      //during accessing single doc id is always id not _id
      client_reference_id: tour.id,
      metadata: {
        tourId: tour.id,
      },
    });
    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (err) {
    next(new APPError(err.message, 400));
  }
};

const setTourUser = (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) {
    return next();
  }
  req.body.tour = tour;
  req.body.user = user;
  req.body.price = price;
  next();
};
const createBookingCheckout = async (sessionData) => {
  //all the data required during checkout will be received here after successful payment
  const tour = sessionData.metadata.tourId || sessionData.client_reference_id;
  const user = (await User.findOne({ email: sessionData.customer_email })).id;
  const price = sessionData.amount_total / 100;
  await Booking.create({ tour, user, price });
};

const webhookCheckout = async (req, res, next) => {
  const endpointSecret = process.env.WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];
  //this body need to be in raw form
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(`webhook error - ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    console.log(event.data.object);
    createBookingCheckout(event.data.object);
  }
  res.status(200).json({
    received: true,
  });
};

module.exports = {
  getCheckOutSession,
  setTourUser,
  createBookingCheckout,
  webhookCheckout,
};
