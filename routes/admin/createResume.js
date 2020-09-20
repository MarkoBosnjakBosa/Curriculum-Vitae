module.exports = function(app, session, mongoose, models, bodyParser, url){
  app.get("/admin/create/resume", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      response.render("admin/createResume", {username: username, url: url});
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.post("/createResume", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
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
                    var Resume = models.Resume;
                    var newResume = getResumeScheme(Resume, type, title, title_de, workPlace, workPlace_de, duration, duration_de, description, description_de);
                    newResume.save(function(error, resume){
                      if(!isEmpty(resume)){
                        response.status(200).json({saved: "yes", message: resume.title + " has been successfully saved!"});
                        response.end();
                      }
                      else{
                        response.status(200).json({saved: "no", message: resume.title + " has not been saved!"});
                        response.end();
                      }
                    });
                  }
                  else{
                    response.status(200).json({saved: "no", message: "Enter the duration in German!"});
                    response.end();
                  }
                }
                else{
                  response.status(200).json({saved: "no", message: "Enter the duration!"});
                  response.end();
                }
              }
              else{
                response.status(200).json({saved: "no", message: "Enter the work place in German!"});
                response.end();
              }
            }
            else{
              response.status(200).json({saved: "no", message: "Enter the work place!"});
              response.end();
            }
          }
          else{
            response.status(200).json({saved: "no", message: "Enter the title in German!"});
            response.end();
          }
        }
        else{
          response.status(200).json({saved: "no", message: "Enter the title!"});
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
}

function isEmpty(object){
    return !object || Object.keys(object).length === 0;
}

function getResumeScheme(Resume, type, title, title_de, workPlace, workPlace_de, duration, duration_de, description, description_de){
  return new Resume({type: type, title: title, title_de: title_de, workPlace: workPlace, workPlace_de: workPlace_de, duration: duration, duration_de: duration_de, description: description, description_de: description_de});
}
