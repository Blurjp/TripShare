/* Copyright 2011 guideShare */

/* import guide slide */
$(document).ready(function() {    
  
     //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
					 
    //select all the tag with name equal to createguide
    $('.importguide').click(function(e) {  
        
		content = {'_xsrf' : getCookie('_xsrf'),'trip_id':document.getElementById('tripId').value}
		$.postJSON('/getguidesforimport', content, function(response) {
		ShowGuideInList(response);
		
    }); 
		
		$('#closeimportguide-modal').show();
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
    $("#closeimportguide-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#import_guide_step_1').hide();
	
		document.getElementById('import_guide_form').reset();
    }); 

 
function ShowGuideInList(message)
{
		if(message!=null)
		{
		var node;
		var guides = message.split("||||");
		$("#guideinimportlist").empty();
		
		$.each(guides, function(index, value) {
	         node = $(value);
             node.hide();
		     
             $("#guideinimportlist").append(node);
             node.show();
         });
		 }
}
 
 
 function ShowimportGuideResponse()
 {
 	 alert('guide import successfully!');
	 $('#mask4').hide();  
	 $('#import_guide_step_1').hide();
	 document.getElementById('import_guide_form').reset();
 }
    
	$(".l_importguide").live('click', function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
		var content = {'_xsrf': getCookie("_xsrf"),'group_id': $('#groupId').val(), 'guide_id' : $(this).attr('sid'), 'trip_id': $('#tripId').val()};
    	$.postJSON('/importguidetotrip', content, function(response){
        ShowimportGuideResponse();
		AddSiteResponse(response);
			});	
		
		});
	
})
	