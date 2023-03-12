const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { DB } = require("./app");

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
exports.imgModel = imgModel;
const userSchema = mongoose.Schema({
  username: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose);
let User = DB.model("User", userSchema);
exports.User = User;
