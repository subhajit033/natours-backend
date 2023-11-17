const express = require('express');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const APPError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const { webhookCheckout } = require('./controllers/bookingController');
const app = express();

//GLOBAL MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.enable('trust proxy');

//this is special case for performing complex operation like , delete , put , and routes which are sending cookies
app.options('*', cors());

//set securtity http header
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'worker-src': ["'self'", 'blob:'],
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://js.stripe.com',
        'https://api.mapbox.com',
        "'unsafe-inline'",
      ],

      imgSrc: ["'self'", 'https://i.ibb.co', 'http://res.cloudinary.com'],
    },
  })
);

//limit req from same ip

//stripe api need the raw streamed data , not the json data, thats why we are declaring this before body parser
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

//body parser
app.use(express.json({ limit: '10kb' }));
//cookie parser
app.use(cookieParser());

app.use((req, res, next) => {
  req.time = new Date();
  // console.log(req.headers);
  next();
});

//data sanitization after body parser against noSql query injection
app.use(mongoSanitize());

//prevent xss attack (inserting html with js into our code)
app.use(xss());

//prevent parameter pollution
//{{URL}}api/v1/tours?sort=duration&sort=price, but we have created one sort parameter for our api so it will give error
//but using hpp() middleware , the issue is resolved it will sort by the last query i.e price, but for white list property
//we can use duplicate parameter like duration=5&duration=9

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//serving static file
app.use(express.static(`./public`));
//router middleware

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

const clientDir = path.join(__dirname, 'client', 'dist');

app.use(express.static(clientDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

//console.log(x);

//these are unhandled route sohold be put after all routes
app.all('*', (req, res, next) => {
  next(new APPError(`Cannot find ${req.originalUrl} on this server`, 404));
});

//global error handling
app.use(globalErrorHandler);
//DRY concept syntactic sugar ROUTES

module.exports = app;
