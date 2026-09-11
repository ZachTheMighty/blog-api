const route = require("express").Router();
const controller = require("./controller.js");

route.get("/", controller.rootGet);

route.post("/users", controller.createUser);

module.exports = route;
