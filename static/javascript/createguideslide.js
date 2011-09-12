/* Copyright 2011 guideShare */

/* create guide slide */
$(document).ready(function() {    
  
     //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
					 
    //select all the tag with name equal to createguide
    $('a[name=createguide]').click(function(e) {  
        
		//each time before create guide, clear all the cache information for 
		
		$('#destinations_for_guide').val('');
		
        e.preventDefault();
		$('#closeguide-modal').show();
		
        //Get the A tag  
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
    $("#closeguide-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#create_guide_step_1').hide();
    }); 



	    /* Click finish button */
  $('input[name=create_guide_finish]').click(function(e) {  
      e.preventDefault();  
      
	
	  $('#mask4').hide();  
	  $('#closeguide-modal').hide();
	  
	  //var formData = form2object('create_guide_form');
	  
	  var formData = $('#create_guide_form').formToDict();
	  var _formData=JSON.stringify(formData, null, '\t');
      alert(_formData);
      var disabled = $('#create_guide_form').find("input[type=submit]");
      disabled.disable();
	  
	  $.postJSON('/createguide/'+_formData, formData, function(response){
			    ShowCreateguideResponse(response);
			});			
 });
 
 
 
 function ShowCreateguideResponse(response)
 {
 	//alert(response);
 }
    
})
	