require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT;
const logger = require("morgan");
const router = require("./routes/index");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(logger("dev"));
mongoose.connect("mongodb://localhost/musichub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

// app.listen(PORT, () => {
//   console.log("app is listening on PORT", PORT);
// });

module.exports = app;
