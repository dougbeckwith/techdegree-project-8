const express = require("express");
const router = express.Router();

const Book = require("../models").Book;

// Get all books view
router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll();

    if (books.length !== 0) {
      res.render("index", { books });
    } else {
      res.render("index", { books: null });
    }
  } catch (err) {
    console.log(err);
    next();
  }
});

// Get new book view
router.get("/new", function (req, res, next) {
  res.render("new-book");
});

// Get new book edit view
router.get("/:id", async function (req, res, next) {
  const id = parseInt(req.params.id);
  try {
    const bookData = await Book.findOne({ where: { id: `${id}` } });
    if (bookData === null) {
      next();
    } else {
      const book = bookData.dataValues;

      res.render("update-book", { book, id });
    }
  } catch (err) {
    console.log(err);
    next();
  }
});

// Post new book database
router.post("/new", async function (req, res, next) {
  const { title, author, genre, year } = req.body;

  // Add book to database
  try {
    await Book.create({
      title,
      author,
      genre,
      year
    });

    res.redirect("/books");
  } catch (err) {
    console.log(err);
    res.render("new-book", { errors: err.errors });
  }
});

// Update book by id
router.post("/:id", async function (req, res, next) {
  // const id = req.params.id;
  const id = parseInt(req.params.id);
  const { title, author, genre, year } = req.body;

  try {
    await Book.update(
      { title, author, genre, year },
      {
        where: {
          id
        }
      }
    );

    res.redirect("/books");
  } catch (err) {
    console.log(err);
    const bookData = await Book.findOne({ where: { id: `${id}` } });
    const book = bookData.dataValues;
    res.render("update-book", { errors: err.errors, book, id });
  }
});

// Delete book
router.delete("/:id/delete", async function (req, res, next) {
  const id = parseInt(req.params.id);

  try {
    await Book.destroy({ where: { id } });
    res.status(204).send("Success");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
