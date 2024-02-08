const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post('/register', async function (req, res) {
  try {
    const { username, password } = req.body; // Extract username and password from request body

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are not provided" });
    }

    // Check if username already exists
    if (isValid(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Add the new user to the users array
    users.push({ username, password });

    // Return success message
    return res.status(200).json({ message: "User successfully registered. You can now login." });
  } catch (error) {
    // If an error occurs during asynchronous operations, send a 500 Internal Server Error response
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const book = books[isbn]; // Retrieve book details based on ISBN

    if (book) {
      // If the book is found, send its details as a JSON response
      return res.status(200).json(book);
    } else {
      // If the book is not found, send a 404 Not Found response
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // If an error occurs during asynchronous operations, send a 500 Internal Server Error response
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author; // Extract author from request parameters
    const book = Object.values(books).filter(book => book.author === author); // Find the book with matching author

    if (book) {
      // If a book with the specified author is found, send its details as a JSON response
      return res.status(200).json(book);
    } else {
      // If no book with the specified author is found, send a 404 Not Found response
      return res.status(404).json({ message: "No books found for the specified author" });
    }
  } catch (error) {
    // If an error occurs during asynchronous operations, send a 500 Internal Server Error response
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title; // Extract title from request parameters
    const book = Object.values(books).filter(book => book.title === title); // Find the book with matching title

    if (book) {
      // If a book with the specified title is found, send its details as a JSON response
      return res.status(200).json(book);
    } else {
      // If no book with the specified title is found, send a 404 Not Found response
      return res.status(404).json({ message: "No books found for the specified title" });
    }
  } catch (error) {
    // If an error occurs during asynchronous operations, send a 500 Internal Server Error response
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const book = books[isbn]; // Retrieve book details based on ISBN

    if (book) {
      const reviews = book.reviews; // Get reviews for the book

      // Check if there are any reviews for the book
      if (Object.keys(reviews).length > 0) {
        // If there are reviews, send them as a JSON response
        return res.status(200).json(reviews);
      } else {
        // If there are no reviews for the book, send a 404 Not Found response
        return res.status(404).json({ message: "No reviews found for the specified book" });
      }
    } else {
      // If the book with the specified ISBN is not found, send a 404 Not Found response
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // If an error occurs during asynchronous operations, send a 500 Internal Server Error response
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports.general = public_users;
