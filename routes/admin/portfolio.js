module.exports = function(app, session, mongoose, models, bodyParser, path, url, multer, fs){
  var Portfolio = models.Portfolio;
  app.get("/admin/portfolio", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      response.render("admin/portfolio", {username: username, url: url});
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.get("/displayPortfolio", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var portfolioDiv = "";
      var jiraServerCount = 0;
      var jiraServerTable = "";
      var jiraCloudCount = 0;
      var jiraCloudTable = "";
      var personalProjectsCount = 0;
      var personalProjectsTable = "";
      var masterThesisCount = 0;
      var masterThesisTable = "";
      Portfolio.find({}, function(error, portfolios){
        if(!isEmpty(portfolios)){
          portfolios.forEach(function(portfolio){
            if(portfolio.type == "jiraServer"){
              jiraServerCount++;
              if(jiraServerCount == 1){
                jiraServerTable += "<div class='jiraServerDiv'><div class='jiraServerTitle'><h2>Jira Server</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Link</th><th scope='col'>Logo</th><th scope='col'>Action</th><tbody>";
              }
              var jiraServerImage = (new Buffer.from(portfolio.logo.image)).toString("base64");
              jiraServerTable += "<tr><th scope='row'>" + jiraServerCount + "</th><td>" + portfolio.name + "</td><td>" + portfolio.link + "</td><td><img src='data:" + portfolio.logo.contentType + ";base64," + jiraServerImage + "' class='portfolioLogo'></td><td><i class='fas fa-edit editPortfolio' data-id='" + portfolio._id + "' data-type='" + portfolio.type + "' data-name='" + portfolio.name + "' data-link='" + portfolio.link + "' data-logo='" + portfolio.logo.name + "'></i><i class='fas fa-trash deletePortfolio' data-id='" + portfolio._id + "'></i></td></tr>";
            }
            if(portfolio.type == "jiraCloud"){
              jiraCloudCount++;
              if(jiraCloudCount == 1){
                jiraCloudTable += "<div class='jiraCloudDiv'><div class='jiraCloudTitle'><h2>Jira Cloud</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Link</th><th scope='col'>Logo</th><th scope='col'>Action</th><tbody>";
              }
              var jiraCloudImage = (new Buffer.from(portfolio.logo.image)).toString("base64");
              jiraCloudTable += "<tr><th scope='row'>" + jiraCloudCount + "</th><td>" + portfolio.name + "</td><td>" + portfolio.link + "</td><td><img src='data:" + portfolio.logo.contentType + ";base64," + jiraCloudImage + "' class='portfolioLogo'></td><td><i class='fas fa-edit editPortfolio' data-id='" + portfolio._id + "' data-type='" + portfolio.type + "' data-name='" + portfolio.name + "' data-link='" + portfolio.link + "' data-logo='" + portfolio.logo.name + "'></i><i class='fas fa-trash deletePortfolio' data-id='" + portfolio._id + "'></i></td></tr>";
            }
            if(portfolio.type == "personalProject"){
              personalProjectsCount++;
              if(personalProjectsCount == 1){
                personalProjectsTable += "<div class='personalProjectsDiv'><div class='personalProjectsTitle'><h2>Personal Projects</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Link</th><th scope='col'>Logo</th><th scope='col'>Action</th><tbody>";
              }
              var image = (new Buffer.from(portfolio.logo.image)).toString("base64");
              personalProjectsTable += "<tr><th scope='row'>" + personalProjectsCount + "</th><td>" + portfolio.name + "</td><td>" + portfolio.link + "</td><td><img src='data:" + portfolio.logo.contentType + ";base64," + image + "' class='portfolioLogo'></td><td><i class='fas fa-edit editPortfolio' data-id='" + portfolio._id + "' data-type='" + portfolio.type + "' data-name='" + portfolio.name + "' data-link='" + portfolio.link + "' data-logo='" + portfolio.logo.name + "'></i><i class='fas fa-trash deletePortfolio' data-id='" + portfolio._id + "'></i></td></tr>";
            }
            if(portfolio.type == "masterThesis"){
              masterThesisCount++;
              if(masterThesisCount == 1){
                masterThesisTable += "<div class='masterThesisDiv'><div class='masterThesisTitle'><h2>Master thesis</h2></div><table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Link</th><th scope='col'>Logo</th><th scope='col'>Action</th><tbody>";
              }
              var image = (new Buffer.from(portfolio.logo.image)).toString("base64");
              masterThesisTable += "<tr><th scope='row'>" + masterThesisCount + "</th><td>" + portfolio.name + "</td><td>" + portfolio.link + "</td><td><img src='data:" + portfolio.logo.contentType + ";base64," + image + "' class='portfolioLogo'></td><td><i class='fas fa-edit editPortfolio' data-id='" + portfolio._id + "' data-type='" + portfolio.type + "' data-name='" + portfolio.name + "' data-link='" + portfolio.link + "' data-logo='" + portfolio.logo.name + "'></i><i class='fas fa-trash deletePortfolio' data-id='" + portfolio._id + "'></i></td></tr>";
            }
          });
          if(jiraServerCount > 0){
            jiraServerTable += "</tbody></table></div>";
          }
          if(jiraCloudCount > 0){
            jiraCloudTable += "</tbody></table></div>";
          }
          if(personalProjectsCount > 0){
            personalProjectsTable += "</tbody></table></div>";
          }
          if(masterThesisCount > 0){
            masterThesisTable += "</tbody></table></div>";
          }
          portfolioDiv = jiraServerTable + jiraCloudTable + personalProjectsTable + masterThesisTable;
        }
        response.status(200).send(portfolioDiv);
        response.end();
      });
    }
    else{
      response.redirect("/admin/login");
    }
  });
  var storage = multer.diskStorage({
    destination: function (request, file, callback){
      callback(null, "portfolioLogos")
    },
    filename: function (request, file, callback){
      callback(null, file.originalname);
    }
  });
  var upload = uploadFunction(multer);
  app.post("/createPortfolio", upload.single("logo"), (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var type = request.body.type;
      if(type){
        var name = request.body.name;
        if(name){
          var link = request.body.link;
          if(link){
            var file = request.file;
            if(file){
              if(!request.extensionValidationError){
                var logo = fs.readFileSync(file.path);
                var encodeLogo = logo.toString("base64");
                var finalLogo = {name: file.filename, contentType: file.mimetype, image:  Buffer.from(encodeLogo, "base64")};
                var newPortfolio = getPortfolioScheme(Portfolio, type, name, link, finalLogo);
                newPortfolio.save(function(error, portfolio){
                  if(!isEmpty(portfolio)){
                    response.status(200).json({saved: "yes", message: portfolio.name + " has been successfully saved!"});
                    response.end();
                  }
                  else{
                    response.status(200).json({saved: "no", message: portfolio.name + " has not been saved!"});
                    response.end();
                  }
                });
              }
              else{
                response.status(200).json({saved: "no", message: "File format should be PNG, JPG or JPEG!"});
                response.end();
              }
            }
            else{
              response.status(200).json({saved: "no", message: "Choose an image!"});
              response.end();
            }
          }
          else{
            response.status(200).json({saved: "no", message: "Enter a link!"});
            response.end();
          }
        }
        else{
          response.status(200).json({saved: "no", message: "Enter a name!"});
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
  app.post("/editPortfolio", upload.single("editLogo"), (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var id = request.body.id;
      if(id){
        var type = request.body.type;
        if(type){
          var name = request.body.name;
          if(name){
            var link = request.body.link;
            if(link){
              var query = {_id: id};
              var update;
              var file = request.file;
              var deleteLogo = false;
              if(file){
                if(!request.extensionValidationError){
                  var logo = fs.readFileSync(file.path);
                  var encodeLogo = logo.toString("base64");
                  var finalLogo = {name: file.filename, contentType: file.mimetype, image:  Buffer.from(encodeLogo, "base64")};
                  update = {type: type, name: name, link: link, logo: finalLogo};
                  deleteLogo = true;
                }
                else{
                  response.status(200).json({saved: "no", message: "File format should be PNG, JPG or JPEG!"});
                  response.end();
                }
              }
              else{
                update = {type: type, name: name, link: link};
              }
              Portfolio.findOneAndUpdate(query, update, function(error, portfolio){
                if(!error){
                  if(deleteLogo){
                    fs.unlink(path.join(__dirname, "../../images/portfolioLogos/", portfolio.logo.name), function(err){});
                  }
                  response.status(200).json({edited: "yes", message: portfolio.name + " has been successfully edited!"});
                  response.end();
                }
                else{
                  response.status(200).json({edited: "no", message: portfolio.name + " has not been edited!"});
                  response.end();
                }
              });
            }
            else{
              response.status(200).json({edited: "no", message: "Enter the link!"});
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
  app.post("/deletePortfolio", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var id = request.body.id;
      if(id){
        var query = {_id: id};
        Portfolio.findOneAndRemove(query, function(error, portfolio){
          if(!isEmpty(portfolio)){
            fs.unlink(path.join(__dirname, "../../images/portfolioLogos/", portfolio.logo.name), function(err){});
            response.status(200).json({deleted: "yes", message: portfolio.name + " has been successfully deleted!"});
            response.end();
          }
          else{
            response.status(200).json({deleted: "no", message: portfolio.name + " has not been deleted!"});
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

function uploadFunction(multer){
  var storage = multer.diskStorage({
    destination: function (request, file, callback){
      callback(null, "images/portfolioLogos");
    },
    filename: function (request, file, callback){
      callback(null, file.originalname);
    },
  });
  return multer({
    storage: storage,
    fileFilter: function (request, file, callback){
      if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        callback(null, true);
      }
      else{
        request.extensionValidationError = true;
        return callback(null, false, request.extensionValidationError);
      }
    },
    limits: {fileSize: 1024*1024}
  });
}

function getPortfolioScheme(Portfolio, type, name, link, finalLogo){
  return new Portfolio({type: type, name: name, link: link, logo: finalLogo});
}
