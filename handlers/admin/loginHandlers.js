$(document).ready(function(){
  $(document).on("submit", "#loginForm", function(e){
    e.preventDefault();
    var login = $("#login").val();
    var password = $("#password").val();
    if(login){
      if(password){
        $.ajax({
          url: "/login",
          method: "POST",
          dataType: "json",
          data: {login: login, password: password},
          success: function(data){
            if(data.valid == "yes"){
              window.location.href = data.url + "/admin/profile";
            }
            else{
              $("#loginErrorMessage strong").text(data.message);
              $("#loginErrorMessage").show();
            }
          }
        });
      }
      else{
        $("#loginErrorMessage strong").text("Enter your password!");
        $("#loginErrorMessage").show();
      }
    }
    else{
      $("#loginErrorMessage strong").text("Enter your username or email!");
      $("#loginErrorMessage").show();
    }
  });
  $(document).on("keyup", "#login", function(e){
  	var login = $("#login").val();
    if(login){
    	$.ajax({
    		url: "/checkLogin",
    		type: "POST",
        dataType: "json",
    		data: {login: login},
    		success: function(data){
          if(data.exists == "no"){
              $("#loginStatus").text(data.message);
              $("#loginStatus").show();
          }
          else{
              $("#loginStatus").hide();
          }
    		}
    	});
    }
    else{
      $("#loginStatus").hide();
    }
  });
  $(document).on("submit", "#resetLinkForm", function(e){
    e.preventDefault();
    var email = $("#email").val();
    if(email){
      $.ajax({
        url: "/resetLink",
        method: "POST",
        dataType: "json",
        data: {email: email},
        beforeSend: function() {
					$("#resetLinkButton").html("Sending...");
					$("#resetLinkButton").prop("disabled", true);
				},
        success: function(data){
          $("#closeResetLinkModalButton").click();
          $("#resetLinkForm").trigger("reset");
          $("#resetLinkButton").html("Send");
					$("#resetLinkButton").prop("disabled", false);
          if(data.emailSent == "yes"){
            $("#loginErrorMessage").hide();
            $("#loginSuccessMessage strong").text(data.message);
            $("#loginSuccessMessage").show();
          }
          else{
            $("#loginErrorMessage strong").text(data.message);
            $("#loginErrorMessage").show();
          }
        }
      });
    }
  });
  $(document).on("click", "#hideLoginErrorMessage", function(e){
    $("#loginErrorMessage").hide();
  });
  $(document).on("click", "#hideLoginSuccessMessage", function(e){
    $("#loginSuccessMessage").hide();
  });
});
