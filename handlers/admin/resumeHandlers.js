$(document).ready(function(){
  displayResume();
  $(document).on("click", ".editResume", function(e){
    $("#editId").val($(this).data("id"));
    $("#editType").val($(this).data("type"));
    $("#editTitle").val($(this).data("title"));
    $("#editTitle_de").val($(this).data("title_de"));
    $("#editWorkPlace").val($(this).data("workplace"));
    $("#editWorkPlace_de").val($(this).data("workplace_de"));
    $("#editDuration").val($(this).data("duration"));
    $("#editDuration_de").val($(this).data("duration_de"));
    $("#editDescription").val($(this).data("description"));
    $("#editDescription_de").val($(this).data("description_de"));
    $("#editResumeModal").modal("show");
  });
  $(document).on("submit", "#editResumeForm", function(e){
    e.preventDefault();
    var id = $("#editId").val();
    var type = $("#editType").val();
    var title = $("#editTitle").val();
    var title_de = $("#editTitle_de").val();
    var workPlace = $("#editWorkPlace").val();
    var workPlace_de = $("#editWorkPlace_de").val();
    var duration = $("#editDuration").val();
    var duration_de = $("#editDuration_de").val();
    var description = $("#editDescription").val();
    var description_de = $("#editDescription_de").val();
    if(id){
      if(type){
        if(title){
          if(title_de){
            if(workPlace){
              if(workPlace_de){
                if(duration){
                  if(duration_de){
                    $.ajax({
                      url: "/editResume",
                      method: "POST",
                      dataType: "json",
                      data: {id: id, type: type, title: title, title_de: title_de, workPlace: workPlace, workPlace_de: workPlace_de, duration: duration, duration_de: duration_de, description: description, description_de: description_de},
                      success: function(data){
                        $("#closeEditResumeModalButton").click();
                        if(data.edited == "yes"){
                          $("#resumeErrorMessage").hide();
                          $("#resumeSuccessMessage strong").text(data.message);
                          $("#resumeSuccessMessage").show();
                          $("#editResumeForm").trigger("reset");
                        }
                        else{
                          $("#resumeErrorMessage strong").text(data.message);
                          $("#resumeErrorMessage").show();
                        }
                        displayResume();
                      }
                    });
                  }
                  else{
                    $("#skillsErrorMessage strong").text("Enter the duration in German!");
                    $("#skillsErrorMessage").show();
                  }
                }
                else{
                  $("#skillsErrorMessage strong").text("Enter the duration!");
                  $("#skillsErrorMessage").show();
                }
              }
              else{
                $("#skillsErrorMessage strong").text("Enter the work place in German!");
                $("#skillsErrorMessage").show();
              }
            }
            else{
              $("#skillsErrorMessage strong").text("Enter the work place!");
              $("#skillsErrorMessage").show();
            }
          }
          else{
            $("#skillsErrorMessage strong").text("Enter the title in German!");
            $("#skillsErrorMessage").show();
          }
        }
        else{
          $("#skillsErrorMessage strong").text("Enter the title!");
          $("#skillsErrorMessage").show();
        }
      }
      else{
        $("#skillsErrorMessage strong").text("Select a type!");
        $("#skillsErrorMessage").show();
      }
    }
  });
  $(document).on("click", ".deleteResume",function(e){
    var id = $(this).data("id");
    if(id){
      $.ajax({
        url: "/deleteResume",
        method: "POST",
        dataType: "json",
        data: {id: id},
        success: function(data){
          if(data.deleted == "yes"){
            $("#resumeSuccessMessage strong").text(data.message);
  					$("#resumeSuccessMessage").show();
  				}
  				else{
  					$("#resumeErrorMessage strong").text(data.message);
  					$("#resumeErrorMessage").show();
  				}
          displayResume();
        }
      });
    }
  });
  function displayResume(){
		$.ajax({
			url: "/displayResume",
			method: "GET",
			dataType: "html",
			success: function(data){
				$("#resumeDiv").html(data);
			}
		});
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
  $(document).on("click", "#hideResumeErrorMessage", function(e){
    $("#resumeErrorMessage").hide();
  });
  $(document).on("click", "#hideResumeSuccessMessage", function(e){
    $("#resumeSuccessMessage").hide();
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
