/* Copyright 2012 TripShare */

/* draw circle */

$(document).ready(function() { 

showCircleView:function()
{

window.onCircleViewReady=_.bind(this.circleViewReady,this);
window.onCircleViewSelection=_.bind(this.circleViewSelection,this)

}

circleViewReady:function(){
var m=this;

var B=getSwfObject("circleviewer");
if($.browser.msie){__flash__addCallback(B,"_setData")
}
B._setData($("#collection_view").data("view").overview.get("artistTrackAndPlayCounts"),"onCircleViewSelection");
$(".count_by span").click(function(){m.embedCircleView();
$(this).parent().find(".selected_button").removeClass("selected_button");
$(this).addClass("selected_button")
})
}

circleViewSelection:function(m)
{
	alert('test');
	//R.router.go(R.router.current()+"artist/"+m.websafe_name+"/")
}



function getSwfObject(a)
{
if(navigator.appName.indexOf("Microsoft")!=-1)
{
return window[a]
}
else
{
return document[a]
}
}

})   
  