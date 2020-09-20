module.exports = function(app, mongoose, models, path, async, url){
  var Admin = models.Admin;
  var Portfolio = models.Portfolio;
  app.get("/portfolio/:language", (request, response) => {
    var language = request.params.language;
    var queries = [];
    var adminQuery = {username: "admin"};
    queries.push(function(callback){
      Admin.findOne(adminQuery, function(error, admin){
        callback(null, admin);
      });
    });
    queries.push(function(callback){
      Portfolio.find({}, function(error, portfolios){
        callback(null, portfolios);
      });
    });
    async.parallel(queries, function(error, results){
      var adminResult = results[0];
      var adminObject = [];
      var profilePicture = "";
      if(adminResult.picture.name && adminResult.picture.contentType && adminResult.picture.image){
        firstImage = (new Buffer.from(adminResult.picture.image)).toString("base64");
        profilePicture = "data:" + adminResult.picture.contentType + ";base64," + firstImage;
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
      var portfolioResult = results[1];
      var portfolioObject = [];
      portfolioResult.forEach(function(result){
        var eachPortfolioObject = {};
        eachPortfolioObject.type = result.type;
        eachPortfolioObject.name = result.name;
        eachPortfolioObject.link = result.link;
        var logo = "";
        if(result.logo.name && result.logo.contentType && result.logo.image){
          secondImage = (new Buffer.from(result.logo.image)).toString("base64");
          logo = "data:" + result.contentType + ";base64," + secondImage;
        }
        else{
          logo = path.join(__dirname, "../../../images/protfolioLogos/defaultLogo.jpg");
        }
        eachPortfolioObject.logo = logo;
        portfolioObject.push(eachPortfolioObject);
      });
      if(language == "en"){
        adminObject.profession = adminResult.profession;
        adminObject.birthday = adminResult.birthday;
        adminObject.location = adminResult.location;
        response.render("user/portfolio", {admin: adminObject, portfolios: portfolioObject, url: url});
      }
      if(language == "de"){
        adminObject.profession = adminResult.profession_de;
        adminObject.birthday = adminResult.birthday_de;
        adminObject.location = adminResult.location_de;
        response.render("user/de/portfolio_DE", {admin: adminObject, portfolios: portfolioObject, url: url});
      }
    });
  });
}
