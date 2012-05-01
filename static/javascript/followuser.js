$(document).ready(function() {    
  
     //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
					 
    //select all the tag with name equal to createguide
    $('.sendmessage').click(function(e) {  
       
		$('#closesendmessage-modal').show();
		var id = '#send_message_step_1';
        $('#mask4').css({'width':maskWidth,'height':maskHeight});  
        $('#mask4').fadeIn();             
		$(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
		
    });
	
	  //if close button is clicked  
    $("#closesendmessage-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#send_message_step_1').hide();
    }); 
	
	$(".postmessage").click(function()
	{
		var slugs = [];
		$('#user_tag li').each(function(index) {
			if (index < $('#user_tag li').length - 1) {
				
				slugs.push($(this).find('.tag_button_add').attr('sid'));
			}
        });
		
		var slugs_json = JSON.stringify({slugs: slugs});

		var content = {'_xsrf':getCookie('_xsrf'), 'slugs':slugs_json, 'message': document.getElementById("messagetextarea").value};
		
		$.postJSON('/postmessage', content, function(response){
			if (response == 'not_authenticated') {
			
				loginpopup();
			}
			else {
				alert('message sent.');
				$('#mask4').hide();
				$('#send_message_step_1').hide();
			}
			});
	});
	})  




$('.requestfriend').live('click',function(){
	
	 var content = {'_xsrf':getCookie('_xsrf'), 'user_id':$(this).attr('sid')};
	 $.postJSON('/requestfriend',content,function(response){
	 	if (response == 'not_authenticated') {
		
			loginpopup();
		}
		else {
			alert('Friend request send.');
		}
	 });
});	

$('.removefriend').live('click',function(){
	 var content = {'_xsrf':getCookie('_xsrf'), 'user_id':$(this).attr('sid')};
	 $.postJSON('/removefriend',content,function(response){
	 	alert('Friend has been removed.')
	 });
});	


$('.acceptfriend').live('click',function(){
	
	 var content = {'_xsrf':getCookie('_xsrf'), 'user_id':$(this).attr('sid'), 'type':'accept'};
	 $.postJSON('/confirmfriend',content,function(response){
	 	alert('Friend request accepted.')
	 });
});	

$('.declinefriend').live('click',function(){
	 var content = {'_xsrf':getCookie('_xsrf'), 'user_id':$(this).attr('sid'), 'type':'decline'};
	 $.postJSON('/confirmfriend',content,function(response){
	 	alert('Friend request declined.')
	 });
});	

$(document).ready(function() {    
  
     //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  

$('.acceptpayment').live('click',function(){
		$("#expense_value").val($(this).attr('expense'));
		
		$('#closepayment-modal').show();
		
		$('#notification_id').val($(this).attr('id'));
		 var content = {'_xsrf':getCookie('_xsrf'), 'id':$(this).attr('id')};
		$.postJSON('/getnotificationpaymentmethod', content, function(response){
	 	
		var id = '#pay_expense_step_1';
		//alert(response);
		response = jQuery.parseJSON(response);
		if(response["paypal"] == "paypal")
		{
			$("#pay_expense_step_1 ul").append('<li style="display:inline;padding-right:50px" class="PayPal"><img class="picture medium" src="https://www.paypal.com/en_US/i/logo/PayPal_mark_60x38.gif"><input type="radio" name="paymentgroup" class="paymentoption paypal_option"/></li>');
		}
		if(response["dwolla"] == "dwolla")
		{
			 $("#pay_expense_step_1 ul").append('<li style="display:inline;" class="dwolla"><img class="picture medium" src="/static/icon/dwolla.png"><input type="radio" name="paymentgroup" class="paymentoption dwolla_option"/> </li>');
		}
        $('#mask4').css({'width':maskWidth,'height':maskHeight});
        $('#mask4').fadeIn();             
		$(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
		
	 });
		
    });
	
       //if close button is clicked  
    $("#closepayment-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#pay_expense_step_1').hide();
		$("#pay_expense_step_1 ul").empty();
    }); 
	
    $('a[name=callpaymentapi]').live("click",function()
  {    
  var method;
  if ($('.paypal_option').is(':checked'))
  {
  	method = "paypal";
  }
  else if ($('.dwolla_option').is(':checked'))
  {
  	method = "dwolla";
  }
  
  var amount = $('#expense_value').val();
  var _url = document.URL;
  //alert(_url);
    var content = {'_xsrf':getCookie('_xsrf'), 'amount': amount, 'method':method,'url':_url, 'id':$('#notification_id').val()};
	 $.postJSON('/callpaymentapi',content,function(response){
	 	alert(response);
	 });
  	  
	    });


  $('input[name=paymentgroup]').live("click",function()
  {
  	countChecked();  
  });
  
  function countChecked() {
  var n = $(".paymentoption:checked").length;
  if(n<=0)
  {
 
  	$('a[name=makepayment]').addClass('disabled');
  }
  else
  {
  
  	 $('a[name=callpaymentapi]').removeClass('disabled');
  }
}
	 
	
});	


$('.declinepayment').live('click',function(){
	 var content = {'_xsrf':getCookie('_xsrf'), 'user_id':$(this).attr('userid'), 'id':$(this).attr('id'),'type':'decline'};
	 $.postJSON('/processexpense',content,function(response){
	 	alert('Payment request declined.')
	 });
});	

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
    }
	
jQuery.postJSON = function(url, args, callback) {
	
	//alert(_data);
    $.ajax({url: url, data: $.param(args), type: "POST", dataType:"text", success: function(data, textStatus) {if (callback) callback(data);}, error: function(response) {console.log("ERROR:", response)}});
	};
	
	//add as friend
function followpeople(_url) {

		$.getJSON('/followpeople/'+_url, function(response) {
			if (response == 'not_authenticated') {
			
				loginpopup();
			}
			else {
				alert(response.ToString());
			}
        });
        }	
		
function unfollowpeople(_url) {

		$.getJSON('/unfollowpeople/'+_url, function(response) {
        alert(response.ToString());
        }); 
        }
		
jQuery.getJSON = function(_url, callback) {
    $.ajax({
      url: _url, 
      success: function(response) {
	  	console.log("success:", response)
        if (callback) callback(response);
      }, 
	  error: function(response) {
        console.log("ERROR:", response)
		}
});
};

function new_window(b,c,d)
{var 
a=function(){if
(!window.open(b,'t','scrollbars=yes,toolbar=0,resizable=1,status=0,width='+c+',height='+d))
{document.location.href=b}
};
if(/Firefox/.test(navigator.userAgent))
{setTimeout(a,0)}
else
{a()}
}


var slug = $('#trip_slug').val();
var title = $('#trip_title').val();    

//Tweet share
function TwitterShare()
{
	var slug = $('#trip_slug').val();
var title = $('#trip_title').val(); 
	new_window('http://twitter.com/share?url=http://www.tripshare.cc/trip/'+slug+';text='+title+';via=tripshare', 550, 425);
}
//FB share
function FBShare()
{
	var slug = $('#trip_slug').val();
var title = $('#trip_title').val(); 
	
	new_window('http://www.facebook.com/sharer.php?u=http://www.tripshare.cc/trip/'+slug+';t='+title, 755, 425);
}
//Reddit share	
function RedditShare()
{
	var slug = $('#trip_slug').val();
var title = $('#trip_title').val(); 
	new_window('http://reddit.com/submit?url=http://www.tripshare.cc/trip/'+slug+';title='+title, 900, 720);
}
//Digg share
function DiggShare()
{
	var slug = $('#trip_slug').val();
    var title = $('#trip_title').val(); 
	
    new_window('http://digg.com/submit?phase=2&url=http://www.tripshare.cc/trip/'+slug+';title='+title, 1060, 655);
}
//Stumble share
function StumbleShare()
{
	var slug = $('#trip_slug').val();
var title = $('#trip_title').val(); 
	
    new_window('http://www.stumbleupon.com/submit?url=http://www.tripshare.cc/trip/'+slug+';title='+title, 1060, 500)
}


var user_tag_add_form_displayed;
function user_tag_add_show(status)
{
	
    if(!$('#user_tag_add_show').length) { return; } 
    
    if(status && !user_tag_add_form_displayed)
    {
        $('#user_tag_add_show').show();
    }
    else
    {
        $('#user_tag_add_show').hide();
    }
}

function user_tag_add_form_toggle(display)
{ 
    if(display)
    {
        user_tag_add_form_displayed = true;
        
        $('#user_tag').show();
        $('#user_tag_add_show').hide(); 
        $('#user_tag_add_form').show(); 
        
        // Show remove buttons for each category
        var plan_category_as = $('#user_tag').find('.tag_button_add');
        
        if(plan_category_as)
        {
            plan_category_as.addClass('tag_button_a_edit_active');
        }
        
        var plan_category_removes = $('#user_tag').find('.tag_button_remove');
        
        if(plan_category_removes)
        {
            plan_category_removes.show();
        }

        setTimeout("$('#user_tag_add_input').focus();", 50);
    }
    else
    { 
        user_tag_add_form_displayed = false;
        
        $('#user_tag_add_form').hide(); 
        $('#user_tag_add_show').show();
        
        // Show remove buttons for each category
		if($('#user_tag_add_input').val() != '')
		{
		var content ={'tag':$('#user_tag_add_input').val(),'user_id':$('#userId').val(),'_xsrf':getCookie('_xsrf')};
        $.postJSON('/add_user_tag', content, function(response){
			    ShowuserTag($('#user_tag_add_input').val());
		});
		}
		else
		{
		var plan_category_removes = $('#user_tag').find('.tag_button_remove');
        
        if(plan_category_removes)
        {
            plan_category_removes.hide();
        }
		}
    }
}

function ShowUserTag(tag)
{
	if(tag!='')
	{
	var node = $('<li class="tag_button"><a class="tag_button_add tag_button_a_edit_active" rel="tag" href="/tag">'+tag+'</a><div class="tag_button_remove" style="display: block; "></div></li>');
	node.insertBefore($('#user_tag_add_show'));
	$('#user_tag_add_input').val('');
	 
    }
	var plan_category_removes = $('#user_tag').find('.tag_button_remove');
        
        if(plan_category_removes)
        {
            plan_category_removes.hide();
        }
	
}
  

