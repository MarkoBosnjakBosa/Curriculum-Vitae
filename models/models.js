module.exports = function(mongoose){
  var adminScheme = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    profession: String,
    profession_de: String,
    birthday: String,
    birthday_de: String,
    telephone: String,
    location: String,
    location_de: String,
    linkedIn: String,
    xing: String,
    github: String,
    picture: {name: String, contentType: String, image: Buffer}
  });
  var resumeScheme = new mongoose.Schema({
    type: String,
    title: String,
    title_de: String,
    workPlace: String,
    workPlace_de: String,
    duration: String,
    duration_de: String,
    description: String,
    description_de: String
  });
  var skillScheme = new mongoose.Schema({
    type: String,
    name: String,
    rating: Number
  });
  var portfolioScheme = new mongoose.Schema({
    type: String,
    name: String,
    link: String,
    logo: {name: String, contentType: String, image: Buffer}
  });
  var contactScheme = new mongoose.Schema({
    name: String,
    email: String,
    time: String,
    message: String
  });
  var models = {
    Admin: mongoose.model("Admin", adminScheme),
    Resume: mongoose.model("Resume", resumeScheme),
    Skill: mongoose.model("Skill", skillScheme),
    Portfolio: mongoose.model("Portfolio", portfolioScheme),
    Contact: mongoose.model("Contact", contactScheme)
  }
  return models;
}
