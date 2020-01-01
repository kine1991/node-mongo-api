/* eslint-disable no-console */ //отключить для всего файла консоль
const express = require('express');
const morgan = require('morgan');

const app = express();

const carRouter = require('./routes/carRoutes');
const userRouter = require('./routes/userRoutes');
const articleRouter = require('./routes/articleRoutes');
const bookRouter = require('./routes/bookRoutes');

app.use(morgan('dev'));

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/cars', carRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);

// const x = 2;
// // eslint-disable-next-line
// console.log(x);

// console.log('222'); //eslint-disable-line

module.exports = app;
