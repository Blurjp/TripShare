/* Copyright 2011 guideShare */

/* export calendar slide */
$(document).ready(function() {    
  
     //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
					 
    //select all the tag with name equal to createguide
    $('.exporttocalendarpop').click(function(e) {  
       
		$('#closeexportcalendar-modal').show();
		var id = '#export_calendar_step_1';
        $('#mask4').css({'width':maskWidth,'height':maskHeight});  
        $('#mask4').fadeIn();             
		$(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
		
    });
	
	  //if close button is clicked  
    $("#closeexportcalendar-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#export_calendar_step_1').hide();
    }); 
	
	$(".export_google_calendar").click(function()
	{
		var content = {'_xsrf':getCookie('_xsrf'), 'trip_id':$('#tripId').val(), 'type':'google'};
		 alert('test');
		$.postJSON('/exportcalendar', content, function(response){
			      alert('test');
				  $('#mask4').hide();  
		          $('#export_calendar_step_1').hide();
			});
	});
	})  