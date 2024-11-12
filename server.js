const express = require("express");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Sample book data with six books
let books = [
  {
    ISBN: "11111",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    reviews: ["A fascinating story of love and ambition."],
  },
  {
    ISBN: "22222",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    reviews: [],
  },
  { ISBN: "33333", title: "1984", author: "George Orwell", reviews: [] },
  {
    ISBN: "44444",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    reviews: [],
  },
  { ISBN: "55555", title: "Moby Dick", author: "Herman Melville", reviews: [] },
  { ISBN: "66666", title: "War and Peace", author: "Leo Tolstoy", reviews: [] },
];

let users = [];

// Secret key for JWT
const SECRET_KEY = "mysecretkey";

// Middleware to verify JWT token for secure routes
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(403).send("A token is required for authentication");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

// Task 1: Get the book list available in the shop
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// Task 2: Get books based on ISBN
app.get("/books/isbn/:isbn", (req, res) => {
  const book = books.find((b) => b.ISBN === req.params.isbn);
  if (!book) return res.status(404).send("Book not found");
  res.status(200).json(book);
});

// Task 3: Get all books by author
app.get("/books/author/:author", (req, res) => {
  const authorBooks = books.filter((b) => b.author === req.params.author);
  if (!authorBooks.length)
    return res.status(404).send("No books found by this author");
  res.status(200).json(authorBooks);
});

// Task 4: Get all books based on title
app.get("/books/title/:title", (req, res) => {
  const titleBooks = books.filter((b) =>
    b.title.toLowerCase().includes(req.params.title.toLowerCase())
  );
  if (!titleBooks.length)
    return res.status(404).send("No books found with this title");
  res.status(200).json(titleBooks);
});

// Task 5: Get book review
app.get("/books/:isbn/reviews", (req, res) => {
  const book = books.find((b) => b.ISBN === req.params.isbn);
  if (!book) return res.status(404).send("Book not found");
  res.status(200).json(book.reviews);
});

// Task 6: Register a new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.find((user) => user.username === username)) {
    return res.status(400).send("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send("User registered successfully");
});

// Task 7: Login as a registered user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid username or password");
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "2h" });
  res.status(200).json({ token });
});

// Task 8: Add/Modify a book review (requires authentication)
app.post("/books/:isbn/review", verifyToken, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const book = books.find((b) => b.ISBN === isbn);
  if (!book) return res.status(404).send("Book not found");

  // Add or modify review
  const userReview = book.reviews.find((r) => r.username === req.user.username);
  if (userReview) {
    userReview.text = review;
  } else {
    book.reviews.push({ username: req.user.username, text: review });
  }
  res.status(200).json(book.reviews);
});

// Task 9: Delete a book review added by the user (requires authentication)
app.delete("/books/:isbn/review", verifyToken, (req, res) => {
  const { isbn } = req.params;
  const book = books.find((b) => b.ISBN === isbn);
  if (!book) return res.status(404).send("Book not found");

  // Delete review
  book.reviews = book.reviews.filter((r) => r.username !== req.user.username);
  res.status(200).json(book.reviews);
});

// Task 10: Get all books using async callback function
app.get("/async/books", async (req, res) => {
  try {
    res.status(200).json(books);
  } catch (err) {
    res.status(500).send("Error retrieving books");
  }
});

// Task 11: Search by ISBN using Promises
app.get("/async/books/isbn/:isbn", (req, res) => {
  new Promise((resolve, reject) => {
    const book = books.find((b) => b.ISBN === req.params.isbn);
    if (book) resolve(book);
    else reject("Book not found");
  })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).send(error));
});

// Task 12: Search by author
app.get("/async/books/author/:author", async (req, res) => {
  const authorBooks = books.filter((b) => b.author === req.params.author);
  res.status(200).json(authorBooks);
});

// Task 13: Search by title
app.get("/async/books/title/:title", async (req, res) => {
  const titleBooks = books.filter((b) =>
    b.title.toLowerCase().includes(req.params.title.toLowerCase())
  );
  res.status(200).json(titleBooks);
});

// Task 14: Submission of Project GitHub Link - Example route
app.post("/submit", (req, res) => {
  const { githubLink } = req.body;
  if (!githubLink) {
    return res.status(400).send("GitHub link is required");
  }
  res.status(200).send("Project link submitted successfully");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
