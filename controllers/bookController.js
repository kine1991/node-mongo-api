const Book = require('../models/bookModel');
const APIFeatures = require('../utils/apiFeature');

exports.topFiveCheapBook = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  // req.query.fields
  next();
};

exports.getAllBooks = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        book: book
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        book: book
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.createBook = async (req, res) => {
  try {
    console.log(req.body);
    const newBook = await Book.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        book: newBook
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getBookStats = async (req, res) => {
  try {
    // const stats = await Book.find();
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
  } catch (error) {
    console.log(error);
  }
};

exports.getBookStatsByReleaseYear = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
  }
};
