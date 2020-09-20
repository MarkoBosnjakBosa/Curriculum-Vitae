var mongoose = require("mongoose");
var models = require("../models/models.js")(mongoose);
var Admin = models.Admin;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/cv";

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
var database = mongoose.connection;
database.on("error", function(error){
  console.log("Connection to the database has not been established!");
  console.log(error);
});
database.on("open", function(){
  var newAdmin = new Admin({
    username: "admin",
    password: "admin",
    email: "marko_bosnjak93@yahoo.com",
    firstName: "Marko",
    lastName: "Bošnjak",
    profession: "Software developer",
    profession_de: "Software Entwickler",
    birthday: "11/Sep/1993",
    birthday_de: "11.09.1993",
    telephone: "+491733857104",
    location: "Cologne, Germany",
    location_de: "Köln, Deutschland",
    linkedIn: "https://www.linkedin.com/in/marko-bosnjak93/",
    xing: "https://www.xing.com/profile/Marko_Bosnjak11/cv",
    skype: "https://join.skype.com/invite/l5t9Z5ywvXDV",
    picture: {name: "", contentType: "", image: ""}
  });
  newAdmin.save(function(error, result){
    if(error){
     console.log("Admin has not been created!");
     console.log(error);
    }
  });
});
