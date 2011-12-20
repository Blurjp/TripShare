$(document).ready(function() {   

$('#search_all').focus(function() {
	if (this.value == '' || this.value == null) {
		$('.all_search_result ul').hide();
		$('.all_search_result ul').empty();
	}
});

$('#search_all').keyup(function() {
   if (this.value == '' || this.value == null) {
       
	   $('.all_search_result ul').hide();
	   $('.all_search_result ul').empty();
   }
   else {
   	//alert('test');
   	$.getJSON('/realtime_searchall/' + this.value, function(response){
   		ShowResultInSearchAllDropList(response);
   	});
   }
});

$('.trip_member_add_input').live('focus',function() {
	//alert('test');
	if (this.value == '' || this.value == null) {
		$(this).siblings('.people_search_result_in_trip').children('ul').hide();
		$(this).siblings('.people_search_result_in_trip').children('ul').empty();
	}
});

$('.trip_member_add_input').live('keyup',function() {
	
   if (this.value == '' || this.value == null) {
       
	   $(this).siblings('.people_search_result_in_trip').children('ul').hide();
	   $(this).siblings('.people_search_result_in_trip').children('ul').empty();
   }
   else {
   	var object = $(this);
   	$.getJSON('/realtime_searchpeople/' + this.value, function(response){
   		ShowResultInSearchPeopleList(object,response);
   	});
   }
});

});

function ShowResultInSearchPeopleList(object,response)
{
	object.siblings('.people_search_result_in_trip').children('ul').hide();
	object.siblings('.people_search_result_in_trip').children('ul').empty();
	if (response != '' && response != 'not found') {
		
		var _object = JSON.parse(response);
		
		for (var i = 0; i < _object.length; i++) {
			
			object.siblings('.people_search_result_in_trip').children('ul').append('<li><a class="add_user_to_trip" sid="'+_object[i]["user_id"]+'"><span class="user_image"><img class="picture medium" title=' + _object[i]['username'] + ' alt=' + _object[i]['user_id'] + ' src=' + _object[i]['picture'] + '></span><span class="user_name">' + _object[i]["username"] + '</span></a></li><div style="clear:both"></div>');
		}
		object.siblings('.people_search_result_in_trip').children('ul').show();
	}
}



$('.member_button_remove').live('click',function()
{
	var content = {"trip_id":$('#tripId').val(), "user_id":$(this).attr('sid'), "_xsrf":getCookie("_xsrf")};
	var object = $(this);
	$.postJSON('/removeuserfromtrip', content, function(response){
		if (response == 'success') {
			object.closest('li').remove();
			alert('User has been removed from the trip.');
			return false;
		}
		else
		{alert('failed');}
	});
});

$('#search_clear_button').live('click', function (){
	
	 $('#search_all').val('');
	 $('#all_search_result_list').hide();
});

function ShowResultInSearchAllDropList(response)
{
	$('.all_search_result ul').hide();
	$('.all_search_result ul').empty();
	if (response != '' && response != 'not found') {
		response = response.substring(1,response.length-1);
		response = response.replace(/\], \[/g,",");
		//alert(response);
		var _object = JSON.parse(response);
		
		for (var i = 0; i < _object.length; i++) {
			
		if(_object[i]['search_type']=='person')
		{
			$('.all_search_result ul').append('<li><a class="person_search" href="/people/'+_object[i]["slug"]+'"><span class="user_image"><img class="picture medium" title=' + _object[i]['username'] + ' alt=' + _object[i]['user_id'] + ' src=' + _object[i]['picture'] + '></span><span class="user_name">' + _object[i]["username"] + '</span></a></li><div style="clear:both"></div>');
		}
		else if(_object[i]['search_type']=='guide')
		{
			
			$('.all_search_result ul').append('<li><a class="guide_search" href="/guide/'+_object[i]["title"]+'"></span><span class="guide_name">' + _object[i]["title"] + '</span></a></li><div style="clear:both"></div>');
	
		}
		else if(_object[i]['search_type']=='trip')
		{
			$('.all_search_result ul').append('<li><a class="trip_search" href="/trip/'+_object[i]["title"]+'"></span><span class="trip_name">' + _object[i]["title"] + '</span></a></li><div style="clear:both"></div>');
	
		}
		else if(_object[i]['search_type']=='site')
		{
			$('.all_search_result ul').append('<li><a class="site_search" href="/site/'+_object[i]["site_name"]+'"></span><span class="site_name">' + _object[i]["site_name"] + '</span></a></li><div style="clear:both"></div>');
		}
		}
		$('.all_search_result ul').show();
	}
}	
	
