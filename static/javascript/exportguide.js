/* Copyright 2011 guideShare */

/* export guide slide */
$(document).ready(function() {    
  
     //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
					 
    //select all the tag with name equal to createguide
    $('.l_exportguide').click(function(e) {  

		$.getJSON('/gettrips', function(response) {
		ShowTripInGuideList(response);
		
    }); 
		$('#closeexportguide-modal').show();
        //var id = $(this).attr('href'); 
		var id = '#export_guide_step_1';
        $('#mask4').css({'width':maskWidth,'height':maskHeight});  
        
        $('#mask4').fadeIn();             
		$(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
    });  
      
    //if close button is clicked  
    $("#closeexportguide-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#export_guide_step_1').hide();
	
		document.getElementById('export_guide_form').reset();
    }); 

//	    /* Click finish button */
//  $('input[name=export_guide_finish]').click(function(e) {  
//      e.preventDefault();  
//      
//	 $('#export_guide_step_1').animate({right: winW});
//	  $('#mask4').hide();  
//	  $('#closeexportguide-modal').hide();
//	  
//      var tripid='';
//	  var content = {'_xsrf': getCookie("_xsrf"), 'tripid' : tripid};
//      var disabled = $('#export_guide_form').find("input[type=submit]");
//      disabled.disable();
//	  
//	  $.postJSON('/exportguide', content, function(response){
//			    ShowExportGuideResponse(response);
//			});	
//	 
//	  document.getElementById("create_guide_form").reset();	
//	  disabled.enable();
// });
 
 function ShowTripInGuideList(message) {
		if(message!=null)
		{
		var node;
		var trips = message.split("||||");
		$("#tripinexportlist").empty();
		
		$.each(trips, function(index, value) {
	         node = $(value);
             node.hide();
		     
             $("#tripinexportlist").append(node);
             node.show();
         });
		 }
		 else
		 {
		 	alert('You have no trip yet:)')
		 }
    }
 
 
 function ShowExportGuideResponse(response)
 {
 	 alert('guide export successfully!');
	 $('#mask4').hide();  
	 $('#export_guide_step_1').hide();
	 document.getElementById('export_guide_form').reset();
	 $.getJSON('/trip/'+response, function(res){});
	 //window.location = "http://www.google.com/"
 }
    
	$(".l_exporttotrip").live('click', function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
		var content = {'_xsrf': getCookie("_xsrf"), 'trip_id' : $(this).attr('sid'), 'guide_id': $('#guideId').val()};
    	$.postJSON('/exportguide', content, function(response){
        ShowExportGuideResponse(response);
			});	
		
		});
	
})
	