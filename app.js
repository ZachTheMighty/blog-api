const express = require("express");
const app = express();
const signUpRoute = require("./routes/sign_up.js");
const logInRoute = require("./routes/log_in.js");
const postsRoute = require("./routes/posts.js");

app.use(express.urlencoded({ extended: false }));

app.use(require("cors")());
app.use("/users", signUpRoute);
app.use("/tokens", logInRoute);
app.use("/posts", postsRoute);
app.get("/", (req, res) =>
  res.json({
    name: "Blog API",
    version: "1.0.0",
    description: "API for managing posts in a blog applciation",
  }),
);
app.use((req, res) =>
  res.status(404).json({ error: "Endpoint doesn't exist" }),
);

require("dotenv").config();
const port = process.env.PORT;

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`listening on port ${port}`);
});
