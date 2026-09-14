const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/verify_token.js");

const authenticateUser = [
  verifyToken,
  (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, async (error, payload) => {
      if (error) return res.status(403).json({ error, isAuth: false });

      req.payload = payload;
      res.json({ payload, isAuth: true });
      next();
    });
  },
];

module.exports = authenticateUser;
