$(document).ready(function(){
  "use-strict";
  var isMobile = false;
  if(/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    $("html").addClass("touch");
    isMobile = true;
  }
  else{
    $("html").addClass("no-touch");
    isMobile = false;
  }
	var tweenTime = 2;
	var master = new TimelineMax({delay: tweenTime-2});
	master.eventCallback('onComplete', function(){
		progressBar();
  });
	$("body, .js-img-load").imagesLoaded({background: !0}).always(function(instance){
    preloader();
  });
	function preloader(){
		var tl = new TimelineMax({paused: true});
		tl.set(".preloader", {opacity: "1"})
		.addLabel("first")
		.to(".preloader", .6, {delay: 1, opacity: "0", zIndex: "-1", ease: "Power3.easeInOut"})
		.to(".circle-pulse", .5, {opacity: 0, ease: "Power3.easeInOut"}, "+=.5")
		.to(".preloader__progress span", 1, {width: "100%", ease: "Power3.easeInOut"}, "first+=.5");
    tl.duration(tweenTime).play();
		return tl;
	};
  $(".hamburger").on('click', function(){
    $(this).toggleClass("is-active");
    $(".inner-menu").toggleClass("is-active");
    $("body").toggleClass("open-menu");
  });
  var $sideNavOpen = $(".hamburger");
  var tl = new TimelineMax({paused:true, reversed:true});
  if(window.matchMedia("(max-width: 580px)").matches){
    $(".js-menu").each(function(i){
  	   tl.timeScale(1);
       tl.fromTo(".nav", 1.0, {width: "0", opacity: 0, force3D:true}, {width: "100%", opacity: 1, ease: Back.easeOut})
       .staggerFrom(".nav__item", 0.2, {opacity: 0, x: 70, ease: Back.easeOut}, 0.06, "-=0.5");
    });
  }
  else{
    $(".js-menu").each(function(i){
      tl.timeScale(1);
      tl.fromTo(".nav", 1.0, {width: "0"}, {width: "100%", ease: "Bounce.easeOut"})
      .staggerFrom(".nav__item", 0.2, {opacity: 0, x: 70, ease: Back.easeOut}, 0.06, "-=0.25");
    });
  }
  $sideNavOpen.on("click", function(){
    tl.reversed() ? tl.play() : tl.reverse();
  });
	$(".js-carousel-review").each(function(){
		var carousel = new Swiper(".js-carousel-review", {
      slidesPerView: 2,
			spaceBetween: 30,
			speed: 300,
			grabCursor: true,
			watchOverflow: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
			autoplay: {
        delay: 5000,
      },
			breakpoints: {
        580: {
					slidesPerView: 1,
          spaceBetween: 20
        },
        991: {
          slidesPerView: 1
        }
      }
		});
	});
	$(".js-carousel-clients").each(function(){
		var carousel = new Swiper(".js-carousel-clients", {
      slidesPerView: 4,
			spaceBetween: 30,
			grabCursor: true,
			watchOverflow: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
			breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 0
        },
        580: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        991: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }
		});
	});
  function activeStickyKit(){
    $(".sticky-column").stick_in_parent({
      parent: '.sticky-parent'
    });
    $(".sticky-column")
    .on("sticky_kit:bottom", function(e){
      $(this).parent().css("position", "static");
    })
    .on("sticky_kit:unbottom", function(e){
      $(this).parent().css("position", "relative");
    });
  };
  activeStickyKit();
  function detachStickyKit(){
    $(".sticky-column").trigger("sticky_kit:detach");
  };
  var screen = 1200;
  var windowHeight, windowWidth;
  windowWidth = $(window).width();
  if((windowWidth < screen)){
    detachStickyKit();
  }
  else{
    activeStickyKit();
  }
  function windowSize(){
    windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
    windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
  }
  windowSize();
  function debounce(func, wait, immediate){
    var timeout;
    return function(){
      var context = this, args = arguments;
      var later = function(){
        timeout = null;
        if(!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if(callNow) func.apply(context, args);
    };
  };
  $(window).resize(debounce(function(){
    windowSize();
    $(document.body).trigger("sticky_kit:recalc");
    if(windowWidth < screen){
      detachStickyKit();
    }
    else{
      activeStickyKit();
    }
  }, 250));
	function progressBar() {
    $(".progress").each(function(){
	    var ctrl = new ScrollMagic.Controller();
	    new ScrollMagic.Scene({triggerElement: ".progress", triggerHook: "onEnter", duration: 300})
        .addTo(ctrl)
        .on("enter", function(e){
          var progressBar = $(".progress-bar");
          progressBar.each(function(indx){
            $(this).css({"width": $(this).attr("aria-valuenow") + "%", "z-index": "2"});
          });
        });
    });
  }
  function scrollIndicator(){
    $(window).on("scroll", function(){
      var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
      var scrolled = (wintop / (docheight-winheight)) * 100;
      $(".scroll-line").css("width", (scrolled + "%"));
    });
  }
	scrollIndicator();
  function scrollToTop(){
    var $backToTop = $(".back-to-top"),
    $showBackTotop = $(window).height();
    $backToTop.hide();
    $(window).scroll(function(){
      var windowScrollTop = $(window).scrollTop();
      if(windowScrollTop > $showBackTotop){
        $backToTop.fadeIn("slow");
      }
      else{
        $backToTop.fadeOut("slow");
      }
    });
    $backToTop.on("click", function(e){
      e.preventDefault();
      $("body, html").animate({scrollTop: 0}, "slow");
    });
  }
	scrollToTop();
  $(".js-image").each(function(){
    var dataImage = $(this).attr("data-image");
    $(this).css("background-image", "url(" + dataImage + ")");
  });
  $("textarea").each(function(){
    autosize(this);
  });
  $(function(){
    $("[data-toggle='tooltip']").tooltip()
  });
  $(".select").on("click",".placeholder",function(){
    var parent = $(this).closest(".select");
    if (!parent.hasClass("is-open")){
      parent.addClass("is-open");
      $(".select.is-open").not(parent).removeClass("is-open");
    }
    else{
      parent.removeClass("is-open");
    }
  }).on("click","ul>li",function(){
    var parent = $(this).closest(".select");
    parent.removeClass("is-open").find(".placeholder").text($(this).text());
    parent.find("input[type=hidden]").attr("value", $(this).attr("data-value"));
    $(".filter__item").removeClass("active");
    $(this).addClass("active");
    var selector = $(this).attr("data-filter");
    $(".js-filter-container").isotope({filter: selector});
    return false;
  });
  var $portfolioMasonry = $(".js-masonry").isotope({itemSelector: ".gallery-grid__item", layoutMode: "fitRows", percentPosition: true, transitionDuration: "0.5s", hiddenStyle: {opacity: 0, transform: "scale(0.001)"}, visibleStyle: {opacity: 1, transform: "scale(1)"}, fitRows: {gutter: ".gutter-sizer"}, masonry: {columnWidth: ".gallery-grid__item", gutter: ".gutter-sizer", isAnimated: true}});
  $portfolioMasonry.imagesLoaded().progress(function(){
    $portfolioMasonry.isotope({columnWidth: ".gallery-grid__item", gutter: ".gutter-sizer", isAnimated: true, layoutMode: "fitRows", fitRows: {gutter: ".gutter-sizer"}});
  });
  $("textarea").niceScroll({horizrailenabled:false});
  $(function(){
    $(".emoji-wrap img").on("click", function(){
      var emoji = $(this).attr("title");
      $("#commentForm").val($("#commentForm").val() + " " + emoji + " ");
    });
  });
  mediumZoom("[data-zoom]", {margin: 30});
  lazySizes.init();
  var $someImages = $("img.cover");
  objectFitImages($someImages);
  $("#contactForm").validator().on("submit", function (e){
    var language = $("#language").val();
    var errorMessage;
    if(language == "en"){
      errorMessage = "Please fill in the form...";
    }
    if(language == "de"){
      errorMessage = "Bitte füllen Sie das Formular aus...";
    }
    if(e.isDefaultPrevented()){
      formError();
      submitMessage(false, errorMessage);
    }
    else{
      e.preventDefault();
      submitForm();
    }
  });
  function submitForm(){
    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();
    var language = $("#language").val();
    $.ajax({
      url: "/submitContact",
      type: "POST",
      dataType: "json",
      data: {name: name, email: email, message: message, language: language},
      success : function(data){
        if(data.saved == "yes"){
          formSuccess(data.message);
        }
        else{
          formError();
          submitMessage(false, data.message);
        }
      }
    });
  }
  function formSuccess(message){
    submitMessage(true, message);
    $("#contactForm").trigger("reset");
  }
  function formError(){
    $("#contactForm").removeClass().addClass("shake animated").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
      $(this).removeClass();
    });
  }
  function submitMessage(validation, message){
    var messageClass;
    var messageColor;
    if(validation){
      messageClass = "validation-success";
      messageColor = "#00cc00";
    }
    else{
      messageClass = "validation-danger";
      messageColor = "#fff";
    }
    $("#validator-contact").removeClass().addClass(messageClass).html("<span style='color: " + messageColor + "'>" + message + "</span>");
  }
});
