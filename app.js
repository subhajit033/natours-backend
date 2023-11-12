const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
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
const app = express();

//GLOBAL MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
  app.use(morgan('dev'));
}

//set securtity http header
app.use(helmet());
app.use((req, res, next) => {
  console.log(`${__dirname}/../client`);
  next();
});
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'too many request from this ip, please try again in an hour',
});

//views

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//limit req from same ip
app.use('/api', limiter);

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

//console.log(x);
app.all('*', (req, res, next) => {
  next(new APPError(`Cannot find ${req.originalUrl} on this server`, 404));
});

//global error handling
app.use(globalErrorHandler);
//DRY concept syntactic sugar ROUTES

module.exports = app;
