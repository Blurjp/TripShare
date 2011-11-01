$(document).ready(function() {   

$('#search_all').focus(function() {
	if (this.value == '' || this.value == null) {
		$('.all_search_result ul').hide();
		$('.all_search_result ul').empty();
	}
});

$('input.add_member').keyup(function() {
   if (this.value == '' || this.value == null) {
       $('.all_search_result ul').empty();
   }
   else {
   	$.getJSON('/realtime_searchall/' + this.value, function(response){
   		ShowResultInSearchAllDropList(response);
   	});
   }
});

});

function ShowResultInSearchAllDropList(response)
{
	$('.search_dropdown_list ul').empty();
	if (response != '' && response != 'not found') {
		var _object = JSON.parse(response);
		for (var i = 0; i < _object.length; i++) {
		if(_object[i]['type']=='person')
		{
			$('.all_search_result ul').append('<li><a class="person_search"><span class="user_image"><img class="picture medium" title=' + _object[i]['username'] + ' alt=' + _object[i]['user_id'] + ' src=' + _object[i]['picture'] + '></span><span class="user_name">' + _object[i]["username"] + '</span></a></li>');
		}
		else if(_object[i]['type']=='guide')
		{
			$('.all_search_result ul').append('<li><a class="guide_search"></span><span class="guide_name">' + _object[i]["guide_name"] + '</span></a></li>');
	
		}
		else if(_object[i]['type']=='trip')
		{
			$('.all_search_result ul').append('<li><a class="guide_search"></span><span class="trip_name">' + _object[i]["trip_name"] + '</span></a></li>');
	
		}
			else if(_object[i]['type']=='tag')
		{
			$('.all_search_result ul').append('<li><a class="tag_search"></span><span class="tag_name">' + _object[i]["tag_name"] + '</span></a></li>');
	
		}
		}
		$('.all_search_result ul').show();
	}
}	
	
