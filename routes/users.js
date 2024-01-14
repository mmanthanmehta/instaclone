const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb+srv://mehtamanthan547:lfcBlQhGsg1iGr20@cluster0.6ktrfch.mongodb.net/test1");

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
