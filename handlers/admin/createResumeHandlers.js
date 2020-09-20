$(document).ready(function(){
  $(document).on("submit", "#createResumeForm", function(e){
    e.preventDefault();
    var type = $("#type").val();
    var title = $("#title").val();
    var title_de = $("#title_de").val();
    var workPlace = $("#workPlace").val();
    var workPlace_de = $("#workPlace_de").val();
    var duration = $("#duration").val();
    var duration_de = $("#duration_de").val();
    var description = $("#description").val();
    var description_de = $("#description_de").val();
    if(type){
      if(title){
        if(title_de){
          if(workPlace){
            if(workPlace_de){
              if(duration){
                if(duration_de){
                  $.ajax({
                    url: "/createResume",
                    method: "POST",
                    dataType: "json",
                    data: {type: type, title: title, title_de: title_de, workPlace: workPlace, workPlace_de: workPlace_de, duration: duration, duration_de: duration_de, description: description, description_de: description_de},
                    success: function(data){
                      if(data.saved == "yes"){
                        $("#createResumeErrorMessage").hide();
                        $("#createResumeSuccessMessage strong").text(data.message);
                        $("#createResumeSuccessMessage").show();
                        $("#createResumeForm").trigger("reset");
                      }
                      else{
                        $("#createResumeErrorMessage strong").text(data.message);
                        $("#createResumeErrorMessage").show();
                      }
                    }
                  });
                }
                else{
                  $("#createResumeErrorMessage strong").text("Enter the duration in German!");
                  $("#createResumeErrorMessage").show();
                }
              }
              else{
                $("#createResumeErrorMessage strong").text("Enter the duration!");
                $("#createResumeErrorMessage").show();
              }
            }
            else{
              $("#createResumeErrorMessage strong").text("Enter the work place in German!");
              $("#createResumeErrorMessage").show();
            }
          }
          else{
            $("#createResumeErrorMessage strong").text("Enter the work place!");
            $("#createResumeErrorMessage").show();
          }
        }
        else{
          $("#createResumeErrorMessage strong").text("Enter the title in German!");
          $("#createResumeErrorMessage").show();
        }
      }
      else{
        $("#createResumeErrorMessage strong").text("Enter the title!");
        $("#createResumeErrorMessage").show();
      }
    }
    else{
      $("#createResumeErrorMessage strong").text("Select a type!");
      $("#createResumeErrorMessage").show();
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
  $(document).on("click", "#hideCreateResumeErrorMessage", function(e){
    $("#createResumeErrorMessage").hide();
  });
  $(document).on("click", "#hideCreateResumeSuccessMessage", function(e){
    $("#createResumeSuccessMessage").hide();
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
