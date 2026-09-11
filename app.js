require("dotenv").config();
const app = require("express")();

app.get("/", (req, res) => {
  res.json({ message: "hi" });
});

const port = process.env.PORT;

app.listen(port, (error) => {
  if (error) throw error;
  console.log(`listening on port ${port}`);
});
