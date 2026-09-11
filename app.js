const app = require("express")();
const signUpRoute = require("./routes/sign_up.js");

app.use("/", (req, res) =>
  res.json({
    name: "Blog API",
    version: "1.0.0",
    description: "API for managing posts in a blog applciation",
  }),
);

app.use("/users", signUpRoute);

require("dotenv").config();
const port = process.env.PORT;

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`listening on port ${port}`);
});
