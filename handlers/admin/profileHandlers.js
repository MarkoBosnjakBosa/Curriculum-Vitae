$(document).ready(function(){
  $(document).on("click", ".logOutLink",function(e){
    $.ajax({
      url: "/logOut",
      method: "GET",
      dataType: "json",
      success: function(data){
        window.location.href = data.url + "/admin/login";
      }
    });
  });
  $(document).on("click", "#menu-toggle",function(e){
    $("#wrapper").toggleClass("toggled");
		if($("#menu-toggle i").hasClass("fa-angle-double-left")){
			$("#menu-toggle i").removeClass("fa-angle-double-left");
			$("#menu-toggle i").addClass("fa-angle-double-right");
		}
		else{
			$("#menu-toggle i").removeClass("fa-angle-double-right");
			$("#menu-toggle i").addClass("fa-angle-double-left");
		}
  });
});
