module.exports = function(app, session, mongoose, models, url){
  var Contact = models.Contact;
  app.get("/admin/contact", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      response.render("admin/contact", {username: username, url: url});
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.get("/displayContacts", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var contactCount = 0;
      var contactDiv = "";
      Contact.find({}, function(error, contacts){
        if(!isEmpty(contacts)){
          contacts.forEach(function(contact){
            contactCount++;
            contactDiv += "<div class='card contactCard'><div class='card-header'><div class='row'><div class='col-sm-6'><b>" + contact.email + "</b></div><div class='col-sm-6 contactRightAlign'><b>#" + contactCount + "</b></div></div></div><div class='card-body'><h5 class='card-title'>" + contact.name + "</h5><p class='card-text'>" + contact.message + "</p></div><div class='card-footer'><div class='row'><div class='col-sm-6'><b>" + contact.time + "</b></div><div class='col-sm-6 contactRightAlign'><i class='fas fa-trash deleteContact' data-id='" + contact._id + "'></i></div></div></div></div>";
          });
        }
        response.status(200).send(contactDiv);
        response.end();
      });
    }
    else{
      response.redirect("/admin/login");
    }
  });
  app.post("/deleteContact", (request, response) => {
    var session = request.session;
    var username = session.username;
    if(username){
      var id = request.body.id;
      if(id){
        var query = {_id: id};
        Contact.findOneAndRemove(query, function(error, contact){
          if(!isEmpty(contact)){
            response.status(200).json({deleted: "yes", message: "Contact " + contact.name + " has been successfully deleted!"});
            response.end();
          }
          else{
            response.status(200).json({deleted: "no", message: "Contact: " + contact.name + " has not been deleted!"});
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
