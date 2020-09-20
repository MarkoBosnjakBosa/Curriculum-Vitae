$(document).ready(function(){
  displaySkills();
  $(document).on("submit", "#createSkillForm", function(e){
    e.preventDefault();
    var type = $("#type").val();
    var name = $("#name").val();
    var rating = $("#rating").val();
    if(type){
      if(name){
        if(rating && !isNaN(rating)){
          $.ajax({
            url: "/createSkill",
            method: "POST",
            dataType: "json",
            data: {type: type, name: name, rating: rating},
            success: function(data){
              if(data.saved == "yes"){
                $("#skillsErrorMessage").hide();
                $("#skillsSuccessMessage strong").text(data.message);
                $("#skillsSuccessMessage").show();
                $("#createSkillForm").trigger("reset");
              }
              else{
                $("#skillsErrorMessage strong").text(data.message);
                $("#skillsErrorMessage").show();
              }
              displaySkills();
            }
          });
        }
        else{
          $("#skillsErrorMessage strong").text("Enter the rating!");
          $("#skillsErrorMessage").show();
        }
      }
      else{
        $("#skillsErrorMessage strong").text("Enter the name!");
        $("#skillsErrorMessage").show();
      }
    }
    else{
      $("#skillsErrorMessage strong").text("Select a type!");
      $("#skillsErrorMessage").show();
    }
  });
  $(document).on("click", ".editSkill", function(e){
    $("#editId").val($(this).data("id"));
    $("#editType").val($(this).data("type"));
    $("#editName").val($(this).data("name"));
    $("#editRating").val($(this).data("rating"));
    $("#editSkillModal").modal("show");
  });
  $(document).on("submit", "#editSkillForm", function(e){
    e.preventDefault();
    var id = $("#editId").val();
    var type = $("#editType").val();
    var name = $("#editName").val();
    var rating = $("#editRating").val();
    if(id){
      if(type){
        if(name){
          if(rating && !isNaN(rating)){
            $.ajax({
              url: "/editSkill",
              method: "POST",
              dataType: "json",
              data: {id: id, type: type, name: name, rating: rating},
              success: function(data){
                $("#closeEditSkillModalButton").click();
                if(data.edited == "yes"){
                  $("#skillsErrorMessage").hide();
                  $("#skillsSuccessMessage strong").text(data.message);
                  $("#skillsSuccessMessage").show();
                  $("#editSkillForm").trigger("reset");
                }
                else{
                  $("#skillsErrorMessage strong").text(data.message);
                  $("#skillsErrorMessage").show();
                }
                displaySkills();
              }
            });
          }
          else{
            $("#skillsErrorMessage strong").text("Enter the rating!");
            $("#skillsErrorMessage").show();
          }
        }
        else{
          $("#skillsErrorMessage strong").text("Enter the name!");
          $("#skillsErrorMessage").show();
        }
      }
      else{
        $("#skillsErrorMessage strong").text("Select a type!");
        $("#skillsErrorMessage").show();
      }
    }
  });
  $(document).on("click", ".deleteSkill",function(e){
    var id = $(this).data("id");
    if(id){
      $.ajax({
        url: "/deleteSkill",
        method: "POST",
        dataType: "json",
        data: {id: id},
        success: function(data){
          if(data.deleted == "yes"){
            $("#skillsSuccessMessage strong").text(data.message);
  					$("#skillsSuccessMessage").show();
  				}
  				else{
  					$("#skillsErrorMessage strong").text(data.message);
  					$("#skillsErrorMessage").show();
  				}
          displaySkills();
        }
      });
    }
  });
  function displaySkills(){
		$.ajax({
			url: "/displaySkills",
			method: "GET",
			dataType: "html",
			success: function(data){
				$("#skillsDiv").html(data);
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
  $(document).on("click", "#hideSkillsErrorMessage", function(e){
    $("#skillsErrorMessage").hide();
  });
  $(document).on("click", "#hideSkillsSuccessMessage", function(e){
    $("#skillsSuccessMessage").hide();
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
