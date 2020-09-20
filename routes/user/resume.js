module.exports = function(app, mongoose, models, path, async, url){
  var Admin = models.Admin;
  var Resume = models.Resume;
  app.get("/resume/:language", (request, response) => {
    var language = request.params.language;
    var queries = [];
    var adminQuery = {username: "admin"};
    queries.push(function(callback){
      Admin.findOne(adminQuery, function(error, admin){
        callback(null, admin);
      });
    });
    queries.push(function(callback){
      Resume.find({}, function(error, resumes){
        callback(null, resumes);
      });
    });
    async.parallel(queries, function(error, results){
      var adminResult = results[0];
      var adminObject = [];
      var profilePicture = "";
      if(adminResult.picture.name && adminResult.picture.contentType && adminResult.picture.image){
        image = (new Buffer.from(adminResult.picture.image)).toString("base64");
        profilePicture = "data:" + adminResult.picture.contentType + ";base64," + image;
      }
      else{
        profilePicture = path.join(__dirname, "../../../images/profilePictures/defaultProfilePicture.jpg");
      }
      adminObject.firstName = adminResult.firstName;
      adminObject.lastName = adminResult.lastName;
      adminObject.email = adminResult.email;
      adminObject.telephone = adminResult.telephone;
      adminObject.linkedIn = adminResult.linkedIn;
      adminObject.xing = adminResult.xing;
      adminObject.github = adminResult.github;
      adminObject.profilePicture = profilePicture;
      var resumeResult = results[1];
      if(language == "en"){
        adminObject.profession = adminResult.profession;
        adminObject.birthday = adminResult.birthday;
        adminObject.location = adminResult.location;
        response.render("user/resume", {admin: adminObject, resumes: resumeResult, url: url});
      }
      if(language == "de"){
        adminObject.profession = adminResult.profession_de;
        adminObject.birthday = adminResult.birthday_de;
        adminObject.location = adminResult.location_de;
        response.render("user/de/resume_DE", {admin: adminObject, resumes: resumeResult, url: url});
      }
    });
  });
}
