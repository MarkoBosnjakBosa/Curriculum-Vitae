module.exports = function(app, session, mongoose, models, bodyParser, url){
  var Skill = models.Skill;
  app.get("/admin/skills", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      response.render("admin/skills", {username: username, url: url});
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.get("/displaySkills", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var skillsDiv = "";
      var backendCount = 0;
      var backendTable = "";
      var frontendCount = 0;
      var frontendTable = "";
      var databaseCount = 0;
      var databaseTable = "";
      var templateCount = 0;
      var templateTable = "";
      var languageCount = 0;
      var languageTable = "";
      Skill.find({}, function(error, skills){
        if(!isEmpty(skills)){
          skills.forEach(function(skill){
            if(skill.type == "backend"){
              backendCount++;
              if(backendCount == 1){
                backendTable += "<div class='backendDiv'><div class='backendTitle'><h2>Backend</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Rating</th><th scope='col'>Action</th><tbody>";
              }
              backendTable += "<tr><th scope='row'>" + backendCount + "</th><td>" + skill.name + "</td><td>" + skill.rating + "</td><td><i class='fas fa-edit editSkill' data-id='" + skill._id + "' data-type='" + skill.type + "' data-name='" + skill.name + "' data-rating='" + skill.rating + "'></i><i class='fas fa-trash deleteSkill' data-id='" + skill._id + "'></i></td></tr>";
            }
            if(skill.type == "frontend"){
              frontendCount++;
              if(frontendCount == 1){
                frontendTable += "<div class='frontendDiv'><div class='frontendTitle'><h2>Frontend</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Rating</th><th scope='col'>Action</th><tbody>";
              }
              frontendTable += "<tr><th scope='row'>" + frontendCount + "</th><td>" + skill.name + "</td><td>" + skill.rating + "</td><td><i class='fas fa-edit editSkill' data-id='" + skill._id + "' data-type='" + skill.type + "' data-name='" + skill.name + "' data-rating='" + skill.rating + "'></i><i class='fas fa-trash deleteSkill' data-id='" + skill._id + "'></i></td></tr>";
            }
            if(skill.type == "database"){
              databaseCount++;
              if(databaseCount == 1){
                databaseTable += "<div class='databaseDiv'><div class='databaseTitle'><h2>Databases</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Rating</th><th scope='col'>Action</th><tbody>";
              }
              databaseTable += "<tr><th scope='row'>" + databaseCount + "</th><td>" + skill.name + "</td><td>" + skill.rating + "</td><td><i class='fas fa-edit editSkill' data-id='" + skill._id + "' data-type='" + skill.type + "' data-name='" + skill.name + "' data-rating='" + skill.rating + "'></i><i class='fas fa-trash deleteSkill' data-id='" + skill._id + "'></i></td></tr>";
            }
            if(skill.type == "template"){
              templateCount++;
              if(templateCount == 1){
                templateTable += "<div class='templateDiv'><div class='templateTitle'><h2>Templates</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Rating</th><th scope='col'>Action</th><tbody>";
              }
              templateTable += "<tr><th scope='row'>" + templateCount + "</th><td>" + skill.name + "</td><td>" + skill.rating + "</td><td><i class='fas fa-edit editSkill' data-id='" + skill._id + "' data-type='" + skill.type + "' data-name='" + skill.name + "' data-rating='" + skill.rating + "'></i><i class='fas fa-trash deleteSkill' data-id='" + skill._id + "'></i></td></tr>";
            }
            if(skill.type == "language"){
              languageCount++;
              if(languageCount == 1){
                languageTable += "<div class='languageDiv'><div class='languageTitle'><h2>Languages</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Rating</th><th scope='col'>Action</th><tbody>";
              }
              languageTable += "<tr><th scope='row'>" + languageCount + "</th><td>" + skill.name + "</td><td>" + skill.rating + "</td><td><i class='fas fa-edit editSkill' data-id='" + skill._id + "' data-type='" + skill.type + "' data-name='" + skill.name + "' data-rating='" + skill.rating + "'></i><i class='fas fa-trash deleteSkill' data-id='" + skill._id + "'></i></td></tr>";
            }
          });
          if(backendCount > 0){
            backendTable += "</tbody></table></div>";
          }
          if(frontendCount > 0){
            frontendTable += "</tbody></table></div>";
          }
          if(databaseCount > 0){
            databaseTable += "</tbody></table></div>";
          }
          if(templateCount > 0){
            templateTable += "</tbody></table></div>";
          }
          if(languageCount > 0){
            languageTable += "</tbody></table></div>";
          }
          skillsDiv = backendTable + frontendTable + databaseTable + templateTable + languageTable;
        }
        response.status(200).send(skillsDiv);
        response.end();
      });
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.post("/createSkill", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var type = request.body.type;
      if(type){
        var name = request.body.name;
        if(name){
          var rating = request.body.rating;
          if(rating && !isNaN(rating)){
            var newSkill = getSkillScheme(Skill, type, name, rating);
            newSkill.save(function(error, skill){
              if(!isEmpty(skill)){
                response.status(200).json({saved: "yes", message: skill.name + " has been successfully saved!"});
                response.end();
              }
              else{
                response.status(200).json({saved: "no", message: skill.name + " has not been saved!"});
                response.end();
              }
            });
          }
          else{
            response.status(200).json({saved: "no", message: "Enter the rating!"});
            response.end();
          }
        }
        else{
          response.status(200).json({saved: "no", message: "Enter the name!"});
          response.end();
        }
      }
      else{
        response.status(200).json({saved: "no", message: "Select a type!"});
        response.end();
      }
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.post("/editSkill", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var id = request.body.id;
      if(id){
        var type = request.body.type;
        if(type){
          var name = request.body.name;
          if(name){
            var rating = request.body.rating;
            if(rating){
              var query = {_id: id};
              var update = {type: type, name: name, rating: rating};
              Skill.findOneAndUpdate(query, update, {new: true}, function(error, skill){
                if(!error){
                  response.status(200).json({edited: "yes", message: skill.name + " has been successfully edited!"});
                  response.end();
                }
                else{
                  response.status(200).json({edited: "no", message: skill.name + " has not been edited!"});
                  response.end();
                }
              });
            }
            else{
              response.status(200).json({edited: "no", message: "Enter the rating!"});
              response.end();
            }
          }
          else{
            response.status(200).json({edited: "no", message: "Enter the name!"});
            response.end();
          }
        }
        else{
          response.status(200).json({edited: "no", message: "Select a type!"});
          response.end();
        }
      }
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.post("/deleteSkill", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var id = request.body.id;
      if(id){
        var query = {_id: id};
        Skill.findOneAndRemove(query, function(error, skill){
          if(!isEmpty(skill)){
            response.status(200).json({deleted: "yes", message: skill.name + " has been successfully deleted!"});
            response.end();
          }
          else{
            response.status(200).json({deleted: "no", message: skill.name + " has not been deleted!"});
            response.end();
          }
        });
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

function getSkillScheme(Skill, type, name, rating){
  return new Skill({type: type, name: name, rating: rating});
}
