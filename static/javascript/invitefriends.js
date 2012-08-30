/* Copyright 2012 TripShare */

$(document).ready(function() {    

	$('.invitefriends.person').live('click',function(){
		
		$(this).toggleClass('on');
		
	});
				
	$('input[name=facebookinvite]').live('click',function(){
	    var group_ids = '';
		 $('.person.on').each(function(index) {
			group_ids += $(this).attr('sid')+'test';
		 });
		// alert(group_ids);
	    var content = {'_xsrf':getCookie('_xsrf'), 'trip_id':$('#tripId').val(), 'group_ids':group_ids};
		 $.postJSON('/invite_on_facebook', content, function(response){
		 	$('#mask4').hide();  
		    $('#social_tools').hide();
		   // $('#merge_group_list').empty();
		 });
	});	
	
	$('input[name=tripshareinvite]').live('click',function(){
	    var group_ids = '';
		 $('.person.on').each(function(index) {
			group_ids += $(this).attr('sid')+'test';
		 });
		// alert(group_ids);
	    var content = {'_xsrf':getCookie('_xsrf'), 'trip_id':$('#tripId').val(), 'group_ids':group_ids};
		 $.postJSON('/sendtripshareinvite', content, function(response){
		 	$('#mask4').hide();  
		    $('#social_tools').hide();
		   // $('#merge_group_list').empty();
		 });
	});	
	
	});