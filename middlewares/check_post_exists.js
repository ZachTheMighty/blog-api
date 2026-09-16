const prisma = require("../lib/prisma.ts");
module.exports = async (req, res, next) => {
  const post = await prisma.post.findUnique({
    where: { id: +req.params.id },
  });
  if (!post) return res.status(404).json({ error: "Post doesn't exist" });
  req.post = post;
  next();
};
