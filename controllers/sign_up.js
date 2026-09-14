const prisma = require("../lib/prisma.ts");
const { matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const validateUser = require("../middlewares/validate_user.js;");

const createUser = [
  validateUser,
  async (req, res) => {
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
