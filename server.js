/* eslint-disable no-console */ //отключить для всего файла консоль

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const localDb = process.env.DATABASE_LOCAL; //eslint-disable-line no-unused-vars

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.log(err));

const app = require('./app');

const port = process.env.PORT || 3000;
// console.log(process.env.NODE_ENV)

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
