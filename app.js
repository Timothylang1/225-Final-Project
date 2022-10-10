const express = require("express");
const { Db } = require("mongodb");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
var multer = require("multer");

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/views");
app.set("view engine", "ejs");
app.use("/uploads", express.static("uploads"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.raw());
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

let imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

//Image is a model which has a schema imageSchema

let imgModel = new mongoose.model("Image", imageSchema);

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

let upload = multer({ storage: storage });

// Routing 🐍
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

app.route("/login").get((req, res) => {
  res.render("login");
});

app.route("/admin").get((req, res) => {
  res.render("admin");
});

app.route("/all-items").get((req, res) => {
  res.render("all-items");
});

app.route("/admin-newitem").get((req, res) => {
  res.render("admin-newitem");
});

app.get("/upload-image", (req, res) => {
  res.render("upload-image");
});
app.post("/upload-image", upload.single("image"), (req, res, next) => {
  let obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };

  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // grab all images and render them
      imgModel.find({}, (err, items) => {
        if (err) {
          console.log(err);
          res.status(500).send("An error occurred", err);
        } else {
          fs.unlinkSync(path.join(__dirname + "/uploads/" + req.file.filename));
          res.render("uploaded-images", { items });
        }
      });
    }
  });
});

app.route("/delete/:id").get((req, res) => {
  const id = req.params.id;
  Item.find({ _id: id }).remove().exec();
  res.render("deleted");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
