const route = require("express").Router();
const controller = require("./controller.js");

route.get("/", controller.rootGet);

module.exports = route;
