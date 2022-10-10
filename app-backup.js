const express = require("express");
const { Db } = require("mongodb");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
let multer = require("multer");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

let upload = multer({ storage: storage });
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/views");
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: false,
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
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Item = DB.model("item", itemSchema, "items");

function createItem(name, description) {
  const newItem = new Item({
    name: name,
    description: description,
    img: {
      data: Buffer,
      contentType: String,
    },
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
  .post(upload.single("image"), (req, res) => {
    console.log("====================================");
    console.log(req.file.filename);
    console.log("====================================");
    let obj = {
      name: req.body.name,
      desc: req.body.description,
      img: {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    };
    Item.create(obj, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        item.save();
        res.render("success");
      }
    });
  });

app.post("/", upload.single("image"), (req, res, next) => {
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
  Item.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      item.save();
      res.redirect("success");
    }
  });
});

app.route("/delete/:id").get((req, res) => {
  const id = req.params.id;
  Item.find({ _id: id }).remove().exec();
  res.render("deleted");
});

let imageTestSchema = new Schema({
  img: { data: Buffer, contentType: String },
});

var ImgModelTest = mongoose.model("A", imageTestSchema);

app
  .route("/upload-image")
  .get((req, res) => {
    res.render("upload-image");
  })
  .post((req, res) => {
    let image = new ImgModelTest();
    image.img.data = fs.readFileSync("uploads/space-imaige");
    image.img.contentType = "image/png";
    image.save(function (err, a) {
      if (err) throw err;
    });
    image.avatar = Buffer.from(image.avatar).toString("base64");
    console.log("====================================");
    console.log(image.avatar);
    console.log("====================================");
    res.render("success", { image });
  });

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
