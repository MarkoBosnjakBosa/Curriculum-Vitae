$(document).ready(function(){
  $(document).on("submit", "#changePasswordForm", function(e){
    e.preventDefault();
    var firstPassword = $("#firstPassword").val();
    var secondPassword = $("#secondPassword").val();
    if(firstPassword){
      if(secondPassword){
        if(firstPassword == secondPassword){
          $.ajax({
            url: "/changePassword",
            method: "POST",
            dataType: "json",
            data: {firstPassword: firstPassword, secondPassword: secondPassword},
            success: function(data){
              if(data.changed == "yes"){
                $("#changePasswordErrorMessage").hide();
                $("#changePasswordSuccessMessage strong").text(data.message);
                $("#changePasswordSuccessMessage").show();
                $("#changePasswordForm :input").val("");
              }
              else{
                $("#changePasswordErrorMessage strong").text(data.message);
                $("#changePasswordErrorMessage").show();
              }
            }
          });
        }
        else{
          $("#changePasswordErrorMessage strong").text("Passwords do not match!");
          $("#changePasswordErrorMessage").show();
        }
      }
      else{
        $("#changePasswordErrorMessage strong").text("Enter password in the second field!");
        $("#changePasswordErrorMessage").show();
      }
    }
    else{
      $("#changePasswordErrorMessage strong").text("Enter password in the first field!");
      $("#changePasswordErrorMessage").show();
    }
  });
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
  $(document).on("click", "#hideChangePasswordErrorMessage", function(e){
    $("#changePasswordErrorMessage").hide();
  });
  $(document).on("click", "#hideChangePasswordSuccessMessage", function(e){
    $("#changePasswordSuccessMessage").hide();
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
