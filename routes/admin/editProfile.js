module.exports = function(app, session, mongoose, models, bodyParser, path, url, multer, fs){
  var Admin = models.Admin;
  app.get("/admin/edit/profile", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      response.render("admin/editProfile", {username: username, url: url});
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.get("/displayProfileInformation", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var query = {username: username};
      Admin.findOne(query, function(error, admin){
        if(!isEmpty(admin)){
          var profilePicture = "";
          if(admin.picture.name && admin.picture.contentType && admin.picture.image){
            image = (new Buffer.from(admin.picture.image)).toString("base64");
            profilePicture = "data:" + admin.picture.contentType + ";base64," + image;
          }
          else{
            profilePicture = path.join(__dirname, "../../../images/profilePictures/defaultProfilePicture.jpg");
          }
          response.status(200).json({username: admin.username, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, telephone: admin.telephone, profession: admin.profession, profession_de: admin.profession_de, birthday: admin.birthday, birthday_de: admin.birthday_de, location: admin.location, location_de: admin.location_de, linkedIn: admin.linkedIn, xing: admin.xing, github: admin.github, profilePicture: profilePicture, url: url});
        }
        else{
          response.redirect("/admin/login");
        }
      });
    }
    else{
      response.redirect("/admin/login");
    }
  })
  app.post("/updatePersonalInformation", (request, response) => {
    var session = request.session;
    if(session.username){
      var firstName = request.body.firstName;
      if(firstName){
        var lastName = request.body.lastName;
        if(lastName){
          var email = request.body.email;
          if(email){
            var telephone = request.body.telephone;
            if(telephone){
              var profession = request.body.profession;
              if(profession){
                var profession_de = request.body.profession_de;
                if(profession_de){
                  var birthday = request.body.birthday;
                  if(birthday){
                    var birthday_de = request.body.birthday_de;
                    if(birthday_de){
                      var location = request.body.location;
                      if(location){
                        var location_de = request.body.location_de;
                        if(location_de){
                          var linkedIn = request.body.linkedIn;
                          if(linkedIn){
                            var xing = request.body.xing;
                            if(xing){
                              var github = request.body.github;
                              if(github){
                                var query = {username: session.username}
                                var update = {firstName: firstName, lastName: lastName, email: email, telephone: telephone, profession: profession, profession_de: profession_de, birthday: birthday, birthday_de: birthday_de, location: location, location_de: location_de, linkedIn: linkedIn, xing: xing, github: github};
                                Admin.findOneAndUpdate(query, update, {new: true}, function(error){
                                  if(!error){
                                    response.status(200).json({updated: "yes", message: "Personal information has been successfully updated!"})
                                    response.end();
                                  }
                                  else{
                                    response.redirect("/admin/login");
                                  }
                                });
                              }
                              else{
                                response.status(200).json({updated: "no", message: "Enter your GitHub link!"});
                                response.end();
                              }
                            }
                            else{
                              response.status(200).json({updated: "no", message: "Enter your xing link!"});
                              response.end();
                            }
                          }
                          else{
                            response.status(200).json({updated: "no", message: "Enter your linkedIn link!"});
                            response.end();
                          }
                        }
                        else{
                          response.status(200).json({updated: "no", message: "Enter your location in German!"});
                          response.end();
                        }
                      }
                      else{
                        response.status(200).json({updated: "no", message: "Enter your location!"});
                        response.end();
                      }
                    }
                    else{
                      response.status(200).json({updated: "no", message: "Enter your birthday in German!"});
                      response.end();
                    }
                  }
                  else{
                    response.status(200).json({updated: "no", message: "Enter your birthday!"});
                    response.end();
                  }
                }
                else{
                  response.status(200).json({updated: "no", message: "Enter your profession in German!"});
                  response.end();
                }
              }
              else{
                response.status(200).json({updated: "no", message: "Enter your profession!"});
                response.end();
              }
            }
            else{
              response.status(200).json({updated: "no", message: "Enter your telephone!"});
              response.end();
            }
          }
          else{
            response.status(200).json({updated: "no", message: "Enter your email!"});
            response.end();
          }
        }
        else{
          response.status(200).json({updated: "no", message: "Enter your last name!"});
          response.end();
        }
      }
      else{
        response.status(200).json({updated: "no", message: "Enter your first name!"});
        response.end();
      }
    }
    else{
      response.redirect("/admin/login");
    }
  });
  var storage = multer.diskStorage({
    destination: function (request, file, callback){
      callback(null, "profilePictures")
    },
    filename: function (request, file, callback){
      callback(null, file.originalname);
    }
  });
  var upload = uploadFunction(multer);
  app.post("/updateProfilePicture", upload.single("profilePicture"), (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var file = request.file;
      if(file){
        if(!request.extensionValidationError){
          var query = {username: username};
          var profilePicture = fs.readFileSync(file.path);
          var encodeProfilePicture = profilePicture.toString("base64");
          var finalProfilePicture = {name: file.filename, contentType: file.mimetype, image:  Buffer.from(encodeProfilePicture, "base64")};
          var update = {picture: finalProfilePicture};
          Admin.findOneAndUpdate(query, update, function(error, oldProfilePicture){
            if(!error){
              if(!isEmpty(oldProfilePicture.picture.name) && !isEmpty(oldProfilePicture.picture.contentType) && !isEmpty(oldProfilePicture.picture.image)){
                fs.unlink(path.join(__dirname, "../../images/profilePictures/", oldProfilePicture.picture.name), function(err){});
              }
              response.status(200).json({updated: "yes", message: "The profile picture has been successfully updated!"});
              response.end();
            }
            else{
              response.redirect("/admin/login");
            }
          });
        }
        else{
          response.status(200).json({updated: "no", message: "File format should be PNG, JPG or JPEG!"});
          response.end();
        }
      }
      else{
        response.status(200).json({updated: "no", message: "Upload a picture!"});
        response.end();
      }
    }
    else{
      response.redirect("/admin/login");
    }
  });
}

function isEmpty(object){
    return !object || Object.keys(object).length === 0;
}

function uploadFunction(multer){
  var storage = multer.diskStorage({
    destination: function (request, file, callback){
      callback(null, "images/profilePictures");
    },
    filename: function (request, file, callback){
      callback(null, file.originalname);
    },
  });
  return multer({
    storage: storage,
    fileFilter: function (request, file, callback){
      if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        callback(null, true);
      }
      else{
        request.extensionValidationError = true;
        return callback(null, false, request.extensionValidationError);
      }
    },
    limits: {fileSize: 1024*1024}
  });
}
