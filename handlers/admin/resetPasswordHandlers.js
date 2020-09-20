$(document).ready(function(){
  $(document).on("submit", "#resetPasswordForm", function(e){
    e.preventDefault();
    var username = $("#username").val();
    var firstPassword = $("#firstPassword").val();
    var secondPassword = $("#secondPassword").val();
    if(username){
      if(firstPassword){
        if(secondPassword){
          if(firstPassword == secondPassword){
            $.ajax({
              url: "/resetPassword",
              method: "POST",
              dataType: "json",
              data: {username: username, firstPassword: firstPassword, secondPassword: secondPassword},
              success: function(data){
                if(data.changed == "yes"){
                  $("#resetPasswordErrorMessage").hide();
                  $("#resetPasswordSuccessMessage strong").text(data.message);
                  $("#resetPasswordSuccessMessage").show();
                  $("#resetPasswordForm :input:not(#username)").val("");
                }
                else{
                  $("#resetPasswordErrorMessage strong").text(data.message);
                  $("#resetPasswordErrorMessage").show();
                }
              }
            });
          }
          else{
            $("#resetPasswordErrorMessage strong").text("Passwords do not match!");
            $("#resetPasswordErrorMessage").show();
          }
        }
        else{
          $("#resetPasswordErrorMessage strong").text("Enter password in the second field!");
          $("#resetPasswordErrorMessage").show();
        }
      }
      else{
        $("#resetPasswordErrorMessage strong").text("Enter password in the first field!");
        $("#resetPasswordErrorMessage").show();
      }
    }
    else{
      $("#resetPasswordErrorMessage strong").text("Username is not specified!");
      $("#resetPasswordErrorMessage").show();
    }
  });
  $(document).on("click", "#hideResetPasswordErrorMessage", function(e){
    $("#resetPasswordErrorMessage").hide();
  });
  $(document).on("click", "#hideResetPasswordSuccessMessage", function(e){
    $("#resetPasswordSuccessMessage").hide();
  });
});
