/* Copyright 2011 guideShare */

/* import guide slide */
$(document).ready(function() {    
  
     //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
	
	$('.mergegrouppop').click(function(e) { 
	    var content = {'_xsrf':getCookie('_xsrf'), 'trip_id':$('#tripId').val()}; 
	    $.postJSON('/gettripgroupformerge', content, function(response){
	       
        if (response != null) {
			//showCircleView();
		    var groups = JSON.parse(response);
			
			for (var i = 0; i < groups.length; i++) 
			{
				
				if(groups[i]['group_id']=='new')
				{
					continue;
				}
				var classname = "group_"+i.toString();
				$('#merge_group_list').append('<ul class="trip_member '+classname+'" sid="' + groups[i]['group_id'] + '" style="position: relative;">');
				
				for (var x = 0; x < groups[i]['members'].length; x++) {
					
					$('#merge_group_list .trip_member.'+classname+'').append('<li><span class="headpichold"><img class="picture medium" src="'+groups[i]['members'][x]['picture']+'"></li>');
				}
			}
			
			$('#closemergegroup-modal').show();
			var id = $('#merge_group_step_1');
			//Set height and width to mask to fill up the whole screen  
			$('#mask4').css({
				'width': maskWidth,
				'height': maskHeight
			});
			
			//transition effect       
			$('#mask4').fadeIn();
			//slide from right to left, Set the popup window to center  
			
			$(id).show();
			$(id).css({
				right: $(id).width() - winW,
				top: winH / 2 - $(id).height() / 2
			});
			$(id).animate({
				right: winW / 2 - $(id).width() / 2
			});
			$(id).css("position", "fixed");
		}
		});
        });
		
	$('#merge_group_list .trip_member').live('click',function(){
		
		$(this).toggleClass('on');
		
	});
				
	$('a[name=mergegroup]').click(function(e) { 
	    var group_ids = '';
		 $('#merge_group_list .trip_member.on').each(function(index) {
		 	
		 	//group_ids.push($(this).attr('sid'));
			group_ids += $(this).attr('sid')+'test';
		 });
		// alert(group_ids);
	    var content = {'_xsrf':getCookie('_xsrf'), 'trip_id':$('#tripId').val(), 'group_ids':group_ids};
		 $.postJSON('/mergetripgroups', content, function(response){
		 	$('#mask4').hide();  
		    $('#merge_group_step_1').hide();
		    $('#merge_group_list').empty();
		 });
	});		
	 
    //select all the tag with name equal to createguide
    $('.importguide').click(function(e) {  
        
		content = {'_xsrf' : getCookie('_xsrf'),'trip_id':document.getElementById('tripId').value}
		$.postJSON('/getguidesforimport', content, function(response) {
		ShowGuideInList(response);
		
    }); 
		
		$('#closeimportguide-modal').show();
        var id = $(this).attr('href');
        //Set height and width to mask to fill up the whole screen  
        $('#mask4').css({'width':maskWidth,'height':maskHeight});  
          
        //transition effect       
        $('#mask4').fadeIn();             
		//slide from right to left, Set the popup window to center  
		
		$(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
    });  
	
	
      
    //if close button is clicked  
    $("#closeimportguide-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#import_guide_step_1').hide();
	
		document.getElementById('import_guide_form').reset();
    }); 

     $("#closemergegroup-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#merge_group_step_1').hide();
	    $('#merge_group_list').empty();
		//document.getElementById('merge_group_step_1').reset();
    }); 
	 
function ShowGuideInList(message)
{
		if(message!=null)
		{
		var node;
		var guides = message.split("||||");
		$("#guideinimportlist").empty();
		
		$.each(guides, function(index, value) {
	         node = $(value);
             node.hide();
		     
             $("#guideinimportlist").append(node);
             node.show();
         });
		 }
}
 
 
 function ShowimportGuideResponse()
 {
 	 alert('guide import successfully!');
	 $('#mask4').hide();  
	 $('#import_guide_step_1').hide();
	 document.getElementById('import_guide_form').reset();
 }
 
 function AddSiteResponse(message)
{
		if(message!=null)
		{
		$('.route li').last().remove();
		var node;
		var sites = message.split("||||");
		
		
		$.each(sites, function(index, value) {
	         node = $(value);
            // node.hide();
		     
             $('ul.route').append(node);
             //node.show();
			 
         });	
		 }
	 $('.trip_site_add').show();
}
    
	$(".l_importguide").live('click', function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
		var content = {'_xsrf': getCookie("_xsrf"),'group_id': $('#groupId').val(), 'guide_id' : $(this).attr('sid'), 'trip_id': $('#tripId').val()};
    	$.postJSON('/importguidetotrip', content, function(response){
        ShowimportGuideResponse();
		AddSiteResponse(response);
			});	
		
		});
	
	
})
	