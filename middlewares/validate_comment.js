const { body } = require("express-validator");
const validationResult = require("./validation_result.js");

module.exports = [
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment can't be empty.")
    .isLength({ max: 1000 }),
  validationResult,
];
