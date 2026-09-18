const prisma = require("../lib/prisma.ts");
require("dotenv").config();
const authenticateUser = require("../middlewares/authenticate_user.js");
const validateComment = require("../middlewares/validate_comment.js");
const checkPostExists = require("../middlewares/check_post_exists.js");

const createComment = [
  authenticateUser,
  validateComment,
  async (req, res) => {
    try {
      const comment = await prisma.comment.create({
        data: {
          userId: req.payload.user.id,
          postId: +req.params.id,
          body: req.body.comment,
        },
      });

      const user = await prisma.user.findUnique({
        where: { id: comment.userId },
      });
      comment.user = user;

      res.json(comment);
    } catch (error) {
      res.status(404).json({ error: "Can't comment under non existent post." });
    }
  },
];

const getAllComments = [
  checkPostExists,
  async (req, res) => {
    const comments = await prisma.comment.findMany({
      where: { postId: +req.params.id },
    });

    if (comments.length === 0)
      return res.json({ message: "This post doesn't have any comments" });

    res.json(comments);
  },
];

const getCommentById = [
  checkPostExists,
  async (req, res) => {
    const comment = await prisma.comment.findUnique({
      where: {
        id: +req.params.commentId,
        postId: +req.params.id,
      },
    });
    if (!comment) res.status(404).json({ error: "Comment doesn't exist" });
    res.json(comment);
  },
];

const deleteCommentById = [
  checkPostExists,
  async (req, res) => {
    const comment = await prisma.comment.delete({
      where: {
        id: +req.params.commentId,
        postId: +req.params.id,
      },
    });
    res.json(comment);
  },
];

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  deleteCommentById,
};
