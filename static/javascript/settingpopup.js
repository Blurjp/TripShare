/* Copyright 2010 TripShare */
$(function() {
      
	  $('.avatar img').live('mouseenter', function(e){
	  	 //alert('test');
		 $('.avatar img[alt]').tooltip();
	  });
	  
	 
	  
	  $("#demo img[title]").tooltip();
	//$('.avatar img[alt]').tooltip();
	
	//$('.headpichold img[alt]').tooltip();
	
	
	
	
	
    });


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
	
	//$('.avatar img[alt]').tooltip();
	//$('.headpichold img[alt]').tooltip();
	

	
	  $('.guide_action span').live('mouseenter', function(e){
	  	//alert('tset');
	  	 var position = $(this).position();
		 var position = $(this).position();
		 var x = e.pageX;
		 var y = e.PageY;
		 //var dx= -30, dy= -tip.height()-10;
		 $('<div id="tooltip"><div id="tooltip_interior"><div>'+ $(this).parent().attr('alt')+'</div><div id="tooltip_micro"></div></div></div>').appendTo("body");
		 $('#tooltip').css('left', e.pageX+dx+'px').css('top', e.pageY+dy+'px');
	  });

      $('.guide_action span').live('mouseleave', function(){
	  	 $('#tooltip').remove();
	  });

	
	$('.trip_action').live("click",function(e) {
    type = $(this).attr('targettype');
	action = $(this).attr('actiontype');
	url = '/'+action+'_'+type;
	var content = {
			"trip_id": $(this).attr('sid'),
			"_xsrf": getCookie("_xsrf")
		};
	var object = $(this);
	$.postJSON(url, content, function(response){
		if (response == 'not_authenticated') {
		
			loginpopup();
		}
		else {
			object.children().toggleClass('un');
		}
			//SwapClass(object, action)
	});
	
	});
	
		$('.guide_action').live("click",function(e) {
    type = $(this).attr('targettype');
	action = $(this).attr('actiontype');
	url = '/'+action+'_'+type;
	var content = {
			"guide_id": $(this).attr('sid'),
			"_xsrf": getCookie("_xsrf")
		};
	var object = $(this);
	$.postJSON(url, content, function(response){
		object.children().toggleClass('un');
			//SwapClass(object, action)
	});
	
	});
	
});  


function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
    }
	
	function set_section(section, _url) {
	    var trips = null;
		$("#section_value").val(section);
        $('#tabs > .on').removeClass('on');
        $('#'+section + '-tab').addClass('on');
		var content = {'_xsrf':getCookie("_xsrf"), 'section':section,'type':'click'};
		$.postJSON(_url, content, function(response) {
        
			var History = window.History;
			if (History.enabled) {
				History.pushState({
					state: section
				}, null, _url);
			}
			ShowTrip(response);
		
        }
		); 
        }
	  
function ShowTrip(message) {
		if(message!=null)
		{
		var node;
		var trips = message.split("||||");
		$("#latest_trip").empty();
		
		$.each(trips, function(index, value){
	         node = $(value);
            // node.hide();
		     
             $("#latest_trip").append(node);
             //node.show();
			 
         });	
		 }
    }
	
function authenticate(url) {
	var content = {
			
			"_xsrf": getCookie("_xsrf")
		};
	    $.postJSON(url, content, function(json) {
    if (json.not_authenticated) {
        alert('Not authorized.');  // Or something in a message DIV
        return;
    }
    // Etc ...
});
}
	
	
function set_social_section(section) {
	    
		var value = $("#social_section_value").val();
		if (value=="")
		{
			value = "tripshare";
		}
       if (section == 'facebook') {
			$.getJSON('/getfriends_on_facebook', function(response){
				//alert(response);
			$('.social_list > .on').removeClass('on');
			$('.invitefriends.person').each(function(index) {
                     if($(this).hasClass('on'))
					 {
					 	$(this).removeClass('on');
					 }
             });
			$('.' + section + '-tab').addClass('on');
			$('#content_' + value).hide();
			$('#login_' + value).hide();
			$('#login_' + section).show();
			$('#content_' + section).show();
			$("#social_section_value").val(section);
			});
		}
		else {
			$('.social_list > .on').removeClass('on');
			$('.invitefriends.person').each(function(index) {
                     if($(this).hasClass('on'))
					 {
					 	$(this).removeClass('on');
					 }
             });
			$('.' + section + '-tab').addClass('on');
			$('#content_' + value).hide();
			$('#login_' + value).hide();
			$('#login_' + section).show();
			$('#content_' + section).show();
			$("#social_section_value").val(section);
			$('.invite_text').val("I create this trip here for you to join! " + window.location.href);
		}
        }
		
$(document).ready(function() { 

//Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
	
	
	
	$('a[name=find_friends]').click(function(e) {  
      e.preventDefault(); 
	  //alert($('#userid').val()) ;
	  if($('#userid').length==0)
	  {
	  	loginpopup();
	  }
	  else
	  {
	  $('#social-close-modal').show()
        var id = '#social_tools';  
       
        $('#mask4').css({'width':maskWidth,'height':maskHeight});  
        $('#mask4').fadeIn();             
		$(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
		set_social_section('tripshare');
	  }
 });
 
   //if close button is clicked  
    $("#social-close-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#social_tools').hide();
		$("#social-close-modal").hide();
		//document.getElementById('find_friends_form').reset();
		
    }); 
	
	$('a[name=l_changepayment]').click(function(e) {  
      e.preventDefault();  
	  $('#closepaymentsetting-modal').show()
        var id = '#payment_setting_step_1';  
       
        $('#mask4').css({'width':maskWidth,'height':maskHeight});  
        $('#mask4').fadeIn();             
		$(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
		
 });
 
     //if close button is clicked  
    $("#closepaymentsetting-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#payment_setting_step_1').hide();
		$("#closepaymentsetting-modal").hide();
		
		
    }); 
	
	
	
	
});
