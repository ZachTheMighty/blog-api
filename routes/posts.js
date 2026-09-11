const route = require("express").Router();
const controller = require("../controllers/posts.js");

route.post("/", controller.createPost);
route.get("/", controller.getAllPosts);
route.get("/:id", controller.getPostById);

module.exports = route;
