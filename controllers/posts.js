const prisma = require("../lib/prisma.ts");
const { body, validationResult, matchedData } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("You have to provide a title.")
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be between 10 and 50 characters."),
  body("body")
    .trim()
    .notEmpty()
    .withMessage("You have to provide body")
    .isLength({ min: 3, max: 3000 }),
];

const createPost = [
  validatePost,

  (req, res, next) => {
    if (!req.headers["authorization"])
      return res
        .status(403)
        .json({ error: "You need to log in in order to create posts" });

    req.token = req.headers["authorization"].split(" ")[1];
    next();
  },

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    jwt.verify(req.token, process.env.SECRET, async (error, payload) => {
      if (error) return res.status(403).json({ error });

      await prisma.post.create({
        data: {
          authorId: payload.user.id,
          title: req.body.title,
          body: req.body.body,
        },
      });
      res.json({ message: "successfully created post" });
    });
  },
];

module.exports = {
  createPost,
};
