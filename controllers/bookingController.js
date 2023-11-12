const Tour = require('../models/tourModel');
const APPError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SEC_KEY);
const { createOne } = require('../controllers/handlerFactory');
const Booking = require('../models/bookingModel');
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
      success_url: `http://localhost:5173?tour=${tour._id}?user=${req.user.id}?price=${tour.price}`,
      cancel_url: `http://localhost:5173/${req.params.tourSlug}`,
      //customer_name: req.user.name,
      customer_email: req.user.email,
      client_reference_id: req.user.id,
    });
    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (err) {
    next(new APPError(err.message, 400));
  }
};

const setTourUser = (req, res ,next)=>{
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) {
    return next();
  }
  req.body.tour = tour;
  req.body.user = user;
  req.body.price = price;
  next();
}
const createBookingCheckout = createOne(Booking);


module.exports = { getCheckOutSession, setTourUser, createBookingCheckout };
