$(document).ready(function(){
  function loadMap(){
   var mapElement = document.getElementById("map");
    var mapOptions = {
      zoom: 10,
      scrollwheel: true,
      disableDefaultUI: true,
      center: new google.maps.LatLng(50.932980, 7.040375),
    };
    var map = new google.maps.Map(mapElement, mapOptions);
    var image = {
      url: "../images/map/map.svg",
      scaledSize: new google.maps.Size(50, 50),
    }
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(50.932980, 7.040375),
      map: map,
      optimized: false,
      icon: image
    });
    var infoWindow = new google.maps.InfoWindow({content: "<h1 class='popover-map-title'>Marko Bošnjak</h1><div class='popover-map-caption'>Henri-Dunant-Str. 71, Ostheim, Köln, Deutschland</div>"});
    marker.addListener("click", function(){
      infoWindow.open(map, marker);
    });
    map.addListener("tilesloaded", function(){
      $("#map div[style*='background-color: white']").remove()
    })
  }
  google.maps.event.addDomListener(window, "load", loadMap);
});
