const express = require("express");
const session = require("express-session");
const app = express();
var mongoose = require("mongoose");
var models = require("./models/models.js")(mongoose);
var nodeMailer = require('nodemailer');
var transporter = getTransporter();
var bodyParser = require("body-parser");
var path = require("path");
var multer = require("multer");
var fs = require("fs");
var async = require("async");
var bcrypt = require('bcrypt');
var databaseUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/cv";
var port = process.env.PORT || 5000;
var googleMapsKey = process.env.GOOGLE_MAPS_KEY;
var url = "https://marko-bosnjak-official.herokuapp.com";
//var url = "http://localhost:" + port;
useSession();
getBodyParser();
var adminLogin = require("./routes/admin/login.js")(app, session, mongoose, models, transporter, bodyParser, bcrypt, url);
var adminResetPassword = require("./routes/admin/resetPassword.js")(app, session, mongoose, models, bodyParser, bcrypt, url);
var adminProfile = require("./routes/admin/profile.js")(app, session, mongoose, models, path, url);
var adminEditProfile = require("./routes/admin/editProfile.js")(app, session, mongoose, models, bodyParser, path, url, multer, fs);
var adminChangePassword = require("./routes/admin/changePassword.js")(app, session, mongoose, models, bodyParser, bcrypt, url);
var adminLogout = require("./routes/admin/logout.js")(app, session, url);
var adminResume = require("./routes/admin/resume.js")(app, session, mongoose, models, path, url);
var adminCreateResume = require("./routes/admin/createResume.js")(app, session, mongoose, models, bodyParser, url);
var adminSkills = require("./routes/admin/skills.js")(app, session, mongoose, models, bodyParser, url);
var adminPortfolio = require("./routes/admin/portfolio.js")(app, session, mongoose, models, bodyParser, path, url, multer, fs);
var adminContact = require("./routes/admin/contact.js")(app, session, mongoose, models, url);
var about = require("./routes/user/about.js")(app, mongoose, models, path, url);
var resume = require("./routes/user/resume.js")(app, mongoose, models, path, async, url);
var skills = require("./routes/user/skills.js")(app, mongoose, models, path, async, url);
var portfolio = require("./routes/user/portfolio.js")(app, mongoose, models, path, async, url);
var contact = require("./routes/user/contact.js")(app, mongoose, models, transporter, bodyParser, path, googleMapsKey, url);
var downloadCV = require("./routes/user/downloadCV.js")(app, path);

mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
var database = mongoose.connection;
database.on("error", function(error) {
  console.log("Connection to the database has not been established!");
  console.log(error);
});
database.on("open", function() {
  console.log("Connection to the database has been successfully established!");
});

app.use("/handlers", express.static("handlers"));
app.use("/css", express.static("css"));
app.use("/images", express.static("images"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.listen(port, function(){
  console.log("CV app listening on " + url + "!");
});

function useSession(){
  app.use(session({secret: "session", saveUninitialized: true, resave: true}));
}
function getBodyParser(){
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
}
function getTransporter(){
  return nodeMailer.createTransport({service: "gmail", auth: { user: "marko.bosnjak.noreply@gmail.com", pass: "no.reply0"}});
}
