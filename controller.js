const rootGet = (req, res) =>
  res.json({
    name: "Blog API",
    version: "1.0.0",
    description: "API for managing posts in a blog applciation",
  });

module.exports = {
  rootGet,
};
