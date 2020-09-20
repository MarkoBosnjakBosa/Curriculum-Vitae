module.exports = function(app, mongoose, models, transporter, bodyParser, path, googleMapsKey, url){
  var Admin = models.Admin;
  app.get("/contact/:language", (request, response) => {
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
          response.render("user/contact", {firstName: admin.firstName, lastName: admin.lastName, email: admin.email, telephone: admin.telephone, profession: admin.profession, birthday: admin.birthday, location: admin.location, linkedIn: admin.linkedIn, xing: admin.xing, github: admin.github, profilePicture: profilePicture, url: url, googleMapsKey: googleMapsKey});
        }
        if(language == "de"){
          response.render("user/de/contact_DE", {firstName: admin.firstName, lastName: admin.lastName, email: admin.email, telephone: admin.telephone, profession: admin.profession_de, birthday: admin.birthday_de, location: admin.location_de, linkedIn: admin.linkedIn, xing: admin.xing, github: admin.github, profilePicture: profilePicture, url: url, googleMapsKey: googleMapsKey});
        }
      }
      else{
        if(language == "en"){
          response.render("user/contact", {firstName: "", lastName: "", email: "", telephone: "", profession: "", birthday: "", location: "", linkedIn: "", xing: "", github: "", profilePicture: path.join(__dirname, "../../../images/profilePictures/defaultProfilePicture.jpg"), url: url, googleMapsKey: googleMapsKey});
        }
        if(language == "de"){
          response.render("user/de/contact_DE", {firstName: "", lastName: "", email: "", telephone: "", profession: "", birthday: "", location: "", linkedIn: "", xing: "", github: "", profilePicture: path.join(__dirname, "../../../images/profilePictures/defaultProfilePicture.jpg"), url: url, googleMapsKey: googleMapsKey});
        }
      }
    });
  });
  app.post("/submitContact", (request, response) => {
    var name = request.body.name;
    var email = request.body.email;
    var message = request.body.message;
    var language = request.body.language;
    if(name && email && message && language){
      var Contact = models.Contact;
      var time = getTime();
      var newContact = getContactScheme(Contact, name, email, time, message);
      newContact.save(function(error, contact){
        if(!isEmpty(contact)){
          var userMailOptions;
          if(language == "en"){
            userMailOptions = {
              from: "marko.bosnjak.noreply@gmail.com",
              to: email,
              subject: "Marko Bošnjak - Message received",
              html: "<html>" +
                "<body>" +
                  "<p><i>Hello <b>" + name + "</b>,</i></p>" +
                  "<p><i>thank you for getting in touch. I received your message and will get back to you as soon as possible.</i></p>" +
                  "<p><i>Kind regards,<br/>" +
                  "Marko Bošnjak</i></p>" +
                "</body>" +
              "</html>"};
          }
          if(language == "de"){
            userMailOptions = {
              from: "marko.bosnjak.noreply@gmail.com",
              to: email,
              subject: "Marko Bošnjak - Nachricht erhalten",
              html: "<html>" +
                "<body>" +
                  "<p><i>Hallo <b>" + name + "</b>,</i></p>" +
                  "<p><i>vielen Dank für Ihre Kontaktaufnahme. Ich habe Ihre Nachricht erhalten und werde mich so schnell wie möglich bei Ihnen melden.</i></p>" +
                  "<p><i>Liebe Grüße,<br/>" +
                  "Marko Bošnjak</i></p>" +
                "</body>" +
              "</html>"};
          }
          transporter.sendMail(userMailOptions, function(firstError, result){});
          var adminMailOptions = {
            from: "marko.bosnjak.noreply@gmail.com",
            to: "marko_bosnjak93@yahoo.com",
            subject: "New inquiry",
            html: "<html>" +
              "<body>" +
                "<p>Hey <b>Marko</b>,</p>" +
                "<p>you have a new inquiry.</p>" +
                "<p>" +
                  "Name: <b>" + name + "</b><br/>" +
                  "Email: <b>" + email + "</b><br/>" +
                  "Time: <b>" + time + "</b><br/>" +
                  "Message: <b>" + message + "</b>" +
                "</p>" +
              "</body>" +
            "</html>"};
          transporter.sendMail(adminMailOptions, function(secondError, result){});
          var successMessage;
          if(language == "en"){
            successMessage = "Your message has been successfully sent!";
          }
          if(language == "de"){
            successMessage = "Ihre Nachricht wurde erfolgreich gesendet!";
          }
          response.status(200).json({saved: "yes", message: successMessage + "<i class='fas fa-check' style='margin-left: 10px'></i>"});
          response.end();
        }
        else{
          var firstErrorMessage;
          if(language == "en"){
            firstErrorMessage = "Your message has not been sent!";
          }
          if(language == "de"){
            firstErrorMessage = "Ihre Nachricht wurde nicht gesendet!";
          }
          response.status(200).json({saved: "no", message: firstErrorMessage});
          response.end();
        }
      });
    }
    else{
      var secondErrorMessage;
      if(language == "en"){
        secondErrorMessage = "Please fill in the form...";
      }
      if(language == "de"){
        secondErrorMessage = "Bitte füllen Sie das Formular aus...";
      }
      response.status(200).json({saved: "no", message: secondErrorMessage});
      response.end();
    }
  });
}

function isEmpty(object){
    return !object || Object.keys(object).length === 0;
}

function getContactScheme(Contact, name, email, time, message){
  return new Contact({name: name, email: email, time: time, message: message});
}

function getTime(){
    var date = new Date();
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var year = date.getFullYear();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var minute = date.getMinutes();
    minute = (minute < 10 ? "0" : "") + minute;
    var second = date.getSeconds();
    second = (second < 10 ? "0" : "") + second;
    var time = day + "." + month + "." + year + ". " + hour + ":" + minute + ":" + second;
    return time;
}
