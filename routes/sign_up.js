const route = require("express").Router();
const controller = require("../controllers/sign_up.js");

route.post("/users", controller.createUser);

module.exports = route;
