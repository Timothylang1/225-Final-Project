const express = require("express");
const { Db } = require("mongodb");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
let multer = require("multer");
const { deserializeUser } = require("passport");
const { type } = require("os");
const compression = require("compression");

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/views");
app.set("view engine", "ejs");
app.use("/uploads", express.static("uploads"));
app.use(compression());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(
  session({
    secret: "change this",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  "mongodb+srv://freeswapadmin:cafemacisgreat@freeswap.nx7crsb.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Chooses which DB tp save to
const DB = mongoose.connection.useDb("freeswap");

// Models

const itemSchema = mongoose.Schema({
  name: String,
  description: String,
});

const Item = DB.model("item", itemSchema, "items");

let imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  type: String,
  img: {
    data: Buffer,
    contentType: String,
  },
  date: { type: Date, default: Date.now },
});

let imgModel = DB.model("Image", imageSchema);

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

let User = DB.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Multer setup

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
  .get(async (req, res) => {
    try {
      const items = await imgModel.find({}, null, { limit: 12 });
      items.sort((item) => item.date).reverse();
      res.render("home", { items });
    } catch (err) {
      res.status(500).send("An error occurred", err);
    }
  })
  .post((req, res) => {
    res.render("home");
  });

app.route("/about").get((req, res) => {
  res.render("about");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(user, (err) => {
      if (!err) {
        logUserIn(req, res);
      } else {
        console.log(err);
        res.redirect("/login");
      }
    });
  });

app.route("/logout").get((req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.route("/admin").get(async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  }

  try {
    const items = await imgModel.find({});
    res.render("admin", { items });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred", err);
  }
});

app.route("/all-items").get(async (req, res) => {
  try {
    const items = await imgModel.find({});
    res.render("all-items", { items });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred", err);
  }
});

app.route("/single-item/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    const item = await imgModel.find({ _id: id });
    res.render("individual-item", { item });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred", err);
  }
});

app.route("/admin-newitem").get((req, res) => {
  if (req.isAuthenticated()) {
    res.render("admin-newitem");
  } else {
    res.redirect("/login");
  }
});

app.post("/upload-image", upload.single("image"), (req, res, next) => {
  let obj = {
    name: trimAndCapitalizeFirstLetter(req.body.name),
    desc: trimAndCapitalizeFirstLetter(req.body.desc),
    type: req.body.type,
    img: {
      data: fs.readFileSync(
        // adds file to local app storage
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };

  imgModel.create(obj, (err, item) => {
    if (err) {
      res.render("admin-newitem", { err });
    } else {
      fs.unlinkSync(path.join(__dirname + "/uploads/" + req.file.filename)); // Removes image from local app storage
      res.render("admin-newitem", { obj });
    }
  });
});

app.route("/delete/:id").get((req, res) => {
  const id = req.params.id;
  imgModel.find({ _id: id }).remove().exec();
  res.redirect("/admin");
});

app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    imgModel.find({ _id: id }, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin-edit", { item });
      }
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    imgModel.find({ _id: id }, (err, foundImage) => {
      if (err) {
        console.log("error in post edit form");
      } else {
        updateDocument(req, id);
        res.redirect("/admin");
      }
    });
  });

app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});

function updateDocument(req, id) {
  let update = {
    name: trimAndCapitalizeFirstLetter(req.body.name),
    desc: trimAndCapitalizeFirstLetter(req.body.desc),
    type: req.body.type,
  };
  imgModel.findByIdAndUpdate(
    { _id: id },
    update,
    { multi: true, new: true },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("updated item");
      }
    }
  );
}

function logUserIn(req, res) {
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  })(req, res, () => {
    res.redirect("/admin");
  });
}

function trimAndCapitalizeFirstLetter(text) {
  text = text.trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
// app.listen(port, () => {
//   console.log(`listening on port ${port}`);
// });

// code for creating new user

/* 

User.register({ username: req.body.username }, req.body.password , (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        console.log("new user made" + user);
        res.redirect("/login");
      }
    });
*/
