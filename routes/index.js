var express = require("express");
var router = express.Router();
const userModel = require("./users.js");
const postModel = require('./post.js')
const storyModel = require('./story.js')

const localStrangy = require("passport-local");
const passport = require("passport");
const upload = require("./multer.js");

passport.use(new localStrangy(userModel.authenticate()));

router.get("/", function (req, res) {
  res.render("index", { footer: false });
});

router.get("/login", function (req, res) {
  res.render("login", { footer: false });
});

router.get("/feed", isLoggedIn, async function (req, res) {
  const posts = await postModel.find().populate('user')
  const user = await userModel.findOne({username:req.session.passport.user})
  const story = await storyModel.find()
  // console.log(story)
  res.render("feed", { footer: true, posts , user, story});
});

router.get("/profile",isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username:req.session.passport.user}).populate('posts')
  // console.log(user)
  res.render("profile", { footer: true, user });
});

router.get("/likepage",isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username:req.session.passport.user}).populate('likes')
  console.log(user)
  res.render("likepage", { footer: true, user });
});

router.get("/search", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render("search", { footer: false , user });
});

router.get("/like/post/:id", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username:req.session.passport.user})
  const post = await postModel.findOne({_id:req.params.id})

  if(post.likes.indexOf(user._id) === -1){
    post.likes.push(user._id)
    user.likes.push(post._id)
  }
  else{
    post.likes.splice(post.likes.indexOf(user._id),1)
    user.likes.splice(user.likes.indexOf(post._id),1)
  }

  await post.save()
  await user.save()
  res.redirect('/feed')
});

router.get("/story_upload", isLoggedIn, function (req, res) {
  res.render("story_upload", { footer: true });
});

router.get("/edit", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render("edit", { footer: true ,user});
});

router.get("/username/:username", isLoggedIn, async function (req, res) {
  const regex = new RegExp(`^${req.params.username}`, 'i')
  const users = await userModel.find({username: regex})
  res.json(users)
});

router.post("/update", upload.single("image"), async function (req, res) {
  const user = await userModel.findOneAndUpdate(
    { username: req.session.passport.user},
    { username: req.body.username, name: req.body.name, bio: req.body.bio },
    { new: true }
  );
  if(req.file){
  user.profile = req.file.filename
  }
  await user.save()
  res.redirect('/profile')
});

router.get("/upload", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render("upload", { footer: false, user });
});

router.post("/register", function (req, res) {
  var userdata = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });
  userModel.register(userdata, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post('/story_upload', isLoggedIn, upload.single('image'), async function(req,res){
  const user = await userModel.findOne({username:req.session.passport.user})
  const story = await storyModel.create({
    picture: req.file.filename,
    user:user._id,
    caption: req.body.caption
  })

  user.story.push(story._id)
  await user.save()
  res.redirect('/feed')
})

router.post('/upload', isLoggedIn, upload.single('image'), async function(req,res){
  const user = await userModel.findOne({username:req.session.passport.user})
  const post = await postModel.create({
    picture: req.file.filename,
    user:user._id,
    username:user.name,
    caption: req.body.caption
  })

  user.posts.push(post._id)
  await user.save()
  res.redirect('/feed')
})

router.post("/login",passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
