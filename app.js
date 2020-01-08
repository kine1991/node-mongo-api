/* eslint-disable no-console */ //отключить для всего файла консоль
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const carRouter = require('./routes/carRoutes');
const userRouter = require('./routes/userRoutes');
const articleRouter = require('./routes/articleRoutes');
const bookRouter = require('./routes/bookRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
app.use(morgan('dev'));

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // от подобных атак "email": { "$gt": "" }, удаляет знаки $ ect

// Data sanitization against XSS
app.use(xss()); // удаляет html code <script></script>

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('req.headers');
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/cars', carRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Любая ошибка типа next(err...) будет обрабатываться здесь
app.use(globalErrorHandler);
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });

module.exports = app;

// const x = 2;
// // eslint-disable-next-line
// console.log(x);
// console.log('222'); //eslint-disable-line
