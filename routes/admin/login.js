module.exports = function(app, session, mongoose, models, transporter, bodyParser, bcrypt, url){
  var Admin = models.Admin;
  app.get("/admin/login", (request, response) => {
    response.render("admin/login");
  });
  app.post("/login", (request, response) => {
    var login = request.body.login;
    if(login){
      var password = request.body.password;
      if(password){
        var query = {$or: [{username: login}, {email: login}]};
        Admin.findOne(query, function(firstError, admin){
          if(!isEmpty(admin)){
            if(password == "admin"){
              if(admin.password == password){
                request.session.username = admin.username;
                response.status(200).json({valid: "yes", url: url})
                response.end();
              }
              else{
                response.status(200).json({valid: "no", message: "Password is not valid for the entered username!"})
                response.end();
              }
            }
            else{
              bcrypt.compare(password, admin.password, function(secondError, foundPassword){
                if(foundPassword){
                  request.session.username = admin.username;
                  response.status(200).json({valid: "yes", url: url})
                  response.end();
                }
                else{
                  response.status(200).json({valid: "no", message: "Password is not valid for the entered username!"})
                  response.end();
                }
              })
            }
          }
          else{
            response.status(200).json({valid: "no", message: "User does not exist!"});
            response.end();
          }
        });
      }
      else{
        response.status(200).json({valid: "no", message: "Enter the password!"});
        response.end();
      }
    }
    else{
      response.status(200).json({valid: "no", message: "Enter the username or email!"});
      response.end();
    }
  });
  app.post("/checkLogin", (request, response) => {
    var login = request.body.login;
    if(login){
      var query = {$or: [{username: login}, {email: login}]};
      Admin.findOne(query, function(error, admin){
        if(!isEmpty(admin)){
          response.status(200).json({exists: "yes"});
          response.end();
        }
        else{
          response.status(200).json({exists: "no", message: "The username or email does not exist!"});
          response.end();
        }
      });
    }
  });
  app.post("/resetLink", (request, response) => {
    var email = request.body.email;
    if(email){
      var query = {email: email};
      Admin.findOne(query, function(firstError, admin){
        if(!isEmpty(admin)){
          var mailOptions = {
            from: "marko.bosnjak.noreply@gmail.com",
            to: email,
            subject: "Reset password link",
            html: "<html>" +
              "<body>" +
                "<p>Dear <b>" + admin.username + "</b>,</p>" +
                "<p>you have requested to change your password. Click on the button below to proceed with your request:" +
                "<p style='margin-bottom: 30px;'><a href='" + url + "/reset/password/" + admin.username + "' target='_blank' style=' background-color: #1a1aff; border: none; color: #fff; padding: 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer; border-radius:5px;'>Reset password</a></p>" +
                "<p>Kind regards,<br/>" +
  							"Marko Bošnjak</p>" +
              "</body>" +
            "</html>"};
          transporter.sendMail(mailOptions, function(secondError, email){
            if(secondError){
              response.status(200).json({emailSent: "no", message: "Email has not been sent!"});
              response.end();
            }
            else{
              response.status(200).json({emailSent: "yes", message: "An email containing the reset link has been sent to your email address!"});
              response.end();
            }
          });
        }
        else{
          response.status(200).json({emailSent: "no", message: "The entered email does not exist!"});
          response.end();
        }
      });
    }
  });
}

function isEmpty(object){
    return !object || Object.keys(object).length === 0;
}
