$(document).ready(function() {   

$('#search_all').focus(function() {
	if (this.value == '' || this.value == null) {
		$('.all_search_result ul').hide();
		$('.all_search_result ul').empty();
	}
});

$('#search_all').keyup(function() {
   if (this.value == '' || this.value == null) {
       $('.all_search_result ul').empty();
   }
   else {
   	//alert('test');
   	$.getJSON('/realtime_searchall/' + this.value, function(response){
   		ShowResultInSearchAllDropList(response);
   	});
   }
});

});

function ShowResultInSearchAllDropList(response)
{
	$('.all_search_result ul').hide();
	$('.all_search_result ul').empty();
	if (response != '' && response != 'not found') {
		var _object = JSON.parse(response);
		alert(response);
		for (var i = 0; i < _object.length; i++) {
			alert(_object[i]['type'])
		if(_object[i]['type']=='person')
		{
			$('.all_search_result ul').append('<li><a class="person_search"><span class="user_image"><img class="picture medium" title=' + _object[i]['username'] + ' alt=' + _object[i]['user_id'] + ' src=' + _object[i]['picture'] + '></span><span class="user_name">' + _object[i]["username"] + '</span></a></li>');
		}
		else if(_object[i]['type']=='guide')
		{
			$('.all_search_result ul').append('<li><a class="guide_search"></span><span class="guide_name">' + _object[i]["title"] + '</span></a></li>');
	
		}
		else if(_object[i]['type']=='trip')
		{
			$('.all_search_result ul').append('<li><a class="trip_search"></span><span class="trip_name">' + _object[i]["title"] + '</span></a></li>');
	
		}
		else
		{
			$('.all_search_result ul').append('<li><a class="site_search"></span><span class="site_name">' + _object[i]["site_name"] + '</span></a></li>');
		}
		}
		$('.all_search_result ul').show();
	}
}	
	
