const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pin");

const user = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  name: String,
  profile: String,
  bio: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
  story: [{ type: mongoose.Schema.Types.ObjectId, ref: "story" }],
});

user.plugin(plm);

module.exports = mongoose.model("user", user);
