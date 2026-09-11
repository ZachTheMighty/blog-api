const route = require("express").Router();
const controller = require("../controllers/posts.js");

route.post("/", controller.createPost);

module.exports = route;
