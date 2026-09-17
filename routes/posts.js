const route = require("express").Router();
const postsController = require("../controllers/posts.js");
const commentsController = require("../controllers/comments.js");

route.post("/", postsController.createPost);
route.get("/", postsController.getAllPosts);
route.get("/:id", postsController.getPostById);
route.delete("/:id", postsController.deletePostById);
route.put("/:id", postsController.editPostById);
route.post("/:id/views", postsController.incrementViews);
route.post("/:id/published", postsController.togglePublished);

route.post("/:id/comments", commentsController.createComment);
route.get("/:id/comments", commentsController.getAllComments);
route.get("/:id/comments/:commentId", commentsController.getCommentById);

module.exports = route;
