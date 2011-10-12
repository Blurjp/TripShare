
$('.friendaction').live('click',function(){
	 var content = {'_xsrf':getCookie('_xsrf'), 'user_id':$(this).attr('sid')};
	 $.postJSON('/friendaction',content,function(response){
	 	
	 	
	 });
});	

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
    }
	
jQuery.postJSON = function(url, args, callback) {
	
	//alert(_data);
    $.ajax({url: url, data: $.param(args), type: "POST", dataType:"text", success: function(data, textStatus) {if (callback) callback(data);}, error: function(response) {console.log("ERROR:", response)}});
	};
	
	//add as friend
function followpeople(_url) {

		$.getJSON('/followpeople/'+_url, function(response) {
        alert(response.ToString());
        });
        }	
		
function unfollowpeople(_url) {

		$.getJSON('/unfollowpeople/'+_url, function(response) {
        alert(response.ToString());
        }); 
        }
		
jQuery.getJSON = function(_url, callback) {
    $.ajax({
      url: _url, 
      success: function(response) {
	  	console.log("success:", response)
        if (callback) callback(response);
      }, 
	  error: function(response) {
        console.log("ERROR:", response)
		}
});
};

function new_window(b,c,d)
{var 
a=function(){if
(!window.open(b,'t','scrollbars=yes,toolbar=0,resizable=1,status=0,width='+c+',height='+d))
{document.location.href=b}
};
if(/Firefox/.test(navigator.userAgent))
{setTimeout(a,0)}
else
{a()}
}


var slug = $('#trip_slug').val();
var title = $('#trip_title').val();    

//Tweet share
function TwitterShare()
{
	var slug = $('#trip_slug').val();
var title = $('#trip_title').val(); 
	new_window('http://twitter.com/share?url=http://www.tripshare.cc/trip/'+slug+';text='+title+';via=tripshare', 550, 425);
}
//FB share
function FBShare()
{
	var slug = $('#trip_slug').val();
var title = $('#trip_title').val(); 
	
	new_window('http://www.facebook.com/sharer.php?u=http://www.tripshare.cc/trip/'+slug+';t='+title, 755, 425);
}
//Reddit share	
function RedditShare()
{
	var slug = $('#trip_slug').val();
var title = $('#trip_title').val(); 
	new_window('http://reddit.com/submit?url=http://www.tripshare.cc/trip/'+slug+';title='+title, 900, 720);
}
//Digg share
function DiggShare()
{
	var slug = $('#trip_slug').val();
    var title = $('#trip_title').val(); 
	
    new_window('http://digg.com/submit?phase=2&url=http://www.tripshare.cc/trip/'+slug+';title='+title, 1060, 655);
}
//Stumble share
function StumbleShare()
{
	var slug = $('#trip_slug').val();
var title = $('#trip_title').val(); 
	
    new_window('http://www.stumbleupon.com/submit?url=http://www.tripshare.cc/trip/'+slug+';title='+title, 1060, 500)
}
  