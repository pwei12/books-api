const express = require("express");
const router = express.Router();
const { books: oldBooks } = require("../data/db.json");
const { Book, Author } = require("../models");

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.sendStatus(403);
  } else {
    if (authorization === "Bearer my-awesome-token") {
      next();
    } else {
      res.sendStatus(403);
    }
  }
};

router
  .route("/")
  .get(async (req, res) => {
    try {
      const { author, title } = req.query;
      if (title) {
        const books = await Book.findAll({
          where: { title },
          include: [Author]
        });
        res.json(books);
      } else if (author) {
        const books = await Book.findAll({
          include: [
            {
              model: Author,
              where: { name: author }
            }
          ]
        });
        res.json(books);
      } else {
        const books = await Book.findAll({ include: [Author] });
        res.json(books);
      }
    } catch (err) {
      return res.sendStatus(400);
    }
  })
  .post(verifyToken, async (req, res) => {
    try {
      const { title, author } = req.body;
      //METHOD1
      // const [foundAuthor] = await Author.findOrCreate({where: {name: author}});
      // const newBook = await Book.create({title});
      // await newBook.setAuthor(foundAuthor); //newBook without author
      // const newBookWithAuthor = await Book.findOne({
      //   where: { id: newBook.id},
      //   include: [Author]
      // });
      // res.status(201).json(newBookWithAuthor);

      //METHOD2
      const foundAuthor = await Author.findOne({ where: { name: author } });
      if (!foundAuthor) {
        const createdBook = await Book.create(
          { title, author: { name: author } },
          { include: [Author] }
        );
        return res.status(201).json(createdBook);
      }
      const createdBook = await Book.create(
        { title, authorId: foundAuthor.id },
        { include: [Author] }
      );
      return res.status(201).json(createdBook);
    } catch (err) {
      return res.sendStatus(400);
    }
  });

router
  .route("/:id")
  .put(async (req, res) => {
    try {
      const { title, author } = req.body;
      const book = await Book.findOne({
        where: { id: req.params.id },
        include: [Author]
      });
      const [foundAuthor] = await Author.findOrCreate({
        where: { name: author }
      });
      await book.update({ title });
      await book.setAuthor(foundAuthor);
      const result = await Book.findOne({
        where: { id: book.id },
        include: [Author]
      });
      return res.status(202).json(result);
    } catch (err) {
      return res.sendStatus(400);
    }
  })
  .delete(async (req, res) => {
    try {
      const book = oldBooks.find(b => b.id === req.params.id);
      if (book) {
        res.sendStatus(202);
      } else {
        res.sendStatus(400);
      }
    } catch (err) {
      return res.sendStatus(400);
    }
  });

module.exports = router;
