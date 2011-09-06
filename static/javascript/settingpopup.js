/* Copyright 2010 TripShare */

$(document).ready(function() {    
  
    $('#loadingimage').ajaxStart(function() {
        $(this).show();
    }).ajaxStop(function() {
        $(this).hide();
    })
  
    //select all the a tag with name equal to usersetting  
    $('.l_editprofile').click(function(e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        //Get the A tag  
        var id = $(this).attr('href');  
      
        //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
      
        //Set height and width to mask to fill up the whole screen  
        $('#mask').css({'width':maskWidth,'height':maskHeight});  
          
        //transition effect       
        $('#mask').fadeIn();
      
        //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
                
        //Set the popup window to center  
        $(id).css('top',  winH/2-$(id).height()/2);  
        $(id).css('left', winW/2-$(id).width()/2);  
      
        //transition effect  
        $(id).fadeIn();   
    });  
      
    //if close button is clicked  
    $('.settingdialogdiv .closesetting').click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask, .settingdialogdiv').hide();  
    }); 
	
	
	//if user setting button is clicked
	 $('.settingdialogdiv .closesetting').click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
       
     });       
      

	   /* search member for trip  */
	   
	    $('input.searchmember').click(function (e) {  
        //Cancel the link behavior
        e.preventDefault();  
        $('#close-searchmember').show();
		
		 //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
        //Get the A tag  
        var id = $(this).attr('href');  
        //Set height and width to mask to fill up the whole screen  
       
          
        //transition effect       
        $('#mask5').fadeIn();    
		 
		 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
		
		 //Set the popup window to center  
        $(id).css('top',  winH/2-$(id).height()/2);  
        $(id).css('left', winW/2-$(id).width()/2);  
      
        //transition effect  
        $(id).fadeIn();
    }); 
	
	$("#close-searchmember").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask5').hide();  
		$('#search_member_pop').hide();
		$('.people_search_result').empty();
		
    });     
	
	
	/*  Set user icon hover effect   */ 
      $('.headpichold img').mouseenter(function(){
	  	 var position = $(this).position();
		 $('<div id="tooltip"><div id="tooltip_interior"><div>'+ $(this).attr('alt')+'</div><div id="tooltip_micro"></div></div></div>').appendTo("body");
		 $('#tooltip').css({left:position.left, top: position.top+110});
	  });

      $('.headpichold img').mouseleave(function(){
	  	 $('#tooltip').remove();
	  });
	  
	 
      $('.avatar img').live('mouseenter', function(){
	  	 var position = $(this).position();
		 $('<div id="tooltip"><div id="tooltip_interior"><div>'+ $(this).attr('alt')+'</div><div id="tooltip_micro"></div></div></div>').appendTo("body");
		 $('#tooltip').css({left:position.left+95, top: position.top+810, });
	  });

      $('.avatar img').live('mouseleave', function(){
	  	 $('#tooltip').remove();
	  });

});  


