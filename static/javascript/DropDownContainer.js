var doit = true
function showm(ob,pict) {
  if(doit) {
    document.getElementById(ob).style.height = '125'
    document.getElementById(pict).src = 'images/arrowl.gif'
    doit = false
  }
  else {
    document.getElementById(ob).style.height = '20'
    document.getElementById(pict).src = 'images/arrowd.gif'
    doit = true
  }
}
