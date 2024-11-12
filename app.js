const express = require("express");
const app = express();
const port = 3000;

// Sample book data with six books
let books = [
  {
    ISBN: "11111",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    reviews: [],
  },
  {
    ISBN: "22222",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    reviews: [],
  },
  {
    ISBN: "33333",
    title: "1984",
    author: "George Orwell",
    reviews: [],
  },
  {
    ISBN: "44444",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    reviews: [],
  },
  {
    ISBN: "55555",
    title: "Moby Dick",
    author: "Herman Melville",
    reviews: [],
  },
  {
    ISBN: "66666",
    title: "War and Peace",
    author: "Leo Tolstoy",
    reviews: [],
  },
];

// Promise-based function to search for books by title
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    // Find all books whose title matches the given title (case insensitive search)
    const booksByTitle = books.filter((b) =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );
    if (booksByTitle.length > 0) {
      resolve(booksByTitle); // If books are found, resolve the promise
    } else {
      reject("No books found with this title"); // If no books found, reject the promise
    }
  });
};

// Route to get books by title
app.get("/books/title/:title", (req, res) => {
  const title = req.params.title;

  // Using the getBooksByTitle function which returns a promise
  getBooksByTitle(title)
    .then((booksByTitle) => {
      res.status(200).json(booksByTitle); // Send the books found by the title in the response
    })
    .catch((error) => {
      res.status(404).send(error); // If no books found, send error message
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
