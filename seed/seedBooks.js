/* eslint-disable no-undef */
/* eslint-disable no-console */ //отключить для всего файла консоль
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });

const mongoose = require('mongoose');
const faker = require('faker');
const Book = require('../models/bookModel');

// eslint-disable-next-line no-unused-vars
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

const impData = () => {
  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line prettier/prettier
    const genres = [
      'Fantasy',
      'Science',
      'fiction',
      'Western',
      'Romance',
      'Thriller',
      'Mystery',
      'Detective',
      'Dystopia',
      'Newspaper'
    ];
    const authors = [
      'Fyodor Dostoevsky',
      'Mikhail Bulgakov',
      'Vladimir Sorokin',
      'Nikolai Gogol'
    ];
    const publisher = ['admin', 'publisher1', 'publisher'][
      Math.floor(Math.random() * 3)
    ];

    let private = true;
    if (Math.random() > 0.95) {
      // eslint-disable-next-line no-const-assign
      private = false;
    }

    const randomGenre = Math.floor(Math.random() * 10);
    const randomAuthor = Math.floor(Math.random() * 4);
    const description = faker.lorem.sentences(3);
    const name = faker.lorem.words(3);
    const price = faker.commerce.price(1, 100);
    const priceDiscount = Math.floor(price * 0.8);
    const pages = faker.random.number({ min: 10, max: 900 });
    const ratingsAverage =
      0.1 * faker.random.number({ min: 20, max: 50 }).toFixed(1);
    const ratingsQuantity = faker.random.number({ min: 1, max: 50 });
    const imgageUrl = faker.random.image();
    const createdAt = faker.date.recent();
    const releaseBook = [
      faker.date.between(1965, 2020),
      faker.date.between(1965, 2020),
      faker.date.between(1965, 2020)
    ];

    const book = {
      description,
      name,
      genre: genres[randomGenre],
      author: authors[randomAuthor],
      publisher,
      private,
      price,
      priceDiscount,
      pages,
      ratingsAverage,
      ratingsQuantity,
      imgageUrl,
      createdAt,
      releaseBook
    };

    const importData = async () => {
      try {
        const book2 = await Book.create(book);
        console.log(book2);
      } catch (error) {
        console.log(error);
      }
    };
    importData();
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Book.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  impData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
