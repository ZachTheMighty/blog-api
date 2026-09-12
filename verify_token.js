module.exports = (req, res, next) => {
  if (!req.headers["authorization"])
    return res
      .status(403)
      .json({ error: "You need to log in in order to create posts" });

  req.token = req.headers["authorization"].split(" ")[1];
  next();
};
