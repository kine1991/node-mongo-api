const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;
//Book schema
const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A book must have a name'],
      // trim: true,
      maxlength: [
        100,
        'A book name must have less or equal then 100 characters'
      ],
      minlength: [3, 'A book name must have more or equal then 3 characters']
    },
    genre: {
      type: String,
      required: [true, 'A book must have a genre']
    },
    description: {
      type: String
    },
    author: {
      type: String,
      required: [true, 'A book must have a author']
    },
    slug: String,
    private: {
      type: Boolean,
      default: false
    },
    publisher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    price: {
      type: Number
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    pages: {
      type: Number
    },
    releaseBook: [Date],
    //   releaseBook: [Number],
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    imgageUrl: {
      type: String
    },
    imgages: {
      type: [String]
    },
    buyUrl: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
      // select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

bookSchema.virtual('priceInRubles').get(function() {
  return this.price * 60;
});

// Virtual populate
bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
bookSchema.pre('save', function(next) {
  this.slug = slugify(`${this.name} ${this.author}`, { lower: true });
  next();
});

// bookSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
bookSchema.pre(/^find/, function(next) {
  this.find({ private: { $ne: true } });

  this.start = Date.now();
  next();
});

bookSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'publisher',
    select: '-__v -passwordChangedAt'
  });
  next();
});

bookSchema.post(/^find/, function(docs, next) {
  // console.log(docs)
  // console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
bookSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { private: { $ne: true } } });

  // console.log(this.pipeline());
  next();
});

bookSchema.index({ title: 1, author: 1 }, { unique: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
