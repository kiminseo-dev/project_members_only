const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();
const indexRouter = require("./routes/index-router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
