$(document).ready(function(){
	displayContacts();
	$(document).on("click", ".deleteContact", function(e){
		var id = $(this).data("id");
		if(id){
			$.ajax({
				url: "/deleteContact",
				method: "POST",
				data: {id: id},
				dataType: "json",
				success: function(data){
					if(data.deleted == "yes"){
						$("#contactSuccessMessage strong").text(data.message);
						$("#contactSuccessMessage").show();
					}
					else{
						$("#contactErrorMessage strong").text(data.message);
						$("#contactErrorMessage").show();
					}
					displayContacts();
				}
			});
		}
	});
	function displayContacts(){
		$.ajax({
			url: "/displayContacts",
			method: "GET",
			dataType: "html",
			success: function(data){
				$("#contactDiv").html(data);
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
	$(document).on("click", "#hideContactErrorMessage", function(e){
    $("#contactErrorMessage").hide();
  });
  $(document).on("click", "#hideContactSuccessMessage", function(e){
    $("#contactSuccessMessage").hide();
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
