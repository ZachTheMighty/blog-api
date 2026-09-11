const prisma = require("../lib/prisma.ts");

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
  createUser,
};
