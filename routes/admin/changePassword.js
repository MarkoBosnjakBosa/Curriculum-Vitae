module.exports = function(app, session, mongoose, models, bodyParser, bcrypt, url){
  var Admin = models.Admin;
  app.get("/admin/change/password", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var query = {username: username};
      Admin.findOne(query, function(error, admin){
        if(!isEmpty(admin)){
          response.render("admin/changePassword", {username: username, url: url});
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
  app.post("/changePassword", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var firstPassword = request.body.firstPassword;
      if(firstPassword){
        var secondPassword = request.body.secondPassword;
        if(secondPassword){
          if(firstPassword == secondPassword){
            var query = {username: username};
            bcrypt.hash(firstPassword, 10, function(firstError, password){
              var update = {password: password};
              Admin.findOneAndUpdate(query, update, {new: true}, function(secondError){
                if(!secondError){
                  response.status(200).json({changed: "yes", message: "Password has been successfully changed!"})
                  response.end();
                }
                else{
                  response.redirect("/admin/login");
                }
              });
            });
          }
          else{
            response.status(200).json({changed: "no", message: "Passwords do not match!"});
            response.end();
          }
        }
        else{
          response.status(200).json({changed: "no", message: "Enter password in the second field!!"});
          response.end();
        }
      }
      else{
        response.status(200).json({changed: "no", message: "Enter password in the first field!!"});
        response.end();
      }
    }
    else{
      response.redirect("/admin/login");
    }
  })
}

function isEmpty(object){
    return !object || Object.keys(object).length === 0;
}
