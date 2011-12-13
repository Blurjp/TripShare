$('.updateusersetting').click(function(){
	  var formData = $('#usersettingform').settingformToDict();
	  var _formData = JSON.stringify(formData, null, '\t');
	  alert(_formData);
	  var content = {'_xsrf': getCookie("_xsrf"), 'data' : _formData};
      var disabled = $('#usersettingform').find("input[type=submit]");
      disabled.disable();
	  
	  $.postJSON('/updateusersetting', content, function(response){
			   if(response=='success')
			   {
			   	alert('User profile updated.');
			   }
			});	
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