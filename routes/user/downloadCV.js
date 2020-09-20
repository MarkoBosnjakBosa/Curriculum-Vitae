module.exports = function(app, path){
  app.get("/downloadCV/:language", function(request, response){
    var language = request.params.language;
    var cv;
    if(language == "en"){
      cv = path.join(__dirname, "../../downloadCV/Marko_Bošnjak_CV.pdf");
    }
    if(language == "de"){
      cv = path.join(__dirname, "../../downloadCV/Marko_Bošnjak_Lebenslauf.pdf");
    }
    response.download(cv);
  });
}
