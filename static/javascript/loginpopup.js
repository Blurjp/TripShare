/* Copyright 2010 TripShare */

/* sign up */
$(document).ready(function() {  
  
    //select all the a tag with name equal to modal  
    $('a[name=modal]').click(function(e) {  
        //Cancel the link behavior  
        e.preventDefault();  
		$('#mask2').hide(); 
		$('#login').hide();
        //Get the A tag  
        var id = $(this).attr('href');  
      
        //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
      
        //Set height and width to mask to fill up the whole screen  
        $('#mask').css({'width':maskWidth,'height':maskHeight});  
          
        //transition effect       
        $('#mask').fadeIn();      
      //  $('#mask').fadeTo("slow",0.8);    
      
        //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
                
        //Set the popup window to center  
        $(id).css('top',  winH/2-$(id).height()/2);  
        $(id).css('left', winW/2-$(id).width()/2);  
      
        //transition effect  
        $(id).fadeIn();   
      
    });  
      
     //if close tag is clicked  
    $("#close-signup").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask').hide();  
		$('#modal-content').hide();
		$( "signup_form" )[0].reset();
    });      
	
    $(".text").focus(function (e) {
	   var old = $(this).closest('.active');
	   old.removeClass("active");
	   old.children('label.prompted').show();
	   $(this).closest("div.text-box").addClass("active");
	   $(this).closest('div.active').children('label.prompted').hide();
	  
	 //  $(this).closest('div.text-box label.prompted').show();
	//  $(this).closest('div.active label.prompted').hide();
	//   $("div.text-box label[class='prompted']").show();
	 //  $("div.active label[class='prompted']").hide();
     });   
	 
	$('#new_person').submit(function() {
        
       $("signup_form")[0].reset();
    });      
});  


/* Log in */

$(document).ready(function() {    
   
    //select all the a tag with name equal to modal  
    $('a[name=modal2]').click(function(e) {  
        //Cancel the link behavior 
       
        e.preventDefault();  
		$('#mask').hide(); 
		$('#modal-content').hide();
        //Get the A tag  
        var id = $(this).attr('href');  
      
        //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
      
        //Set height and width to mask to fill up the whole screen  
        $('#mask2').css({'width':maskWidth,'height':maskHeight});  
          
        //transition effect       
        $('#mask2').fadeIn();      
     
      
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
    $('.window .close').click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask2, .window').hide(); 
		$( "login_form" )[ 0 ].reset();
    }); 
	
      //if close tag is clicked  
    $("#close-login").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask2').hide();  
		$('#login').hide();
		$( "login_form" )[ 0 ].reset();
    });   
      
        
      
});  

