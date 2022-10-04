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

var imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

//Image is a model which has a schema imageSchema

imgModel = new mongoose.model("Image", imageSchema);

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

app.get("/profile-upload-single", (req, res) => {
  res.render("index");
});
app.post(
  "/profile-upload-single",
  upload.single("profile-file"),
  function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    console.log(JSON.stringify(req.file));
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString("base64");
    var final_img = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_img, "base64"),
    };
    console.log("====================================");
    console.log(final_img);
    console.log("====================================");
    image.create(final_img, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        console.log("Saved To database");
        res.contentType(final_img.contentType);
        res.send(final_img.image);
      }
    });
  }
);

app.get("/test-3", (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("index", { items: items });
    }
  });
});

app.post("/test-3", upload.single("image"), (req, res, next) => {
  var obj = {
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
      imgModel.find({}, (err, items) => {
        if (err) {
          console.log(err);
          res.status(500).send("An error occurred", err);
        } else {
          console.log("====================================");
          console.log(items);
          console.log("====================================");
          fs.unlinkSync(path.join(__dirname + "/uploads/" + req.file.filename));
          res.render("uploaded-images", { items });
        }
      });
    }
  });
});
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

app.route("/admin").get((req, res) => {
  res.render("admin");
});

app.route("/all-items").get((req, res) => {
  res.render("all-items");
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

app.route("/delete/:id").get((req, res) => {
  const id = req.params.id;
  Item.find({ _id: id }).remove().exec();
  res.render("deleted");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
