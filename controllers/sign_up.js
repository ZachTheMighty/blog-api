const prisma = require("../lib/prisma.ts");
const { body, validationResult, matchedData } = require("express-validator");

const emptyError = "field can't be empty.";
const alphaError = "can only contain alphabet characters.";

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
];

const createUser = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        isAuthor: req.body.isAuthor === true,
      },
    });
    res.json({ message: "User created successfully" });
  },
];

module.exports = {
  createUser,
};
