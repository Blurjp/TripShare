/* Copyright 2011 tripShare */

/* create trip slide */
$(document).ready(function() {    

     //Get the screen height and width  
        var maskHeight = $(document).height();  
        var maskWidth = $(window).width();  
		
	 //Get the window height and width  
        var winH = $(window).height();  
        var winW = $(window).width();  
					 
    //select all the tag with name equal to managebudget
    $('.managebudget').click(function(e) {  

        e.preventDefault();
		$('#closemanagebudget-modal').show();
		
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
    $("#closemanagebudget-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
        $('#mask4').hide();  
		$('#manage_budget').hide();
		$("#user_expense_table").empty();
		
    }); 


/* ask for share slide*/
 
    $('a[name=shareexpense]').click(function(e) {  
        //Cancel the link behavior  
        e.preventDefault(); 
		//var content = {'_xsrf': getCookie("_xsrf"), 'user_id':_formData};
        $.getJSON('/checkpaymentaccount',  function(response){
			$('#manage_budget').animate({
				right: winW
			});
		var id;
		if (response == "none") {
		     
			$('#closemanagebudget-modal').hide();
			$('#closepaymentsetting-modal').show();
			//Get the A tag  
			//var id = "#share_expense_setup_1";
			id = "#payment_setting_step_1";
			
		}
		else {
			ExpenseSum();
			
			$('#closemanagebudget-modal').hide();
			$('#closeshareexpense-modal').show();
			//Get the A tag  
			//var id = $(this).attr('href');
			id = "#share_expense_step_1";
			
		}
		$(id).show();
			$(id).css({
				right: $(id).width() - winW,
				top: winH / 2 - $(id).height() / 2
			});
			$(id).animate({
				right: winW / 2 - $(id).width() / 2
			});
			$(id).css("position", "fixed");
		});	
	  
    });  
	
			  /* Click go back step2 button */
 $('a[name=Go_back_to_expense]').click(function(e) {  
      e.preventDefault();  
	  
	  $('#closemanagebudget-modal').show();
      $('#manage_budget').animate({right: winW/2-$('#manage_budget').width()/2});
	  $('#share_expense_step_1').animate({right: -winW});
 });
 
        //if close button is clicked  
    $("#closeshareexpense-modal").click(function (e) {  
        //Cancel the link behavior  
        e.preventDefault();  
		
        $('#mask4').hide();  
		$('#share_expense_step_1').hide();
		$("#user_expense_table").empty();
		//document.getElementById('create_trip_form').reset();
    });  



   $('a[name=sendexpenserequest]').click(function(e) {  
      e.preventDefault();  
	  $('#mask4').hide();  
	  $('#share_expense_step_1').hide();
	  $("#user_expense_table").empty();
	 // $(".user_expense_request_collection").empty();
	  var formData = {};
	  var slug = '';
	  var temp = [];
	  var subjson = {};
	  $('.user_expense_request_collection li').each(function(index) {
        if($(this).find('.usercheckoption').is(':checked'))
		{
			slug = subjson['slug'] = $(this).find('.picture').attr('alt');
			subjson['pic'] = $(this).find('.picture').attr('src');
			subjson['expense'] = $(this).find('.expense_amount').val();
			//alert($(this).find('.expense_amount').val());
			var payment = {};
			if($(this).find('.paypal_option').is(':checked'))
			{
				
				payment['paypal']='paypal';
			}
			if ($(this).find('.dwolla_option').is(':checked'))
			{
				payment['dwolla']='dwolla';
			}
			subjson['payment'] = payment;
			temp[index]=subjson;
			
			subjson={};
		}
		formData['userexpense']=temp;
      });
   
	  
	  var _formData=JSON.stringify(formData, null, '\t');
	  //alert(_formData);
	  var content = {'_xsrf': getCookie("_xsrf"), 'userexpense':_formData};
	  $.postJSON('/sendexpenserequest', content, function(response){
			    //ShowCreateTripResponse(response);
				alert("Expense share request sent!");
			});	
	  
 });
  
})




	