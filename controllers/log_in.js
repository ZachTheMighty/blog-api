const prisma = require("../lib/prisma.ts");
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const emptyError = "field can't be empty.";

const validateUser = [
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
];

const login = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) return res.status(401).json({ error: "Incorrect email" });

    if (!(await bcrypt.compare(matchedData(req).password, user.password)))
      return res.status(401).json({ error: "Incorrect password" });

    jwt.sign(
      { user },
      process.env.SECRET,
      { expiresIn: "30s" },
      (error, token) => res.json({ token }),
    );
  },
];

module.exports = {
  login,
};
