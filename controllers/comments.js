const prisma = require("../lib/prisma.ts");
const { body, validationResult, matchedData } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = require("../verify_token.js");

const createComment = [
  verifyToken,
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment can't be empty.")
    .isLength({ max: 1000 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    jwt.verify(req.token, process.env.SECRET, async (error, payload) => {
      if (error) return res.status(403).json({ error });

      try {
        await prisma.comment.create({
          data: {
            userId: payload.user.id,
            postId: +req.params.id,
            body: req.body.comment,
          },
        });

        res.json({ message: "Comment successfully created." });
      } catch (error) {
        res
          .status(404)
          .json({ error: "Can't comment under non existent post." });
      }
    });
  },
];

module.exports = {
  createComment,
};
