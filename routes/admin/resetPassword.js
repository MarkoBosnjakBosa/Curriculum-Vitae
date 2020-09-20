module.exports = function(app, session, mongoose, models, bodyParser, bcrypt, url){
  var Admin = models.Admin;
  app.get("/reset/password/:username", (request, response) => {
    var username = request.params.username;
    response.render("admin/resetPassword", {username: username, url: url});
  });
  app.post("/resetPassword", (request, response) => {
    var username = request.body.username;
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
                  response.status(200).json({changed: "yes", message: "Password has been successfully changed!"});
                  response.end();
                }
                else{
                  response.status(200).json({changed: "no", message: "User does not exist!"});
                  response.end();
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
          response.status(200).json({changed: "no", message: "Enter password in the second field!"});
          response.end();
        }
      }
      else{
        response.status(200).json({changed: "no", message: "Enter password in the first field!"});
        response.end();
      }
    }
    else{
      response.status(200).json({changed: "no", message: "Username is not specified!"});
      response.end();
    }
  });
}
