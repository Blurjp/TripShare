
function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function checkUser(){
    var c = document.getElementById("subscribe_trip");
    if (c.getAttribute("sid")=="no")
    {
        return false;
    }
       return true;
}

$(document).ready(function() {

	$('.l_subscribe').click(function() {
		
		if (checkUser())
		{
		    alert("test1");
		xsrf = getCookie("_xsrf");
		var C=$('<form action="/subscribe_trip" method="post" ><input type="hidden" name="_xsrf" value='+xsrf+'><input type="hidden" name="sid" value={{trip.trip_id}}></form>');
		$("body").append(C);
		C.submit();
		}
		else
		{
		    
		  $('.login_modal').click(function(e) {  
		     
        //Cancel the link behavior  
        e.preventDefault();  
        //Get the A tag  
        var id = $(this).attr('href');  
      //alert("test2");
        //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
      
        //Set height and width to mask to fill up the whole screen  
        $('#mask2').css({'width':maskWidth,'height':maskHeight});  
          
        //transition effect       
        $('#mask2').fadeIn();      
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
		}
		
	});
	
	$('.l_unsubscribe').click(function(e) {
		e.preventDefault();  
		$('.settingdialogdiv').hide();  
		$dialog.dialog('open');
		// prevent the default action, e.g., following a link
		return false;
	});

});