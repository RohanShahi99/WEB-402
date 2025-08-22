const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Helper response
const sendResponse = (res, status, data, message = null) => {
  if (status === 'error') {
    return res.status(400).json({ status, message });
  }
  res.json({ status, data });
};

// Export the router
module.exports = router;


const books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 2, title: "1984", author: "George Orwell" }
];

router.get('/', (req, res) => {
  res.json(books);
});

module.exports = router;

