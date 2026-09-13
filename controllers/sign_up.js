const prisma = require("../lib/prisma.ts");
const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");

const emptyError = "field can't be empty.";
const alphaError = "can only contain alphabet characters.";
const strongPasswordError =
  "must be between 8 and 24  characters, and must contain at least one number and one symbol";
const maxLengthError = "Password must be between 8 and 24 charactesr";

const validateUser = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage(`First name ${emptyError}`)
    .isAlpha()
    .withMessage(`First name ${alphaError}`),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage(`Last name ${emptyError}`)
    .isAlpha()
    .withMessage(`Last name ${alphaError}`),
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
    .withMessage(`Password ${strongPasswordError}`)
    .isLength({ max: 24 })
    .withMessage(maxLengthError),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage(`Confirm password ${emptyError}`)
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(`Confrim password ${strongPasswordError}`)
    .isLength({ max: 24 })
    .withMessage(maxLengthError)
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The two passwords don't match"),
];

const createUser = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    try {
      await prisma.user.create({
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: await bcrypt.hash(matchedData(req).password, 10),
          isAuthor: req.body.isAuthor === true,
        },
      });
      res.json({ message: "User created successfully" });
    } catch (error) {
      if (error.code === "P2002")
        return res.status(409).json({
          error: "An account with this email already exists.",
        });
      res.status(400).json(error);
    }
  },
];

module.exports = {
  createUser,
};
