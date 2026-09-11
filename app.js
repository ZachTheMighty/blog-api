require("dotenv").config();
const app = require("express")();
const route = require("./routes.js");

app.use("/", route);

const port = process.env.PORT;

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`listening on port ${port}`);
});
