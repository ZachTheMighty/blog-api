const prisma = require("../lib/prisma.ts");

module.exports = async function attachComments(post) {
  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
  });
  for (let i = 0; i < comments.length; i++) {
    const user = await prisma.user.findUnique({
      where: { id: comments[i].userId },
    });
    comments[i].user = user;
  }
  post.comments = comments;
  return post;
};
