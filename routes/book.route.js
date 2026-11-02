/**
 * Compatibility Route: Book Route (routes/book.route.js)
 */

const express = require('express');
const router = express.Router();
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} = require('../controllers/book.controller');

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
