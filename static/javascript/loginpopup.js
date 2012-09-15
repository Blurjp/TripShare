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
		$("form[name=signup_form]")[0].reset();
    });      
	
    $(".text").live("focus", function (e) {
		
		
	   $(this).children('label.prompted').hide();
	   var old = $(this).parents("ul").find(".active");
	   
	   old.removeClass('active');
	   if(old.children(".text").val()==null|| old.children(".text").val().length==0)
	  {
	  	//alert(old.children(".text").val());
	   	old.children('label.prompted').show();
	   }
	   $(this).closest("div.text-box").addClass("active");
	   $(this).closest('div.active').children('label.prompted').hide();

     });   
	 
	$('#new_person').submit(function() {
        
       //$("form[name=signup_form]")[0].reset();
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
		$("form[name=login_form]")[0].reset();
    }); 
	
      //if close tag is clicked  
    $("#close-login").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask2').hide();  
		$('#login').hide();
		$("form[name=login_form]")[0].reset();
    });   
      
      $('#modal-body1').focus(function (e) {
	   $(this).children('label.prompted').hide();
	   var old = $(this).parents("ul").find(".active");
	   old.removeClass('active');
	   if(old.children(".text").val()==null|| old.children(".text").val().length==0)
	   {
	  	//alert(old.children(".text").val());
	   	old.children('label.prompted').show();
	   }
	   $(this).closest("div.text-box").addClass("active");
	   $(this).closest('div.active').children('label.prompted').hide();

     });   

});  

	  /* login pop-up*/
function loginpopup(){
	
	$('#mask').hide(); 
		$('#modal-content').hide();
        //Get the A tag  
        var id = "#login";  
      
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
}


