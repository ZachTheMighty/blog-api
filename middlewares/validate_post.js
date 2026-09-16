const { body } = require("express-validator");
const validationResult = require("./validation_result");

module.exports = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("You have to provide a title.")
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be between 10 and 50 characters."),
  body("body")
    .trim()
    .notEmpty()
    .withMessage("You have to provide body")
    .isLength({ min: 3, max: 3000 })
    .withMessage("Body must be between 3 and 3000 characters"),
  validationResult,
];
