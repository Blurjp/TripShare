/* Copyright 2011 TripShare */

/* create trip slide */
$(document).ready(function() {    
  
     //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
					 
    //select all the tag with name equal to createtrip
    $('a[name=createtrip]').click(function(e) {  
        
		//each time before create trip, clear all the cache information for 
		$('#user_ids_for_trips').val('');
		$('#destinations_for_trips').val('');
		
        e.preventDefault();
		$('#close-modal1').show();
		
        //Get the A tag  
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
    $("#close-modal1").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#create_trip_step_1').hide();
    }); 

	  /* Click go back step1 button */
 $('a[name=Go_back_to_Step1]').click(function(e) {  
      e.preventDefault();  
	  $('#close-modal1').show()
      $('#create_trip_step_1').animate({right: winW/2-$('#create_trip_step_1').width()/2});
	  $('#create_trip_step_2').animate({right: $('#create_trip_step_2').width()-winW});
 });


/* create trip slide 2*/
 
    $('a[name=createtrip2]').click(function(e) {  
        //Cancel the link behavior  
        e.preventDefault(); 
		
		if($("#start").attr("value")=='' || $("#start").attr("value") == null || $("#start").attr("value") == "EX: New York, NY")
		{
			alert("Please input start place.");
			return false;
		}
		
		
//		if ($('.dest_list_part li').length == 0) {
//			$('#dest_list').append('<li class="start"><img src="../static/icon/start.png" alt="" border="0">' + 'Start:' + $("#start").attr("value") + '</li>').fadeIn();
//		}
//		else
//		{
//			$('#dest_list li.start').replaceWith('<li class="start"><img src="../static/icon/start.png" alt="" border="0">' + 'Start:'+ $("#start").attr("value") + '</li>');
//		}
		
		$('.start_list_part').empty();
		$('.start_list_part').append('<img src="../static/icon/start.png" alt="" border="0"><span>' + 'Start:' + $("#start").attr("value")+'</span>').fadeIn();
		$('#create_trip_step_1').animate({right: winW});
		$('#close-modal1').hide();
		$('#close-modal2').show();
        //Get the A tag  
        var id = $(this).attr('href');  
		
	    $(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
				  
    });  
      
    //if close button is clicked  
    $("#close-modal2").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#create_trip_step_2').hide();
		$('#create_trip_step_1').hide();
    });   
	
/* add start*/
	$('#start').focus(function() { 
	     $("#start").val('');
	  
	 });
	
	var calendar_id = 1;
    /* add destination*/
	$('a[name=add_dest]').click(function(e) { 
	 e.preventDefault();  
	 if($("#destination").attr("value")!='' && $("#destination").attr("value") != null)
	 {
	 	var start_script = document.createElement( 'script' );
        start_script.type = 'text/javascript';
        start_script.text  = "var cal{startID}x = new CalendarPopup(\"testdiv{startID}\");"
		
		var dest_script = document.createElement( 'script' );
        dest_script.type = 'text/javascript';
        dest_script.text  = "var cal{destID}x = new CalendarPopup(\"testdiv{destID}\");"
		
	 	var _length = $('.dest_list_part li').length;
		var _dest = $("#destination").attr("value");
	 	var template = "<li id=dest_{length}><img src=\"../static/icon/dest.png\"  border=\"0\"> {destination} <a href=\"#\" class=\"delete_dest\" onclick=\"deletedest(dest_{length}); return false;\"></a>\n<div class=\"Travel_Date\">\n<tr><td>Start Date:</td><td><input type=\"text\" id=\"date{startID}x\" name=\"start_date\" size=\"20\">{start_script}<div id=\"testdiv{startID}\" style=\"display:none;background-color:white;layer-background-color:white;\"></div><a href=\"#\" onclick=\"cal{startID}x.select(document.forms['create_trip'].start_date,'anchor{startID}x','MM/dd/yyyy'); return false;\" title=\"start date\" name=\"anchor{startID}x\" id=\"anchor{startID}x\">select</a></td></tr><tr><td>End Date:</td><td><input type=\"text\" id=\"date{destID}x\" name=\"end_date\" size=\"20\">{dest_script}<div id=\"testdiv{destID}\" style=\"display:none;background-color:white;layer-background-color:white;\"></div><a href=\"#\" onclick=\"cal{destID}x.select(document.forms['create_trip'].end_date,'anchor{destID}x','MM/dd/yyyy'); return false;\" title=\"end date\" name=\"anchor{destID}x\" id=\"anchor{destID}x\">select</a></td></tr></div></li>";
	 	
		template = template.replace(/{start_script}/g, start_script);
		template = template.replace(/{dest_script}/g, dest_script);
		template = template.replace(/{startID}/g, calendar_id);
		template = template.replace(/{destID}/g, calendar_id+1);
		template = template.replace(/{length}/g, _length);
		template = template.replace(/{destination}/g, _dest);
		
	 	$('#dest_list').append(template).fadeIn();
	   
		dragsort.makeListSortable(document.getElementById("dest_list"),saveOrder);
		$('#destination').val('');
		calendar_id += 2;
	 }
	 else
	 {
	 	alert('Please input destination.');
	 }
	}); 
	
	
	
	/* create trip slide 3*/
	
   $('a[name=createtrip3]').click(function(e) {  
        //Cancel the link behavior  
        e.preventDefault(); 
		
		if($("#start").attr("value")=='' || $("#start").attr("value") == null || $("#start").attr("value") == "EX: New York, NY")
		{
			alert("Please input start place.");
			return false;
		}
		
//		if($('.dest_list_part li').length == 1)
//		{
//			$('#dest_list').clear();
//		}
//		if ($('.dest_list_part li').length == 0) {
//			$('#dest_list').append('<li>' + 'Start:' + $("#start").attr("value") + '<img src="../static/icon/start.png" alt="" border="0"></li>');
//		}

		$('#create_trip_step_1').animate({right: winW});
		$('#close-modal1').hide();
		$('#close-modal2').show();
        //Get the A tag  
        var id = $(this).attr('href');  
		
	    $(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
				   
	   
    });	
	
		  /* Click go back step2 button */
 $('a[name=Go_back_to_Step2]').click(function(e) {  
      e.preventDefault();  
	  $('#close-modal2').show()
      $('#create_trip_step_2').animate({right: winW/2-$('#create_trip_step_1').width()/2});
	  $('#create_trip_step_3').animate({right: $('#create_trip_step_2').width()-winW});
 });
	
	    /* Click finish button */
  $('input[name=create_trip_finish]').click(function(e) {  
      e.preventDefault();  
      
	  $('#create_trip_step_3').animate({right: winW});
	  $('#mask4').hide();  
	  $('#close-modal3').hide();
	  
	  //var formData = form2object('create_trip_form');
	  
	  var formData = $('#create_trip_form').formToDict();
	  var _formData=JSON.stringify(formData, null, '\t');
      alert(_formData);
      var disabled = $('#create_trip_form').find("input[type=submit]");
      disabled.disable();
	  
	  $.postJSON('/createtrip/'+_formData, formData, function(response){
			    ShowCreateTripResponse(response);
			});			
      
      
 });
 
 jQuery.fn.disable = function() {
    this.enable(false);
    return this;
};

jQuery.fn.formToDict = function() {
    var fields = this.serializeArray();
    var json = {};
	var subjson = {};
	var destinations = [];
	var tempString = [];
	var index = temp = 0;
	
    for (var i = 0; i < fields.length; i++) {
		if(fields[i].name.indexOf('place-')==0)
		{
			
			index = fields[i].name.substring(6,7);
			if(temp==index)
			{
				subjson[fields[i].name.substring(fields[i].name.lastIndexOf('-')+1, fields[i].name.length)] = fields[i].value;
			}
			else
			{
				tempString[temp]= subjson;
				subjson = {};
				subjson[fields[i].name.substring(fields[i].name.lastIndexOf('-')+1, fields[i].name.length)] = fields[i].value;
			}
			//tempString[index] += fields[i].name.substring(fields[i].name.lastIndexOf('-')+1, fields[i].name.length)+" : "+fields[i].value+" ,";
			//tempString[index][fields[i].name.substring(fields[i].name.lastIndexOf('-')+1,fields[i].name.length) ] += fields[i].value;
		}
		else
		{
			json[fields[i].name] = fields[i].value;
		}
		temp = index;
    }
	tempString[temp]= subjson;
	for(var i = 0; i < tempString.length; i++)
	{
		destinations.push(tempString[i]);
	}
	json['destinations'] = destinations;
    if (json.next) delete json.next;
    return json;
};

jQuery.fn.enable = function(opt_enable) {
    if (arguments.length && !opt_enable) {
        this.attr("disabled", "disabled");
    } else {
        this.removeAttr("disabled");
    }
    return this;
};
 
 function ShowCreateTripResponse(response)
 {
 	//alert(response);
 }
     /* Click go to step 3 button */
  $('a[name=create_trip_step_3]').click(function(e) {  
      e.preventDefault();  
    
	 $('#create_trip_step_2').animate({right: winW});
		$('#close-modal2').hide();
		$('#close-modal3').show();
        //Get the A tag  
        var id = $(this).attr('href');  
		
	    $(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
		
	//	 $('#dest_list li').each(function(index) {
			// alert(index + ': ' + $(this).text());
	//	     $("#destination_part").val($("#destination_part").val()+$(this).text() + '---');
	//	});
		
		var fields = $(".destination").serializeArray();
        $("#destinations_for_trips").empty();
        jQuery.each(fields, function(i, field){
       // $("#destinations_for_trips").append(field.value + " ");
		jQ_append("#destinations_for_trips", field.value);
        });
		
	//	SearchFriends();
 });
 
   //if close button is clicked  
    $("#close-modal3").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#create_trip_step_3').hide();
		$('#create_trip_step_2').hide();
    });  
	
	
	$(".add_user_link").click(function () {
		var image_link = this.siblings(".picture").attr("src");
		var slug = this.siblings(".picture").attr("alt");
		var username = this.siblings(".picture").attr("title");
		$('.people_search_result ul').append('<li><a class="user_link" href="#removeuserfromtrip"><span class="user_image"><img class="picture medium" alt=' + slug + ' src=' + image_link + '></span><span class="user_name">' + username + '</span></a></li>');

	});
	
	     /* Click current location */
     $('#current_location').click(function(e) {  
      e.preventDefault();  
		
        	
//		if ($('.dest_list_part li').length == 0) {
//			$('#dest_list').append('<li class="start"><img src="../static/icon/start.png" alt="" border="0">' + 'Start:' + 'Beijing' + '</li>').fadeIn();
//		}
//		else
//		{
//			$('#dest_list li.start').replaceWith('<li class="start"><img src="../static/icon/start.png" alt="" border="0">' + 'Start:'+ 'Beijing' + '</li>');
//		}		
        
		$('.start_list_part').empty();
		$('.start_list_part').append('<img src="../static/icon/start.png" alt="" border="0"><span>' + 'Start:' + 'New York</span>').fadeIn();
		$("#start").val('new york');
		$('#create_trip_step_1').animate({right: winW});
		$('#close-modal1').hide();
		$('#close-modal2').show();
        //Get the A tag  
        var id = $('#create_trip_step_2');
		
	    $(id).show();
		$(id).css({right: $(id).width()-winW, top: winH / 2 - $(id).height() / 2});
	    $(id).animate({right: winW/2-$(id).width()/2});
        $(id).css("position", "fixed");
	 
 });

	 
});  

function SearchMember()
{
	//var trip_id = $("#member").attr("name");
	var name = $("#member").attr("value");
	$("#member").val('');
	$(".people_search_result").empty();
	$.getJSON('/searchpeople/'+name, function(response) {
        ShowMember(response);
        });
}

function SearchFriends()
{
	$.getJSON('/searchfriend/'+name, function(response) {
        ShowMember(response);
        });
}
   

function ShowMember(message) {
	//alert(message);
     $(".people_search_result").append(message);
    }

function ShowAddUserResponse(message) {
	alert("User has been added to the trip");
	$('.conv-head ul').append(message);
    } 
 
function AddUserToTrip(userid){
        
		if (document.getElementById('tripId')!=null && document.getElementById('tripId')!="") {
			//after the trip get created
			$('.people_search_result').empty();
			tripid = document.getElementById('tripId').value;
			$.getJSON('/addusertotrip/' + userid + '/' + tripid, function(response){
						ShowAddUserResponse(response);
			});
		}
		else
		{
			//before the trip get created
			//var mix = $('.addusertotrip-button').attr('value').split("/");
			//alert($('.addusertotrip-button').attr('value'));
			//$('#mask5').hide();  
			//$('#search_member_pop').hide();
			$('.people_search_result').empty();
			
			if (!CheckUserinTrip2(userid)) {
				//alert("check");
				
			    jQ_append('#user_ids_for_trips', userid + '||');
			    // we should show user profile picture in the GUI 
			}
			else {
				alert('This user is already in the trip.');
			}
		}
      }


function jQ_append(id_of_input, text){
    $(id_of_input).val($(id_of_input).val() + text);
}

function jQ_ifcontain(id_of_input, text){
	return ($(id_of_input).val().indexOf(text) != -1);
	
}
 
function CheckUserinTrip2(userid)
{
	  return jQ_ifcontain('#user_ids_for_trips', userid);
}	

function CheckUserinTrip(userid, tripid)
{
	  $.getJSON('/checkuserintrip/' + userid + '/' + tripid, function(response){
	  	alert(response);
		
				if(response=='existed')
				{
					return true;
				}
				else
				{
					return false;
				}
			});
}	  

function deletedest(id)
	{  
		// alert(id.toString());
         $(id).remove();
		
    }; 

$(function(){
	
var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth();
var curr_year = d.getFullYear();
var current_date = curr_year + "-" + ('0' + (curr_month)).slice(-2) + "-" + curr_date;

if(document.getElementById("place-0-date") != null)
{
	document.getElementById("place-0-date").value = current_date;
}
	
multihop_setup();




/*    subscribe trip    */	  
		$('.l_subscribe').live('click', function(){
			
			tripid= $(this).attr('sid');
			userid =  $(this).attr('href');
			
		    $.getJSON('/checkuserintrip/' + userid + '/' + tripid, function(response){
				if(response=='existed')
				{
					alert('user is already in the trip.');
				}
				else
				{
					 
					
					$.getJSON('/subscribe_trip/'+tripid, function(response) {
                      if(response.indexOf("success") != -1)
					  {
					  	 var tripid = response.substring(7);
						 //alert($(this).attr('value'));
						 //this.removeClass('l_subscribe').addClass('l_unsubscribe');
						
						// $('#'+tripid+'.l_subscribe').removeClass('l_subscribe').addClass('l_unsubscribe');
						// $('#'+tripid+'.l_subscribe').val('Leave the trip');
						
					  }
	                });
					
				}
		});
		$(this).val('Leave the trip');
        $(this).removeClass('l_subscribe').addClass('l_unsubscribe');
		$(this).parent('.right').siblings('.members').append('');
		return false;
		});
		
		
		$('.l_unsubscribe').live('click', function(){
			
			tripid=$(this).attr('sid');
			userid = $(this).attr('href');
			
		    $.getJSON('/checkuserintrip/' + userid + '/' + tripid, function(response){
				if (response == 'existed') {
					$.getJSON('/unsubscribe_trip/' + tripid, function(response){
					   if(response.indexOf("success") != -1)
					  {
					  
					  	var tripid = response.substring(7);
						//alert($(this).attr('value'));
						
						//	$('#'+tripid+'.l_unsubscribe').removeClass('l_unsubscribe').addClass('l_subscribe');
						//	$('#'+tripid+'.l_subscribe').val('Join');
						// alert('User has been removed from the trip.');
					  } 
					});
				}
				else {
					alert('user is not in the trip.');
				}
      
        });
		$(this).val('Join');
		$(this).removeClass('l_unsubscribe').addClass('l_subscribe');
		//alert('avatar'+$(this).parent('.right').siblings('.members').children('a.avatar').attr('alt'));
		$(this).parent('.right').siblings('.members').children('a.avatar').each(
		function(){
			if ($(this).attr('alt')==userid)
			{
				$(this).remove();
				//alert('removed');
			}
		}
		);
		return false;
		});
		
	
		
		
jQuery.getJSON = function(_url, callback) {
    $.ajax({
      url: _url, success: function(data, textStatus) {console.log("success:", data)
        if (callback) callback(data);
      }, 
	  error: function(response) {console.log("ERROR:", response)}
});
};


jQuery.postJSON = function(url, args, callback) {
    $.ajax({url: url, data: $.param(args),type: "POST",dataType: "text",success: function(data, textStatus) {if (callback) callback(data);}, error: function(response) {console.log("ERROR:", response)}});};
});
	  
	  
  function magic_date_fixup( value ) {
      // we've picked a date for one of the date pickers. We want to magically
      // make all the other date pickers catch up to this date, so the calendars
      // are nicer to use. Going to do this very crudely - all blank or 'today'
      // date fields will be changed to the date we just picked.
      
      var max_date = null;
      
      // ensure that the dates are in order
      var last_date = null;
      var out_of_order = false;

      $('.multihop-row .multihop-calendar').each(function(i) {
        // oh, also, don't update the first calendar _ever_. Otherwise, hitting
        // 'add trip' and changing the finish date will alter the start date.
        if (value) {
          if (i > 1 && ($(this).val() == current_date || $(this).val() == '' || $(this).val() == null))
            $(this).val( value );
        }
          
        // track the largest date.
        if ( !max_date || $(this).val() > max_date )
          max_date = $(this).val();
        
        // make sure every date is larger than the one before
        if ( last_date && last_date > $(this).val() ) {
          out_of_order = true;
          $(this).addClass("out-of-order");
        } else {
          $(this).removeClass("out-of-order");
        }
        last_date = $(this).val();
      });
      
      // update the finish box
      if ( max_date > $('#finish-date').val() )
        $('#finish-date').val( max_date );
        
      // trips out of order?
      if (out_of_order) {
        $("#order-feedback").show();
      } else {
        $("#order-feedback").hide();
      }

      if ($.browser.msie && $.browser.version == 6) {
      } else {
        if ($(".row-wrapper").length > 1) {
          $(".remove-trip-link").html("<img src='/static/images/delete_stop_16px.png' width='16' height='16' />");
          $(".move-up-link").html("<img src='/static/images/move_stop_up_16px.png' width='16' height='16' />");
          $(".move-down-link").html("<img src='/static/images/move_stop_down_16px.png' width='16' height='16' />");
        } else {
          $(".remove-trip-link").html("");
          $(".move-up-link").html("");
          $(".move-down-link").html("");
        }
      }
      

    }
    
    function move_add_link() {
      $("#add-row-div").insertBefore(".transport-label:last");
    }
    
    var magic_transport_type = true;
    function bind_transport_change() {
      // magic_transport_type means that the return transport type is linked
      // to the outbound trnasport type.
      $(".transport-selector").unbind('change').change(function() {
        if (magic_transport_type) {
          $('#return-transport').val( $(this).val() );
        }
      });
      // changing the return transport type widget manually breaks the magic
      $("#return-transport").unbind("change").change(function() {
        magic_transport_type = false;
      });
    }
      

    // Assume european date order?
    var assume_euro = false;

    // this is a template for adding rows to the disambiguation template
    var disambiguator_template = "<div id=\"{ID}-wrapper\" class=\"row-wrapper\">\n<li class=\"lh-tighter {ID}-element multihop-row goodbox\">\n  \n  <div class=\"left c1of5 tright\" style=\"margin-top:2px;\">\n    <label for=\"{ID}-text\">Destination:<\/label>\n  <\/div>\n  <div class=\"left c2of5 tright\">\n    <input id=\"{ID}-text\" name=\"{ID}-text\" type=\"text\" class=\"text destination margin-right-thin\" value=\"\" \/>\n    <input id=\"{ID}\" name=\"{ID}\" type=\"hidden\" value=\"\" \/>\n  <\/div>\n  <div class=\"left c1of10 tright\" style=\"margin-top:2px;\">\n    <label for=\"{ID}-date\">on:<\/label>\n  <\/div>\n  <div class=\"left c1of5\">\n    <input id=\"{ID}-date\" name=\"{ID}-date\" type=\"text\" value=\"\" class=\"text date multihop-calendar\" \/>\n  <\/div>\n  <div class=\"left\">\n  <a href=\"#\" id=\"{ID}-move-up-link\" class=\"pad-left-thin f2 lh-tight move-up-link\"><\/a><a href=\"#\" id=\"{ID}-move-down-link\" class=\"f2 lh-tight move-down-link\"><\/a><a href=\"#\" id=\"{ID}-remove-link\" class=\"pad-left-thin f2 lh-tight remove-trip-link\"><\/a><\/div>\n<\/li>\n<li class=\"lh-tighter {ID}-element goodbox\" id=\"{ID}-feedback-wrapper\" style=\"margin-bottom:0;\">\n  <div id=\"{ID}-feedback\" class=\"check-placename-info\" style=\"display:none;\"><\/div>\n  <div id=\"{ID}-others\" style=\"display:none;\"><\/div>\n<\/li>\n<li class=\"lh-tighter pad-bottom-thin {ID}-element goodbox\">\n  <div class=\"left c1of5 transport-label\">&nbsp;<\/div>\n  <div class=\"left c2of5 tright\">\n    <img id=\"{ID}-loading\" class=\"left margin-top-thin\" style=\"display: none\" src=\"\/images\/dopplr-anim-smaller-faster.gif\" alt=\"loading...\" \/>\n    <div class=\"margin-right-thin\"><select class=\"transport-selector\" id=\"{ID}-transport-type\" name=\"{ID}-transport-type\"><option value=\"plane\">by plane<\/option>\n<option value=\"train\">by train<\/option>\n<option value=\"car\">by car<\/option>\n<option value=\"bus\">by bus<\/option>\n<option value=\"ferry\">by ferry<\/option>\n<option value=\"motorcycle\">by motorcycle<\/option>\n<option value=\"cycle\">by bicycle<\/option>\n<option value=\"walk\">on foot<\/option>\n<option value=\"other\">other<\/option><\/select><\/div>\n  <\/div>\n<\/li>\n<\/div>\n";
    var disambiguator_index = 1;
    function add_disambiguator() {

      // adding a disambiguator breaks the magic connection, as we're suddenly complicated.
      magic_transport_type = false;

      // what date do we put in the box? Copy the most recent date
      var new_date = "2011-08-05";
      var cal = $(".multihop-row .multihop-calendar:last")
      if (cal)
        new_date = cal.val()
      
      // add a day to the date.
      var parsed = $.parseDate(new_date) || new Date();
      parsed.setDate( parsed.getDate() + 1 )
      Date.format = 'yyyy-mm-dd';
      new_date = parsed.asString();

      var id = "place-" + disambiguator_index;
      $( "#follows-disambiguators" ).before( disambiguator_template.replace(/{ID}/g, id) );
      
      hook_up_disambiguator( id, new_date );

      $("#"+id+"-wrapper").find("input.destination").focus().animate({ backgroundColor: '#f8f4ac' }, 1).animate({opacity: 1.0}, 100).animate({ backgroundColor: '#ffffff' }, 300);
      
      disambiguator_index += 1;
      return false;
    }
    
    function hook_up_disambiguator( id, new_date ) {
      $.disambiguator(id);

      move_add_link();
      bind_transport_change();

      if (new_date)
          $('#' + id + '-date').val(new_date).dateGuesser( assume_euro, null, null, magic_date_fixup );

      if ($.browser.msie && $.browser.version == 6) {
      } else {
        
        $("#"+id+"-remove-link").click(function() {
          if ($(".row-wrapper").length > 1) {
            $("#add-row-div").insertBefore("#finish-date");
            $("#"+id+"-wrapper").remove();
            move_add_link();
            bind_transport_change();
            magic_date_fixup();
          }
          return false;
        });
            
        $("#"+id+"-move-up-link").click(function() {
          // going to swpa the places of these two elements
          var self = $("#"+id+"-wrapper");
          var swap = self.prev();
          return swap_and_pulse( swap, self, self );
        });

        $("#"+id+"-move-down-link").click(function() {
          // going to swpa the places of these two elements
          var self = $("#"+id+"-wrapper");
          var swap = self.next(".row-wrapper");
          return swap_and_pulse( self, swap, self );
        });
        
        function swap_and_pulse(first, second, pulse) {
          // swap the date values, so the ordering stays the same
          var temp = first.find("input.date").val();
          first.find("input.date").val( second.find("input.date").val() );
          second.find("input.date").val( temp );

          pulse.find("input.destination").animate({ backgroundColor: '#f8f4ac' }, 1).animate({opacity: 1.0}, 100).animate({ backgroundColor: '#ffffff' }, 300);

          // do the swap
          second.after(first);

          // fixup
          move_add_link();
          bind_transport_change();
          magic_date_fixup();
          return false;
        }
      
      }
      
      magic_date_fixup(); // sanity check is useful.
    }

    
    function multihop_setup() {
      
	        // attach the calendar, but remove the keypress filtering event, so
      // all keys work again.
      $('#finish-date').dateGuesser( assume_euro, null, null, magic_date_fixup );
      
      // wire up disambiguators
      hook_up_disambiguator("place-0");
        $('#place-0-date').dateGuesser( assume_euro, null, null, magic_date_fixup );
      
      $('#places input').change(function() {
        edit_trip_form_is_dirty = true;
      });
      $('form').submit(function() {
        edit_trip_form_is_dirty = false;
      });
      
      if ($.browser.msie && $.browser.version == 6) {
        // IE6 is a pain. No cheese^Wmulti-hop for YOU.
      } else {
        // add the link text with JS, so that if you don't have JS, you don't see it.
        $("#add-row-div").removeClass('hidden');
        $("#add-row-link").html("Add another stop on this trip").click(function() {
         
		  add_disambiguator();
          return false;
        });
        move_add_link();
        bind_transport_change();
      }

      $("#place-0-text").focus();
      
      $("#trip-edit-form").submit(function() {
        $("#submitButton").attr("value", 'Saving...').attr("disabled", true );
      });


      // prompt user when navigating away from page if they've changed something
      var edit_trip_form_is_dirty = false;
      window.onbeforeunload = function() {
        if (edit_trip_form_is_dirty) {
          
            return "You have started entering details, but not saved them.";
          
        }
      }
      
    }
	
	
$(document).ready(function() {   


$('input.add_member').focus(function() {
	if (this.value == '' || this.value == null) {
		$('.friend_dropdown_list ul').hide();
		$('.friend_dropdown_list ul').empty();
	}
});

$('input.add_member').keyup(function() {
	
   $.getJSON('/realtime_searchpeople/'+this.value, function(response) {
        ShowResultInCreateTripDropList(response);
        });
});



function ShowResultInCreateTripDropList(response)
{
	$('.friend_dropdown_list ul').empty();
	//alert(response);
	if (response != '' && response != 'not found') {
		var _object = JSON.parse(response);
		//alert(_object.length);
		for (var i = 0; i < _object.length; i++) {
		
			$('.friend_dropdown_list ul').append('<li><a class="add_user_link" href="#"><span class="user_image"><img class="picture medium" title='+  _object[i]['username']  +' alt=' + _object[i]['slug'] + ' src=' + _object[i]['picture'] + '></span><span class="user_name">' + _object[i]["username"] + '</span></a></li>');
		}
		$('.friend_dropdown_list ul').show();
	}
}

$('#mask4').click(function(e) { 
        e.preventDefault();  
        $('.friend_dropdown_list ul').hide();
		
});

});



	  