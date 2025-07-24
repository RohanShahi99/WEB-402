// utils/fileHelper.js
const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/books.json');

const readBooks = async () => {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeBooks = async (books) => {
  await fs.writeFile(filePath, JSON.stringify(books, null, 2));
};

module.exports = { readBooks, writeBooks };
