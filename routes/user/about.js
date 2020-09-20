module.exports = function(app, mongoose, models, path, url){
  var Admin = models.Admin;
  app.get("/:language", (request, response) => {
    var language = request.params.language;
    var query = {username: "admin"};
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
        if(language == "en"){
          response.render("user/about", {firstName: admin.firstName, lastName: admin.lastName, email: admin.email, telephone: admin.telephone, profession: admin.profession, birthday: admin.birthday, location: admin.location, linkedIn: admin.linkedIn, xing: admin.xing, github: admin.github, profilePicture: profilePicture, url: url});
        }
        if(language == "de"){
          response.render("user/de/about_DE", {firstName: admin.firstName, lastName: admin.lastName, email: admin.email, telephone: admin.telephone, profession: admin.profession_de, birthday: admin.birthday_de, location: admin.location_de, linkedIn: admin.linkedIn, xing: admin.xing, github: admin.github, profilePicture: profilePicture, url: url});
        }
      }
      else{
        if(language == "en"){
          response.render("user/about", {firstName: "", lastName: "", email: "", telephone: "", profession: "", birthday: "", location: "", linkedIn: "", xing: "", github: "", profilePicture: path.join(__dirname, "../../../images/profilePictures/defaultProfilePicture.jpg"), url: url});
        }
        if(language == "de"){
          response.render("user/de/about_DE", {firstName: "", lastName: "", email: "", telephone: "", profession: "", birthday: "", location: "", linkedIn: "", xing: "", github: "", profilePicture: path.join(__dirname, "../../../images/profilePictures/defaultProfilePicture.jpg"), url: url});
        }
      }
    });
  });
}

function isEmpty(object){
    return !object || Object.keys(object).length === 0;
}
