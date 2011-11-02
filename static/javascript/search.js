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
		response = response.substring(1,response.length-1);
		response = response.replace(/\], \[/g,",");
		//alert(response);
		var _object = JSON.parse(response);
		
		for (var i = 0; i < _object.length; i++) {
			
		if(_object[i]['search_type']=='person')
		{
			$('.all_search_result ul').append('<li><a class="person_search"><span class="user_image"><img class="picture medium" title=' + _object[i]['username'] + ' alt=' + _object[i]['user_id'] + ' src=' + _object[i]['picture'] + '></span><span class="user_name">' + _object[i]["username"] + '</span></a></li><div style="clear:both"></div>');
		}
		else if(_object[i]['search_type']=='guide')
		{
			
			$('.all_search_result ul').append('<li><a class="guide_search"></span><span class="guide_name">' + _object[i]["title"] + '</span></a></li><div style="clear:both"></div>');
	
		}
		else if(_object[i]['search_type']=='trip')
		{
			$('.all_search_result ul').append('<li><a class="trip_search"></span><span class="trip_name">' + _object[i]["title"] + '</span></a></li><div style="clear:both"></div>');
	
		}
		else if(_object[i]['search_type']=='site')
		{
			$('.all_search_result ul').append('<li><a class="site_search"></span><span class="site_name">' + _object[i]["site_name"] + '</span></a></li><div style="clear:both"></div>');
		}
		}
		$('.all_search_result ul').show();
	}
}	
	
