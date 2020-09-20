module.exports = function(app, session, url){
  app.get("/logOut", (request, response) => {
    request.session.destroy(function(){
      response.status(200).json({"url": url});
      response.end();
    });
  });
}
