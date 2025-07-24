// routes/books.js
const express = require('express');
const router = express.Router();
const { readBooks, writeBooks } = require('../utils/fileHelper');

const validateBook = (book) => {
  const currentYear = new Date().getFullYear();
  return book.title && book.author && typeof book.year === 'number' &&
         book.year >= 1000 && book.year <= currentYear;
};

// GET /books
router.get('/', async (req, res, next) => {
  try {
    const books = await readBooks();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// GET /books/:id
router.get('/:id', async (req, res, next) => {
  try {
    const books = await readBooks();
    const book = books.find(b => b.id == req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// GET /books/search
router.get('/search', async (req, res, next) => {
  try {
    const { id, title, author, year } = req.query;
    let books = await readBooks();
    if (id) books = books.filter(b => b.id == id);
    if (title) books = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
    if (author) books = books.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
    if (year) books = books.filter(b => b.year == parseInt(year));
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// POST /books
router.post('/', async (req, res, next) => {
  try {
    const newBook = req.body;
    if (!validateBook(newBook)) return res.status(400).json({ error: 'Invalid book data' });

    const books = await readBooks();
    newBook.id = Date.now();
    books.push(newBook);
    await writeBooks(books);
    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
});

// PUT /books/:id
router.put('/:id', async (req, res, next) => {
  try {
    const update = req.body;
    if (!validateBook(update)) return res.status(400).json({ error: 'Invalid book data' });

    const books = await readBooks();
    const index = books.findIndex(b => b.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Book not found' });

    books[index] = { ...books[index], ...update };
    await writeBooks(books);
    res.json(books[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE /books/:id
router.delete('/:id', async (req, res, next) => {
  try {
    let books = await readBooks();
    const index = books.findIndex(b => b.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Book not found' });

    const removed = books.splice(index, 1);
    await writeBooks(books);
    res.json(removed[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
