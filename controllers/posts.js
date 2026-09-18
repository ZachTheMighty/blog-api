const prisma = require("../lib/prisma.ts");
require("dotenv").config();
const authenticateUser = require("../middlewares/authenticate_user.js");
const validatePost = require("../middlewares/validate_post.js");
const checkPostExists = require("../middlewares/check_post_exists.js");
const attachComments = require("../middlewares/attach_comments_to_post.js");

const createPost = [
  authenticateUser,
  validatePost,
  async (req, res) => {
    const post = await prisma.post.create({
      data: {
        authorId: req.payload.user.id,
        title: req.body.title,
        body: req.body.body,
      },
    });
    await attachComments(post);
    res.json({ post, message: "successfully created post" });
  },
];

const getAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { id: "desc" },
  });

  for (let i = 0; i < posts.length; i++) await attachComments(posts[i]);
  res.json(posts);
};

const getPostById = [
  checkPostExists,
  async (req, res) => {
    const post = await prisma.post.findUnique({
      where: { id: +req.params.id },
    });

    await attachComments(post);
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

const deletePostById = [
  checkPostExists,
  async (req, res) => {
    const deleteComments = prisma.comment.deleteMany({
      where: { postId: +req.params.id },
    });

    const deletePost = prisma.post.delete({
      where: { id: +req.params.id },
    });
    await prisma.$transaction([deleteComments, deletePost]);
    res.json({ message: "Post delete successfully!" });
  },
];

const editPostById = [
  authenticateUser,
  validatePost,
  async (req, res) => {
    const post = await prisma.post.update({
      where: { id: +req.params.id },
      data: {
        title: req.body.title,
        body: req.body.body,
      },
    });
    await attachComments(post);
    res.json({ post, message: "successfully edited post" });
  },
];

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  incrementViews,
  togglePublished,
  deletePostById,
  editPostById,
};
