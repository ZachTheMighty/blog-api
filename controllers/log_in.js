const prisma = require("../lib/prisma.ts");
const bcrypt = require("bcryptjs");
const { matchedData } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const validateUser = require("../middlewares/validate_login.js");

const login = [
  validateUser,
  async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user || user.isAuthor !== req.body.isAuthor)
      return res.status(401).json({ error: "Incorrect email", path: "email" });

    if (!(await bcrypt.compare(matchedData(req).password, user.password)))
      return res
        .status(401)
        .json({ error: "Incorrect password", path: "password" });

    jwt.sign(
      { user },
      process.env.SECRET,
      { expiresIn: "15m" },
      (error, token) => res.json({ token }),
    );
  },
];

module.exports = {
  login,
};
