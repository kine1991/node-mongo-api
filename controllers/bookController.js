const Book = require('../models/bookModel');
const APIFeatures = require('../utils/apiFeature');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.topFiveCheapBook = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  // req.query.fields
  next();
};

exports.getAllBooks = catchAsync(async (req, res) => {
  const features = new APIFeatures(Book.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const books = await features.query;

  // Send Response
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books: books
    }
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate('reviews');

  if (!book) {
    return next(new AppError('No book found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book: book
    }
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!book) {
    return next(new AppError('No book found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book: book
    }
  });
});

exports.createBook = catchAsync(async (req, res) => {
  const newBook = await Book.create({ ...req.body, publisher: req.user.id });

  res.status(201).json({
    status: 'success',
    data: {
      book: newBook
    }
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return next(new AppError('No book found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getBookStats = catchAsync(async (req, res) => {
  const stats = await Book.aggregate([
    // {
    //   $match: { ratingsAverage: { $gte: 3 } }
    // },
    {
      $group: {
        _id: { $toUpper: '$genre' },
        num: { $sum: 1 },
        avgPage: { $avg: '$pages' },
        totalPrice: { $sum: '$price' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    },
    {
      $match: { _id: { $ne: 'SCIENCE' } }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: stats
  });
});

exports.getBookStatsByReleaseYear = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const stats = await Book.aggregate([
    {
      $unwind: '$releaseBook'
    },
    {
      $match: {
        releaseBook: {
          // $eq: 'new Date(`2007-04-18T07:08:38.680Z`)',
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$releaseBook' },
        num: { $sum: 1 },
        totalPrice: { $sum: '$price' },
        books: { $push: { $concat: ['$name', ' - ', '$author'] } }
        // month: { $month: '$releaseBook' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { month: 1 }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: stats
  });
});
