$(document).ready(function(){
	displayPortfolio();
	document.getElementById("logo").addEventListener("change", handlePortfolioLogo, false);
	document.getElementById("editLogo").addEventListener("change", editPortfolioLogo, false);
	$(document).on("submit", "#createPortfolioForm", function(e){
		e.preventDefault();
		var type = $("#type").val();
		var name = $("#name").val();
		var link = $("#link").val();
		var logo = $("#logo")[0].files[0];
		if(type){
			if(name){
				if(logo){
					if(link){
						var formData = new FormData();
						formData.append("type", type);
						formData.append("name", name);
						formData.append("link", link);
						formData.append("logo", logo);
						$.ajax({
							url: "/createPortfolio",
							method: "POST",
							data: formData,
							dataType: "json",
							processData: false,
							contentType: false,
				      success: function(data){
								if(data.saved == "yes"){
									$("#portfolioErrorMessage").hide();
									$("#portfolioSuccessMessage strong").text(data.message);
									$("#portfolioSuccessMessage").show();
									$("#createPortfolioForm").trigger("reset");
									$("#logoName").text("Choose a logo");
								}
								else{
									$("#portfolioErrorMessage strong").text(data.message);
									$("#portfolioErrorMessage").show();
								}
								displayPortfolio();
				      },
				      error: function(data){
								$("#portfolioErrorMessage strong").text("Image size must be less than 1MB!");
								$("#portfolioErrorMessage").show();
				      }
				    });
					}
					else{
						$("#portfolioErrorMessage strong").text("Enter a link!");
						$("#portfolioErrorMessage").show();
					}
				}
				else{
					$("#portfolioErrorMessage strong").text("Choose an image!");
					$("#portfolioErrorMessage").show();
				}
			}
			else{
				$("#portfolioErrorMessage strong").text("Enter a name!");
				$("#portfolioErrorMessage").show();
			}
		}
		else{
			$("#portfolioErrorMessage strong").text("Select a type!");
			$("#portfolioErrorMessage").show();
		}
  });
	$(document).on("click", ".editPortfolio", function(e){
    $("#editId").val($(this).data("id"));
    $("#editType").val($(this).data("type"));
    $("#editName").val($(this).data("name"));
    $("#editLink").val($(this).data("link"));
		var logoName = $(this).data("logo");
		if(logoName){
    	$("#editLogoName").text(logoName);
		}
		else{
			$("#editLogoName").text("Choose a logo");
		}
    $("#editPortfolioModal").modal("show");
  });
	$(document).on("submit", "#editPortfolioForm", function(e){
		e.preventDefault();
		var id = $("#editId").val();
		var type = $("#editType").val();
		var name = $("#editName").val();
		var link = $("#editLink").val();
		var logo = $("#editLogo")[0].files[0];
		if(id){
			if(type){
				if(name){
					if(link){
						var formData = new FormData();
						formData.append("id", id);
						formData.append("type", type);
						formData.append("name", name);
						formData.append("link", link);
						formData.append("editLogo", logo);
						$.ajax({
							url: "/editPortfolio",
							method: "POST",
							data: formData,
							dataType: "json",
							processData: false,
							contentType: false,
				      success: function(data){
								$("#closeEditPortfolioModalButton").click();
								if(data.edited == "yes"){
									$("#portfolioErrorMessage").hide();
									$("#portfolioSuccessMessage strong").text(data.message);
									$("#portfolioSuccessMessage").show();
									$("#editPortfolioForm").trigger("reset");
									$("#logoName").text("Choose a logo");
								}
								else{
									$("#portfolioErrorMessage strong").text(data.message);
									$("#portfolioErrorMessage").show();
								}
								displayPortfolio();
							},
							error: function(data){
								$("#portfolioErrorMessage strong").text("Image size must be less than 1MB!");
								$("#portfolioErrorMessage").show();
				      }
						});
					}
					else{
						$("#portfolioErrorMessage strong").text("Enter the link!");
						$("#portfolioErrorMessage").show();
					}
				}
				else{
					$("#portfolioErrorMessage strong").text("Enter the name!");
					$("#portfolioErrorMessage").show();
				}
			}
			else{
				$("#portfolioErrorMessage strong").text("Select a type!");
				$("#portfolioErrorMessage").show();
			}
		}
	});
	$(document).on("click", ".deletePortfolio", function(e){
		var id = $(this).data("id");
		if(id){
			$.ajax({
				url: "/deletePortfolio",
				method: "POST",
				data: {id: id},
				dataType: "json",
				success: function(data){
					if(data.deleted == "yes"){
						$("#portfolioSuccessMessage strong").text(data.message);
						$("#portfolioSuccessMessage").show();
					}
					else{
						$("#portfolioErrorMessage strong").text(data.message);
						$("#portfolioErrorMessage").show();
					}
					displayPortfolio();
				}
			});
		}
	});
	function displayPortfolio(){
		$.ajax({
			url: "/displayPortfolio",
			method: "GET",
			dataType: "html",
			success: function(data){
				$("#portfolioDiv").html(data);
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
	function handlePortfolioLogo(){
		var logoName = $("#logo").val().split('\\').pop();
		if(logoName){
    	$("#logoName").text(logoName);
		}
		else{
			$("#logoName").text("Choose a logo");
		}
	}
	function editPortfolioLogo(){
		var logoName = $("#editLogo").val().split('\\').pop();
		if(logoName){
    	$("#editLogoName").text(logoName);
		}
		else{
			$("#editLogoName").text("Choose a logo");
		}
	}
	$(document).on("click", "#hidePortfolioErrorMessage", function(e){
    $("#portfolioErrorMessage").hide();
  });
  $(document).on("click", "#hidePortfolioSuccessMessage", function(e){
    $("#portfolioSuccessMessage").hide();
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
