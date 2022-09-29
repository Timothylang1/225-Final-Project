const express = require("express");
const { Db } = require("mongodb");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");
const bodyParser = require("body-parser");

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/views");
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// parse application/json
app.use(bodyParser.json());
// parse the raw data
app.use(bodyParser.raw());
// parse text
app.use(bodyParser.text());

app.use(bodyParser.json());

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

const itemSchema = mongoose.Schema({
  name: String,
  description: String,
});

const Item = DB.model("item", itemSchema, "items");

function createItem(name, description) {
  const newItem = new Item({
    name: name,
    description: description,
  });
  return newItem;
}

app
  .route("/")
  .get((req, res) => {
    res.render("home");
  })
  .post((req, res) => {
    res.render("home");
  });

app.route("/about").get((req, res) => {
  res.render("about");
});

app
  .route("/testing-database")
  .get(async (req, res) => {
    let items = await Item.find({});
    res.render("testing-database", { items });
  })
  .post((req, res) => {
    let name = req.body.Name;
    let description = req.body.description;
    let newItem = createItem(name, description);
    newItem.save();
    res.render("success", { name, description });
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
