const express = require("express");
const { Db } = require("mongodb");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect(
  "mongodb+srv://freeswapadmin:cafemacisgreat@freeswap.nx7crsb.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Chooses which DB tp save to
const DB = mongoose.connection.useDb("freeswap");

// Creating bug schema and Model 📝

const bugSchema = mongoose.Schema({
  name: String,
  description: String,
});

const Bug = DB.model("bug", bugSchema, "items");

const firstBug = new Bug({
  name: "items ",
  description:
    "creating a mongoose data base using the url but cannot find it in the mongo show db in the terminal",
});

firstBug.save();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
