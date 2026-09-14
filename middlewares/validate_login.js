const { body } = require("express-validator");
const validationResult = require("./validation_result");

const emptyError = "field can't be empty.";

module.exports = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${emptyError}`)
    .isEmail()
    .withMessage(`Email must be in the format a@b.domain`),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${emptyError}`)
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      `Password must be between 8 and 24  characters, and must contain at least one number and one symbol`,
    )
    .isLength({ max: 24 })
    .withMessage("Password must be between 8 and 24 characters"),
  validationResult,
];
