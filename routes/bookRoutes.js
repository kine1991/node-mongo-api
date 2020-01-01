const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

// router.param('id', bookController.checkID);

router
  .route('/top-5-cheap')
  .get(bookController.topFiveCheapBook, bookController.getAllBooks);

router.route('/get-book-stats').get(bookController.getBookStats);
router
  .route('/get-book-stats-by-release-year/:year')
  .get(bookController.getBookStatsByReleaseYear);

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
