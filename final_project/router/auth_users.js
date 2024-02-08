const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", async (req,res) => {
  try{
    const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  }catch(err){
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const review = req.query.review; // Extract review from query parameters
    const username = req.session.authorization.username; // Extract username from session

    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already posted a review for this book
    if (books[isbn].reviews[username]) {
      // Modify the existing review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // Add a new review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

regd_users.delete("/auth/review/:isbn", async(req, res) => {
  try {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const username = req.session.authorization.username; // Extract username from session

    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has posted a review for this book
    if (books[isbn].reviews[username]) {
      // Delete the review
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
