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
    $('.l_exportguide').live('click', (function(e) {  
        $('#guide_id_for_export').val($(this).attr('uid'));
		$.getJSON('/gettrips', function(response) {
		ShowTripInGuideList(response);
		
    }); 
		$('#closeexportguide-modal').show();
		var id = '#export_guide_step_1';
        $('#mask4').css({'width':maskWidth,'height':maskHeight});  
        
        $('#mask4').fadeIn();             
		$(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
    }));  