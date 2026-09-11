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

const getAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany();
  const result = {};
  for (let i = 0; i < posts.length; i++) result[i] = posts[i];
  res.json(result);
};

const getPostById = async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: +req.params.id },
  });
  if (!post) return res.status(404).json({ error: "Post doesn't exist" });
  const result = {};
  result[0] = post;
  res.json(result);
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
};
