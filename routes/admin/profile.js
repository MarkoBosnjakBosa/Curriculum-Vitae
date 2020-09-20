module.exports = function(app, session, mongoose, models, path, url){
  app.get("/admin/profile", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var query = {username: username};
      var Admin = models.Admin;
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
          response.render("admin/profile", {username: admin.username, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, telephone: admin.telephone, profession: admin.profession, profession_de: admin.profession_de, birthday: admin.birthday, birthday_de: admin.birthday_de, location: admin.location, location_de: admin.location_de, linkedIn: admin.linkedIn, xing: admin.xing, github: admin.github, profilePicture: profilePicture, url: url});
        }
        else{
          response.redirect("/admin/login");
        }
      });
    }
    else{
      response.redirect("/admin/login");
    }
  });
}

function isEmpty(object){
    return !object || Object.keys(object).length === 0;
}
