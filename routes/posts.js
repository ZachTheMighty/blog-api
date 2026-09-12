const route = require("express").Router();
const postsController = require("../controllers/posts.js");
const commentsController = require("../controllers/comments.js");

route.post("/", postsController.createPost);

route.get("/", postsController.getAllPosts);
route.get("/:id", postsController.getPostById);

route.post("/:id/comments", commentsController.createComment);

module.exports = route;
