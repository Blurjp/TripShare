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
      $('.headpichold img').live('mouseenter', function(){
	  	 var position = $(this).position();
		 $('<div id="tooltip"><div id="tooltip_interior"><div>'+ $(this).attr('alt')+'</div><div id="tooltip_micro"></div></div></div>').appendTo("body");
		 $('#tooltip').css({left:position.left+150, top: position.top+300});
	  });

      $('.headpichold img').live('mouseleave', function(){
	  	 $('#tooltip').remove();
	  });
	  
	 
      $('.avatar img').live('mouseenter', function(){
	  	 var position = $(this).position();
		 $('<div id="tooltip"><div id="tooltip_interior"><div>'+ $(this).attr('alt')+'</div><div id="tooltip_micro"></div></div></div>').appendTo("body");
		 $('#tooltip').css({left:position.left+90, top: position.top+630, });
	  });

      $('.avatar img').live('mouseleave', function(){
	  	 $('#tooltip').remove();
	  });


      xsrf = getCookie("_xsrf");
	  var fileName;
	  var $dialog = $('<div class="pic_dialogdiv"></div>')
		.html('<div id="pic_dialog"><form name="upload_pic_form" action="/a/changepicture" method="post" onsubmit="return checkRequired(this)" enctype="multipart/form-data"><input type="hidden" name="_xsrf" value='+xsrf+'><div><img src="{{current_user["picture"]}}" alt="{{current_user["username"]}}" class="picture large"></div><div style="margin-top: 1em"><input type="file" size="40" name="picture" value="/tmp/test.gif" id="pictureupload"></div><div class="buttons"><input type="submit" value="Upload picture" class="save"><a href="#" class="l_closedialog">Cancel</a></div></form></div>')
		.dialog({
			autoOpen: false,
			title: 'User Profile Picture',
			zIndex: 9999,
			open: function(event, ui) { $(".ui-dialog-titlebar-close").hide();}
		});

	$('.l_editpicture').click(function(e) {
		e.preventDefault();  
		//alert('test');
		$('.settingdialogdiv').hide();  
		$dialog.dialog('open');
		
		return false;
	});
	
	$('.l_closedialog').click(function() {
		
		$dialog.dialog('close');
		$('#mask2').hide();
		// prevent the default action, e.g., following a link
		return false;
	});
	
	$('input:file').change(function(e){
        fileName = $(this).val();
		 
    });

    $('upload_pic_form').submit(function(){
    //check name, you can do the rest... 
    if(fileName==''||fileName==null)
	{
		alert("Please select a picture for upload.");
		return false;
	}
    // if we get to this point send the form
    return true;
    });
	
	
});  

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
    }


