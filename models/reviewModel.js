const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Review schema
const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [true, 'Review must belong to a book.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path: 'book',
  //     select: 'name -publisher  '
  //   }).populate({
  //     path: 'user',
  //     select: 'name'
  //   });
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
});

// reviewSchema.index({ book: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
