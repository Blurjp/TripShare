/* Copyright 2010 TripShare */

$(document).ready(function() {    
  
    //select all the a tag with name equal to modal  
    $('a[name=createtrip]').click(function(e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        //Get the A tag  
        var id = $(this).attr('href');  
      
        //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
      
        //Set height and width to mask to fill up the whole screen  
        $('#mask3').css({'width':maskWidth,'height':maskHeight});  
          
        //transition effect       
        $('#mask3').fadeIn();      
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
      
    //if close button is clicked  
    $('.window .close').click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask3, .window').hide();  
    }); 
	
	
	//if create trip button is clicked
	 $('.window .close').click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
       // $('#mask, .window').hide();  
     });       
      
    //if mask is clicked  
    $('#mask3').click(function () {  
        $(this).hide();  
        $('.window').hide();  
    });           
      
});  
