$('.updateusersetting').click(function(){
	  var formData = $('#usersettingform').settingformToDict();
	  var _formData = JSON.stringify(formData, null, '\t');
	  alert(_formData);
	  var content = {'_xsrf': getCookie("_xsrf"), 'data' : _formData};
      var disabled = $('#usersettingform').find("input[type=submit]");
      disabled.disable();
	  
	  $.postJSON('/updateusersetting', content, function(response){
			   // ShowCreateguideResponse(response);
			});	
	 
	  //document.getElementById("create_guide_form").reset();	
	  disabled.enable();
});

 jQuery.fn.settingformToDict = function(){
     var fields = this.serializeArray();
	 var json = {};
	 for (var i = 0; i < fields.length; i++) {
	 json[fields[i]]=fields[i].value;
	 }
	 if (json.next) delete json.next;
	 return json;
 }