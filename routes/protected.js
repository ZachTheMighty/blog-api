const route = require("express").Router();
const authenticateUser = require("../middlewares/authenticate_user.js");

route.get("/", authenticateUser);

module.exports = route;
