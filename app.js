const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { sequelize } = require("./models/index");

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// connect to database and sync models to db
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.use("/", indexRouter);
app.use("/books", booksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const error = new Error();
  error.status = 404;
  error.message = "404 Page Not Found";
  res.render("page-not-found", { error });
});

// error handler
app.use(function (err, req, res, next) {
  if (!err.status) {
    err.status = 500;
  }
  if (!err.message) {
    err.message = "Sorry Something Went Wrong";
  }

  console.log(err.message);
  console.log(err.status);

  res.render("error", { err });
});

module.exports = app;
