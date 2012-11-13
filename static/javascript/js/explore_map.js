
	var initialLocation;
    var browserSupportFlag =  new Boolean();
    var user_images= document.getElementsByName("image_info");
	var bounds = new google.maps.LatLngBounds();
	var geocoder;
	
	function initialize(){
	geocoder = new google.maps.Geocoder();
		var _center = new google.maps.LatLng(34.3664951, -89.5192484);

		var myOptions = {
			zoom: 5,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: _center
		}
		map = new google.maps.Map(document.getElementById("map"), myOptions);
		//directionsDisplay.setMap(map);
		//infoWindow = new google.maps.InfoWindow();
		
		//setMarkers(map);
		
		setAutoComplete('start');
		setAutoComplete('place-0-text');
		
		
//		// Try W3C Geolocation (Preferred)
//  if(navigator.geolocation) {
//    browserSupportFlag = true;
//    navigator.geolocation.getCurrentPosition(function(position) {
//      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
//      map.setCenter(initialLocation);
//    }, function() {
//      handleNoGeolocation(browserSupportFlag);
//    });
//  // Try Google Gears Geolocation
//  } else if (google.gears) {
//    browserSupportFlag = true;
//    var geo = google.gears.factory.create('beta.geolocation');
//    geo.getCurrentPosition(function(position) {
//      initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
//      map.setCenter(initialLocation);
//    }, function() {
//      handleNoGeoLocation(browserSupportFlag);
//    });
//  // Browser doesn't support Geolocation
//  } else {
//    browserSupportFlag = false;
//    handleNoGeolocation(browserSupportFlag);
//  }
		
	}
	
	
	function setAutoComplete(searchId)
	{
		   /*   Autocomplete   */
        var input = document.getElementById(searchId);
        var autocomplete = new google.maps.places.Autocomplete(input);
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
		geocoder.geocode( { 'address': place.formatted_address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
			
			if(searchId.indexOf("start")==-1)
			{
				var geoId = searchId.replace(/text/g, "geo");
			}
			else 
			{
				var geoId = searchId+"-geo";
			}
	  	$('#'+geoId).val(results[0].geometry.location);
		//$('#'+geoId).attr('geovalue').val(results[0].geometry.location);
		//$('#'+geoId).geovalue = results[0].geometry.location;
		//alert(geoId);
      } 
      });
      });
	}
	
	 function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }
	
	
	function setMarkers(map) {
  
      var image,shadow;
	  var image_split;
	  var image_url, image_title, image_startPlace, image_id;
dest_places = document.getElementsByName("dest_places");

  for (var i = 0; i < user_images.length; i++) {
      image_split = user_images.item(i).value.split(';');
	  image_url = image_split[1];
	  image_id = image_split[2];

	  image = new google.maps.MarkerImage(image_url,
      new google.maps.Size(50, 50),    
      new google.maps.Point(0,0),    
      new google.maps.Point(50, 50),
	  new google.maps.Size(50, 50));
	  
      shadow = new google.maps.MarkerImage(image_url,
      new google.maps.Size(1, 1),
      new google.maps.Point(0,0),
      new google.maps.Point(0, 1));
	
	DestToMarker(dest_places.item(i).value,image, shadow);

  }
}

function DestToMarker(dest_place,image, shadow)
{

      dest_place= jQuery.parseJSON(dest_place);
	  if(dest_place[0] === undefined && dest_place[0]['dest'] === undefined)
	  {
	  	alert('test');
	  	geocoder.geocode({
	  		'address': dest_place[0]['dest']
	  	}, function(results, status){
	  		if (status == google.maps.GeocoderStatus.OK) {
	  			bounds.extend(results[0].geometry.location);
	  			map.fitBounds(bounds);
	  			var marker = new google.maps.Marker({
	  				position: results[0].geometry.location,
	  				map: map,
	  				shadow: shadow,
	  				icon: image,
	  				zIndex: 9000
	  			});
	  			
	  		}
	  		else {
	  			alert("Geocode was not successful for the following reason: " + status);
	  		}
	  	});
	  }
 
	
}