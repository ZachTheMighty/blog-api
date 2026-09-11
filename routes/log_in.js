const route = require("express").Router();
const controller = require("../controllers/log_in.js");

route.post("/", controller.login);

module.exports = route;
