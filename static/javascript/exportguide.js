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
    $('a[name=exportguide]').click(function(e) {  
        
		$('#closeexportguide-modal').show();
		
        var id = $(this).attr('href');  
        //Set height and width to mask to fill up the whole screen  
        $('#mask4').css({'width':maskWidth,'height':maskHeight});  
          
        //transition effect       
        $('#mask4').fadeIn();             
		//slide from right to left, Set the popup window to center  
		
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

	    /* Click finish button */
  $('input[name=export_guide_finish]').click(function(e) {  
      e.preventDefault();  
      
	 $('#export_guide_step_1').animate({right: winW});
	  $('#mask4').hide();  
	  $('#closeexportguide-modal').hide();
	  
      var tripid='';
	  var content = {'_xsrf': getCookie("_xsrf"), 'tripid' : tripid};
      var disabled = $('#export_guide_form').find("input[type=submit]");
      disabled.disable();
	  
	  $.postJSON('/exportguide', content, function(response){
			    ShowExportGuideResponse(response);
			});	
	 
	  document.getElementById("create_guide_form").reset();	
	  disabled.enable();
 });
 
 
 function ShowExportGuideResponse(response)
 {
 	//alert(response);
 }
    
})
	