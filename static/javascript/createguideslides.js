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
      
	 $('#create_guide_step_1').animate({right: winW});
	  $('#mask4').hide();  
	  $('#closeguide-modal').hide();
	  
	  var formData = $('#create_guide_form').guideformToDict();
	  var _formData = JSON.stringify(formData, null, '\t');
	  var content = {'_xsrf': getCookie("_xsrf"), 'data' : _formData};
      var disabled = $('#create_guide_form').find("input[type=submit]");
      disabled.disable();
	  
	  $.postJSON('/createguide', content, function(response){
			    ShowCreateguideResponse(response);
			});	
	 
	  document.getElementById("create_guide_form").reset();	
	  disabled.enable();
 });
 
 jQuery.fn.guideformToDict = function(){
     var fields = this.serializeArray();
	 var destinations = []
	 var json = {};
	 json ['title'] = fields[1].value;
	 
	 for (var i = 2; i < fields.length; i++) {
	 destinations.push({
	 	'dest': fields[i].value,
	 	'day': fields[i + 1].value
	 })
	
	  i++;
	 }
	 json['destinations'] = destinations;
	 if (json.next) delete json.next;
	 return json;
 }
 
 function ShowCreateguideResponse(response)
 {
 	//alert(response);
 }
    
	  $('a[class=add_another_destination]').live("click",function()
  {
  	   //alert('guide');
	   $('.add_another_box').remove();
  	   $('.guide-row-wrapper').append('<li class="lh-tighter place-0-element multihop-row goodbox"><div class="left c1of5 tright" style="margin-top:2px;"><label for="place-0-text">Destination:</label></div><div class="left c2of5 tright"><input id="place-0-text" name="place-0-text" type="text" class="text destination margin-right-thin" value=""></div><div class="right " style="margin:0 50px 22px 12px;"><label>on <select name="day"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select> day</label></div></li><li class="add_another_box"><div class="right" style="margin-right:40px;"><a class="add_another_destination" href="#" >Add another destination on this guide</a></div></li>');
  });
})
	