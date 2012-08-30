/* Copyright 2011 guideShare */

/* export calendar slide */
$(document).ready(function() {    
  
    $('.downloadpdf').click(function(e) {
		var content = {'_xsrf':getCookie('_xsrf'), 'trip_id':$('#tripId').val()};
		$.postJSON('/downloadpdf', content, function(response){
			
			});
		
		
		});  
					 
   
	})  