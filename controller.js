const prisma = require("./lib/prisma.ts");

const rootGet = (req, res) =>
  res.json({
    name: "Blog API",
    version: "1.0.0",
    description: "API for managing posts in a blog applciation",
  });

const createUser = async (req, res) => {
  await prisma.user.create({
    data: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      isAuthor: req.body.isAuthor,
    },
  });
  res.json({ message: "User created successfully" });
};

module.exports = {
  rootGet,
  createUser,
};
