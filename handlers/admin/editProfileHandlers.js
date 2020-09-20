$(document).ready(function(){
  displayProfileInformation();
  document.getElementById("profilePicture").addEventListener("change", handleProfilePicture, false);
  $(document).on("submit", "#updateProfilePictureForm",function(e){
    e.preventDefault();
		var profilePicture = $("#profilePicture")[0].files[0];
		if(profilePicture){
			var formData = new FormData();
			formData.append("profilePicture", profilePicture);
			$.ajax({
				url: "/updateProfilePicture",
				method: "POST",
				data: formData,
				dataType: "json",
				processData: false,
				contentType: false,
	      success: function(data){
					if(data.updated == "yes"){
						$("#editPersonalInformationErrorMessage").hide();
						$("#editPersonalInformationSuccessMessage strong").text(data.message);
						$("#editPersonalInformationSuccessMessage").show();
            $("#uploadProfilePictureForm").trigger("reset");
						$("#profilePictureName").text("Choose a picture");
					}
					else{
						$("#editPersonalInformationErrorMessage strong").text(data.message);
						$("#editPersonalInformationErrorMessage").show();
					}
          displayProfileInformation();
	      },
	      error: function(data){
					$("#editPersonalInformationErrorMessage strong").text("Image size must be less than 1MB!");
					$("#editPersonalInformationErrorMessage").show();
	      }
	    });
		}
		else{
			$("#editPersonalInformationErrorMessage strong").text("Choose a picture!");
			$("#editPersonalInformationErrorMessage").show();
		}
  });
  $(document).on("submit", "#updatePersonalInformationForm", function(e){
    e.preventDefault();
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var email = $("#email").val();
    var telephone = $("#telephone").val();
    var profession = $("#profession").val();
    var profession_de = $("#profession_de").val();
    var birthday = $("#birthday").val();
    var birthday_de = $("#birthday_de").val();
    var location = $("#location").val();
    var location_de = $("#location_de").val();
    var linkedIn = $("#linkedIn").val();
    var xing = $("#xing").val();
    var github = $("#github").val();
    if(firstName){
      if(lastName){
        if(email){
          if(telephone){
            if(profession){
              if(profession_de){
                if(birthday){
                  if(birthday_de){
                    if(location){
                      if(location_de){
                        if(linkedIn){
                          if(xing){
                            if(github){
                              $.ajax({
                                url: "/updatePersonalInformation",
                                method: "POST",
                                dataType: "json",
                                data: {firstName: firstName, lastName: lastName, email: email, telephone: telephone, profession: profession, profession_de: profession_de, birthday: birthday, birthday_de: birthday_de, location: location, location_de: location_de, linkedIn: linkedIn, xing: xing, github: github},
                                success: function(data){
                                  if(data.updated == "yes"){
                                    $("#editPersonalInformationErrorMessage").hide();
                                    $("#editPersonalInformationSuccessMessage strong").text(data.message);
                                    $("#editPersonalInformationSuccessMessage").show();
                                  }
                                  else{
                                    $("#editPersonalInformationErrorMessage strong").text(data.message);
                                    $("#editPersonalInformationErrorMessage").show();
                                  }
                                  displayProfileInformation();
                                }
                              });
                            }
                            else{
                              $("#editPersonalInformationErrorMessage strong").text("Enter your GitHub link!");
                              $("#editPersonalInformationErrorMessage").show();
                            }
                          }
                          else{
                            $("#editPersonalInformationErrorMessage strong").text("Enter your xing link!");
                            $("#editPersonalInformationErrorMessage").show();
                          }
                        }
                        else{
                          $("#editPersonalInformationErrorMessage strong").text("Enter your linkedIn link!");
                          $("#editPersonalInformationErrorMessage").show();
                        }
                      }
                      else{
                        $("#editPersonalInformationErrorMessage strong").text("Enter your location in German!");
                        $("#editPersonalInformationErrorMessage").show();
                      }
                    }
                    else{
                      $("#editPersonalInformationErrorMessage strong").text("Enter your location!");
                      $("#editPersonalInformationErrorMessage").show();
                    }
                  }
                  else{
                    $("#editPersonalInformationErrorMessage strong").text("Enter your birthday in German!");
                    $("#editPersonalInformationErrorMessage").show();
                  }
                }
                else{
                  $("#editPersonalInformationErrorMessage strong").text("Enter your birthday!");
                  $("#editPersonalInformationErrorMessage").show();
                }
              }
              else{
                $("#editPersonalInformationErrorMessage strong").text("Enter your profession in German!");
                $("#editPersonalInformationErrorMessage").show();
              }
            }
            else{
              $("#editPersonalInformationErrorMessage strong").text("Enter your profession!");
              $("#editPersonalInformationErrorMessage").show();
            }
          }
          else{
            $("#editPersonalInformationErrorMessage strong").text("Enter your telephone!");
            $("#editPersonalInformationErrorMessage").show();
          }
        }
        else{
          $("#editPersonalInformationErrorMessage strong").text("Enter your email!");
          $("#editPersonalInformationErrorMessage").show();
        }
      }
      else{
        $("#editPersonalInformationErrorMessage strong").text("Enter your last name!");
        $("#editPersonalInformationErrorMessage").show();
      }
    }
    else{
      $("#editPersonalInformationErrorMessage strong").text("Enter your first name!");
      $("#editPersonalInformationErrorMessage").show();
    }
  });
  function displayProfileInformation(){
		$.ajax({
			url: "/displayProfileInformation",
			method: "GET",
			dataType: "json",
			success: function(data){
        $("#profilePictureDiv").attr("src", data.profilePicture);
        $("#firstName").val(data.firstName);
				$("#lastName").val(data.lastName);
				$("#email").val(data.email);
				$("#telephone").val(data.telephone);
        $("#profession").val(data.profession);
        $("#profession_de").val(data.profession_de);
				$("#birthday").val(data.birthday);
        $("#birthday_de").val(data.birthday_de);
				$("#location").val(data.location);
        $("#location_de").val(data.location_de);
        $("#linkedIn").val(data.linkedIn);
				$("#xing").val(data.xing);
        $("#github").val(data.github);
			}
		})
	}
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
  function handleProfilePicture(){
		var profilePictureName = $('#profilePicture').val().split('\\').pop();
    if(profilePictureName){
      $("#profilePictureName").text(profilePictureName);
    }
    else{
      $("#profilePictureName").text("Upload a picture");
    }
	}
  $(document).on("click", "#hideEditPersonalInformationErrorMessage", function(e){
    $("#editPersonalInformationErrorMessage").hide();
  });
  $(document).on("click", "#hideEditPersonalInformationSuccessMessage", function(e){
    $("#editPersonalInformationSuccessMessage").hide();
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
