var service = null;   
 
  
google.load('gdata', '2.x', {packages: ['maps'] });                
  google.load("jquery", "1.4.2");  
                 
google.setOnLoadCallback(onGoogleDataLoad);            
  

function onGoogleDataLoad() {
      service = new google.gdata.maps.MapsService('where2.0-example');      
      if(checkLogin()) {
        $('#login').text('Logout');
        addmap();
      }
    }

function login() {
      if(checkLogin()) {
        logout();
      } else {
        google.accounts.user.login('http://maps.google.com/maps/feeds');
      }
    }

    // Check whether the user is authenticated.
    function checkLogin() {
      return google.accounts.user.checkLogin('http://maps.google.com/maps/feeds');
    }

    // Log the user out.
    function logout() {
      google.accounts.user.logout();
    }  
  
 function addMap() 
{    var mapFeedUrl = 'http://maps.google.com/maps/feeds/maps/default/owned';    
service.getMapFeed(mapFeedUrl, function(feedRoot){    
var newMap = new google.gdata.maps.MapEntry();   
 newMap.setTitle(new google.gdata.atom.Text.create('Jason 2010'));  
  newMap.setSummary(new google.gdata.atom.Text.create('Seattle to San Francisco, and back'));   
 feedRoot.feed.insertEntry(newMap, function() {window.location.reload();}, errorHandler);  }, errorHandler);}   

 function errorHandler(e) {
      document.getElementById('errors').innerHTML = 'Error: '
          + (e.cause ? e.cause.statusText : e.message);
    }