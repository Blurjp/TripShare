  var rendererOptions = {
              draggable: true,
              suppressMarkers: true
                          };
  var clickerPixel;

  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  var directionsService = new google.maps.DirectionsService();
  var map;
  var start;
  var end;
  var dragStartPos;
  
// map zoom and center  
  var mapZoom;
  var mapCenter;
  
//  polyline and marker store 
  var polylineGroup = [];
  var startMarkerGroup = [];
  var endMarkerGroup = [];
  var polylineMarkerGroup = [];
  var markerGroup = [];
  var wayptsMarkerGroup = [];
  
  var waypts = [];
  var infoWindow;
  var clickedOverlay;
  var markerMenuDiv;
  var markerMenu;
  var polylineMenuDiv;
  var polylineMenu;
  var mapDiv;
  var geocoder;
  var polyline;
  
  var createMarkerFlag = true;
  var selectedMarker;
  var selectedPolyline;
  
  var routeBounds = new google.maps.LatLngBounds();
  
  
  function initialize() {
    geocoder = new google.maps.Geocoder();
	var polyOptions = {
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
    }
    polyline = new google.maps.Polyline(polyOptions);
   
	var _center = new google.maps.LatLng(34.3664951, -89.5192484);
	if (document.getElementById("startPosition").value != 'undefined' && document.getElementById("startPosition").value != '') {

		var startValue = document.getElementById("startPosition").value;
		var temp = startValue.substring(1, startValue.length - 2);
		var a = temp.split(', ')[0];
		var b = temp.split(', ')[1];
		
		_center = new google.maps.LatLng(a, b);
		calcRoute(false);
	}
	else if (document.getElementById("startPlace").value != 'undefined' && document.getElementById("startPlace").value != '') {
			//alert(document.getElementById("startPlace").value);
			var address_id = document.getElementById("startPlace").value;
			geocoder.geocode({
				'address': address_id
			}, function(results, status){
				if (status == google.maps.GeocoderStatus.OK) {
					_center = results[0].geometry.location;
					document.getElementById("startPosition").value = _center;
				// alert(_center);
				//alert("test");
				}
				else {
					alert("Geocode was not successful for the following reason: " + status);
					return null;
				}
			});
		}
	//setAutoComplete('site_input');
	var  dest_places = document.getElementById('dest_place').value;
	dest_places = jQuery.parseJSON(dest_places);
	var bounds = new google.maps.LatLngBounds();
	for (var i=0; i < dest_places.length; i++)
	{
	  day = dest_places[i]['day'];
	  geocoder.geocode( { 'address': dest_places[i]['dest']}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
	  	//map.setCenter(results[0].geometry.location);
		bounds.extend(results[0].geometry.location);
		map.fitBounds(bounds);
		//map.setZoom(7);
		createMarker('normal', results[0].geometry.location);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
      });
	}
	
	
    var myOptions = {
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: _center
    }
     map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

     directionsDisplay.setMap(map);
     infoWindow = new google.maps.InfoWindow();
     clickedOverlay = new google.maps.OverlayView();
     clickedOverlay.draw = function(){};
     clickedOverlay.setMap(map);


   // === create the context menu div ===           
    markerMenuDiv = document.createElement("div");
    
    markerMenuDiv.index = 1;               
    google.maps.event.addListener(map,"click",function(event) {    
    
      createMarker('normal',event.latLng);
                });   
                
    google.maps.event.addListener(map,"rightclick",function(event) {    
     markerMenuDiv.style.visibility = "hidden";
    // polylineMenuDiv.style.visibility = "hidden";
                });   
                
                
  // Create the DIV to hold the control and call the HomeControl() constructor
  // passing in this DIV.
  var markerControlDiv = document.createElement('DIV');
  var markerControl = new MarkerControl(markerControlDiv);

  markerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(markerControlDiv);   
  
    var homeControlDiv = document.createElement('DIV');
  var homeControl = new HomeControl(homeControlDiv);

  homeControlDiv.index = 2;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(homeControlDiv);          
  fetchPath();                 
   
  }
  
	
function setAutoComplete(searchId)
	{
		   /*   Autocomplete   */
        var input = document.getElementById(searchId);
		
        var autocomplete = new google.maps.places.Autocomplete(input);
		
		 google.maps.event.addListener(autocomplete, 'place_changed', function() {
         var place = autocomplete.getPlace();
        });
	}

  /**
 * The HomeControl adds a control to the map that simply
 * returns the user to Chicago. This constructor takes
 * the control DIV as an argument.
 */

function MarkerControl(controlDiv) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

var oImg=document.createElement("img");
oImg.style.paddingLeft = '1px';
oImg.style.paddingRight = '1px';
oImg.setAttribute('src', '../static/images/normalTag.png');
oImg.setAttribute('alt', 'na');
oImg.setAttribute('height', '24px');
oImg.setAttribute('width', '24px');
oImg.title = 'Drag and drop the marker to your map';

controlDiv.appendChild(oImg);

 // Setup the click event listeners: simply set the map to Chicago
  google.maps.event.addDomListener(oImg, 'dragstart', function() {
   var _latLng = clickedOverlay.getProjection().fromDivPixelToLatLng(oImg);
    createMarker('normal', _latLng); 
  });
}
  
function HomeControl(controlDiv) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('DIV');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Drag and drop the marker to your map';
  controlDiv.appendChild(controlUI);

  
  var oImg=document.createElement("img");
  oImg.style.paddingLeft = '1px';
  oImg.style.paddingRight = '1px';
  oImg.setAttribute('src', '../static/images/model2.png');
  oImg.setAttribute('alt', 'na');
  oImg.setAttribute('height', '24px');
  oImg.setAttribute('width', '24px');
  controlUI.appendChild(oImg);

  google.maps.event.addDomListener(oImg, 'dragstart', function() {
   var _latLng = clickedOverlay.getProjection().fromDivPixelToLatLng(oImg);
    createMarker('normal', _latLng);
    
  });

}
 
 Array.prototype.indexof = function(value){
var ctr = "";
for (var i=0; i < this.length; i++) {
// use === to check for Matches. ie., identical (===), ;
if (this[i] === value) {
return i;
}
}
return ctr;
}; 

 Array.prototype.removeAt = function(index){
     this.splice(index, 1);
}; 
  
 function MarkerWrapper(markerType, marker)
 {
     this.markerType = markerType;
     this.marker = marker;
 } 


  
 function MarkerMenu(contextMenu)
{
   // contextMenu.style.visibility="hidden";      
    contextMenu.style.background="#ffffff";      
    contextMenu.style.border="1px solid #8888FF";     
    // ===context menu HTML for varioys situations ===     
    
    contextMenu.innerHTML = '<a href="javascript:setasstart()"><div class="context">&nbsp;&nbsp;Set as Start&nbsp;&nbsp;<\/div><\/a>'
      + '<a href="javascript:setasdest()"><div class="context">&nbsp;&nbsp;Set as Dest&nbsp;&nbsp;<\/div><\/a>'   
       + '<a href="javascript:addaswaypoint()"><div class="context">&nbsp;&nbsp;Add as waypoint&nbsp;&nbsp;<\/div><\/a>' 
         + '<a href="javascript:DeleteMarker()"><div class="context">&nbsp;&nbsp;Delete Marker&nbsp;&nbsp;<\/div><\/a>' ;   
    
    var mapObject = document.getElementById("map-canvas");
    mapObject.appendChild(contextMenu);
}

 
 
 function PolylineMenu(contextMenu)
{
  // contextMenu.style.visibility="hidden";      
    contextMenu.style.background="#ffffff";      
    contextMenu.style.border="1px solid #8888FF";     
    // ===context menu HTML for varioys situations ===     
    
    contextMenu.innerHTML = '<a href="javascript:redline()"><div class="context">&nbsp;&nbsp;Set Red&nbsp;&nbsp;<\/div><\/a>'
      + '<a href="javascript:greenline()"><div class="context">&nbsp;&nbsp;Set Green&nbsp;&nbsp;<\/div><\/a>'   
       + '<a href="javascript:blueline()"><div class="context">&nbsp;&nbsp;Set Blue&nbsp;&nbsp;<\/div><\/a>' ;   
    
    var mapObject = document.getElementById("map-canvas");
    mapObject.appendChild(contextMenu);
}

 function DeleteMarker()
{
var markerIndex;

switch (selectedMarker.markerType)
{

    case 'polylinemarker':
        markerIndex = polylineMarkerGroup.indexof(selectedMarker.marker);
        polylineMarkerGroup.removeAt(markerIndex);
        break;
    case 'start':
        markerIndex = startMarkerGroup.indexof(selectedMarker.marker);
        startMarkerGroup.removeAt(markerIndex);
        break;
    case 'end':
        markerIndex = endMarkerGroup.indexof(selectedMarker.marker);
        endMarkerGroup.removeAt(markerIndex);
        break;
    case 'waypoint':
        markerIndex = wayptsMarkerGroup.indexof(selectedMarker.marker);
        wayptsMarkerGroup.removeAt(markerIndex);
        break;
    default:
        markerIndex = markerGroup.indexof(selectedMarker.marker);
        markerGroup.removeAt(markerIndex);
}

selectedMarker.marker.setMap(null);
markerMenuDiv.style.visibility = "hidden";
}

function setasstart()
{
  
    if(selectedMarker.marker)
    {   
	start = selectedMarker;
    selectedMarker.markerType = 'start';
    selectedMarker.marker.setIcon('../static/images/start.png');
    document.getElementById("startPosition").value = selectedMarker.marker.getPosition();
	//document.getElementById("startPlace").value = selectedMarker.marker.getPosition();
	
	codeLatLng('startPosition');
    ProcessSetMarker();
    }
    if(selectedPolyline)
    {
    selectedPolyline.setMap(null);
    }
    if(document.getElementById("endPosition").value != 'undefined' && document.getElementById("endPosition").value != '')
    {
   // alert("endpo: "+document.getElementById("endPosition").value);
    calcRoute(false);
   
    }
    markerMenuDiv.style.visibility = "hidden";
	
}

function addaswaypoint()
{

if(selectedMarker.marker)
    {   
    selectedMarker.markerType = 'waypoint';
    selectedMarker.marker.setIcon('../static/images/tag.png');
    waypts.push({
            location: selectedMarker.marker.getPosition(),
            stopover:true});
  
     ProcessSetMarker();       
    }
    if(selectedPolyline)
    {
    selectedPolyline.setMap(null);
    }
    if(document.getElementById("startPosition").value!= 'undefined'  && document.getElementById("endPosition").value != 'undefined')
    {
    calcRoute(false);
    }
    markerMenuDiv.style.visibility = "hidden";
}

function setasdest()
{
   
    if(selectedMarker.marker)
    { 
    selectedMarker.markerType = 'end';  
    selectedMarker.marker.setIcon('../static/images/dest.png');
    document.getElementById("endPosition").value = selectedMarker.marker.getPosition();
	//document.getElementById("endPlace").value = selectedMarker.marker.getPosition();
	
	codeLatLng('endPosition');
    ProcessSetMarker();       
    }
     if(selectedPolyline)
    {
    selectedPolyline.setMap(null);
    
    }
    if(document.getElementById("startPosition").value!= 'undefined')
    {
	
    calcRoute(false);
   
    }
    markerMenuDiv.style.visibility = "hidden";
}

function pushPath() {
  var path = polyline.getPath();
  var pathSize = path.getLength();
  //alert('push path');
  document.getElementById('startPosition').value = path.getAt(0).lat() + "," + path.getAt(0).lng();
  document.getElementById('endPosition').value = path.getAt(pathSize - 1).lat() + "," + path.getAt(pathSize - 1).lng();
	  
  // Update the text field to display the polyline encodings
  var encodeString = google.maps.geometry.encoding.encodePath(path);
  if (encodeString) {
  //	alert('encodeString');
      document.getElementById('encodedPolyline').value = encodeString;
  }
}

function fetchPath(){
	var encodingString;
	 
	if (document.getElementById('encodedPolyline').value != 'undefined' && document.getElementById('encodedPolyline').value != '') {
		encodingString = document.getElementById('encodedPolyline').value;
		alert(encodingString);
        var path = google.maps.geometry.encoding.decodePath(encodingString);
		
		
		document.getElementById('startPosition').value = path[0];
	    //alert('path:'+path[0]);
        document.getElementById('endPosition').value = path[path.length-1];
	
		//polyline.setPath(path);
		
		createMarker('start', path[0]);
		createMarker('end', path[path.length-1]);
		if(path.length>2)
		{
		for (var i = 1; i < path.length ; i++) {
		    createMarker('waypoint', path[i]);
		}
		}
		
	}
}

function redline()
{
if(selectedPolyline)
{
selectedPolyline.setOptions({

 strokeColor:'#FF0000'
}
)
}
polylineMenuDiv.style.visibility = "hidden";
}

function greenline()
{
if(selectedPolyline)
{
selectedPolyline.setOptions(
{

 strokeColor:'#00FF00'
}
)
}
polylineMenuDiv.style.visibility = "hidden";
}

function blueline()
{
if(selectedPolyline)
{
selectedPolyline.setOptions(
{
strokeColor:'#0000FF'
}
)
}
polylineMenuDiv.style.visibility = "hidden";
}

function updateTag(address, marker)
{
//alert('updateTag'); 
    var myHtml = '<strong>'+address+'</strong><br/>';
    infoWindow.setContent(myHtml);
    infoWindow.open(map, marker);
} 


  
  function reverseGeocodePosition(pos, task, marker) 
{  
geocoder.geocode({latLng: pos}, function(responses, status)
{
if (status == google.maps.GeocoderStatus.OK) 
    {
        if(responses && responses.length > 0)
        {
        task(responses[0].formatted_address, marker);
        }
    }

else {
        alert("Geocoder failed due to: " + status);
     }
}
);
 }

function codeLatLng(name) {
    var input = document.getElementById(name).value;
	
	var temp = input.substring(1, input.length-1);
	
    var latlngStr = temp.split(",",2);
    var lat = parseFloat(latlngStr[0]);
    var lng = parseFloat(latlngStr[1]);
    var latlng = new google.maps.LatLng(lat, lng);
	
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
		  tempName = name.replace(/Position/,"Place");
		  //alert("Geocoder failed due ");
          document.getElementById(tempName).value = results[1].formatted_address;
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }
 

  function codeAddress(address_id) {
   // var address = document.getElementById(address_id).value;
    
    geocoder.geocode( { 'address': address_id}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) 
      {
       map.setCenter(results[0].geometry.location);        
       //alert("test");
       return results[0].geometry.location;
        }

     else {
        alert("Geocode was not successful for the following reason: " + status);
        return null;
      }
     }); 
  
  }

  function calcRoute(createMarkerFlag) {
  	
	var polyOptions = {
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 3
    }
    var poly = new google.maps.Polyline(polyOptions);
	var _path = poly.getPath();
	
     polyline = new google.maps.Polyline({
       path:[],
       strokeColor: '#FF0000',
       strokeWeight: 5
       });
	   
    //alert("calcRoute");
    var startPos = document.getElementById("startPosition").value;
    var endPos = document.getElementById("endPosition").value;
   
    if(createMarkerFlag == true)
    {
    createMarker('start',startPos);
    createMarker('end',endPos);
    }
    
    var dragPosition = startPos;
    
    var checkboxArray = document.getElementById("wayPoints");
    for (var i = 0; i < checkboxArray.length; i++) {
      if (checkboxArray.options[i].selected == true) {
        waypts.push({
            location:checkboxArray[i].value,
            stopover:true});
      }
    }

    var request = {
        origin: startPos, 
        destination: endPos,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
	
	
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        
        var route = response.routes[0];
        path = route.overview_path;
        
        var legs = route.legs;                                      
        for (i=0;i<legs.length;i++) {                                    
        var steps = legs[i].steps;                                         
        for (j=0;j<steps.length;j++) {                  
        var nextSegment = steps[j].path;
       
        for (k=0;k<nextSegment.length;k++) {                                                      
        polyline.getPath().push(nextSegment[k]);                                                       
        routeBounds.extend(nextSegment[k]);                                                   
        }   
        }
		}                       

         
         polyline.setMap(map);
		 var path = polyline.getPath();
		 var temp = startPos.substring(1, startPos.length-2);
		 var a = temp.split(', ')[0];
		// alert(a);
		 var b = temp.split(', ')[1];
		// alert(b);
		 var _start = new google.maps.LatLng(a, b);
		 
		 
		 temp = endPos.substring(1, endPos.length-2);
		 a = temp.split(', ')[0];
	//	 alert(a);
		 b = temp.split(', ')[1];
	//	 alert(b);
		 
		 var _end = new google.maps.LatLng(a, b);
		 
		 _path.push(_start);
		 //_path.push()
		 _path.push(_end);
		 var encodeString = google.maps.geometry.encoding.encodePath(path);
		 //var encodeString = google.maps.geometry.encoding.encodePath(path);
		 
		 
		 document.getElementById('encodedPolyline').value = encodeString;
		// alert(encodeString);
		
        map.fitBounds(routeBounds);
        polylineGroup.push(polyline);
        selectedPolyline = polyline;
      
      
       // === set listener for polyline marker ===   
        polylineMenuDiv = document.createElement("div");    
        polylineMenuDiv.index = 1;     
        var dragMarker = createMarker('polylinemarker',dragPosition);
                      
        google.maps.event.addListener(polyline,'rightclick', function(event){
        //dragMarker.visible = false;
		alert("addListener");
        polylineMenuDiv.style.position = "absolute";
        var pixel =  clickedOverlay.getProjection().fromLatLngToContainerPixel(event.latLng);     
                    polylineMenuDiv.style.top = pixel.y+ 'px';
                    polylineMenuDiv.style.left = pixel.x+ 'px';
                  
                   
       // markerMenuDiv.innerHTML = mapContextHtml;       
        if(polylineMenuDiv.style.visibility == "visible") 
        { 
       // alert("hidden");
        polylineMenuDiv.style.visibility = "hidden";  
        }
        else
        {
      //  alert("visible");
        polylineMenuDiv.style.visibility = "visible";  
        }
        polylineMenu = new PolylineMenu(polylineMenuDiv);
         //     alert('right'); 
        });

       google.maps.event.addListener(polyline,'mousemove', function(event){
       
       dragMarker.visible = true;
       dragMarker.setPosition(event.latLng);
  
        });
      

        // begin to drag the marker
         google.maps.event.addListener(dragMarker,'drag', function(event){
         polyline.setMap(null);
        dragMarker.visible = true;
    
        });
        
        
        // end the drag of marker
        google.maps.event.addListener(dragMarker,'dragend', function(event){
        
        waypts.push({
        location:event.latLng ,stopover:true });
        calcRoute(false);
        dragMarker.visible = false;
        });
      }
    });
  }
  
  function addMarkers() {
       
        var bounds = map.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        var lngSpan = northEast.lng() - southWest.lng();
        var latSpan = northEast.lat() - southWest.lat();
      

        var latLng = new google.maps.LatLng(southWest.lat() + latSpan * Math.random(),
                                              southWest.lng() + lngSpan * Math.random());
        createMarker('normal',latLng);
        
      }
      
   function createPolylineMarker(latLng)
     {
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: 'node.gif'
          });
		  
		 marker.setIcon('../static/images/node.gif');
         marker.setDraggable(true);
          //var username = document.getElementById("username").value;
          google.maps.event.addListener(marker, 'click', function() {
            var myHtml = '<strong>' + '{{current_user["username"]}}' + '</strong><br/>';
            infoWindow.setContent(myHtml);
            infoWindow.open(map, marker);
          });
          
          
      
        google.maps.event.addListener(marker, 'rightclick', function(){
       
        selectedMarker = new MarkerWrapper('polylinemarker',marker);
         
       
        markerMenuDiv.style.position = "absolute";
      
        var pixel = marker.getPosition();  
        markerMenuDiv.style.top = pixel.y+ 'px';
        markerMenuDiv.style.left = pixel.x+ 'px';
                  
        if(markerMenuDiv.style.visibility == "visible") 
        { 
            markerMenuDiv.style.visibility = "hidden";  
        }
        else
        {
        //alert("visible");
        markerMenuDiv.style.visibility = "visible";  
        }
        markerMenu = new MarkerMenu(markerMenuDiv);
         });
         
         return marker;
     }
      
      function createMarker(markerType, latLng) {
       //  alert(latLng);
         var marker = new google.maps.Marker({
            position: latLng,
            map: map
            
          });
          marker.setDraggable(true);
          marker.setIcon('../static/images/start.png');
		  switch (markerType) {
		 	case 'start':
			
		 		marker.setIcon('../static/images/start.png');
		 		break;
			case 'end': 
			
		 		marker.setIcon('../static/images/dest.png');
		 		break;
			case 'waypoint': 
			
		 		marker.setIcon('../static/images/waypoint.png');
		 		break;
				
			case 'polylinemarker': 
			
		 		marker.setIcon('../static/images/node.gif');
		 		break;
				
		    default:
			    marker.setIcon('../static/images/dest.png');
		 		break;
		 }

          google.maps.event.addListener(marker, 'click', function() {
            var myHtml = '<strong>' + '{{current_user["username"]}}' + '</strong><br/>';
            infoWindow.setContent(myHtml);
            infoWindow.open(map, marker);
          });
         google.maps.event.addListener(marker, 'dragstart', function(event){
         dragStartPos = event.latLng;       
        });

        google.maps.event.addListener(marker, 'rightclick', function(event){
       
        selectedMarker = new MarkerWrapper(markerType, marker);
        // selectedMarker.setVisible(false);
        markerMenuDiv.style.position = "absolute";
        
        var pixel =  clickedOverlay.getProjection().fromLatLngToContainerPixel(marker.getPosition());     
        markerMenuDiv.style.top = pixel.y+ 'px';
        markerMenuDiv.style.left = pixel.x+ 'px';
                  
       // markerMenuDiv.innerHTML = mapContextHtml;       
        if(markerMenuDiv.style.visibility == "visible") 
        { 
        //alert("hidden");
        markerMenuDiv.style.visibility = "hidden";  
        }
        else
        {
        //alert("visible");
        markerMenuDiv.style.visibility = "visible";  
        }
        markerMenu = new MarkerMenu(markerMenuDiv);
         });
		 
		 markerGroup.push(marker);
         return marker;
        }
        
        function MarkerWarpper(markerType, marker)
        {
          this.markerType = markerType;
          this.marker = marker;
        }
        
        function ProcessSetMarker()
        {
            switch (selectedMarker.markerType)
        {
            case 'start':
			
             startMarkerGroup.push(selectedMarker.marker);
             
                break;
            case 'end':
			
             endMarkerGroup.push(selectedMarker.marker);
           
                break;
            case 'waypoint':
             wayptsMarkerGroup.push(selectedMarker.marker);
             
             google.maps.event.addListener(selectedMarker.marker, 'dragend', function(){
             var _waypointMarker = {
            location: dragStartPos,
            stopover:true};

              var _index;
              for (var i=0; i < waypts.length; i++) 
		     {

             if (waypts[i].location === dragStartPos) {
                 _index = i;
                }
             }
                 if(_index>=0)
                 {
                 selectedPolyline.setMap(null);
                    waypts.removeAt(_index);
                    waypts.push({
                    location: selectedMarker.marker.getPosition(),
                    stopover:true});
                    calcRoute(false);
                  
                 }
             });
                break;
            case 'polylinemarker':
             polylineMarkerGroup.push(selectedMarker.marker);
             marker.setIcon('../static/images/node.gif');
                break;
            default:
             markerGroup.push(selectedMarker.marker);
			 break;
        }
		//alert('finish process');
        }
        
   //   google.maps.event.addDomListener(window, 'load', initialize);
	
	/*  Set map hover effect   */
	  $(document).ready(function(){
	  	var panel = $('#photoBarContent'); 
		var panel2 = $('#photoBarBg'); 
		var panel3 = $('#tripBarContent'); 
		var panel4 = $('#tripBarBg'); 

      $('#map-canvas').mouseenter(function(){
	  	clearTimeout($(this).data('timeoutId'));
		clearTimeout($('#photoBarBg').data('timeoutId'));
		clearTimeout($('#tripBarBg').data('timeoutId'));
        panel.show();
	    panel2.show();
		panel3.show();
	    panel4.show();
	 //  panel.fadein('slow');
	 //  panel2.fadein('slow');
       });
	   
	    $('#photoBarBg').mouseenter(function(){
	  	clearTimeout($('#map-canvas').data('timeoutId'));
		clearTimeout($(this).data('timeoutId'));
       });
	   
	    $('#photoBarContent').mouseenter(function(){
	  	clearTimeout($('#map-canvas').data('timeoutId'));
		clearTimeout($('#photoBarBg').data('timeoutId'));
		clearTimeout($('#tripBarBg').data('timeoutId'));
       });
	   
	   $('#tripBarBg').mouseenter(function(){
	  	clearTimeout($('#map-canvas').data('timeoutId'));
		clearTimeout($(this).data('timeoutId'));
       });
	   
	    $('#tripBarContent').mouseenter(function(){
	  	clearTimeout($('#map-canvas').data('timeoutId'));
		clearTimeout($('#photoBarBg').data('timeoutId'));
		clearTimeout($('#tripBarBg').data('timeoutId'));
       });
	   
	
	   
	    $('#photoBarBg').mouseleave(function(){
	  	var timeoutId = setTimeout(function(){ panel.hide(); panel2.hide();panel3.hide(); panel4.hide();}, 650);
		$(this).data('timeoutId', timeoutId); 
       });
	   
	  $('#map-canvas').mouseleave(function(){
	  var timeoutId = setTimeout(function(){ panel.hide(); panel2.hide();panel3.hide(); panel4.hide();}, 650);
      $(this).data('timeoutId', timeoutId); 
       });
	   
	    $('#tripBarBg').mouseleave(function(){
	  	var timeoutId = setTimeout(function(){ panel.hide(); panel2.hide();panel3.hide(); panel4.hide();}, 650);
		$(this).data('timeoutId', timeoutId); 
       });
	   
	   
	   //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
	
	$('input[name=invite_friend]').click(function(e) {  
      e.preventDefault();  
	  
	  $('#social-close-modal').show()
        var id = '#social_tools';  
       
        $('#mask4').css({'width':maskWidth,'height':maskHeight});  
        $('#mask4').fadeIn();             
		$(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
		set_social_section('tripshare');
 });
 
   //if close button is clicked  
    $("#social-close-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#social_tools').hide();
		 $("#social-close-modal").hide();
		//document.getElementById('find_friends_form').reset();
		
    }); 
});

function set_social_section(section) {
	    
		var value = $("#social_section_value").val();
		if (value=="")
		{
			value = "tripshare";
		}
		
		if (section == 'facebook') {
			$.getJSON('/getfriends_on_facebook', function(response){
				//alert(response);
			$('.social_list > .on').removeClass('on');
			//alert($('#content_tripshare .invitefriends.person > .on').attr('sid'));
			$('.invitefriends.person').each(function(index) {
                     if($(this).hasClass('on'))
					 {
					 	$(this).removeClass('on');
					 }
             });
			$('#content_tripshare .invitefriends.person > .on').removeClass('on');
			$('.' + section + '-tab').addClass('on');
			$('#content_' + value).hide();
			$('#login_' + value).hide();
			$('#login_' + section).show();
			$('#content_' + section).show();
			$("#social_section_value").val(section);
			});
		}
		else {
			$('.social_list > .on').removeClass('on');
			$('.invitefriends.person').each(function(index) {
                     if($(this).hasClass('on'))
					 {
					 	$(this).removeClass('on');
					 }
             });
			$('.' + section + '-tab').addClass('on');
			$('#content_' + value).hide();
			$('#login_' + value).hide();
			$('#login_' + section).show();
			$('#content_' + section).show();
			$("#social_section_value").val(section);
			$('.invite_text').val("I create this trip here for you to join! " + window.location.href);
		}
        }



$(".comment form").live("submit",function(a){a.preventDefault();var c=$(this).parents("li.feed"),
a=c.find(".commentBody"),e=c.data("feedId"),b=a.val();a.val("");$.post(URI+"overview/comment",{id:e,comment:b},function(a){a.status=="ok"&&c.find(".comment.post").before(a.html)},"json")});
$("li.end ul.BUTTON li").click(function(){if(!a.loading)a.loading=!0,$.post(URI+"overview/loadMore",{activity_filter:$("#activity_filter").val(),skip:a.skip,date:$(" li.date:last p").text()},function(d){if(d.status=="ok")d.html==""?$("li.end").remove():$("li.end").before(d.html),a.skip+=a.limit,a.loading=!1},"json")});
$("a.comment").live("click",function(a){a.preventDefault();$(this).parents("li.feed").find("ul.comment_list").show().find(".commentBody").focus()});

$(document).ready(function() {   

  $('.post-button').live('click',function(e) { 
        e.preventDefault();
        var id = $('#typeId').val();
		var type = $('#type').val();
		var content  = $('.feedBody').val();
		var xsrf = $('input[name=_xsrf]').val();
		var message = {"content": content, "id":id , "_xsrf":xsrf, "type":type};
		//alert(jQuery.parseJSON(message));
		//$('.feedsUI li').last().before('<li class="feed item">'+content+'</li>');
		//$('.feedBody').val('');
		$.postJSON('/postfeed', message, function(response){
			
			if (response == 'not_authenticated') {
			
				loginpopup();
			}
			else {
				PostFeedResponse(response)
			}
			}, "text");	
});

  $('.post-comment-button').live('click',function(e) { 
        e.preventDefault();  
		var type = $('#type').val();
        var feed_id = $(this).parent('.feed').attr('data-feedid');
		alert(feed_id);
		var content  = $('.commentBody').val();
		alert(content);
		var xsrf = $('input[name=_xsrf]').val();
		alert(xsrf);
		var message = {"content": content, "feed_id":feed_id , "_xsrf":xsrf, "type":type};
		//alert(jQuery.parseJSON(message));
		
		$.postJSON('/postcomment', message, function(response){PostCommentResponse(response)}, "text");	
});


	

  
    $('.add_trip_site_remove').live('click',function(){
  	
  	 $(this).closest('li').remove();
	 $('.trip_site_add').show();
  });

$('.trip_site_add').live('click',function(){
  	
     $('.route').append('<li class="show_site" style="height:100px"><div class="site-details left" style="width:80% ;padding:5px"><div class="site-bar"><img class="picture small" src="/static/icon/site_icon2.png"><h2><input type="text" autocomplete="off" class="ac_input" geovalue="" id="site_input" name="site_input" placeholder="EX: New York, NY" class="site_input"><input class="site_input_date" value=""></h2></div><div class="action-bar"><div class="actions"><div class="site_action"><input type="button" class="trip_site_add_done action" value="update" targettype="site"><select class="site_ride"><option value="plane">by plane</option><option value="train">by train</option><option value="car">by car</option><option value="bus">by bus</option><option value="ferry">by ferry</option><option value="motorcycle">by motorcycle</option><option value="cycle">by bicycle</option><option value="walk">on foot</option><option value="other">other</option></select></div></div></div></div></div></div><div class="add_trip_site_move left" style="padding:5px"><a class="add_trip_site_remove"><img src="/static/images/delete_stop_16px.png" width="24" height="24"></a></div></li>')
     setAutoComplete('site_input');
	 $('.trip_site_add').hide();
  });
  

  
$('.trip_site_add_done').live('click',function(){
	if($('#groupId').val()=='new')
	{
		alert('Please assign a member to the group');
		$('.trip_site_add').show();
		return;
	}
	if($('#site_input').val()=='')
	{
		alert('Please input site name.');
		$('.trip_site_add').show();
		return;
	}
	if($('.site_input_date').val()=='')
	{
		alert('Please input date.');
		$('.trip_site_add').show();
		return;
	}
	
	var content = {"site_name":$('#site_input').val() ,"group_id": $('#groupId').val(),"date":$('.site_input_date').val(),"site_ride":$('.site_action select').val(),"trip_id":$('#tripId').val()};
	
	content._xsrf = getCookie("_xsrf");
	
	$.postJSON('/addsitetotrip',content, function (response){
		//alert('test');
		AddSiteResponse(response)
	});
	});
	
 //$(".site_ride").change(alert('test'));
$('.postUpdate').live('click',function(){
	
	//alert($(this).siblings('.site_note_action').attr('class'));
	$(this).siblings('.site_note_action').show();
	//alert($(this).closest('.site_details left').attr('class'));
});

$('.postUpdateDone').live('click',function(){
	if($('#groupId').val()=='new')
	{
		alert('Please assign a member to the group');
		return;
	}
	var message = {"note": $(this).closest('.site_note_action').children('.site_note_input').val(),"group_id":$('#groupId').val(),"trip_id":$('#tripId').val(),"site_name":$(this).parent().parent().find('.trip_sights').attr('value')};
	message._xsrf = getCookie("_xsrf");
	var object = $(this);
	$.postJSON('/postsitenote', message, function(response){if (response != '') {
		var _object = JSON.parse(response);
		var node = '<li class="note item left"><div class="left"><img alt="' + _object['from']['username'] + '" src="' + _object['from']['picture'] + '" title="' + _object['from']['username'] + '" class="picture medium"></div><div style="margin:5px 10px"><p class="message">' + _object['note'] + '</p><p class="details"><span class="timestamp">' + _object['date'] + '</span>  · <a class="remove_site_note" href="#">Remove</a></p></div></li>';
		object.parent().parent().children('.site_notes').append(node);
		//alert(object.parent().parent().children('.site_notes').attr('class'));
	}});
	
	$(this).closest('.site_note_action').hide();
});

$('.show_notes').live('click',function(){
	$(this).siblings('.hide_notes').show();
	$(this).hide();
	$(this).siblings('.site_notes').show();
});

$('.hide_notes').live('click',function(){
	$(this).hide();
	$(this).siblings('.show_notes').show();
	$(this).siblings('.site_notes').hide();
});

$('.trip_site_remove').live('click',function(){
	var message = {"trip_id":$('#tripId').val(),"group_id":$('#groupId').val(),"site_name":$(this).parent().parent().find('.trip_sights').attr('value')};
	message._xsrf = getCookie("_xsrf");
	var object = $(this);
	$.postJSON('/removesitefromtrip', message, function(response)
	{
		if (response == 'success') {
			
			object.closest('li').remove();
		}
	});
});

function AddSiteResponse(message)
{
		if(message!=null)
		{
		$('.route li').last().remove();
		var node;
		var sites = message.split("||||");
		
		
		$.each(sites, function(index, value) {
	         node = $(value);
            // node.hide();
		     
             $('ul.route').append(node);
             //node.show();
			 
         });	
		 }
	 $('.trip_site_add').show();
}

function PostCommentResponse(response){
	alert('post');
	response = JSON.parse(data);
	alert(response.username);
	var node = '<li class="comment item" data-commentid="' + _object['id'] + '"><a href="#"><img alt="' + _object['from']['username'] + '" src="' + _object['from']['picture'] + '" title="' + _object['from']['username'] + '" class="picture medium"></a>' + _object['body'] + '</li><div class="body"><p class="message"><a class="name" href="">' + _object['from']['username'] + '</a> ' + $('.commentBody').val() + '</p><p class="timestamp"> <a class="remove_comment" href="#">Delete</a></p></div>';
	$('.comment_list li').first().before(node);
	$('.commentBody').val('');
}



function PostFeedResponse(response){
	if (response != '') {
		var _object = JSON.parse(response);
		var node = '<li class="feed item left" data-feedid="' + _object['id'] + '"><div class="left"><img alt="' + _object['from']['username'] + '" src="' + _object['from']['picture'] + '" title="' + _object['from']['username'] + '" class="picture medium"></div><div class="right"><p class="message">' + _object['body'] + '</p><p class="details"><span class="timestamp">' + _object['date'] + '</span>  · <a class="comment" href="#">Comment</a></p></div></li>';
		$('.feedsUI li').first().before(node);
		
	}
	$('.feedBody').val('');
}

    $('.remove_comment').click(function(){
		var message = {"comment_id": $(this).parent('.feed').attr('data-feedid')};
		message._xsrf = getCookie("_xsrf");
		$.postJSON('/deletecomment', message, null, "text");	
	});
});



function set_trip_section(group_id)
{
	if(group_id=='default')
	{
		group_id = $('#groupId').val()
	}
	
	$.getJSON('/gettripgroupformap/'+group_id+'/'+$('#tripId').val(), function(response){
		if(response!='')
		{
			
			//var object = JSON.parse(response);
			//alert(JSON.stringify(object['title']))
			$('#dest_place').val(response);
			
			//init the map after change group
			initialize();
		}
	});
	
	$.getJSON('/gettripgroupforsite/'+group_id+'/'+$('#tripId').val(), function(message){
		if(message!='')
		{
			var node;
		    var sites = message.split("||||");
			$(".route").empty();
		
		    $.each(sites, function(index, value) {
	         node = $(value);
            // node.hide();
		     
             $(".route").append(node);
             //node.show(); 
         });	
		 }
	});
}


	$(function() {
		
		$('.droppable').live('click',function(){
			$(this).addClass('on').siblings().removeClass('on');
			var group_id = $(this).attr('sid');
			$('#groupId').val(group_id);
			set_trip_section(group_id);
		});
		
		
		$('.draggable').live('mouseover',function(){
            $(this).draggable({
			containment: $('.trip_member_tabs'),
			stack: $('.trip_member'),
			revert: true,
			zIndex:2700,
			start:function(event, ui){ 
		       $(this).parent().closest('li').addClass('on').siblings().removeClass('on');
			},
			stop: function(event, ui){ 
		 //      $('.new_trip_tab').hide();
               
			},
			drag: function(event, ui){ 
		 //      $('.new_trip_tab').show();
               
			}
		});
});

		$('.droppable').live('mouseover',function(){
    $(this).droppable({
			
			tolerance: 'touch',
			over: function() {
                      // $(this).css('backgroundColor', '#cedae3');
                },
            out: function() {
                     //  $(this).css('backgroundColor', '#a6bcce');
                },
			drop: function( event, ui) {
				var draggable = ui.draggable;
				var group_id = $(this).attr('sid');
				var object = $(this);
				//create a new group
				if ($(this).attr('class').indexOf('new_trip_tab') > -1) {
					
					var content = {'trip_id':$('#tripId').val(),'group_id':'new','user_id': draggable.attr('sid'),'_xsrf':getCookie('_xsrf')};
				    $.postJSON('/addgrouptotrip', content, function(response){
					if(response!='')
					{
					var node = '<li class="new_trip_tab droppable" sid=""><ul class="trip_member" style="display:block"><li class="trip_member_add_form_show"></li><li class="trip_member_add_form_remove"></li><li class="trip_member_add_form"><div class="trip_member_add_input_exterior"><input type="text" class="trip_member_add_input" default_value="add member" tip="add member" css_size="small" autocomplete="off" class="input_inactive_small"><div class="people_search_result_in_trip"><ul class="people_search_result_list"></ul></div></div><a class="trip_member_add_form_hide">done</a></li></ul></li>';
					object.removeClass('new_trip_tab');
					var temp = draggable;
					//alert(draggable.parent('ul').children('li').size());
					if(draggable.parent('ul').children('li').size()<4)
					{
						draggable.parent('ul').children('.trip_member_add_form_show').before('<li class="readme"><span>Empty Group</span></li>');
					}
					object.addClass('on').siblings().removeClass('on');
					if(object.find('ul').find('.readme'))
					{
						object.children('li').remove('.readme');
					}
					draggable.remove();
					object.children('ul').children('.trip_member_add_form_show').before(temp);
					object.parent('ul').append(node);
					}
					});
					
				}
				//drag user to existed group
				else {
					var temp = draggable;
					var content = {'trip_id':$('#tripId').val(),'group_id': group_id,'user_id': draggable.attr('sid'),'_xsrf':getCookie('_xsrf')};
					$.postJSON('/addgrouptotrip', content, function(response){
					if(response!='')
					{
					if(draggable.parent('ul').children('li').size()<5)
					{
						draggable.parent('ul').children('.trip_member_add_form_show').before('<li class="readme"><span>Empty Group</span></li>');
					}
					object.addClass('on').siblings().removeClass('on');
					draggable.remove();
					if(object.find('ul').find('.readme'))
					{
						object.children('li').remove('.readme');
					}
					object.children('ul').children('.trip_member_add_form_show').before(temp);
					}
					});
				}
			}
		});
});
		$(".draggable").draggable({
			containment: $('.trip_member_tabs'),
			stack: $('.trip_member'),
			revert: true,
			zIndex:12700,
			start:function(event, ui){ 
		       $(this).parent().closest('li').addClass('on').siblings().removeClass('on');
			},
			stop: function(event, ui){ 
		     //  $('.new_trip_tab').hide();
               
			},
			drag: function(event, ui){ 
		     //  $('.new_trip_tab').show();
			}
		});
		
		$(".droppable").droppable({
			
			tolerance: 'touch',
			over: function() {
                      // $(this).css('backgroundColor', '#cedae3');
                },
            out: function() {
                     //  $(this).css('backgroundColor', '#a6bcce');
                },
			drop: function( event, ui) {
				var draggable = ui.draggable;
				var group_id = $(this).attr('sid');
				var object = $(this);
				if ($(this).attr('class').indexOf('new_trip_tab') > -1) {
					
					var content = {'trip_id':$('#tripId').val(),'group_id':'new','user_id': draggable.attr('sid'),'_xsrf':getCookie('_xsrf')};
				    $.postJSON('/addgrouptotrip', content, function(response){
					if(response!='')
					{
					var node = '<li class="new_trip_tab droppable"><ul class="trip_member" style="display:block"><li class="trip_member_add_form_show"></li><li class="trip_member_add_form_remove"></li><li class="trip_member_add_form"><div class="trip_member_add_input_exterior"><input type="text" class="trip_member_add_input" default_value="add member" tip="add member" css_size="small" autocomplete="off" class="input_inactive_small"><div class="people_search_result_in_trip"><ul class="people_search_result_list"></ul></div></div><a class="trip_member_add_form_hide">done</a></li></ul></li>';
					object.removeClass('new_trip_tab');
					var temp = draggable;
					if(draggable.parent('ul').children('li').size()<4)
					{
						draggable.parent('ul').children('.trip_member_add_form_show').before('<li class="readme"><span>Empty Group</span></li>');
					}
					object.addClass('on').siblings().removeClass('on');
					if(object.find('ul').find('.readme'))
					{
						object.children('li').remove('.readme');
					}
					draggable.remove();
					object.children('ul').children('.trip_member_add_form_show').before(temp);
					object.parent('ul').append(node);
					}
					});
				}
				else {
					var temp = draggable;
					var content = {'trip_id':$('#tripId').val(),'group_id': group_id,'user_id': draggable.attr('sid'),'_xsrf':getCookie('_xsrf')};
					$.postJSON('/addgrouptotrip', content, function(response){
					if(response!='')
					{
					if(draggable.parent('ul').children('li').size()<4)
					{
						draggable.parent('ul').children('.trip_member_add_form_show').before('<li class="readme"><span>Empty Group</span></li>');
					}
					object.addClass('on').siblings().removeClass('on');
					if(object.find('ul').find('.readme'))
					{
						object.children('li').remove('.readme');
					}
					draggable.remove();
					object.children('ul').children('.trip_member_add_form_show').before(temp);
					}
					});
				}
				
			}
		});
	});
   
	
$('.trip_member').live('mouseover',function(){
	trip_member_add_show(true, $(this));
});
$('.trip_member').live('mouseleave',function(){
	trip_member_add_show(false, $(this));
});
var trip_member_add_form_displayed;

//var $tabs = $('.conv-head').tabs();
//var selected  = $tabs.tabs('option', 'selected');
function trip_member_add_show(status, object)
{
    
    if(!object.children('.trip_member_add_form_show').length) { return; }
    
    if(status && !trip_member_add_form_displayed)
    {
        object.children('.trip_member_add_form_show').show();
		object.children('.trip_member_add_form_remove').show();
    }
    else
    {
        object.children('.trip_member_add_form_show').hide();
		object.children('.trip_member_add_form_remove').hide();
    }
}

$('.trip_member_add_form_remove').live('click',function(){
	
	var content = {
			"trip_id": $('#tripId').val(),
			"group_id": $(this).parents('.droppable').attr('sid'),
			"_xsrf": getCookie("_xsrf")
		};
	var object  = $(this);
	$.postJSON('/removegroupfromtrip', content, function(response){
		if (response!='')
		{
			object.closest('.trip_member').remove();
			$('#groupId').val('default');
		}
	});
	
});

$('.trip_member_add_form_show').live('click',function(){
	trip_member_add_form_displayed = true;
	$(this).closest('.trip_member').show();
    $(this).hide(); 
    $(this).siblings('.trip_member_add_form').show(); 
	var plan_category_as =  $(this).closest('.trip_member').find('.member_button_add');
        
        if(plan_category_as)
        {
            plan_category_as.addClass('member_button_a_edit_active');
        }
        
        var plan_category_removes =  $(this).closest('.trip_member').find('.member_button_remove');
        
        if(plan_category_removes)
        {
            plan_category_removes.show();
        }

        setTimeout("$('.trip_member_add_input').focus();", 50);
});


$('.trip_member_add_form_hide').live('click',function(){
	 trip_member_add_form_displayed = false;
        
        $(this).closest('.trip_member_add_form').hide(); 
        $(this).parent().siblings('.trip_member_add_show').show();
        
        // Show remove buttons for each category
		
		//alert($(this).siblings().children('.trip_member_add_input').attr('class'));
		
		if($(this).siblings().children('.trip_member_add_input').val() != '')
		{
			//alert($(this).parents('.trip_member').children('.trip_member_add_input').val());
	          $(this).siblings().children('.trip_member_add_input').val('');
		//alert('test1');
		}
		else
		{
		var plan_category_removes = $(this).parents('.trip_member').children('.draggable').children('.member_button_remove');
		
        if(plan_category_removes)
        {
		//	alert('test');
            plan_category_removes.hide();
        }
		}
});

$('.add_user_to_trip').live('click',function()
{
	//alert($(this).parents('.droppable').attr('sid'));
	if ($(this).parents('.droppable').attr('sid') == '') {
		var content = {
			"trip_id": $('#tripId').val(),
			"group_id": 'new',
			"user_id": $(this).attr('sid'),
			"_xsrf": getCookie("_xsrf")
		};
		
	}
	else {
		var content = {
			"trip_id": $('#tripId').val(),
			"group_id": $(this).parents('.droppable').attr('sid'),
			"user_id": $(this).attr('sid'),
			"_xsrf": getCookie("_xsrf")
		};
	}
	var object = $(this);
	$.postJSON('/addusertotrip', content, function(response){
		if(response=='existed')
		{
			alert('User already exist in this trip.');
		}
		else if (response != '') {
			var user = JSON.parse(response);
			if(user.hasOwnProperty('group_id'))
			{
				
				object.parents('.droppable').attr('sid',user['group_id']);
				object.parents('.droppable').removeClass('new_trip_tab');
				object.parents('.droppable').children('li').remove();
			}
			
			var node = $('<li><span class="headpichold"><a style="cursor:pointer;" href="/people/'+user["slug"]+'"><img class="picture medium" alt="'+user['username']+'"  src="'+user['picture']+'" ></a></span><div sid="'+user['user_id']+'" class="member_button_remove" style="display:block"></div></li>');
	       // alert(object.parents('.trip_member').find('.trip_member_add_form_show').attr('class'));
			node.insertBefore(object.parents('.trip_member').find('.trip_member_add_form_show'));
			
		    trip_member_add_form_displayed = false;
        
		
        object.parents('.trip_member_add_form').hide();
        object.parents('.trip_member_add_form').siblings('.trip_member_add_form_show').show();
        
        // Show remove buttons for each category
		if(object.parents('.trip_member_add_form').children('.trip_member_add_input').val() != '')
		{
	          object.parents('.trip_member_add_form').children('.trip_member_add_input').val('');
		}
		else
		{
		var plan_category_removes = object.parents('.trip_member_add_form').siblings().children('.member_button_remove');
        
        if(plan_category_removes)
        {
            plan_category_removes.hide();
        }
		}
			alert('User has been added to the trip.');
			return false;
		}
		else
		{alert('failed');}
	});
});

function trip_member_add_form_toggle(display,object)
{ 
object = $(object);
    if(display)
    {
        trip_member_add_form_displayed = true;
        
        object.closest('.trip_member').show();
        object.hide(); 
        object.siblings('#trip_member_add_form').show(); 
        
        // Show remove buttons for each category
        var plan_category_as =  object.closest('.trip_member').find('.member_button_add');
        
        if(plan_category_as)
        {
            plan_category_as.addClass('member_button_a_edit_active');
        }
        
        var plan_category_removes =  object.closest('.trip_member').find('.member_button_remove');
        
        if(plan_category_removes)
        {
            plan_category_removes.show();
        }

        setTimeout("$('.trip_member_add_input').focus();", 50);
    }
    else
    { 
        trip_member_add_form_displayed = false;
        
        object.siblings('#trip_member_add_form').hide(); 
        object.show();
        
        // Show remove buttons for each category
		if($('.trip_member_add_input').val() != '')
		{
	          $('.trip_member_add_input').val('');
		}
		else
		{
		var plan_category_removes = object.closest('.trip_member').find('.member_button_remove');
        
        if(plan_category_removes)
        {
            plan_category_removes.hide();
        }
		}
    }
}

function ShowTripmember(member)
{
	if(member!='')
	{
	var node = $('<li class="member_button"><a class="member_button_add member_button_a_edit_active" rel="member" href="/member">'+member+'</a><div class="member_button_remove" style="display: block; "></div></li>');
	node.insertBefore($('.trip_member_add_show'));
	$('.trip_member_add_input').val('');
	 
    }
	var plan_category_removes = $('.trip_member').find('.member_button_remove');
        
        if(plan_category_removes)
        {
            plan_category_removes.hide();
        }
	
}

/*invite friend*/
$(document).ready(function() {    

	$('.invitefriends.person').live('click',function(){
		
		$(this).toggleClass('on');
		
	});
				
	$('input[name=facebookinvite]').live('click',function(){
	    var group_ids = '';
		 $('.person.on').each(function(index) {
			group_ids += $(this).attr('sid')+'test';
		 });
		// alert(group_ids);
	    var content = {'_xsrf':getCookie('_xsrf'), 'trip_id':$('#tripId').val(), 'group_ids':group_ids};
		 $.postJSON('/invite_on_facebook', content, function(response){
		 	$('#mask4').hide();  
		    $('#social_tools').hide();
		   // $('#merge_group_list').empty();
		 });
	});	
	
	$('input[name=tripshareinvite]').live('click',function(){
	    var group_ids = '';
		 $('.person.on').each(function(index) {
			group_ids += $(this).attr('sid')+'test';
		 });
		 //alert(group_ids);
	    var content = {'_xsrf':getCookie('_xsrf'), 'trip_id':$('#tripId').val(), 'group_ids':group_ids};
		
		 $.postJSON('/sendtripshareinvite', content, function(response){
		 	$('#mask4').hide();  
		    $('#social_tools').hide();
		   // $('#merge_group_list').empty();
		 });
	});	
	
	});
	 