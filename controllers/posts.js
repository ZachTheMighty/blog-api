const prisma = require("../lib/prisma.ts");
require("dotenv").config();
const authenticateUser = require("../middlewares/authenticate_user.js");
const validatePost = require("../middlewares/validate_post.js");
const checkPostExists = require("../middlewares/check_post_exists.js");

const createPost = [
  authenticateUser,
  validatePost,
  async (req, res) => {
    await prisma.post.create({
      data: {
        authorId: req.payload.user.id,
        title: req.body.title,
        body: req.body.body,
      },
    });
    res.json({ message: "successfully created post" });
  },
];

const getAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { id: "desc" },
  });
  const result = {};
  for (let i = 0; i < posts.length; i++) {
    const comments = await prisma.comment.findMany({
      where: { postId: posts[i].id },
    });
    result[i] = posts[i];
    result[i].comments = comments;
  }
  res.json(result);
};

const getPostById = [
  checkPostExists,
  async (req, res) => {
    const post = await prisma.post.findUnique({
      where: { id: +req.params.id },
    });
    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
    });
    post.comments = comments;
    res.json(post);
  },
];

const incrementViews = [
  checkPostExists,
  async (req, res) => {
    const updatedPost = await prisma.post.update({
      where: { id: +req.params.id },
      data: { views: { increment: 1 } },
    });
    res.json({ views: updatedPost.views });
  },
];

const togglePublished = [
  checkPostExists,
  async (req, res) => {
    const updatedPost = await prisma.post.update({
      where: { id: +req.params.id },
      data: { published: !req.body.published },
    });

    res.json({ published: updatedPost.published });
  },
];

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  incrementViews,
  togglePublished,
};
