module.exports = function(app, session, mongoose, models, path, url){
  var Resume = models.Resume;
  app.get("/admin/resume", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      response.render("admin/resume", {username: username, url: url});
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.get("/displayResume", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var resumeDiv = "";
      var educationCount = 0;
      var educationTable = "";
      var experienceCount = 0;
      var experienceTable = "";
      Resume.find({}, function(error, resumes){
        if(!isEmpty(resumes)){
          resumes.forEach(function(resume){
            if(resume.type == "education"){
              educationCount++;
              if(educationCount == 1){
                educationTable += "<div class='educationDiv'><div class='educationTitle'><h2>Education</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Language</th><th scope='col'>Title</th><th scope='col'>Work place</th><th scope='col'>Duration</th><th scope='col'>Description</th><th scope='col'>Action</th><tbody>";
              }
              educationTable += "<tr><th scope='row'>" + educationCount + "</th><td><img class='flag' src='" + path.join(__dirname, '../../../images/flags/americanFlag.png') + "' alt='American flag'></td><td>" + resume.title + "</td><td>" + resume.workPlace + "</td><td>" + resume.duration + "</td><td>" + resume.description + "</td><td><i class='fas fa-edit editResume' data-id='" + resume._id + "' data-type='" + resume.type + "' data-title='" + resume.title + "' data-title_de='" + resume.title_de + "' data-workplace='" + resume.workPlace + "' data-workplace_de='" + resume.workPlace_de + "' data-duration='" + resume.duration + "' data-duration_de='" + resume.duration_de + "' data-description='" + resume.description + "' data-description_de='" + resume.description_de + "'></i><i class='fas fa-trash deleteResume' data-id='" + resume._id + "'></i></td></tr>";
              educationTable += "<tr><th></th><td><img class='flag' src='" + path.join(__dirname, '../../../images/flags/germanFlag.png') + "' alt='German flag'></td><td>" + resume.title_de + "</td><td>" + resume.workPlace_de + "</td><td>" + resume.duration_de + "</td><td>" + resume.description_de + "</td><td></td></tr>";
            }
            if(resume.type == "experience"){
              experienceCount++;
              if(experienceCount == 1){
                experienceTable += "<div class='experienceDiv'><div class='experienceTitle'><h2>Experience</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Language</th><th scope='col'>Title</th><th scope='col'>Work place</th><th scope='col'>Duration</th><th scope='col'>Description</th><th scope='col'>Action</th><tbody>";
              }
              experienceTable += "<tr><th scope='row'>" + experienceCount + "</th><td><img class='flag' src='" + path.join(__dirname, '../../../images/flags/americanFlag.png') + "' alt='American flag'></td><td>" + resume.title + "</td><td>" + resume.workPlace + "</td><td>" + resume.duration + "</td><td>" + resume.description + "</td><td><i class='fas fa-edit editResume' data-id='" + resume._id + "' data-type='" + resume.type + "' data-title='" + resume.title + "' data-title_de='" + resume.title_de + "' data-workplace='" + resume.workPlace + "' data-workplace_de='" + resume.workPlace_de + "' data-duration='" + resume.duration + "' data-duration_de='" + resume.duration_de + "' data-description='" + resume.description + "' data-description_de='" + resume.description_de + "'></i><i class='fas fa-trash deleteResume' data-id='" + resume._id + "'></i></td></tr>";
              experienceTable += "<tr><th></th><td><img class='flag' src='" + path.join(__dirname, '../../../images/flags/germanFlag.png') + "' alt='German flag'></td></td><td>" + resume.title_de + "</td><td>" + resume.workPlace_de + "</td><td>" + resume.duration_de + "</td><td>" + resume.description_de + "</td><td></td></tr>";
            }
          });
          if(educationCount > 0){
            educationTable += "</tbody></table></div>";
          }
          if(experienceCount > 0){
            experienceTable += "</tbody></table></div>";
          }
          resumeDiv = educationTable + experienceTable;
        }
        response.status(200).send(resumeDiv);
        response.end();
      });
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.post("/editResume", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var id = request.body.id;
      if(id){
        var type = request.body.type;
        if(type){
          var title = request.body.title;
          if(title){
            var title_de = request.body.title_de;
            if(title_de){
              var workPlace = request.body.workPlace;
              if(workPlace){
                var workPlace_de = request.body.workPlace_de;
                if(workPlace_de){
                  var duration = request.body.duration;
                  if(duration){
                    var duration_de = request.body.duration_de;
                    if(duration_de){
                      var description = request.body.description;
                      var description_de = request.body.description_de;
                      var query = {_id: id};
                      var update = {type: type, title: title, title_de: title_de, workPlace: workPlace, workPlace_de: workPlace_de, duration: duration, duration_de: duration_de, description: description, description_de: description_de};
                      Resume.findOneAndUpdate(query, update, {new: true}, function(error, resume){
                        if(!error){
                          response.status(200).json({edited: "yes", message: resume.title + " has been successfully edited!"});
                          response.end();
                        }
                        else{
                          response.status(200).json({edited: "no", message: resume.title + " has not been edited!"});
                          response.end();
                        }
                      });
                    }
                    else{
                      response.status(200).json({edited: "no", message: "Enter the duration in German!"});
                      response.end();
                    }
                  }
                  else{
                    response.status(200).json({edited: "no", message: "Enter the duration!"});
                    response.end();
                  }
                }
                else{
                  response.status(200).json({edited: "no", message: "Enter the work place in German!"});
                  response.end();
                }
              }
              else{
                response.status(200).json({edited: "no", message: "Enter the work place!"});
                response.end();
              }
            }
            else{
              response.status(200).json({edited: "no", message: "Enter the title in German!"});
              response.end();
            }
          }
          else{
            response.status(200).json({edited: "no", message: "Enter the title!"});
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
  app.post("/deleteResume", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var id = request.body.id;
      if(id){
        var query = {_id: id};
        Resume.findOneAndRemove(query, function(error, resume){
          if(!isEmpty(resume)){
            response.status(200).json({deleted: "yes", message: resume.title + " has been successfully deleted!"});
            response.end();
          }
          else{
            response.status(200).json({deleted: "no", message: resume.title + " has not been deleted!"});
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
