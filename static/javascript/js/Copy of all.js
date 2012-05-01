
/* Copyright (c) 2007 Paul Bakaus (paul.bakaus@googlemail.com) and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2007-12-20 08:46:55 -0600 (Thu, 20 Dec 2007) $
 * $Rev: 4259 $
 *
 * Version: 1.2
 *
 * Requires: jQuery 1.2+
 */

(function($){
    
$.dimensions = {
    version: '1.2'
};

// Create innerHeight, innerWidth, outerHeight and outerWidth methods
$.each( [ 'Height', 'Width' ], function(i, name){
    
    // innerHeight and innerWidth
    $.fn[ 'inner' + name ] = function() {
        if (!this[0]) return;
        
        var torl = name == 'Height' ? 'Top'    : 'Left',  // top or left
            borr = name == 'Height' ? 'Bottom' : 'Right'; // bottom or right
        
        return this.is(':visible') ? this[0]['client' + name] : num( this, name.toLowerCase() ) + num(this, 'padding' + torl) + num(this, 'padding' + borr);
    };
    
    // outerHeight and outerWidth
    $.fn[ 'outer' + name ] = function(options) {
        if (!this[0]) return;
        
        var torl = name == 'Height' ? 'Top'    : 'Left',  // top or left
            borr = name == 'Height' ? 'Bottom' : 'Right'; // bottom or right
        
        options = $.extend({ margin: false }, options || {});
        
        var val = this.is(':visible') ? 
                this[0]['offset' + name] : 
                num( this, name.toLowerCase() )
                    + num(this, 'border' + torl + 'Width') + num(this, 'border' + borr + 'Width')
                    + num(this, 'padding' + torl) + num(this, 'padding' + borr);
        
        return val + (options.margin ? (num(this, 'margin' + torl) + num(this, 'margin' + borr)) : 0);
    };
});

// Create scrollLeft and scrollTop methods
$.each( ['Left', 'Top'], function(i, name) {
    $.fn[ 'scroll' + name ] = function(val) {
        if (!this[0]) return;
        
        return val != undefined ?
        
            // Set the scroll offset
            this.each(function() {
                this == window || this == document ?
                    window.scrollTo( 
                        name == 'Left' ? val : $(window)[ 'scrollLeft' ](),
                        name == 'Top'  ? val : $(window)[ 'scrollTop'  ]()
                    ) :
                    this[ 'scroll' + name ] = val;
            }) :
            
            // Return the scroll offset
            this[0] == window || this[0] == document ?
                self[ (name == 'Left' ? 'pageXOffset' : 'pageYOffset') ] ||
                    $.boxModel && document.documentElement[ 'scroll' + name ] ||
                    document.body[ 'scroll' + name ] :
                this[0][ 'scroll' + name ];
    };
});

$.fn.extend({
    position: function() {
        var left = 0, top = 0, elem = this[0], offset, parentOffset, offsetParent, results;
        
        if (elem) {
            // Get *real* offsetParent
            offsetParent = this.offsetParent();
            
            // Get correct offsets
            offset       = this.offset();
            parentOffset = offsetParent.offset();
            
            // Subtract element margins
            offset.top  -= num(elem, 'marginTop');
            offset.left -= num(elem, 'marginLeft');
            
            // Add offsetParent borders
            parentOffset.top  += num(offsetParent, 'borderTopWidth');
            parentOffset.left += num(offsetParent, 'borderLeftWidth');
            
            // Subtract the two offsets
            results = {
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        }
        
        return results;
    },
    
    offsetParent: function() {
        var offsetParent = this[0].offsetParent;
        while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && $.css(offsetParent, 'position') == 'static') )
            offsetParent = offsetParent.offsetParent;
        return $(offsetParent);
    }
});

function num(el, prop) {
    return parseInt($.curCSS(el.jquery?el[0]:el,prop,true))||0;
};

})(jQuery);

/*
 * searchField - jQuery plugin to display and remove
 * a default value in a searchvalue on blur/focus
 *
 * Copyright (c) 2007 J�rn Zaefferer, Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Clear the help text in a search field (either in the value or title attribute)
 * when focused, and restore it on blur if nothing was entered. If the value is
 * blank but there is a title attribute, the title will be moved to the initial value.
 *
 * @example $('#quicksearch').searchField();
 * @before <input id="quicksearch" title="Enter search here" name="quicksearch" />
 * @result <input id="quicksearch" value="Enter search here" name="quicksearch" />
 *
 * @name searchField
 * @type jQuery
 * @cat Plugins/SearchField
 */
jQuery.fn.searchField = function(){
    return this.each(function(){
        var $this = jQuery(this);
        // setup initial value from title if no initial value
        if(this.title && this.title.length && !this.value.length){
            $this.val(this.title);
            $this.removeAttr('title');
        }
        // attach listeners if there is a value
        if(this.value.length){
            this.defaultValue = this.value;
            $this.focus(function(){
                if(this.value==this.defaultValue) this.value='';
            })
            .blur(function(){
                if(!this.value.length)this.value=this.defaultValue;
            });
          var def = this.defaultValue;
            $this.parents('form').submit(function() {
              if ($this.val() == def)
                $this.val("");
          });
        }
    });
};

/**
 * Interface Elements for jQuery
 * utility function
 *
 * http://interface.eyecon.ro
 *
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 *
 */

jQuery.iUtil = {
    getPosition : function(e)
    {
        var x = 0;
        var y = 0;
        var es = e.style;
        var restoreStyles = false;
        if (jQuery.curCSS(e,'display') == 'none') {
            var oldVisibility = es.visibility;
            var oldPosition = es.position;
            restoreStyles = true;
            es.visibility = 'hidden';
            es.display = 'block';
            es.position = 'absolute';
        }
        var el = e;
        if (el.getBoundingClientRect) { // IE
            var box = el.getBoundingClientRect();
            x = box.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) - 2;
            y = box.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - 2;
        } else {
            x = el.offsetLeft;
            y = el.offsetTop;
            el = el.offsetParent;
            if (e != el) {
                while (el) {
                    x += el.offsetLeft;
                    y += el.offsetTop;
                    el = el.offsetParent;
                }
            }
            if (jQuery.browser.safari && jQuery.curCSS(e, 'position') == 'absolute' ) {
                x -= document.body.offsetLeft;
                y -= document.body.offsetTop;
            }
            el = e.parentNode;
            while (el && el.tagName.toUpperCase() != 'BODY' && el.tagName.toUpperCase() != 'HTML') 
            {
                if (jQuery.curCSS(el, 'display') != 'inline') {
                    x -= el.scrollLeft;
                    y -= el.scrollTop;
                }
                el = el.parentNode;
            }
        }
        if (restoreStyles == true) {
            es.display = 'none';
            es.position = oldPosition;
            es.visibility = oldVisibility;
        }
        return {x:x, y:y};
    },
    getPositionLite : function(el)
    {
        var x = 0, y = 0;
        while(el) {
            x += el.offsetLeft || 0;
            y += el.offsetTop || 0;
            el = el.offsetParent;
        }
        return {x:x, y:y};
    },
    getSize : function(e)
    {
        var w = jQuery.curCSS(e,'width');
        var h = jQuery.curCSS(e,'height');
        var wb = 0;
        var hb = 0;
        var es = e.style;
        if (jQuery.curCSS(e, 'display') != 'none') {
            wb = e.offsetWidth;
            hb = e.offsetHeight;
        } else {
            var oldVisibility = es.visibility;
            var oldPosition = es.position;
            es.visibility = 'hidden';
            es.display = 'block';
            es.position = 'absolute';
            wb = e.offsetWidth;
            hb = e.offsetHeight;
            es.display = 'none';
            es.position = oldPosition;
            es.visibility = oldVisibility;
        }
        return {w:w, h:h, wb:wb, hb:hb};
    },
    getSizeLite : function(el)
    {
        return {
            wb:el.offsetWidth||0,
            hb:el.offsetHeight||0
        };
    },
    getClient : function(e)
    {
        var h, w, de;
        if (e) {
            w = e.clientWidth;
            h = e.clientHeight;
        } else {
            de = document.documentElement;
            w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
            h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
        }
        return {w:w,h:h};
    },
    getScroll : function (e)
    {
        var t=0, l=0, w=0, h=0, iw=0, ih=0;
        if (e && e.nodeName.toLowerCase() != 'body') {
            t = e.scrollTop;
            l = e.scrollLeft;
            w = e.scrollWidth;
            h = e.scrollHeight;
            iw = 0;
            ih = 0;
        } else  {
            if (document.documentElement) {
                t = document.documentElement.scrollTop;
                l = document.documentElement.scrollLeft;
                w = document.documentElement.scrollWidth;
                h = document.documentElement.scrollHeight;
            } else if (document.body) {
                t = document.body.scrollTop;
                l = document.body.scrollLeft;
                w = document.body.scrollWidth;
                h = document.body.scrollHeight;
            }
            iw = self.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
            ih = self.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
        }
        return { t: t, l: l, w: w, h: h, iw: iw, ih: ih };
    },
    getMargins : function(e, toInteger)
    {
        var el = jQuery(e);
        var t = el.css('marginTop') || '';
        var r = el.css('marginRight') || '';
        var b = el.css('marginBottom') || '';
        var l = el.css('marginLeft') || '';
        if (toInteger)
            return {
                t: parseInt(t)||0,
                r: parseInt(r)||0,
                b: parseInt(b)||0,
                l: parseInt(l)
            };
        else
            return {t: t, r: r, b: b, l: l};
    },
    getPadding : function(e, toInteger)
    {
        var el = jQuery(e);
        var t = el.css('paddingTop') || '';
        var r = el.css('paddingRight') || '';
        var b = el.css('paddingBottom') || '';
        var l = el.css('paddingLeft') || '';
        if (toInteger)
            return {
                t: parseInt(t)||0,
                r: parseInt(r)||0,
                b: parseInt(b)||0,
                l: parseInt(l)
            };
        else
            return {t: t, r: r, b: b, l: l};
    },
    getBorder : function(e, toInteger)
    {
        var el = jQuery(e);
        var t = el.css('borderTopWidth') || '';
        var r = el.css('borderRightWidth') || '';
        var b = el.css('borderBottomWidth') || '';
        var l = el.css('borderLeftWidth') || '';
        if (toInteger)
            return {
                t: parseInt(t)||0,
                r: parseInt(r)||0,
                b: parseInt(b)||0,
                l: parseInt(l)||0
            };
        else
            return {t: t, r: r, b: b, l: l};
    },
    getPointer : function(event)
    {
        var x = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)) || 0;
        var y = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
        return {x:x, y:y};
    },
    traverseDOM : function(nodeEl, func)
    {
        func(nodeEl);
        nodeEl = nodeEl.firstChild;
        while(nodeEl){
            jQuery.iUtil.traverseDOM(nodeEl, func);
            nodeEl = nodeEl.nextSibling;
        }
    },
    purgeEvents : function(nodeEl)
    {
        jQuery.iUtil.traverseDOM(
            nodeEl,
            function(el)
            {
                for(var attr in el){
                    if(typeof el[attr] === 'function') {
                        el[attr] = null;
                    }
                }
            }
        );
    },
    centerEl : function(el, axis)
    {
        var clientScroll = jQuery.iUtil.getScroll();
        var windowSize = jQuery.iUtil.getSize(el);
        if (!axis || axis == 'vertically')
            jQuery(el).css(
                {
                    top: clientScroll.t + ((Math.max(clientScroll.h,clientScroll.ih) - clientScroll.t - windowSize.hb)/2) + 'px'
                }
            );
        if (!axis || axis == 'horizontally')
            jQuery(el).css(
                {
                    left:   clientScroll.l + ((Math.max(clientScroll.w,clientScroll.iw) - clientScroll.l - windowSize.wb)/2) + 'px'
                }
            );
    },
    fixPNG : function (el, emptyGIF) {
        var images = jQuery('img[@src*="png"]', el||document), png;
        images.each( function() {
            png = this.src;             
            this.src = emptyGIF;
            this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + png + "')";
        });
    }
};

// Helper function to support older browsers!
[].indexOf || (Array.prototype.indexOf = function(v, n){
    n = (n == null) ? 0 : n;
    var m = this.length;
    for (var i=n; i<m; i++)
        if (this[i] == v)
            return i;
    return -1;
});


/**
 * Interface Elements for jQuery
 * FX
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

/**
 * Validates elements that can be animated
 */
jQuery.fxCheckTag = function(e)
{
    if (/^tr$|^td$|^tbody$|^caption$|^thead$|^tfoot$|^col$|^colgroup$|^th$|^body$|^header$|^script$|^frame$|^frameset$|^option$|^optgroup$|^meta$/i.test(e.nodeName) )
        return false;
    else 
        return true;
};

/**
 * Destroy the wrapper used for some animations
 */
jQuery.fx.destroyWrapper = function(e, old)
{
    var c = e.firstChild;
    var cs = c.style;
    cs.position = old.position;
    cs.marginTop = old.margins.t;
    cs.marginLeft = old.margins.l;
    cs.marginBottom = old.margins.b;
    cs.marginRight = old.margins.r;
    cs.top = old.top + 'px';
    cs.left = old.left + 'px';
    e.parentNode.insertBefore(c, e);
    e.parentNode.removeChild(e);
};

/**
 * Builds a wrapper used for some animations
 */
jQuery.fx.buildWrapper = function(e)
{
    if (!jQuery.fxCheckTag(e))
        return false;
    var t = jQuery(e);
    var es = e.style;
    var restoreStyle = false;
    
    if (t.css('display') == 'none') {
        oldVisibility = t.css('visibility');
        t.css('visibility', 'hidden').show();
        restoreStyle = true;
    }
    var oldStyle = {};
    oldStyle.position = t.css('position');
    oldStyle.sizes = jQuery.iUtil.getSize(e);
    oldStyle.margins = jQuery.iUtil.getMargins(e);
    
    var oldFloat = e.currentStyle ? e.currentStyle.styleFloat : t.css('float');
    oldStyle.top = parseInt(t.css('top'))||0;
    oldStyle.left = parseInt(t.css('left'))||0;
    var wid = 'w_' + parseInt(Math.random() * 10000);
    var wr = document.createElement(/^img$|^br$|^input$|^hr$|^select$|^textarea$|^object$|^iframe$|^button$|^form$|^table$|^ul$|^dl$|^ol$/i.test(e.nodeName) ? 'div' : e.nodeName);
    jQuery.attr(wr,'id', wid);
    var wrapEl = jQuery(wr).addClass('fxWrapper');
    var wrs = wr.style;
    var top = 0;
    var left = 0;
    if (oldStyle.position == 'relative' || oldStyle.position == 'absolute'){
        top = oldStyle.top;
        left = oldStyle.left;
    }
    
    wrs.top = top + 'px';
    wrs.left = left + 'px';
    wrs.position = oldStyle.position != 'relative' && oldStyle.position != 'absolute' ? 'relative' : oldStyle.position;
    wrs.height = oldStyle.sizes.hb + 'px';
    wrs.width = oldStyle.sizes.wb + 'px';
    wrs.marginTop = oldStyle.margins.t;
    wrs.marginRight = oldStyle.margins.r;
    wrs.marginBottom = oldStyle.margins.b;
    wrs.marginLeft = oldStyle.margins.l;
    wrs.overflow = 'hidden';
    if (jQuery.browser.msie) {
        wrs.styleFloat = oldFloat;
    } else {
        wrs.cssFloat = oldFloat;
    }
    if (jQuery.browser == "msie") {
        es.filter = "alpha(opacity=" + 0.999*100 + ")";
    }
    es.opacity = 0.999;
    //t.wrap(wr);
    e.parentNode.insertBefore(wr, e);
    wr.appendChild(e);
    es.marginTop = '0px';
    es.marginRight = '0px';
    es.marginBottom = '0px';
    es.marginLeft = '0px';
    es.position = 'absolute';
    es.listStyle = 'none';
    es.top = '0px';
    es.left = '0px';
    if (restoreStyle) {
        t.hide();
        es.visibility = oldVisibility;
    }
    return {oldStyle:oldStyle, wrapper:jQuery(wr)};
};

/**
 * named colors
 */
jQuery.fx.namedColors = {
    aqua:[0,255,255],
    azure:[240,255,255],
    beige:[245,245,220],
    black:[0,0,0],
    blue:[0,0,255],
    brown:[165,42,42],
    cyan:[0,255,255],
    darkblue:[0,0,139],
    darkcyan:[0,139,139],
    darkgrey:[169,169,169],
    darkgreen:[0,100,0],
    darkkhaki:[189,183,107],
    darkmagenta:[139,0,139],
    darkolivegreen:[85,107,47],
    darkorange:[255,140,0],
    darkorchid:[153,50,204],
    darkred:[139,0,0],
    darksalmon:[233,150,122],
    darkviolet:[148,0,211],
    fuchsia:[255,0,255],
    gold:[255,215,0],
    green:[0,128,0],
    indigo:[75,0,130],
    khaki:[240,230,140],
    lightblue:[173,216,230],
    lightcyan:[224,255,255],
    lightgreen:[144,238,144],
    lightgrey:[211,211,211],
    lightpink:[255,182,193],
    lightyellow:[255,255,224],
    lime:[0,255,0],
    magenta:[255,0,255],
    maroon:[128,0,0],
    navy:[0,0,128],
    olive:[128,128,0],
    orange:[255,165,0],
    pink:[255,192,203],
    purple:[128,0,128],
    red:[255,0,0],
    silver:[192,192,192],
    white:[255,255,255],
    yellow:[255,255,0]
};

/**
 * parses a color to an object for reg, green and blue
 */
jQuery.fx.parseColor = function(color, notColor)
{
    if (jQuery.fx.namedColors[color]) 
        return {
            r: jQuery.fx.namedColors[color][0],
            g: jQuery.fx.namedColors[color][1],
            b: jQuery.fx.namedColors[color][2]
        };
    else if (result = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/.exec(color))
        return {
            r: parseInt(result[1]),
            g: parseInt(result[2]),
            b: parseInt(result[3])
        };
    else if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)$/.exec(color)) 
        return {
            r: parseFloat(result[1])*2.55,
            g: parseFloat(result[2])*2.55,
            b: parseFloat(result[3])*2.55
        };
    else if (result = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/.exec(color))
        return {
            r: parseInt("0x"+ result[1] + result[1]),
            g: parseInt("0x" + result[2] + result[2]),
            b: parseInt("0x" + result[3] + result[3])
        };
    else if (result = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/.exec(color))
        return {
            r: parseInt("0x" + result[1]),
            g: parseInt("0x" + result[2]),
            b: parseInt("0x" + result[3])
        };
    else
        return notColor == true ? false : {r: 255, g: 255, b: 255};
};
/**
 * CSS rules that can be animated
 */
jQuery.fx.cssProps = {
    borderBottomWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderTopWidth:1,
    bottom:1,
    fontSize:1,
    height:1,
    left:1,
    letterSpacing:1,
    lineHeight:1,
    marginBottom:1,
    marginLeft:1,
    marginRight:1,
    marginTop:1,
    maxHeight:1,
    maxWidth:1,
    minHeight:1,
    minWidth:1,
    opacity:1,
    outlineOffset:1,
    outlineWidth:1,
    paddingBottom:1,
    paddingLeft:1,
    paddingRight:1,
    paddingTop:1,
    right:1,
    textIndent:1,
    top:1,
    width:1,
    zIndex:1
};
/**
 * CSS color rules that can be animated
 */
jQuery.fx.colorCssProps = {
    backgroundColor:1,
    borderBottomColor:1,
    borderLeftColor:1,
    borderRightColor:1,
    borderTopColor:1,
    color:1,
    outlineColor:1
};

jQuery.fx.cssSides = ['Top', 'Right', 'Bottom', 'Left'];
jQuery.fx.cssSidesEnd = {
    'borderWidth': ['border', 'Width'],
    'borderColor': ['border', 'Color'],
    'margin': ['margin', ''],
    'padding': ['padding', '']
};

/**
 * Overwrite animation to use new FX function
 */
jQuery.fn.extend({
    
    animate: function( prop, speed, easing, callback ) {
        return this.queue(function(){
            var opt = jQuery.speed(speed, easing, callback);
            var e = new jQuery.fxe( this, opt, prop );
            
        });
    },
    pause: function(speed, callback) {
        return this.queue(function(){
            var opt = jQuery.speed(speed, callback);
            var e = new jQuery.pause( this, opt );
        });
    },
    stop : function(step) {
        return this.each(function(){
            if (this.animationHandler)
                jQuery.stopAnim(this, step);
            
        });
    },
    stopAll : function(step) {
        return this.each(function(){
            if (this.animationHandler)
                jQuery.stopAnim(this, step);
            if ( this.queue && this.queue['fx'] )
                this.queue.fx = [];
        });
    }
});
/**
 * Improved FXC function that aniamtes collection of properties per timer. Accepts inline styles and class names to animate
 */
jQuery.extend({
    pause: function(elem, options)
    {
        var z = this, values;
        z.step = function()
        {
            if ( jQuery.isFunction( options.complete ) )
                options.complete.apply( elem );
        };
        z.timer=setInterval(function(){z.step();},options.duration);
        elem.animationHandler = z;
    },
    easing :  {
        linear: function(p, n, firstNum, delta, duration) {
            return ((-Math.cos(p*Math.PI)/2) + 0.5) * delta + firstNum;
        }
    },
    fxe: function( elem, options, prop ){
        var z = this, values;

        // The styles
        var y = elem.style;
        var oldOverflow = jQuery.css(elem, "overflow");
        var oldDisplay= jQuery.css(elem, "display");
        var props = {};
        z.startTime = (new Date()).getTime();
        options.easing = options.easing && jQuery.easing[options.easing] ? options.easing : 'linear';
        
        z.getValues = function(tp, vp)
        {
            if (jQuery.fx.cssProps[tp]) {
                if (vp == 'show' || vp == 'hide' || vp == 'toggle') {
                    if ( !elem.orig ) elem.orig = {};
                    var r = parseFloat( jQuery.curCSS(elem, tp) );
                    elem.orig[tp] = r && r > -10000 ? r : (parseFloat( jQuery.css(elem,tp) )||0);
                    vp = vp == 'toggle' ? ( oldDisplay == 'none' ? 'show' : 'hide') : vp;
                    options[vp] = true;
                    props[tp] = vp == 'show' ? [0, elem.orig[tp]] : [elem.orig[tp], 0];
                    if (tp != 'opacity')
                        y[tp] = props[tp][0] + (tp != 'zIndex' && tp != 'fontWeight' ? 'px':'');
                    else
                        jQuery.attr(y, "opacity", props[tp][0]);
                } else {
                    props[tp] = [parseFloat( jQuery.curCSS(elem, tp) ), parseFloat(vp)||0];
                }
            } else if (jQuery.fx.colorCssProps[tp])
                props[tp] = [jQuery.fx.parseColor(jQuery.curCSS(elem, tp)), jQuery.fx.parseColor(vp)];
            else if(/^margin$|padding$|border$|borderColor$|borderWidth$/i.test(tp)) {
                var m = vp.replace(/\s+/g, ' ').replace(/rgb\s*\(\s*/g,'rgb(').replace(/\s*,\s*/g,',').replace(/\s*\)/g,')').match(/([^\s]+)/g);
                switch(tp){
                    case 'margin':
                    case 'padding':
                    case 'borderWidth':
                    case 'borderColor':
                        m[3] = m[3]||m[1]||m[0];
                        m[2] = m[2]||m[0];
                        m[1] = m[1]||m[0];
                        for(var i = 0; i < jQuery.fx.cssSides.length; i++) {
                            var nmp = jQuery.fx.cssSidesEnd[tp][0] + jQuery.fx.cssSides[i] + jQuery.fx.cssSidesEnd[tp][1];
                            props[nmp] = tp == 'borderColor' ?
                                [jQuery.fx.parseColor(jQuery.curCSS(elem, nmp)), jQuery.fx.parseColor(m[i])]
                                : [parseFloat( jQuery.curCSS(elem, nmp) ), parseFloat(m[i])];
                        }
                        break;
                    case 'border':
                        for(var i = 0; i< m.length; i++) {
                            var floatVal = parseFloat(m[i]);
                            var sideEnd = !isNaN(floatVal) ? 'Width' : (!/transparent|none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/i.test(m[i]) ? 'Color' : false);
                            if (sideEnd) {
                                for(var j = 0; j < jQuery.fx.cssSides.length; j++) {
                                    nmp = 'border' + jQuery.fx.cssSides[j] + sideEnd;
                                    props[nmp] = sideEnd == 'Color' ?
                                [jQuery.fx.parseColor(jQuery.curCSS(elem, nmp)), jQuery.fx.parseColor(m[i])]
                                : [parseFloat( jQuery.curCSS(elem, nmp) ), floatVal];
                                }
                            } else {
                                y['borderStyle'] = m[i];
                            }
                        }
                        break;
                }
            } else {
                y[tp] = vp;
            }
            return false;
        };
        
        for(p in prop) {
            if (p == 'style') {
                var newStyles = jQuery.parseStyle(prop[p]);
                for (np in newStyles) {
                    this.getValues(np, newStyles[np]);
                }
            } else if (p == 'className') {
                if (document.styleSheets)
                    for (var i=0; i<document.styleSheets.length; i++){
                        var cssRules = document.styleSheets[i].cssRules||document.styleSheets[i].rules||null;
                        if (cssRules) {
                            for (var j=0; j<cssRules.length; j++) {
                                if(cssRules[j].selectorText == '.' + prop[p]) {
                                    var rule = new RegExp('\.' + prop[p] + ' {');
                                    var styles = cssRules[j].style.cssText;
                                    var newStyles = jQuery.parseStyle(styles.replace(rule, '').replace(/}/g, ''));
                                    for (np in newStyles) {
                                        this.getValues(np, newStyles[np]);
                                    }
                                }
                            }
                        }
                    }
            } else {
                this.getValues(p, prop[p]);
            }
        }
        y.display = oldDisplay == 'none' ? 'block' : oldDisplay;
        y.overflow = 'hidden';
        
        /*if (options.show)
            y.display = "";*/
        
        z.step = function(){
            var t = (new Date()).getTime();
            if (t > options.duration + z.startTime) {
                clearInterval(z.timer);
                z.timer = null;
                for (p in props) {
                    if ( p == "opacity" )
                        jQuery.attr(y, "opacity", props[p][1]);
                    else if (typeof props[p][1] == 'object')
                        y[p] = 'rgb(' + props[p][1].r +',' + props[p][1].g +',' + props[p][1].b +')';
                    else 
                        y[p] = props[p][1] + (p != 'zIndex' && p != 'fontWeight' ? 'px':'');
                }
                if ( options.hide || options.show )
                    for ( var p in elem.orig )
                        if (p == "opacity")
                            jQuery.attr(y, p, elem.orig[p]);
                        else
                            y[p] = "";
                y.display = options.hide ? 'none' : (oldDisplay !='none' ? oldDisplay : 'block');
                y.overflow = oldOverflow;
                elem.animationHandler = null;
                if ( jQuery.isFunction( options.complete ) )
                    options.complete.apply( elem );
            } else {
                var n = t - this.startTime;
                var pr = n / options.duration;
                for (p in props) {
                    if (typeof props[p][1] == 'object') {
                        y[p] = 'rgb('
                        + parseInt(jQuery.easing[options.easing](pr, n,  props[p][0].r, (props[p][1].r-props[p][0].r), options.duration))
                        + ','
                        + parseInt(jQuery.easing[options.easing](pr, n,  props[p][0].g, (props[p][1].g-props[p][0].g), options.duration))
                        + ','
                        + parseInt(jQuery.easing[options.easing](pr, n,  props[p][0].b, (props[p][1].b-props[p][0].b), options.duration))
                        +')';
                    } else {
                        var pValue = jQuery.easing[options.easing](pr, n,  props[p][0], (props[p][1]-props[p][0]), options.duration);
                        if ( p == "opacity" )
                            jQuery.attr(y, "opacity", pValue);
                        else 
                            y[p] = pValue + (p != 'zIndex' && p != 'fontWeight' ? 'px':'');
                    }
                }

            }
        };
    z.timer=setInterval(function(){z.step();},13);
    elem.animationHandler = z;
    },
    stopAnim: function(elem, step)
    {
        if (step)
            elem.animationHandler.startTime -= 100000000;
        else {
            window.clearInterval(elem.animationHandler.timer);
            elem.animationHandler = null;
            jQuery.dequeue(elem, "fx");
        }
    }
}
);

jQuery.parseStyle = function(styles) {
    var newStyles = {};
    if (typeof styles == 'string') {
        styles = styles.toLowerCase().split(';');
        for(var i=0; i< styles.length; i++){
            rule = styles[i].split(':');
            if (rule.length == 2) {
                newStyles[jQuery.trim(rule[0].replace(/\-(\w)/g,function(m,c){return c.toUpperCase();}))] = jQuery.trim(rule[1]);
            }
        }
    }
    return newStyles;
};

/**
 * Interface Elements for jQuery
 * Tooltip
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

/**
 * Creates tooltips using title attribute
 *
 * 
 * 
 * @name ToolTip
 * @description Creates tooltips using title attribute
 * @param Hash hash A hash of parameters
 * @option String position tooltip's position ['top'|'left'|'right'|'bottom'|'mouse']
 * @options Function onShow (optional) A function to be executed whenever the tooltip is displayed
 * @options Function onHide (optional) A function to be executed whenever the tooltip is hidden
 *
 * @type jQuery
 * @cat Plugins/Interface
 * @author Stefan Petre
 */
jQuery.iTooltip = {
    current : null,
    focused : false,
    oldTitle : null,
    focus : function(e)
    {
        jQuery.iTooltip.focused = true;
        jQuery.iTooltip.show(e, this, true);
    },
    hidefocused : function(e)
    {
        if (jQuery.iTooltip.current != this)
            return ;
        jQuery.iTooltip.focused = false;
        jQuery.iTooltip.hide(e, this);
    },
    show : function(e, el, focused)
    {
        if (jQuery.iTooltip.current != null)
            return ;
        if (!el) {
            el = this;
        }
        
        jQuery.iTooltip.current = el;
        pos = jQuery.extend(
            jQuery.iUtil.getPosition(el),
            jQuery.iUtil.getSize(el)
        );
        jEl = jQuery(el);
        title = jEl.attr('title');
        href = jEl.attr('href');
        if (title) {
            jQuery.iTooltip.oldTitle = title;
            jEl.attr('title','');
            jQuery('#tooltipTitle').html(title);
            if (href)
                jQuery('#tooltipURL').html(href.replace('http://', ''));
            else 
                jQuery('#tooltipURL').html('');
            helper = jQuery('#tooltipHelper');
            if(el.tooltipCFG.className){
                helper.get(0).className = el.tooltipCFG.className;
            } else {
                helper.get(0).className = '';
            }
            helperSize = jQuery.iUtil.getSize(helper.get(0));
            filteredPosition = focused && el.tooltipCFG.position == 'mouse' ? 'bottom' : el.tooltipCFG.position;
            
            switch (filteredPosition) {
                case 'top':
                    ny = pos.y - helperSize.hb;
                    nx = pos.x;
                break;
                case 'left' :
                    ny = pos.y;
                    nx = pos.x - helperSize.wb;
                break;
                case 'right' :
                    ny = pos.y;
                    nx = pos.x + pos.wb;
                break;
                case 'mouse' :
                    jQuery('body').bind('mousemove', jQuery.iTooltip.mousemove);
                    pointer = jQuery.iUtil.getPointer(e);
                    ny = pointer.y + 15;
                    nx = pointer.x + 15;
                break;
                default :
                    ny = pos.y + pos.hb;
                    nx = pos.x;
                break;
            }
            helper.css(
                {
                    top     : ny + 'px',
                    left    : nx + 'px'
                }
            );
            if (el.tooltipCFG.delay == false) {
                helper.show();
            } else {
                helper.fadeIn(el.tooltipCFG.delay);
            }
            if (el.tooltipCFG.onShow) 
                el.tooltipCFG.onShow.apply(el);
            jEl.bind('mouseout',jQuery.iTooltip.hide)
               .bind('blur',jQuery.iTooltip.hidefocused);
        }
    },
    mousemove : function(e)
    {
        if (jQuery.iTooltip.current == null) {
            jQuery('body').unbind('mousemove', jQuery.iTooltip.mousemove);
            return; 
        }
        pointer = jQuery.iUtil.getPointer(e);
        jQuery('#tooltipHelper').css(
            {
                top     : pointer.y + 15 + 'px',
                left    : pointer.x + 15 + 'px'
            }
        );
    },
    hide : function(e, el)
    {
        if (!el) {
            el = this;
        }
        if (jQuery.iTooltip.focused != true && jQuery.iTooltip.current == el) {
            jQuery.iTooltip.current = null;
            jQuery('#tooltipHelper').fadeOut(1);
            jQuery(el)
                .attr('title',jQuery.iTooltip.oldTitle)
                .unbind('mouseout', jQuery.iTooltip.hide)
                .unbind('blur', jQuery.iTooltip.hidefocused);
            if (el.tooltipCFG.onHide) 
                el.tooltipCFG.onHide.apply(el);
            jQuery.iTooltip.oldTitle = null;
        }
    },
    build : function(options)
    {
        if (!jQuery.iTooltip.helper)
        {
            jQuery('body').append('<div id="tooltipHelper"><div id="tooltipTitle"></div><div id="tooltipURL"></div></div>');
            jQuery('#tooltipHelper').css(
                {
                    position:   'absolute',
                    zIndex:     3000,
                    display:    'none'
                }
            );
            jQuery.iTooltip.helper = true;
        }
        return this.each(
            function(){
                if(jQuery.attr(this,'title')) {
                    this.tooltipCFG = {
                        position    : /top|bottom|left|right|mouse/.test(options.position) ? options.position : 'bottom',
                        className   : options.className ? options.className : false,
                        delay       : options.delay ? options.delay : false,
                        onShow      : options.onShow && options.onShow.constructor == Function ? options.onShow : false,
                        onHide      : options.onHide && options.onHide.constructor == Function ? options.onHide : false
                    };
                    var el = jQuery(this);
                    el.bind('mouseover',jQuery.iTooltip.show);
                    el.bind('focus',jQuery.iTooltip.focus);
                }
            }
        );
    }
};

jQuery.fn.ToolTip = jQuery.iTooltip.build;

/*
 * Thickbox 3.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2007 cody lindley
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/
          


/*!!!!!!!!!!!!!!!!! edit below this line at your own risk !!!!!!!!!!!!!!!!!!!!!!!*/

//on page load call tb_init
$(document).ready(function(){   
    tb_init('a.thickbox, area.thickbox, input.thickbox');//pass where to apply thickbox

});

//add thickbox to href & area elements that have a class of .thickbox
function tb_init(domChunk){
    $(domChunk).click(function(){
    var t = this.title || this.name || null;
    var a = this.href || this.alt;
    var g = this.rel || false;
    tb_show(t,a,g);
    this.blur();
    return false;
    });
}

function tb_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link

    try {
        if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
            $("body","html").css({height: "100%", width: "100%"});
            $("html").css("overflow","hidden");
            if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
                $("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
                $("#TB_overlay").click(tb_remove);
            }
        }else{//all others
            if(document.getElementById("TB_overlay") === null){
                $("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
                $("#TB_overlay").click(tb_remove);
            }
        }
        
        if(tb_detectMacXFF()){
            $("#TB_overlay").addClass("TB_overlayMacFFBGHack");//use png overlay so hide flash
        }else{
            $("#TB_overlay").addClass("TB_overlayBG");//use background and opacity
        }
        
        if(caption===null){caption="";}
        $("body").append("<div id='TB_load'><img src='"+imgLoader.src+"' /></div>");//add loader to the page
        $('#TB_load').show();//show loader
        
        var baseURL;
       if(url.indexOf("?")!==-1){ //ff there is a query string involved
            baseURL = url.substr(0, url.indexOf("?"));
       }else{ 
            baseURL = url;
       }
       
       var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
       var urlType = baseURL.toLowerCase().match(urlString);

        if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp'){//code to show images
                
            TB_PrevCaption = "";
            TB_PrevURL = "";
            TB_PrevHTML = "";
            TB_NextCaption = "";
            TB_NextURL = "";
            TB_NextHTML = "";
            TB_imageCount = "";
            TB_FoundURL = false;
            if(imageGroup){
                TB_TempArray = $("a[@rel="+imageGroup+"]").get();
                for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
                    var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
                        if (!(TB_TempArray[TB_Counter].href == url)) {                      
                            if (TB_FoundURL) {
                                TB_NextCaption = TB_TempArray[TB_Counter].title;
                                TB_NextURL = TB_TempArray[TB_Counter].href;
                                TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>";
                            } else {
                                TB_PrevCaption = TB_TempArray[TB_Counter].title;
                                TB_PrevURL = TB_TempArray[TB_Counter].href;
                                TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>";
                            }
                        } else {
                            TB_FoundURL = true;
                            TB_imageCount = "Image " + (TB_Counter + 1) +" of "+ (TB_TempArray.length);                                         
                        }
                }
            }

            imgPreloader = new Image();
            imgPreloader.onload = function(){       
            imgPreloader.onload = null;
                
            // Resizing large images - orginal by Christian Montoya edited by me.
            var pagesize = tb_getPageSize();
            var x = pagesize[0] - 150;
            var y = pagesize[1] - 150;
            var imageWidth = imgPreloader.width;
            var imageHeight = imgPreloader.height;
            if (imageWidth > x) {
                imageHeight = imageHeight * (x / imageWidth); 
                imageWidth = x; 
                if (imageHeight > y) { 
                    imageWidth = imageWidth * (y / imageHeight); 
                    imageHeight = y; 
                }
            } else if (imageHeight > y) { 
                imageWidth = imageWidth * (y / imageHeight); 
                imageHeight = y; 
                if (imageWidth > x) { 
                    imageHeight = imageHeight * (x / imageWidth); 
                    imageWidth = x;
                }
            }
            // End Resizing
            
            TB_WIDTH = imageWidth + 30;
            TB_HEIGHT = imageHeight + 60;
            $("#TB_window").append("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a> or Esc Key</div>");      
            
            $("#TB_closeWindowButton").click(tb_remove);
            
            if (!(TB_PrevHTML === "")) {
                function goPrev(){
                    if($(document).unbind("click",goPrev)){$(document).unbind("click",goPrev);}
                    $("#TB_window").remove();
                    $("body").append("<div id='TB_window'></div>");
                    tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
                    return false;   
                }
                $("#TB_prev").click(goPrev);
            }
            
            if (!(TB_NextHTML === "")) {        
                function goNext(){
                    $("#TB_window").remove();
                    $("body").append("<div id='TB_window'></div>");
                    tb_show(TB_NextCaption, TB_NextURL, imageGroup);                
                    return false;   
                }
                $("#TB_next").click(goNext);
                
            }

            document.onkeydown = function(e){   
                if (e == null) { // ie
                    keycode = event.keyCode;
                } else { // mozilla
                    keycode = e.which;
                }
                if(keycode == 27){ // close
                    tb_remove();
                } else if(keycode == 190){ // display previous image
                    if(!(TB_NextHTML == "")){
                        document.onkeydown = "";
                        goNext();
                    }
                } else if(keycode == 188){ // display next image
                    if(!(TB_PrevHTML == "")){
                        document.onkeydown = "";
                        goPrev();
                    }
                }   
            };
            
            tb_position();
            $("#TB_load").remove();
            $("#TB_ImageOff").click(tb_remove);
            $("#TB_window").css({display:"block"}); //for safari using css instead of show
            };
            
            imgPreloader.src = url;
        }else{//code to show html
            
            var queryString = url.replace(/^[^\?]+\??/,'');
            var params = tb_parseQuery( queryString );

            TB_WIDTH = (params['width']*1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
            TB_HEIGHT = (params['height']*1) + 40 || 440; //defaults to 440 if no paramaters were added to URL
            ajaxContentW = TB_WIDTH - 30;
            ajaxContentH = TB_HEIGHT - 45;
            
            if(url.indexOf('TB_iframe') != -1){// either iframe or ajax window      
                    urlNoQuery = url.split('TB_');
                    $("#TB_iframeContent").remove();
                    if(params['modal'] != "true"){//iframe no modal
                        $("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a> or Esc Key</div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' > </iframe>");
                    }else{//iframe modal
                    $("#TB_overlay").unbind();
                        $("#TB_window").append("<iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'> </iframe>");
                    }
            }else{// not an iframe, ajax
                    if($("#TB_window").css("display") != "block"){
                        if(params['modal'] != "true"){//ajax no modal
                        $("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>close</a> or Esc Key</div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");
                        }else{//ajax modal
                        $("#TB_overlay").unbind();
                        $("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>"); 
                        }
                    }else{//this means the window is already up, we are just loading new content via ajax
                        $("#TB_ajaxContent")[0].style.width = ajaxContentW +"px";
                        $("#TB_ajaxContent")[0].style.height = ajaxContentH +"px";
                        $("#TB_ajaxContent")[0].scrollTop = 0;
                        $("#TB_ajaxWindowTitle").html(caption);
                    }
            }
                    
            $("#TB_closeWindowButton").click(tb_remove);
            
                if(url.indexOf('TB_inline') != -1){ 
                    $("#TB_ajaxContent").append($('#' + params['inlineId']).children());
                    $("#TB_window").unload(function () {
                        $('#' + params['inlineId']).append( $("#TB_ajaxContent").children() ); // move elements back when you're finished
                    });
                    tb_position();
                    $("#TB_load").remove();
                    $("#TB_window").css({display:"block"}); 
                }else if(url.indexOf('TB_iframe') != -1){
                    tb_position();
                    if($.browser.safari){//safari needs help because it will not fire iframe onload
                        $("#TB_load").remove();
                        $("#TB_window").css({display:"block"});
                    }
                }else{
                    $("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()),function(){//to do a post change this load method
                        tb_position();
                        $("#TB_load").remove();
                        tb_init("#TB_ajaxContent a.thickbox");
                        $("#TB_window").css({display:"block"});
                    });
                }
            
        }

        if(!params['modal']){
            document.onkeyup = function(e){     
                if (e == null) { // ie
                    keycode = event.keyCode;
                } else { // mozilla
                    keycode = e.which;
                }
                if(keycode == 27){ // close
                    tb_remove();
                }   
            };
        }
        
    } catch(e) {
        //nothing here
    }
}

//helper functions below
function tb_showIframe(){
    $("#TB_load").remove();
    $("#TB_window").css({display:"block"});
}

function tb_remove() {
    $("#TB_imageOff").unbind("click");
    $("#TB_closeWindowButton").unbind("click");
    $("#TB_window").fadeOut("fast",function(){$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
    $("#TB_load").remove();
    if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
        $("body","html").css({height: "auto", width: "auto"});
        $("html").css("overflow","");
    }
    document.onkeydown = "";
    document.onkeyup = "";
    return false;
}

function tb_position() {
$("#TB_window").css({marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px', width: TB_WIDTH + 'px'});
    if ( !(jQuery.browser.msie && jQuery.browser.version < 7)) { // take away IE6
        $("#TB_window").css({marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'});
    }
}

function tb_parseQuery ( query ) {
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function tb_getPageSize(){
    var de = document.documentElement;
    var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
    var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
    arrayPageSize = [w,h];
    return arrayPageSize;
}

function tb_detectMacXFF() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
    return true;
  }
}




/*
    Base, version 1.0.2
    Copyright 2006, Dean Edwards
    License: http://creativecommons.org/licenses/LGPL/2.1/
*/

var Base = function() {
    if (arguments.length) {
        if (this == window) { // cast an object to this class
            Base.prototype.extend.call(arguments[0], arguments.callee.prototype);
        } else {
            this.extend(arguments[0]);
        }
    }
};

Base.version = "1.0.2";

Base.prototype = {
    extend: function(source, value) {
        var extend = Base.prototype.extend;
        if (arguments.length == 2) {
            var ancestor = this[source];
            // overriding?
            if ((ancestor instanceof Function) && (value instanceof Function) &&
                ancestor.valueOf() != value.valueOf() && /\bbase\b/.test(value)) {
                var method = value;
            //  var _prototype = this.constructor.prototype;
            //  var fromPrototype = !Base._prototyping && _prototype[source] == ancestor;
                value = function() {
                    var previous = this.base;
                //  this.base = fromPrototype ? _prototype[source] : ancestor;
                    this.base = ancestor;
                    var returnValue = method.apply(this, arguments);
                    this.base = previous;
                    return returnValue;
                };
                // point to the underlying method
                value.valueOf = function() {
                    return method;
                };
                value.toString = function() {
                    return String(method);
                };
            }
            return this[source] = value;
        } else if (source) {
            var _prototype = {toSource: null};
            // do the "toString" and other methods manually
            var _protected = ["toString", "valueOf"];
            // if we are prototyping then include the constructor
            if (Base._prototyping) _protected[2] = "constructor";
            for (var i = 0; (name = _protected[i]); i++) {
                if (source[name] != _prototype[name]) {
                    extend.call(this, name, source[name]);
                }
            }
            // copy each of the source object's properties to this object
            for (var name in source) {
                if (!_prototype[name]) {
                    extend.call(this, name, source[name]);
                }
            }
        }
        return this;
    },

    base: function() {
        // call this method from any other method to invoke that method's ancestor
    }
};

Base.extend = function(_instance, _static) {
    var extend = Base.prototype.extend;
    if (!_instance) _instance = {};
    // build the prototype
    Base._prototyping = true;
    var _prototype = new this;
    extend.call(_prototype, _instance);
    var constructor = _prototype.constructor;
    _prototype.constructor = this;
    delete Base._prototyping;
    // create the wrapper for the constructor function
    var klass = function() {
        if (!Base._prototyping) constructor.apply(this, arguments);
        this.constructor = klass;
    };
    klass.prototype = _prototype;
    // build the class interface
    klass.extend = this.extend;
    klass.implement = this.implement;
    klass.toString = function() {
        return String(constructor);
    };
    extend.call(klass, _static);
    // single instance
    var object = constructor ? klass : _prototype;
    // class initialisation
    if (object.init instanceof Function) object.init();
    return object;
};

Base.implement = function(_interface) {
    if (_interface instanceof Function) _interface = _interface.prototype;
    this.prototype.extend(_interface);
};



if (!("console" in window) || !("firebug" in console))
{
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    if (!window.console) window.console = {};
    for (var i = 0; i < names.length; ++i)
        if (!window.console[names[i]])
            window.console[names[i]] = function() {}
}


jQuery.fn.log = function (msg) {
    console.log("%s: %o", msg, this);
    return this;
};

function hitch(obj, fun) {
    if(typeof(fun) != 'function') {
        fun = obj[fun];
    }
    return function() { return fun.apply(obj, arguments); }
}

function deadkey(evt) {
    deadkeys = [6,18,37,38,39,40,20,17,35,27,36,45,144,16,9,91,224];
    for(var i = 0; i<deadkeys.length; i++) {
        if(evt.which == deadkeys[i]) {
            return true;
        }
    }
    return false;
}

function h(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function connect_trip_share_links() {
    $(".trip-share-link").unbind('click').click(function() {
        var t = this.title || this.name || null;
        var a = this.href || this.alt;
        var g = this.rel || false;
        a += "?height=500&width=430"; // get content with ajax
        tb_show(t,a,g);
        return false;
    });
}

Date.prototype.yyyymmdd = function() {
    var ymd = this.getFullYear() + "-";
    if(this.getMonth() < 10) {
        ymd += "0";
    }
    ymd += this.getMonth() + "-";
    if(this.getDate() < 10) {
        ymd += "0";
    }
    ymd += this.getDate();
    return ymd;
}

// http://simonwillison.net/2006/Jan/20/escape/
RegExp.escape = function(text) {
  if (!arguments.callee.sRE) {
    var specials = [
      '/', '.', '*', '+', '?', '|',
      '(', ')', '[', ']', '{', '}', '\\'
    ];
    arguments.callee.sRE = new RegExp(
      '(\\' + specials.join('|\\') + ')', 'g'
    );
  }
  return text.replace(arguments.callee.sRE, '\\$1');
}

var CoincidenceCache = Base.extend({
    constructor: function(list,start,finish,url) {
        this.list = $(list);
        this.url = url;
        this.clear_cache();
        this.count = 0;
        this.start = start;
        this.finish = finish;
        this.last_updated = 0;
        $(document).bind('update_coincidences', hitch(this,this.repaint));
        $(document).bind('update_placename', hitch(this,this.update_placename));
    },
    set_start: function(start) {
        if(start > this.finish) {
            this.start = this.finish;
        } else {
            this.start = start;
        }
        this.clear_cache();
        return this.start;
    },
    set_finish: function(finish) {
        if(finish < this.start) {
            this.finish = this.start;
        } else {
            this.finish = finish;
        }
        this.clear_cache();
        return this.finish;
    },
    set_count: function(count) {
        this.count = count;
    },
    clear_cache: function() {
        this.cache = {};
    },
    update: function(force) {
        if(force || new Date().getTime() - this.last_updated > 1000) {
            this.last_updated = new Date().getTime();
            this.load_values(true);
        } else {
            this.load_values(false);
            $(document).trigger('update_placename');
        }
    },
    update_placename: function() {
        if(this.count-1 in this.cache) {
            var cached = this.cache[this.count-1]
            $('#place').text(cached.place);
            $('#map').trigger('circle',[cached.distance]);
        }
    },
    load_values: function(ajax) {
        missing = []
        var max = -1;
        for(var i = 0; i < this.count; i++) {
            if(!(i in this.cache)) {
                missing.push(i);
                if(i > max) {
                    max = i;
                }
            }
        }
        if(max != -1 && ajax) {
            $('#loading').show();
            var url = this.url;
            url += "?"
            url += "max=" + max;
            url += "&start=" + this.start.yyyymmdd();
            url += "&finish=" + this.finish.yyyymmdd();
            $.getJSON(url,hitch(this,this.data));
        }
        $(document).trigger('update_coincidences');
    },
    data: function(d) {
        $('#loading').hide();
        $.each(d.coincidences, hitch(this,function(key,value) {
            this.cache[key] = value;
        }));
        $(document).trigger('update_coincidences');
        $(document).trigger('update_placename');
    },
    display_coincidence: function(item) {
        return "<a href='/trip/" + item.trip.id + "'>" + h(item.traveller.name) + "</a>"
    },
    display_home: function(item) {
        return item.name
    },
    repaint: function() {
        if(this.count >= 0) {
            $('#place-p').show();
            this.list.empty();
            for(var i = 0; i < this.count; i++) {
                var cs = [];
                var hs = [];
                if(i in this.cache) {
                    $.each(this.cache[i].trips,hitch(this,function(index,item) {
                        cs.push(this.display_coincidence(item));
                    }));
                    $.each(this.cache[i].homes,hitch(this,function(index,item) {
                        hs.push(this.display_home(item));
                    }));
                    if(cs.length > 0 || hs.length > 0) {
                        if(cs.length > 0) {
                            var message = this.cache[i].place + " visitors ("+ cs.length + "): ";
                            message += cs.join(", ") + ".";
                            $('<li></li>').html(message).appendTo(this.list);
                        }
                        if(hs.length > 0) {
                            var message = this.cache[i].place + " residents (" + hs.length + "): ";
                            message += hs.join(", ") + "."
                            $('<li></li>').html(message).appendTo(this.list);
                        }
                    }
                }
            }
        }
    }
});

var MapHandler = Base.extend({
    constructor: function(map) {
        this.map = map;
    },
    onClick: function (marker,point) {
        if(point != undefined) {
            $('#loading').show();
            $.getJSON("/city/nearest?lat="+point.lat()+"&lng="+point.lng(),hitch(this,"onNearest"));
        }
    },
    onNearest: function(data,status) {
        $('#loading').hide();
        marker = new GMarker(new GLatLng(data.lat,data.lng), {title: data.name });
        //this.map.savePosition();
        this.map.panTo(marker.getPoint());
        this.map.setZoom(6);
        this.map.addOverlay(marker);
        $('#destination').html("<p>A trip to <a href='/city/geo/"+escape(data.id)+"'>"+h(data.name)+"?</a></p>");
        $('#city').val(data.name);

        marker.openInfoWindowHtml($('#newtrip').html());

        var mapThis = this;
        l = GEvent.addListener( marker, "infowindowclose", function() {
            mapThis.map.removeOverlay( marker );
            //listenerMap.returnToSavedPosition();
            GEvent.removeListener( l );
        });
    }
});

// global status magical stripe of action
function pulse_status( html ) {
  if (html) {
    $("#status").html('<dl class="margin-bottom-full"><dt class="i">i</dt><dd>' + html + '</dd></dl>').show("fast");
  }
  if ($("#status").html() && $("#status").html().match(/\S/)) {
    $('#status').animate({opacity: 1.0}, 500) // equivalent of delay in animation queue
                .animate({ backgroundColor: '#f8f4ac' }, 'slow')
                .animate({opacity: 1.0}, 4500) // equivalent of delay in animation queue
                .animate({ backgroundColor: '#ffffff' }, 'slow');
  } else {
    $("#status").hide();
  }
}

function beenthere_button(evt) {
    var panel = $(evt.target).parents(".beenthere");
    var a_tag = panel.find("a");
    var states = ["starred","unstarred", "question"];
    // work backwards
    $.each(states, function(idx, state) {
        var next_state = states[idx-1];
        if (!next_state)
            next_state = states[ states.length - 1 ];
            
        var button = panel.find(".beenthere_" + state);
        if(button.length > 0) {
            button.removeClass("beenthere_" + state).addClass("beenthere_" + next_state);
            var trip_id = panel.find('input.trip_id').val();
            var url = a_tag.attr('href');
            panel.find('.beenthere_you').html("&hellip;")
            a_tag.attr('title','');
            $.ajax({
                url: url,
                data: { 'vote':next_state },
                dataType: "json",
                success: function(data) {
                    panel.find('.beenthere_you').html(data.status);
                    panel.find('.beenthere_summary').html(data.summary);
                    a_tag.attr('title',data.newtitle);
                    a_tag.attr('href',data.newlink);

                    // the search tile needs this, becasue it can't be inside the panel
                    $('#' + data.poi_id + '_beenthere_summary').html(data.summary);
                }
            });
            return false; // done something bug out here
        }

    });
    return false;
}

var AppBehaviours = Base.extend({
    constructor: function() {
        this.behaviours = {};
    },
    define: function() {
        pulse_status();

        $('.beenthere_button').click(beenthere_button);
        $('.hilight').animate({opacity: 1.0}, 9000).animate({ backgroundColor: '#ffffff' }, 'slow');

        $('a.ack-notification').click(function(evt) {
            var target = $(evt.target);
            //target.parent("div").slideUp('normal');
            target.parent("div").fadeOut("slow");
            $.getJSON(target.attr('href'), { format: 'js' });
            return false;
        });

        $('.__track').click(function(evt) {
            var clicked = $(evt.target);
            if(clicked.filter('.__track').length == 0) {
                // if a sub-element caught the event, walk back up to the element
                clicked = clicked.parents('.__track');
            }
            $.ajax({
                    url: '/main/track',
                    data: {
                        location: window.location,
                        data: clicked.attr('track')
                    }
                });
            return true;
        });


        // manage connection interactions
        $('.call_href_as_ajax').click(hitch(this, "call_href_as_ajax"));
        $('.fellows_controls').hide(); // these are the non-ajax fallback controls.
        $('.fellows-batch-controls').hide(); // these are the non-ajax fallback controls.
        
        // connects an edit_trip form to the disambguate code. This is a function
        // so that we can also call it from the thickbox trip editor to connect a newly-created
        // trip.
        this.connect_edit_trip_actions();

        // main search box
        $('input.searchbox').searchField();

        // quilt of icons
        $('a.traveller_icon').ToolTip({
            className: 'travellerTooltip',
            position: 'left',
            delay: 1
        });
        
        this.connect_add_note_action();
        $('a.edit-tip-link').click(function() {
            $(this).after("<img id='spinner' src='/images/dopplr-anim-smaller-faster.gif' />");
            $('a.edit-tip-link').hide();
            $('a.add-tip-link').hide();

            var tip_id = $(this).attr('tip');
            var tip_div = $('#tip_' + tip_id);
            var original_contents = tip_div.html();
            var form_div = $(document.createElement("div"));
            tip_div.after(form_div);
            var link = $(this).attr('href');
            $.ajax({
                url:link,
                success:function(data) {
                  form_div.addClass('formpanel margin-bottom-full');
                  form_div.html(data);
                  tip_form_ajax();
                  tip_div.hide();
                  $('a.cancel-form-link').show();
                  $('#cancel-edit-tip').click(function() {
                      form_div.remove();
                      tip_div.show();
                      $('a.edit-tip-link').show();
                      $('a.add-tip-link').show();
                      $('#spinner').remove();
                      return false;
                  });
                },
                error:function() {
                  window.location = link;
                }
            });
            return false;
        });
        
        $('.edit_trip_link').click(function() {
          var match = this.id.match(/edit_trip_(\d+)/);
          if (!match) return true;
          var trip_id = match[1];
          var tripcontainer = $("#trip_" + trip_id);
          tripcontainer.addClass('edittrip formpanel margin-bottom-full');
          $("#trip_partial_" + trip_id).hide().html("<img src='/images/loadingAnimation.gif' />").show('fast');
          var link = $(this).attr('href');

          $.ajax({
              url:link,
              success:function(data) {
                $("#trip_partial_" + trip_id).html( data ).fadeIn('fast');
                tripcontainer.children(".related-trip-list").fadeOut('fast');
                $("#edit-description-buttons, #begin-edit-description").hide('fast');

                // there may be an in-line cancel link as well. So connect the cancel action here,
                // rather than when we click 'edit'
                $(".cancel-trip-edit-link").click(function() {
                  edit_trip_form_is_dirty = false;
                  $("#trip_partial_" + trip_id).fadeOut('fast');
                  $("#trip_" + trip_id).removeClass('edittrip formpanel margin-bottom-full');
                  $("#trip_" + trip_id).children(".related-trip-list").fadeIn('fast');
                  $(".cancel-trip-edit-link").hide();
                  $('.edit_trip_link').show();
                  $("#edit-description-buttons, #begin-edit-description").fadeIn('fast');
                  return false;
                });

              },
              error:function() {
                window.location = link;
              }
          })
          $('.edit_trip_link').hide('slow');
          $(this).hide();
          $("<a href='#' class='cancel-trip-edit-link'>Cancel edit</a>").insertAfter( this );
          return false;
        });

        $(".journal-rssi").click(function() {
          var link = $(this).attr('href');
          // abuse HTML attributes to convey the success message.
          var success_text = $(this).attr('successtext') || $(this).attr('success');
          var wrapper = $(this).parents(".rssi"); // the parent element of the RSS object
          $(this).html("<img src='/images/dopplr-anim-smaller-faster.gif' />");
          $.ajax({
            'url':link,
            'success':function(data) { wrapper.html( success_text || data ) },
            'error':function(data, error) { window.location = link }
          });
          return false;
        })


    },
    connect_add_note_action:function myself() {
        $("#add-note-ajax").submit(function() {
            var note = $("#note").val();
            $("#add-note-ajax input").after("<img id='spinner' src='/images/dopplr-anim-smaller-faster.gif' />").remove();
            $.ajax({
              url:$("#add-note-ajax").attr('action'),
              data:{ 'note':note },
              type:"POST",
              error:function() {
                alert("There was an error adding the comment, sorry.");
              },
              success:function(data) {
                $("#trip-page-notes").html( data );
                // this form has been replaced, so reconnect this ajax action
                myself();
              }
            });
            return false;
        });
        $(".edit-note-link, .delete-note-link").click(function() {
            $(this).after("<img id='spinner' src='/images/dopplr-anim-smaller-faster.gif' />").hide();
            $.ajax({
              url:$(this).attr('href'),
              data:{ 'note_id':$(this).attr('href').match(/note_id=(\d+)/)[1] },
              type:"GET",
              error:function(data, e) { alert(e); window.location = self.attr('href') },
              success:function(data) {
                $("#trip-page-notes").html( data );
                // this form has been replaced, so reconnect this ajax action
                myself();
              } 
            });
            return false;
        });
        $(".ajax-cancel-edit-note").click(function() {
            $(this).after("<img id='spinner' src='/images/dopplr-anim-smaller-faster.gif' />").hide();
            $.ajax({
              url:$(".edit-note-form").attr('action'),
              type:"GET",
              error:function() { window.location = self.attr('href') },
              success:function(data) {
                $("#trip-page-notes").html( data );
                // this form has been replaced, so reconnect this ajax action
                myself();
              } 
            });
            return false;
        });
        $(".edit-note-form").submit(function() {
            // we're about to destroy the form, grab these first.
            var body = $("#body").val();
            var note_id = $("#note_id").val();
            var url = $(this).attr('action');
            $(this).after("<img id='spinner' src='/images/dopplr-anim-smaller-faster.gif' />").remove();
            $.ajax({
              url:url,
              data:{ 'note_id':note_id, 'body':body },
              type:"POST",
              error:function() {
                alert("There was an error editing the comment, sorry.");
                window.location.reload();
              },
              success:function(data) {
                $("#trip-page-notes").html( data );
                // this form has been replaced, so reconnect this ajax action
                myself();
              }
            });
            return false;
        });
    },
    connect_edit_trip_actions:function() {
    
        // edit trip interactions
        $('input#check_placename_go').click(hitch(this,"event_check_placename"));
        $('input.place-selector').keyup(hitch(this,"place_inputbox_key"));
        $('input.place-selector').blur(hitch(this,"place_inputbox_blur"));
        $('input.place-selector').focus(hitch(this,"place_inputbox_focus"));
        $('form.disambiguate').append("<input type='hidden' name='ajaxed' id='ajaxed' value='1' />").submit(hitch(this,"submit_trip"));

        if($('input.place-id').val() == '') { 
            this.set_submit_not_ok();
        } else {
            this.set_submit_ok();
        }
        if($('form.disambiguate').is('form.editing')) {
            this.set_submit_ok();
        }

    },
    set_submit_ok: function() {
        $('form.disambiguate input.submit').attr('disabled',false);
        this.submit_ok = true;
        // DEBUG: console.log("Enabling form submit");
    },
    set_submit_not_ok: function() {
        if(this.submit_ok) {
            $('input.hiddenfields').remove();
            $('form.disambiguate input.submit').attr('disabled',true);
            this.submit_ok = false;
            // DEBUG: console.log("Stopping form submit");
        }
    },
    submit_trip: function(evt) {
        if(this.submit_ok) {
            $("#submitButton").attr("value", 'Saving...').attr("disabled", true );
            return true;
        } else {
            $('#edit_trip_submit_feedback').text("Please choose a destination for your trip first.").show().animate({opacity: 1.0}, 4500).hide('slow')
            return false;
        }
    },
    event_choose_placename: function(evt) {
        var place = $(evt.target).attr('title');
        var geoname_id = $(evt.target).attr('href').replace(/^.*?#/,"");
        this.choose_placename(place,geoname_id);

        $("#check-placename-container").empty();
        $('#check_placename_go').hide();
        return false;
    },
    choose_placename: function(place,geoname_id) {
        // DEBUG: console.log("Choosing " + place + " (" + geoname_id + ")");
        $('input.place-id').val(geoname_id);
        $('input.place-selector').val(place);
        this.set_submit_ok();
        this.lastplace = place;
        // the edit trip form wants to be told when the placename
        // changes, so it can recalculate coincindences. If there's
        // a callback function, call it.
        if (window.changedPlace) window.changedPlace();
    },
    event_check_placename: function(evt) {
        $("#check-placename-container").hide().slideDown(1000);
    },
    place_inputbox_key: function(evt) {
        if(this.timeout) {
            clearTimeout(this.timeout);
        }
        if(!deadkey(evt)) {
            $("#check-placename-container").empty();
            $('input.place-id').val('');
            this.set_submit_not_ok();
            this.timeout = setTimeout(hitch(this,"place_inputbox_idle"), 2000);
        }
    },
    place_inputbox_blur: function(evt) {
        // DEBUG: console.log("Input blur");
        this.inputfocused = false;
        // we can kick off an ajax query when you leave the input box if: 
        // 1) we don't have a definite database ID yet and we're not already in an ajax disambiguation (as evidenced by there being HTML in the check-placename area
        // or
        // 2) what we remember you typed and what you have now typed are different (the input box has changed)
        // point 1 is necessary because if we popped up a grid of choices while you were typing, going to click on one of them will make a blur event and we end up here
        if(($('input.place-id').val() == '' && $("#check-placename-container").html() == '') || this.lastplace != $('input.place-selector').val()) {
            this.place_inputbox_idle(evt);
        }
    },
    place_inputbox_focus: function(evt) {
        // DEBUG: console.log("Input focus");
        this.inputfocused = true;
    },
    place_inputbox_idle: function(evt) {
        if(this.timeout) {
            clearTimeout(this.timeout);
        }
        $("#check-placename-container").empty();
        // DEBUG: console.log('Typing finished... clearing IDs');
        $('input.place-id').val('');
        this.set_submit_not_ok();
        var val = $('input.place-selector').val();

        if(val && val.length > 2 && val != this.lastplace) {
            this.lastplace = val;
            $('#ajax').show();
            // DEBUG: console.log("Querying places");
            $.ajax({
                dataType: "json",
                url: "/city/search",
                data: {q:val},
                success: hitch(this,"ajax_citysearch"),
                complete: hitch(this,function() {
                    $('#ajax').hide();
                }),
                error: hitch(this,function(xhr,error,exception) {
                    $('#ajax').hide();
                })
            });
        }
    },
    ajax_citysearch: function(data) {
        $('input.hiddenfields').remove();
        $.each(data.fields,function(key,val) {
            $(document.createElement("input"))
            .attr({
                id: "extra_" + key,
                name: "extra_" + key,
                value: val,
                type: 'hidden'
            })
            .addClass("hiddenfields")
            .appendTo($('form.disambiguate'));
        });

        if(data.cities.length == 0) {
            $("#check-placename-container").html("<div id='check-placename-info' class='check-placename-info'><p class='blurb'>We can't find that place.</p></div>");
            $('#check_placename_go').hide();
        }
        else if('iata' in data.fields) {
            $("#check-placename-container").html("<div id='check-placename-info' class='check-placename-info'><p class='blurb'>We recognised " + data.fields.iata + " as an IATA airport code, and the nearest big city is " + h(data.cities[0].title) + ".</p></div>");
            this.choose_placename(data.cities[0].title, data.cities[0].geoname_id);
            this.set_submit_ok();
        }
        else if(data.fields.geocoded && data.cities[0].title != data.query) {
            $("#check-placename-container").html("<div id='check-placename-info' class='check-placename-info'><p class='blurb'>We couldn't find exactly what you typed, but we believe this may be nearby: " + h(data.cities[0].title) + ".</p></div>");
            this.choose_placename(data.cities[0].title, data.cities[0].geoname_id);
            this.set_submit_ok();
        }
        else if(data.cities.length == 1) {
            $("#check-placename-container").html("<div id='check-placename-info' class='check-placename-info'><p class='blurb'>We know about just one place in the world that matches what you've typed: " + h(data.cities[0].title) + ".</p></div>");
            this.choose_placename(data.cities[0].title, data.cities[0].geoname_id);
            this.set_submit_ok();

            $('#check_placename_go').hide();
        }
        else if(data.cities.length > 1) {
            $("#check-placename-container").html("<div id='check-placename-info' class='check-placename-info'><p class='blurb'>There are " + data.cities.length + " places that could match what you've typed.</p></div>");
            var defaulted = false;
            // if(!this.inputfocused) {
                for(var i = 0; i < data.cities.length; i++) {
                    var item = data.cities[i];
                    if(item.choose) {
                        this.choose_placename(item.title, item.geoname_id);
                        defaulted = true;
                        $("#check-placename-container").html("<div id='check-placename-info' class='check-placename-info'><p class='blurb'>We think you mean " + h(item.title) + ". However, there are " + data.cities.length + " places that could match what you've typed. <a href='#' id='other_cities'>See them now</a>.</p></div>");
                        this.set_submit_ok();
                    }
                }
            // }
            if(!defaulted) {
                $("#check-placename-container").html("<div id='check-placename-info' class='check-placename-info'><p class='blurb'>There are " + data.cities.length + " places that could match what you've typed. To see them, <a href='#' id='other_cities'>click here</a>.</p></div>");
            }
            $('#other_cities').click(hitch(this,function(evt) {
                $("#check-placename-container").html(data.html).hide().slideDown(1000);
                tb_init('#check-placename-container a.thickbox'); // where to apply thickbox
                $('#check-placename-container a.choose-placename').click(hitch(this,"event_choose_placename")); 
                return false;
            }));
        }
    },

    'call_href_as_ajax':function(evt) {
        var target = $( evt.target );
        oldHTML = target.html();
        target.hide(); // html("<img src='/images/loadingAnimation.gif' />"); // need smaller spinner
        target.after("<img id='spinner' src='/images/dopplr-anim-smaller-faster.gif' />");
        $.ajax({  
          'dataType':"json",
          'url':target.attr('href'),
          'data':"format=js",
          'type':'POST',
          'error':function(req, error, exception) {
            //console.log("Ajax error: "+ error + ", " + exception + exception.stack);
            target.html( oldHTML );
            $('#spinner', target.parent()).remove();
            target.show();
          },
          'success':hitch(this, 'got_ajax_response')
        });
        return false;
    },
    'got_ajax_response':function(data) {
      var parent = $("#mutual_" + data.nick );
      var target = $("#call_href_as_ajax_" + data.id );
      var link = target.attr('href');

      if (data.update_class) {
        if (data.mutual) {
          parent.addClass('mutual');
          parent.removeClass('notmutual');
        } else {
          parent.addClass('notmutual');
          parent.removeClass('mutual');
        }
      }
      target.hide();
      $('#spinner', target.parent()).remove();
      target.after( data.status );
      if (data.status) {
        // Now what?
      }
    }

},
{
    define: function() {
        (new AppBehaviours).define();
    }
}
);

$(AppBehaviours.define);

var Timezone = {
    set : function() {
        var date = new Date();
        var timezone = "timezone=" + -date.getTimezoneOffset() * 60;
        date.setTime(date.getTime() + (1000*24*60*60*1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = timezone + expires + "; path=/";
    }
}

// a wrapper for .getJSON that polls until it doesn't get an error.  used for
// web-api content that's being fetched serverside and will eventually show up.
jQuery.pollJSON = function(url, data, fn, timeout) {
    if(!timeout) {
        timeout = 500;
    }
    $.ajax({
        url: url, 
        data: data, 
        success: fn,
        dataType: "json",
        error: function(xhr, textStatus, error) {
            setTimeout(function() {
                $.pollJSON(url, data, fn, timeout+50);
            }, timeout);
        }
    });
}

jQuery.pollHTML = function(url, data, fn, timeout) {
    if(!timeout) {
        timeout = 500;
    }
    $.ajax({
        url: url, 
        data: data, 
        success: fn,
        error: function(xhr, textStatus, error) {
            setTimeout(function() {
                $.pollHTML(url, data, fn, timeout+50);
            }, timeout);
        }
    });
}


// TODO - calendar stuff should be it's own file, it's self-contained enough

var popup_calendar_options = {
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    changeFirstDay: false, 
    clearText: '',
    closeText: 'close',
    dateFormat: 'YMD-',
    closeAtTop: false,
    firstDay: 1,
    minDate: new Date(1970, 1 - 1, 1),
    maxDate: new Date(2037, 12 - 1, 31)
    //autoPopUp: 'both',
    //buttonImage: '/images/calendar.png',
    //buttonImageOnly: true
}

// make into a calendar widget
jQuery.fn.dateGuesser = function( assume_euro, feedback, fail_message, callback )  {
  if (feedback) {
    feedback = $(feedback);
  }
  
  // shallow-clone calendar options
  my_calendar_options = {}
  for (k in popup_calendar_options)
      my_calendar_options[k] = popup_calendar_options[k]
  
  // first day of the week depends on locale
  my_calendar_options['firstDay'] = assume_euro ? 1 : 0;
  
  // callback function for onselect
  my_calendar_options['onSelect'] = callback;
  
  this.calendar( my_calendar_options );
  this.unbind("keypress"); // the calendar picker binds this, and I want it back
  
  var guess = null;

  this.keyup(function(evt) {
    if (deadkey(evt)) return;
    guess = $.parseDate( $(this).val(), assume_euro );

    if (feedback) {
      if (guess) {
        feedback.html( $.formatDate( guess, "MMM d, y" ) );
      } else {
        feedback.html( fail_message );
      }
      feedback.show();
      feedback.css('display', 'inline') 
    }

    // hide calendar
    inst = popUpCal._getInst(this._calId);
    if (inst)
      popUpCal.hideCalendar(inst, '');

  });

  this.blur(function() {
    // replace text field if we have a good guess.
    Date.format = 'yyyy-mm-dd';
    if ( guess && (guess != $(this).val()) )
      $(this).val( guess.asString() );
      
      if (callback && guess) callback( guess.asString() );
      
      if (feedback) {
        feedback.hide( 1000, function() {
          feedback.html('');
          feedback.show();
          feedback.css('display', 'inline') 
        } );
      }
  });

}

// Initialize Superfish dropdown menus for Top Header menus
$(function() {
  $("ul#header-actions").superfish({
    delay: 400,
    animation: {opacity:'show',height:'show'},
    speed: 'fast',
    dropShadows: false
  });
}); 

// IE hack for the dropdowns to work over Google Maps divs
if($.browser.msie){
  $(function() {
    var zIndexNumber = 1000;
    $('div').each(function() {
      $(this).css('zIndex', zIndexNumber);
      zIndexNumber -= 10;
    });
  });
  $(function() {
    var zIndexNumber = 1000;
    $('ul').each(function() {
      $(this).css('zIndex', zIndexNumber);
      zIndexNumber -= 10;
    });
  });
  $(function() {
    var zIndexNumber = 5000;
    $('li').each(function() {
      $(this).css('zIndex', zIndexNumber);
      zIndexNumber -= 10;
    });
  });
}


/*
 * Date prototype extensions. Doesn't depend on any
 * other code. Doens't overwrite existing methods.
 *
 * Adds dayNames, abbrDayNames, monthNames and abbrMonthNames static properties and isLeapYear,
 * isWeekend, isWeekDay, getDaysInMonth, getDayName, getMonthName, getDayOfYear, getWeekOfYear,
 * setDayOfYear, addYears, addMonths, addDays, addHours, addMinutes, addSeconds methods
 *
 * Copyright (c) 2006 Jörn Zaefferer and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 *
 * Additional methods and properties added by Kelvin Luck: firstDayOfWeek, dateFormat, zeroTime, asString, fromString -
 * I've added my name to these methods so you know who to blame if they are broken!
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * An Array of day names starting with Sunday.
 * 
 * @example dayNames[0]
 * @result 'Sunday'
 *
 * @name dayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * An Array of abbreviated day names starting with Sun.
 * 
 * @example abbrDayNames[0]
 * @result 'Sun'
 *
 * @name abbrDayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * An Array of month names starting with Janurary.
 * 
 * @example monthNames[0]
 * @result 'January'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * An Array of abbreviated month names starting with Jan.
 * 
 * @example abbrMonthNames[0]
 * @result 'Jan'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The first day of the week for this locale.
 *
 * @name firstDayOfWeek
 * @type Number
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.firstDayOfWeek = 1;

/**
 * The format that string dates should be represented as (e.g. 'dd/mm/yyyy' for UK, 'mm/dd/yyyy' for US, 'yyyy-mm-dd' for Unicode etc).
 *
 * @name format
 * @type String
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.format = 'dd/mm/yyyy';
//Date.format = 'mm/dd/yyyy';
//Date.format = 'yyyy-mm-dd';
//Date.format = 'dd mmm yy';

(function() {

    /**
     * Adds a given method under the given name 
     * to the Date prototype if it doesn't
     * currently exist.
     *
     * @private
     */
    function add(name, method) {
        if( !Date.prototype[name] ) {
            Date.prototype[name] = method;
        }
    };
    
    /**
     * Checks if the year is a leap year.
     *
     * @example var dtm = new Date("01/12/2008");
     * dtm.isLeapYear();
     * @result true
     *
     * @name isLeapYear
     * @type Boolean
     * @cat Plugins/Methods/Date
     */
    add("isLeapYear", function() {
        var y = this.getFullYear();
        return (y%4==0 && y%100!=0) || y%400==0;
    });
    
    /**
     * Checks if the day is a weekend day (Sat or Sun).
     *
     * @example var dtm = new Date("01/12/2008");
     * dtm.isWeekend();
     * @result false
     *
     * @name isWeekend
     * @type Boolean
     * @cat Plugins/Methods/Date
     */
    add("isWeekend", function() {
        return this.getDay()==0 || this.getDay()==6;
    });
    
    /**
     * Check if the day is a day of the week (Mon-Fri)
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.isWeekDay();
     * @result false
     * 
     * @name isWeekDay
     * @type Boolean
     * @cat Plugins/Methods/Date
     */
    add("isWeekDay", function() {
        return !this.isWeekend();
    });
    
    /**
     * Gets the number of days in the month.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.getDaysInMonth();
     * @result 31
     * 
     * @name getDaysInMonth
     * @type Number
     * @cat Plugins/Methods/Date
     */
    add("getDaysInMonth", function() {
        return [31,(this.isLeapYear() ? 29:28),31,30,31,30,31,31,30,31,30,31][this.getMonth()];
    });
    
    /**
     * Gets the name of the day.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.getDayName();
     * @result 'Saturday'
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.getDayName(true);
     * @result 'Sat'
     * 
     * @param abbreviated Boolean When set to true the name will be abbreviated.
     * @name getDayName
     * @type String
     * @cat Plugins/Methods/Date
     */
    add("getDayName", function(abbreviated) {
        return abbreviated ? Date.abbrDayNames[this.getDay()] : Date.dayNames[this.getDay()];
    });

    /**
     * Gets the name of the month.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.getMonthName();
     * @result 'Janurary'
     *
     * @example var dtm = new Date("01/12/2008");
     * dtm.getMonthName(true);
     * @result 'Jan'
     * 
     * @param abbreviated Boolean When set to true the name will be abbreviated.
     * @name getDayName
     * @type String
     * @cat Plugins/Methods/Date
     */
    add("getMonthName", function(abbreviated) {
        return abbreviated ? Date.abbrMonthNames[this.getMonth()] : Date.monthNames[this.getMonth()];
    });

    /**
     * Get the number of the day of the year.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.getDayOfYear();
     * @result 11
     * 
     * @name getDayOfYear
     * @type Number
     * @cat Plugins/Methods/Date
     */
    add("getDayOfYear", function() {
        var tmpdtm = new Date("1/1/" + this.getFullYear());
        return Math.floor((this.getTime() - tmpdtm.getTime()) / 86400000);
    });
    
    /**
     * Get the number of the week of the year.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.getWeekOfYear();
     * @result 2
     * 
     * @name getWeekOfYear
     * @type Number
     * @cat Plugins/Methods/Date
     */
    add("getWeekOfYear", function() {
        return Math.ceil(this.getDayOfYear() / 7);
    });

    /**
     * Set the day of the year.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.setDayOfYear(1);
     * dtm.toString();
     * @result 'Tue Jan 01 2008 00:00:00'
     * 
     * @name setDayOfYear
     * @type Date
     * @cat Plugins/Methods/Date
     */
    add("setDayOfYear", function(day) {
        this.setMonth(0);
        this.setDate(day);
        return this;
    });
    
    /**
     * Add a number of years to the date object.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.addYears(1);
     * dtm.toString();
     * @result 'Mon Jan 12 2009 00:00:00'
     * 
     * @name addYears
     * @type Date
     * @cat Plugins/Methods/Date
     */
    add("addYears", function(num) {
        this.setFullYear(this.getFullYear() + num);
        return this;
    });
    
    /**
     * Add a number of months to the date object.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.addMonths(1);
     * dtm.toString();
     * @result 'Tue Feb 12 2008 00:00:00'
     * 
     * @name addMonths
     * @type Date
     * @cat Plugins/Methods/Date
     */
    add("addMonths", function(num) {
        var tmpdtm = this.getDate();
        
        this.setMonth(this.getMonth() + num);
        
        if (tmpdtm > this.getDate())
            this.addDays(-this.getDate());
        
        return this;
    });
    
    /**
     * Add a number of days to the date object.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.addDays(1);
     * dtm.toString();
     * @result 'Sun Jan 13 2008 00:00:00'
     * 
     * @name addDays
     * @type Date
     * @cat Plugins/Methods/Date
     */
    add("addDays", function(num) {
        this.setDate(this.getDate() + num);
        return this;
    });
    
    /**
     * Add a number of hours to the date object.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.addHours(24);
     * dtm.toString();
     * @result 'Sun Jan 13 2008 00:00:00'
     * 
     * @name addHours
     * @type Date
     * @cat Plugins/Methods/Date
     */
    add("addHours", function(num) {
        this.setHours(this.getHours() + num);
        return this;
    });

    /**
     * Add a number of minutes to the date object.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.addMinutes(60);
     * dtm.toString();
     * @result 'Sat Jan 12 2008 01:00:00'
     * 
     * @name addMinutes
     * @type Date
     * @cat Plugins/Methods/Date
     */
    add("addMinutes", function(num) {
        this.setMinutes(this.getMinutes() + num);
        return this;
    });
    
    /**
     * Add a number of seconds to the date object.
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.addSeconds(60);
     * dtm.toString();
     * @result 'Sat Jan 12 2008 00:01:00'
     * 
     * @name addSeconds
     * @type Date
     * @cat Plugins/Methods/Date
     */
    add("addSeconds", function(num) {
        this.setSeconds(this.getSeconds() + num);
        return this;
    });
    
    /**
     * Sets the time component of this Date to zero for cleaner, easier comparison of dates where time is not relevant.
     * 
     * @example var dtm = new Date();
     * dtm.zeroTime();
     * dtm.toString();
     * @result 'Sat Jan 12 2008 00:01:00'
     * 
     * @name zeroTime
     * @type Date
     * @cat Plugins/Methods/Date
     * @author Kelvin Luck
     */
    add("zeroTime", function() {
        this.setMilliseconds(0);
        this.setSeconds(0);
        this.setMinutes(0);
        this.setHours(0);
        return this;
    });
    
    /**
     * Returns a string representation of the date object according to Date.format.
     * (Date.toString may be used in other places so I purposefully didn't overwrite it)
     * 
     * @example var dtm = new Date("01/12/2008");
     * dtm.asString();
     * @result '12/01/2008' // (where Date.format == 'dd/mm/yyyy'
     * 
     * @name asString
     * @type Date
     * @cat Plugins/Methods/Date
     * @author Kelvin Luck
     */
    add("asString", function() {
        var r = Date.format;
        return r
            .split('yyyy').join(this.getFullYear())
            .split('yy').join(this.getYear())
            .split('mmm').join(this.getMonthName(true))
            .split('mm').join(_zeroPad(this.getMonth()+1))
            .split('dd').join(_zeroPad(this.getDate()));
    });
    
    /**
     * Returns a new date object created from the passed String according to Date.format or false if the attempt to do this results in an invalid date object
     * (We can't simple use Date.parse as it's not aware of locale and I chose not to overwrite it incase it's functionality is being relied on elsewhere)
     *
     * @example var dtm = Date.fromString("12/01/2008");
     * dtm.toString();
     * @result 'Sat Jan 12 2008 00:00:00' // (where Date.format == 'dd/mm/yyyy'
     * 
     * @name fromString
     * @type Date
     * @cat Plugins/Methods/Date
     * @author Kelvin Luck
     */
    Date.fromString = function(s)
    {
        var f = Date.format;
        var d = new Date('01/01/1977');
        var iY = f.indexOf('yyyy');
        if (iY > -1) {
            d.setFullYear(Number(s.substr(iY, 4)));
        } else {
            // TODO - this doesn't work very well - are there any rules for what is meant by a two digit year?
            d.setYear(Number(s.substr(f.indexOf('yy'), 2)));
        }
        var iM = f.indexOf('mmm');
        if (iM > -1) {
            var mStr = s.substr(iM, 3);
            for (var i=0; i<Date.abbrMonthNames.length; i++) {
                if (Date.abbrMonthNames[i] == mStr) break;
            }
            d.setMonth(i);
        } else {
            d.setMonth(Number(s.substr(f.indexOf('mm'), 2)) - 1);
        }
        d.setDate(Number(s.substr(f.indexOf('dd'), 2)));
        if (isNaN(d.getTime())) return false;
        return d;
    }
    
    // utility method
    var _zeroPad = function(num) {
        var s = '0'+num;
        return s.substring(s.length-2)
        //return ('0'+num).substring(-2); // doesn't work on IE :(
    };
    
})();


// this is 2 date parsing libraries in 1.
// The 2nd (willison) library is munged to not stomp on the global namespaces of builtins.

(function() { // tomi - namespacing
  
// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download. 
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================

// HISTORY
// ------------------------------------------------------------------
// May 17, 2003: Fixed bug in parseDate() for dates <1970
// March 11, 2003: Added parseDate() function
// March 11, 2003: Added "NNN" formatting option. Doesn't match up
//                 perfectly with SimpleDateFormat formats, but 
//                 backwards-compatability was required.

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the 
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
// 
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
function LZ(x) {return(x<0||x>9?"":"0")+x}

// ------------------------------------------------------------------
// isDate ( date_string, format_string )
// Returns true if date string matches format of format string and
// is a valid date. Else returns false.
// It is recommended that you trim whitespace around the value before
// passing it to this function, as whitespace is NOT ignored!
// ------------------------------------------------------------------
function isDate(val,format) {
    var date=getDateFromFormat(val,format);
    if (date==0) { return false; }
    return true;
    }

// -------------------------------------------------------------------
// compareDates(date1,date1format,date2,date2format)
//   Compare two date strings to see which is greater.
//   Returns:
//   1 if date1 is greater than date2
//   0 if date2 is greater than date1 of if they are the same
//  -1 if either of the dates is in an invalid format
// -------------------------------------------------------------------
function compareDates(date1,dateformat1,date2,dateformat2) {
    var d1=getDateFromFormat(date1,dateformat1);
    var d2=getDateFromFormat(date2,dateformat2);
    if (d1==0 || d2==0) {
        return -1;
        }
    else if (d1 > d2) {
        return 1;
        }
    return 0;
    }

// ------------------------------------------------------------------
// formatDate (date_object, format)
// Returns a date in the output format specified.
// The format string uses the same abbreviations as in getDateFromFormat()
// ------------------------------------------------------------------
function formatDate(date,format) {
    format=format+"";
    var result="";
    var i_format=0;
    var c="";
    var token="";
    var y=date.getYear()+"";
    var M=date.getMonth()+1;
    var d=date.getDate();
    var E=date.getDay();
    var H=date.getHours();
    var m=date.getMinutes();
    var s=date.getSeconds();
    var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
    // Convert real date parts into formatted versions
    var value=new Object();
    if (y.length < 4) {y=""+(y-0+1900);}
    value["y"]=""+y;
    value["yyyy"]=y;
    value["yy"]=y.substring(2,4);
    value["M"]=M;
    value["MM"]=LZ(M);
    value["MMM"]=MONTH_NAMES[M-1];
    value["NNN"]=MONTH_NAMES[M+11];
    value["d"]=d;
    value["dd"]=LZ(d);
    value["E"]=DAY_NAMES[E+7];
    value["EE"]=DAY_NAMES[E];
    value["H"]=H;
    value["HH"]=LZ(H);
    if (H==0){value["h"]=12;}
    else if (H>12){value["h"]=H-12;}
    else {value["h"]=H;}
    value["hh"]=LZ(value["h"]);
    if (H>11){value["K"]=H-12;} else {value["K"]=H;}
    value["k"]=H+1;
    value["KK"]=LZ(value["K"]);
    value["kk"]=LZ(value["k"]);
    if (H > 11) { value["a"]="PM"; }
    else { value["a"]="AM"; }
    value["m"]=m;
    value["mm"]=LZ(m);
    value["s"]=s;
    value["ss"]=LZ(s);
    while (i_format < format.length) {
        c=format.charAt(i_format);
        token="";
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
            }
        if (value[token] != null) { result=result + value[token]; }
        else { result=result + token; }
        }
    return result;
    }
    
// ------------------------------------------------------------------
// Utility functions for parsing in getDateFromFormat()
// ------------------------------------------------------------------
function _isInteger(val) {
    var digits="1234567890";
    for (var i=0; i < val.length; i++) {
        if (array_indexOf(digits, val.charAt(i))==-1) { return false; }
        }
    return true;
    }
function _getInt(str,i,minlength,maxlength) {
    for (var x=maxlength; x>=minlength; x--) {
        var token=str.substring(i,i+x);
        if (token.length < minlength) { return null; }
        if (_isInteger(token)) { return token; }
        }
    return null;
    }
    
// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the 
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------
function getDateFromFormat(val,format) {
    val=val+"";
    format=format+"";
    var i_val=0;
    var i_format=0;
    var c="";
    var token="";
    var token2="";
    var x,y;
    var now=new Date();
    var year=now.getYear();
    var month=now.getMonth()+1;
    var date=1;
    var hh=now.getHours();
    var mm=now.getMinutes();
    var ss=now.getSeconds();
    var ampm="";
    
    while (i_format < format.length) {
        // Get next token from format string
        c=format.charAt(i_format);
        token="";
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
            }
        // Extract contents of value based on format token
        if (token=="yyyy" || token=="yy" || token=="y") {
            if (token=="yyyy") { x=4;y=4; }
            if (token=="yy")   { x=2;y=2; }
            if (token=="y")    { x=2;y=4; }
            year=_getInt(val,i_val,x,y);
            if (year==null) { return 0; }
            i_val += year.length;
            if (year.length==2) {
                if (year > 70) { year=1900+(year-0); }
                else { year=2000+(year-0); }
                }
            }
        else if (token=="MMM"||token=="NNN"){
            month=0;
            for (var i=0; i<MONTH_NAMES.length; i++) {
                var month_name=MONTH_NAMES[i];
                if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
                    if (token=="MMM"||(token=="NNN"&&i>11)) {
                        month=i+1;
                        if (month>12) { month -= 12; }
                        i_val += month_name.length;
                        break;
                        }
                    }
                }
            if ((month < 1)||(month>12)){return 0;}
            }
        else if (token=="EE"||token=="E"){
            for (var i=0; i<DAY_NAMES.length; i++) {
                var day_name=DAY_NAMES[i];
                if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
                    i_val += day_name.length;
                    break;
                    }
                }
            }
        else if (token=="MM"||token=="M") {
            month=_getInt(val,i_val,token.length,2);
            if(month==null||(month<1)||(month>12)){return 0;}
            i_val+=month.length;}
        else if (token=="dd"||token=="d") {
            date=_getInt(val,i_val,token.length,2);
            if(date==null||(date<1)||(date>31)){return 0;}
            i_val+=date.length;}
        else if (token=="hh"||token=="h") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<1)||(hh>12)){return 0;}
            i_val+=hh.length;}
        else if (token=="HH"||token=="H") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<0)||(hh>23)){return 0;}
            i_val+=hh.length;}
        else if (token=="KK"||token=="K") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<0)||(hh>11)){return 0;}
            i_val+=hh.length;}
        else if (token=="kk"||token=="k") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<1)||(hh>24)){return 0;}
            i_val+=hh.length;hh--;}
        else if (token=="mm"||token=="m") {
            mm=_getInt(val,i_val,token.length,2);
            if(mm==null||(mm<0)||(mm>59)){return 0;}
            i_val+=mm.length;}
        else if (token=="ss"||token=="s") {
            ss=_getInt(val,i_val,token.length,2);
            if(ss==null||(ss<0)||(ss>59)){return 0;}
            i_val+=ss.length;}
        else if (token=="a") {
            if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
            else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
            else {return 0;}
            i_val+=2;}
        else {
            if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
            else {i_val+=token.length;}
            }
        }
    // If there are any trailing characters left in the value, it doesn't match
    if (i_val != val.length) { return 0; }
    // Is date valid for month?
    if (month==2) {
        // Check for leap year
        if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
            if (date > 29){ return 0; }
            }
        else { if (date > 28) { return 0; } }
        }
    if ((month==4)||(month==6)||(month==9)||(month==11)) {
        if (date > 30) { return 0; }
        }
    // Correct hours value
    if (hh<12 && ampm=="PM") { hh=hh-0+12; }
    else if (hh>11 && ampm=="AM") { hh-=12; }
    var newdate=new Date(year,month-1,date,hh,mm,ss);
    return newdate.getTime();
    }

// ------------------------------------------------------------------
// parseDate( date_string [, prefer_euro_format] )
//
// This function takes a date string and tries to match it to a
// number of possible date formats to get the value. It will try to
// match against the following international formats, in this order:
// y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
// M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
// d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
// A second argument may be passed to instruct the method to search
// for formats like d/M/y (european format) before M/d/y (American).
// Returns a Date object or null if no patterns match.
// ------------------------------------------------------------------
function parseDate(val) {
    var preferEuro=(arguments.length==2)?arguments[1]:false;
    generalFormats=new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d');
    monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');
    dateFirst =new Array('d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');
    var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');
    var d=null;
    for (var i=0; i<checkList.length; i++) {
        var l=window[checkList[i]];
        for (var j=0; j<l.length; j++) {
            d=getDateFromFormat(val,l[j]);
            if (d!=0) { return new Date(d); }
            }
        }
    return null;
    }


// ===============================================================================

/* 'Magic' date parsing, by Simon Willison (6th October 2003)
   http://simon.incutio.com/archive/2003/10/06/betterDateInput
*/

/* Finds the index of the first occurence of item in the array, or -1 if not found */
var array_indexOf = function(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
            return i;
        }
    }
    return -1;
};
/* Returns an array of items judged 'true' by the passed in test function */
var array_filter = function(array, test) {
    var matches = [];
    for (var i = 0; i < array.length; i++) {
        if (test(array[i])) {
            matches[matches.length] = array[i];
        }
    }
    return matches;
};

var monthNames = "January February March April May June July August September October November December".split(" ");
var weekdayNames = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");

/* Takes a string, returns the index of the month matching that string, throws
   an error if 0 or more than 1 matches
*/
function parseMonth(month) {
    var matches = array_filter(monthNames, function(item) { 
        return new RegExp("^" + month, "i").test(item);
    });
    if (matches.length == 0) {
        throw new Error("Invalid month string: "+month);
    }
    if (matches.length > 1) {
        throw new Error("Ambiguous month: "+month);
    }
    return array_indexOf( monthNames, matches[0]);
}
/* Same as parseMonth but for days of the week */
function parseWeekday(weekday) {
    var matches = array_filter( weekdayNames, function(item) {
        return new RegExp("^" + weekday, "i").test(item);
    });
    if (matches.length == 0) {
        throw new Error("Invalid day string");
    }
    if (matches.length > 1) {
        throw new Error("Ambiguous weekday");
    }
    return weekdayNames.indexOf(matches[0]);
}

/* Array of objects, each has 're', a regular expression and 'handler', a 
   function for creating a date from something that matches the regular 
   expression. Handlers may throw errors if string is unparseable. 
*/
var assume_euro_dates = false;
var dateParsePatterns = [
    // Today
    {   re: /^tod/i,
        handler: function() { 
            return new Date();
        } 
    },
    // Tomorrow
    {   re: /^tom/i,
        handler: function() {
            var d = new Date(); 
            d.setDate(d.getDate() + 1); 
            return d;
        }
    },
    // Yesterday
    {   re: /^yes/i,
        handler: function() {
            var d = new Date();
            d.setDate(d.getDate() - 1);
            return d;
        }
    },
    // 4th
    {   re: /^(\d{1,2})(st|nd|rd|th)?$/i, 
        handler: function(bits) {
            var d = new Date();
            d.setDate(parseInt(bits[1], 10));
            return d;
        }
    },
    // 4th Jan
    {   re: /^(\d{1,2})(?:st|nd|rd|th)? (\w+)$/i, 
        handler: function(bits) {
            var d = new Date();
            d.setDate(parseInt(bits[1], 10));
            d.setMonth(parseMonth(bits[2]));
            return d;
        }
    },
    // 4th Jan 2003
    {   re: /^(\d{1,2})(?:st|nd|rd|th)? (\w+),? (\d{4})$/i,
        handler: function(bits) {
            var d = new Date();
            d.setDate(parseInt(bits[1], 10));
            d.setMonth(parseMonth(bits[2]));
            d.setYear(bits[3]);
            return d;
        }
    },
    // Jan 4th
    {   re: /^(\w+) (\d{1,2})(?:st|nd|rd|th)?$/i, 
        handler: function(bits) {
            var d = new Date();
            d.setDate(parseInt(bits[2], 10));
            d.setMonth(parseMonth(bits[1]));
            return d;
        }
    },
    // Jan 4th 2003
    {   re: /^(\w+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})$/i,
        handler: function(bits) {
            var d = new Date();
            d.setDate(parseInt(bits[2], 10));
            d.setMonth(parseMonth(bits[1]));
            d.setYear(bits[3]);
            return d;
        }
    },
    // next Tuesday - this is suspect due to weird meaning of "next"
    {   re: /^next (\w+)$/i,
        handler: function(bits) {
            var d = new Date();
            var day = d.getDay();
            var newDay = parseWeekday(bits[1]);
            var addDays = newDay - day;
            if (newDay <= day) {
                addDays += 7;
            }
            d.setDate(d.getDate() + addDays);
            return d;
        }
    },
    // last Tuesday
    {   re: /^last (\w+)$/i,
        handler: function(bits) {
            throw new Error("Not yet implemented");
        }
    },
    // mm/dd/yyyy (European/American style)
    {   re: /(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/,
        handler: function(bits) {
            var d = new Date();
            d.setYear(bits[3]);
            d.setDate(parseInt(bits[ assume_euro_dates ? 1 : 2 ], 10));
            d.setMonth(parseInt(bits[ assume_euro_dates ? 2 : 1 ], 10) - 1); // Because months indexed from 0
            return d;
        }
    },
    // yyyy-mm-dd (ISO style)
    {   re: /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/,
        handler: function(bits) {
            var d = new Date();
            d.setYear(parseInt(bits[1]));
            d.setDate(parseInt(bits[3], 10));
            d.setMonth(parseInt(bits[2], 10) - 1);
            return d;
        }
    },
];

function parseDateString(s) {
    for (var i = 0; i < dateParsePatterns.length; i++) {
        var re = dateParsePatterns[i].re;
        var handler = dateParsePatterns[i].handler;
        var bits = re.exec(s);
        if (bits) {
            return handler(bits);
        }
    }
    throw new Error("Invalid date string");
}

function magicDate(input) {
    var messagespan = input.id + 'Msg';
    try {
        var d = parseDateString(input.value);
        input.value = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
        input.className = '';
        // Human readable date
        document.getElementById(messagespan).firstChild.nodeValue = d.toDateString();
        document.getElementById(messagespan).className = 'normal';
    }
    catch (e) {
        input.className = 'error';
        var message = e.message;
        // Fix for IE6 bug
        if (message.indexOf('is null or not an object') > -1) {
            message = 'Invalid date string';
        }
        document.getElementById(messagespan).firstChild.nodeValue = message;
        document.getElementById(messagespan).className = 'error';
    }
}



$.parseDate = function(date, euro) { // tomi - wedge into jQuery namespace, because it's there.
  assume_euro_dates = euro;
  var d = parseDate(date, euro);
  if (!d) {
      try {
        d = parseDateString( date );
      } catch(e) {
        return null;
      }
  }
  if (!d) return null;
  if (d.getFullYear() < 1900) {
    d.setYear( (new Date()).getFullYear() );
  }
  return d;
}

$.formatDate = formatDate;

})(); // tomi - namespacing


// http://hacks.bluesmoon.info/strftime/
Date.ext={};Date.ext.util={};Date.ext.util.xPad=function(x,pad,r){if(typeof (r)=="undefined"){r=10}for(;parseInt(x,10)<r&&r>1;r/=10){x=pad.toString()+x}return x.toString()};Date.prototype.locale="en-GB";if(document.getElementsByTagName("html")&&document.getElementsByTagName("html")[0].lang){Date.prototype.locale=document.getElementsByTagName("html")[0].lang}Date.ext.locales={};Date.ext.locales.en={a:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],A:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],b:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],B:["January","February","March","April","May","June","July","August","September","October","November","December"],c:"%a %d %b %Y %T %Z",p:["AM","PM"],P:["am","pm"],x:"%d/%m/%y",X:"%T"};Date.ext.locales["en-US"]=Date.ext.locales.en;Date.ext.locales["en-US"].c="%a %d %b %Y %r %Z";Date.ext.locales["en-US"].x="%D";Date.ext.locales["en-US"].X="%r";Date.ext.locales["en-GB"]=Date.ext.locales.en;Date.ext.locales["en-AU"]=Date.ext.locales["en-GB"];Date.ext.formats={a:function(d){return Date.ext.locales[d.locale].a[d.getDay()]},A:function(d){return Date.ext.locales[d.locale].A[d.getDay()]},b:function(d){return Date.ext.locales[d.locale].b[d.getMonth()]},B:function(d){return Date.ext.locales[d.locale].B[d.getMonth()]},c:"toLocaleString",C:function(d){return Date.ext.util.xPad(parseInt(d.getFullYear()/100,10),0)},d:["getDate","0"],e:["getDate"," "],g:function(d){return Date.ext.util.xPad(parseInt(Date.ext.util.G(d)/100,10),0)},G:function(d){var y=d.getFullYear();var V=parseInt(Date.ext.formats.V(d),10);var W=parseInt(Date.ext.formats.W(d),10);if(W>V){y++}else{if(W===0&&V>=52){y--}}return y},H:["getHours","0"],I:function(d){var I=d.getHours()%12;return Date.ext.util.xPad(I===0?12:I,0)},j:function(d){var ms=d-new Date(""+d.getFullYear()+"/1/1 GMT");ms+=d.getTimezoneOffset()*60000;var doy=parseInt(ms/60000/60/24,10)+1;return Date.ext.util.xPad(doy,0,100)},m:function(d){return Date.ext.util.xPad(d.getMonth()+1,0)},M:["getMinutes","0"],p:function(d){return Date.ext.locales[d.locale].p[d.getHours()>=12?1:0]},P:function(d){return Date.ext.locales[d.locale].P[d.getHours()>=12?1:0]},S:["getSeconds","0"],u:function(d){var dow=d.getDay();return dow===0?7:dow},U:function(d){var doy=parseInt(Date.ext.formats.j(d),10);var rdow=6-d.getDay();var woy=parseInt((doy+rdow)/7,10);return Date.ext.util.xPad(woy,0)},V:function(d){var woy=parseInt(Date.ext.formats.W(d),10);var dow1_1=(new Date(""+d.getFullYear()+"/1/1")).getDay();var idow=woy+(dow1_1>4||dow1_1<=1?0:1);if(idow==53&&(new Date(""+d.getFullYear()+"/12/31")).getDay()<4){idow=1}else{if(idow===0){idow=Date.ext.formats.V(new Date(""+(d.getFullYear()-1)+"/12/31"))}}return Date.ext.util.xPad(idow,0)},w:"getDay",W:function(d){var doy=parseInt(Date.ext.formats.j(d),10);var rdow=7-Date.ext.formats.u(d);var woy=parseInt((doy+rdow)/7,10);return Date.ext.util.xPad(woy,0,10)},y:function(d){return Date.ext.util.xPad(d.getFullYear()%100,0)},Y:"getFullYear",z:function(d){var o=d.getTimezoneOffset();var H=Date.ext.util.xPad(parseInt(Math.abs(o/60),10),0);var M=Date.ext.util.xPad(o%60,0);return(o>0?"-":"+")+H+M},Z:function(d){return d.toString().replace(/^.*\(([^)]+)\)$/,"$1")},"%":function(d){return"%"}};Date.ext.aggregates={c:"locale",D:"%m/%d/%y",h:"%b",n:"\n",r:"%I:%M:%S %p",R:"%H:%M",t:"\t",T:"%H:%M:%S",x:"locale",X:"locale"};Date.ext.aggregates.z=Date.ext.formats.z(new Date());Date.ext.aggregates.Z=Date.ext.formats.Z(new Date());Date.ext.unsupported={};Date.prototype.strftime=function(fmt){if(!(this.locale in Date.ext.locales)){if(this.locale.replace(/-[a-zA-Z]+$/,"") in Date.ext.locales){this.locale=this.locale.replace(/-[a-zA-Z]+$/,"")}else{this.locale="en-GB"}}var d=this;while(fmt.match(/%[cDhnrRtTxXzZ]/)){fmt=fmt.replace(/%([cDhnrRtTxXzZ])/g,function(m0,m1){var f=Date.ext.aggregates[m1];return(f=="locale"?Date.ext.locales[d.locale][m1]:f)})}var str=fmt.replace(/%([aAbBCdegGHIjmMpPSuUVwWyY%])/g,function(m0,m1){var f=Date.ext.formats[m1];if(typeof (f)=="string"){return d[f]()}else{if(typeof (f)=="function"){return f.call(d,d)}else{if(typeof (f)=="object"&&typeof (f[0])=="string"){return Date.ext.util.xPad(d[f[0]](),f[1])}else{return m1}}}});d=null;return str};


/* jQuery Calendar v2.7
   Written by Marc Grabanski (m@marcgrabanski.com) and enhanced by Keith Wood (kbwood@iprimus.com.au).

   Copyright (c) 2007 Marc Grabanski (http://marcgrabanski.com/code/jquery-calendar)
   Dual licensed under the GPL (http://www.gnu.org/licenses/gpl-3.0.txt) and 
   CC (http://creativecommons.org/licenses/by/3.0/) licenses. "Share or Remix it but please Attribute the authors."
   Date: 09-03-2007  */

/* PopUp Calendar manager.
   Use the singleton instance of this class, popUpCal, to interact with the calendar.
   Settings for (groups of) calendars are maintained in an instance object
   (PopUpCalInstance), allowing multiple different settings on the same page. */
function PopUpCal() {
    this._nextId = 0; // Next ID for a calendar instance
    this._inst = []; // List of instances indexed by ID
    this._curInst = null; // The current instance in use
    this._disabledInputs = []; // List of calendar inputs that have been disabled
    this._popUpShowing = false; // True if the popup calendar is showing , false if not
    this._inDialog = false; // True if showing within a "dialog", false if not
    this.regional = []; // Available regional settings, indexed by language code
    this.regional[''] = { // Default regional settings
        clearText: 'Clear', // Display text for clear link
        closeText: 'Close', // Display text for close link
        prevText: '&lt;Prev', // Display text for previous month link
        nextText: 'Next&gt;', // Display text for next month link
        currentText: 'Today', // Display text for current month link
        dayNames: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Names of days starting at Sunday
        monthNames: ['January','February','March','April','May','June',
            'July','August','September','October','November','December'], // Names of months
        dateFormat: 'DMY/' // First three are day, month, year in the required order,
            // fourth (optional) is the separator, e.g. US would be 'MDY/', ISO would be 'YMD-'
    };
    this._defaults = { // Global defaults for all the calendar instances
        autoPopUp: 'focus', // 'focus' for popup on focus,
            // 'button' for trigger button, or 'both' for either
        defaultDate: null, // Used when field is blank: actual date,
            // +/-number for offset from today, null for today
        appendText: '', // Display text following the input box, e.g. showing the format
        buttonText: '...', // Text for trigger button
        buttonImage: '', // URL for trigger button image
        buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
        closeAtTop: true, // True to have the clear/close at the top,
            // false to have them at the bottom
        hideIfNoPrevNext: false, // True to hide next/previous month links
            // if not applicable, false to just disable them
        changeMonth: true, // True if month can be selected directly, false if only prev/next
        changeYear: true, // True if year can be selected directly, false if only prev/next
        yearRange: '-10:+10', // Range of years to display in drop-down,
            // either relative to current year (-nn:+nn) or absolute (nnnn:nnnn)
        firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
        changeFirstDay: true, // True to click on day name to change, false to remain as set
        showOtherMonths: false, // True to show dates in other months, false to leave blank
        minDate: null, // The earliest selectable date, or null for no limit
        maxDate: null, // The latest selectable date, or null for no limit
        speed: 'medium', // Speed of display/closure
        customDate: null, // Function that takes a date and returns an array with
            // [0] = true if selectable, false if not,
            // [1] = custom CSS class name(s) or '', e.g. popUpCal.noWeekends
        fieldSettings: null, // Function that takes an input field and
            // returns a set of custom settings for the calendar
        onSelect: null // Define a callback function when a date is selected
    };
    $.extend(this._defaults, this.regional['']);
    this._calendarDiv = $('<div id="calendar_div"></div>');
    $(document.body).append(this._calendarDiv);
    $(document.body).mousedown(this._checkExternalClick);
}

$.extend(PopUpCal.prototype, {
    /* Class name added to elements to indicate already configured with a calendar. */
    markerClassName: 'hasCalendar',
    
    /* Register a new calendar instance - with custom settings. */
    _register: function(inst) {
        var id = this._nextId++;
        this._inst[id] = inst;
        return id;
    },

    /* Retrieve a particular calendar instance based on its ID. */
    _getInst: function(id) {
        return this._inst[id] || id;
    },

    /* Override the default settings for all instances of the calendar. 
       @param  settings  object - the new settings to use as defaults (anonymous object)
       @return void */
    setDefaults: function(settings) {
        extendRemove(this._defaults, settings || {});
    },

    /* Handle keystrokes. */
    _doKeyDown: function(e) {
        var inst = popUpCal._getInst(this._calId);
        if (popUpCal._popUpShowing) {
            switch (e.keyCode) {
                case 9:  popUpCal.hideCalendar(inst, '');
                        break; // hide on tab out
                case 13: popUpCal._selectDate(inst);
                        break; // select the value on enter
                case 27: popUpCal.hideCalendar(inst, inst._get('speed'));
                        break; // hide on escape
                case 33: popUpCal._adjustDate(inst, -1, (e.ctrlKey ? 'Y' : 'M'));
                        break; // previous month/year on page up/+ ctrl
                case 34: popUpCal._adjustDate(inst, +1, (e.ctrlKey ? 'Y' : 'M'));
                        break; // next month/year on page down/+ ctrl
                case 35: if (e.ctrlKey) popUpCal._clearDate(inst);
                        break; // clear on ctrl+end
                case 36: if (e.ctrlKey) popUpCal._gotoToday(inst);
                        break; // current on ctrl+home
                case 37: if (e.ctrlKey) popUpCal._adjustDate(inst, -1, 'D');
                        break; // -1 day on ctrl+left
                case 38: if (e.ctrlKey) popUpCal._adjustDate(inst, -7, 'D');
                        break; // -1 week on ctrl+up
                case 39: if (e.ctrlKey) popUpCal._adjustDate(inst, +1, 'D');
                        break; // +1 day on ctrl+right
                case 40: if (e.ctrlKey) popUpCal._adjustDate(inst, +7, 'D');
                        break; // +1 week on ctrl+down
            }
        }
        else if (e.keyCode == 36 && e.ctrlKey) { // display the calendar on ctrl+home
            popUpCal.showFor(this);
        }
    },

    /* Filter entered characters. */
    _doKeyPress: function(e) {
        var inst = popUpCal._getInst(this._calId);
        var chr = String.fromCharCode(e.charCode == undefined ? e.keyCode : e.charCode);
        return (chr < ' ' || chr == inst._get('dateFormat').charAt(3) ||
            (chr >= '0' && chr <= '9')); // only allow numbers and separator
    },

    /* Attach the calendar to an input field. */
    _connectCalendar: function(target, inst) {
        var input = $(target);
        if (this._hasClass(input, this.markerClassName)) {
            return;
        }
        var appendText = inst._get('appendText');
        if (appendText) {
            input.after('<span class="calendar_append">' + appendText + '</span>');
        }
        var autoPopUp = inst._get('autoPopUp');
        if (autoPopUp == 'focus' || autoPopUp == 'both') { // pop-up calendar when in the marked field
            input.focus(this.showFor);
        }
        if (autoPopUp == 'button' || autoPopUp == 'both') { // pop-up calendar when button clicked
            var buttonText = inst._get('buttonText');
            var buttonImage = inst._get('buttonImage');
            var buttonImageOnly = inst._get('buttonImageOnly');
            var trigger = $(buttonImageOnly ? '<img class="calendar_trigger" src="' +
                buttonImage + '" alt="' + buttonText + '" title="' + buttonText + '"/>' :
                '<button type="button" class="calendar_trigger">' + (buttonImage != '' ?
                '<img src="' + buttonImage + '" alt="' + buttonText + '" title="' + buttonText + '"/>' :
                buttonText) + '</button>');
            input.wrap('<span class="calendar_wrap"></span>').after(trigger);
            trigger.click(this.showFor);
        }
        input.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress);
        input[0]._calId = inst._id;
    },

    /* Attach an inline calendar to a div. */
    _inlineCalendar: function(target, inst) {
        var input = $(target);
        if (this._hasClass(input, this.markerClassName)) {
            return;
        }
        input.addClass(this.markerClassName).append(inst._calendarDiv);
        input[0]._calId = inst._id;
    },

    /* Does this element have a particular class? */
    _hasClass: function(element, className) {
        var classes = element.attr('class');
        return (classes && classes.indexOf(className) > -1);
    },

    /* Pop-up the calendar in a "dialog" box.
       @param  dateText  string - the initial date to display (in the current format)
       @param  onSelect  function - the function(dateText) to call when a date is selected
       @param  settings  object - update the dialog calendar instance's settings (anonymous object)
       @param  pos       int[2] - coordinates for the dialog's position within the screen
            leave empty for default (screen centre)
       @return void */
    dialogCalendar: function(dateText, onSelect, settings, pos) {
        var inst = this._dialogInst; // internal instance
        if (!inst) {
            inst = this._dialogInst = new PopUpCalInstance({}, false);
            this._dialogInput = $('<input type="text" size="1" style="position: absolute; top: -100px;"/>');
            this._dialogInput.keydown(this._doKeyDown);
            $('body').append(this._dialogInput);
            this._dialogInput[0]._calId = inst._id;
        }
        extendRemove(inst._settings, settings || {});
        this._dialogInput.val(dateText);
        
        /*  Cross Browser Positioning */
        if (self.innerHeight) { // all except Explorer
            windowWidth = self.innerWidth;
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        } 
        this._pos = pos || // should use actual width/height below
            [(windowWidth / 2) - 100, (windowHeight / 2) - 100];

        // move input on screen for focus, but hidden behind dialog
        this._dialogInput.css('left', this._pos[0] + 'px').css('top', this._pos[1] + 'px');
        inst._settings.onSelect = onSelect;
        this._inDialog = true;
        this._calendarDiv.addClass('calendar_dialog');
        this.showFor(this._dialogInput[0]);
        if ($.blockUI) {
            $.blockUI(this._calendarDiv);
        }
    },

    /* Enable the input field(s) for entry.
       @param  inputs  element/object - single input field or jQuery collection of input fields
       @return void */
    enableFor: function(inputs) {
        inputs = (inputs.jquery ? inputs : $(inputs));
        inputs.each(function() {
            this.disabled = false;
            $('../button.calendar_trigger', this).each(function() { this.disabled = false; });
            $('../img.calendar_trigger', this).css({opacity:'1.0',cursor:''});
            var $this = this;
            popUpCal._disabledInputs = $.map(popUpCal._disabledInputs,
                function(value) { return (value == $this ? null : value); }); // delete entry
        });
    },

    /* Disable the input field(s) from entry.
       @param  inputs  element/object - single input field or jQuery collection of input fields
       @return void */
    disableFor: function(inputs) {
        inputs = (inputs.jquery ? inputs : $(inputs));
        inputs.each(function() {
            this.disabled = true;
            $('../button.calendar_trigger', this).each(function() { this.disabled = true; });
            $('../img.calendar_trigger', this).css({opacity:'0.5',cursor:'default'});
            var $this = this;
            popUpCal._disabledInputs = $.map(popUpCal._disabledInputs,
                function(value) { return (value == $this ? null : value); }); // delete entry
            popUpCal._disabledInputs[popUpCal._disabledInputs.length] = this;
        });
    },

    /* Update the settings for a calendar attached to an input field or division.
       @param  control   element - the input field or div/span attached to the calendar or
                         string - the ID or other jQuery selector of the input field
       @param  settings  object - the new settings to update
       @return void */
    reconfigureFor: function(control, settings) {
        control = (typeof control == 'string' ? $(control)[0] : control);
        var inst = this._getInst(control._calId);
        if (inst) {
            extendRemove(inst._settings, settings || {});
            this._updateCalendar(inst);
        }
    },

    /* Set the date for a calendar attached to an input field or division.
       @param  control  element - the input field or div/span attached to the calendar
       @param  date     Date - the new date
       @return void */
    setDateFor: function(control, date) {
        var inst = this._getInst(control._calId);
        if (inst) {
            inst._setDate(date);
        }
    },

    /* Retrieve the date for a calendar attached to an input field or division.
       @param  control  element - the input field or div/span attached to the calendar
       @return Date - the current date */
    getDateFor: function(control) {
        var inst = this._getInst(control._calId);
        return (inst ? inst._getDate() : null);
    },

    /* Pop-up the calendar for a given input field.
       @param  target  element - the input field attached to the calendar
       @return void */
    showFor: function(target) {
        var input = (target.nodeName && target.nodeName.toLowerCase() == 'input' ? target : this);
        if (input.nodeName.toLowerCase() != 'input') { // find from button/image trigger
            input = $('input', input.parentNode)[0];
        }
        if (popUpCal._lastInput == input) { // already here
            return;
        }
        for (var i = 0; i < popUpCal._disabledInputs.length; i++) {  // check not disabled
            if (popUpCal._disabledInputs[i] == input) {
                return;
            }
        }
        var inst = popUpCal._getInst(input._calId);
        var fieldSettings = inst._get('fieldSettings');
        extendRemove(inst._settings, (fieldSettings ? fieldSettings(input) : {}));
        popUpCal.hideCalendar(inst, '');
        popUpCal._lastInput = input;
        inst._setDateFromField(input);
        if (popUpCal._inDialog) { // hide cursor
            input.value = '';
        }
        if (!popUpCal._pos) { // position below input
            popUpCal._pos = popUpCal._findPos(input);
            popUpCal._pos[1] += input.offsetHeight;
        }
        inst._calendarDiv.css('position', (popUpCal._inDialog && $.blockUI ? 'static' : 'absolute')).
            css('left', popUpCal._pos[0] + 'px').css('top', popUpCal._pos[1] + 'px');
        popUpCal._pos = null;
        popUpCal._showCalendar(inst);
    },

    /* Construct and display the calendar. */
    _showCalendar: function(id) {
        var inst = this._getInst(id);
        popUpCal._updateCalendar(inst);
        if (!inst._inline) {
            var speed = inst._get('speed');
            inst._calendarDiv.show(speed, function() {
                popUpCal._popUpShowing = true;
                popUpCal._afterShow(inst);
            });
            if (speed == '') {
                popUpCal._popUpShowing = true;
                popUpCal._afterShow(inst);
            }
            if (inst._input[0].type != 'hidden') {
                inst._input[0].focus();
            }
            this._curInst = inst;
        }
    },

    /* Generate the calendar content. */
    _updateCalendar: function(inst) {
        inst._calendarDiv.empty().append(inst._generateCalendar());
        if (inst._input && inst._input[0].type != 'hidden') {
            inst._input[0].focus();
        }
    },

    /* Tidy up after displaying the calendar. */
    _afterShow: function(inst) {
        if ($.browser.msie) { // fix IE < 7 select problems
            $('#calendar_cover').css({width: inst._calendarDiv[0].offsetWidth + 4,
                height: inst._calendarDiv[0].offsetHeight + 4});
        }
        // re-position on screen if necessary
        var calDiv = inst._calendarDiv[0];
        var pos = popUpCal._findPos(inst._input[0]);
        // Get browser width and X value (IE6+, FF, Safari, Opera)
        if( typeof( window.innerWidth ) == 'number' ) {
            browserWidth = window.innerWidth;
        } else {
            browserWidth = document.documentElement.clientWidth;
        }
        if ( document.documentElement && (document.documentElement.scrollLeft)) {
            browserX = document.documentElement.scrollLeft; 
        } else {
            browserX = document.body.scrollLeft;
        }
        // Reposition calendar if outside the browser window.
        if ((calDiv.offsetLeft + calDiv.offsetWidth) >
                (browserWidth + browserX) ) {
            inst._calendarDiv.css('left', (pos[0] + inst._input[0].offsetWidth - calDiv.offsetWidth) + 'px');
        }
        // Get browser height and Y value (IE6+, FF, Safari, Opera)
        if( typeof( window.innerHeight ) == 'number' ) {
            browserHeight = window.innerHeight;
        } else {
            browserHeight = document.documentElement.clientHeight;
        }
        if ( document.documentElement && (document.documentElement.scrollTop)) {
            browserTopY = document.documentElement.scrollTop;
        } else {
            browserTopY = document.body.scrollTop;
        }
        // Reposition calendar if outside the browser window.
        if ((calDiv.offsetTop + calDiv.offsetHeight) >
                (browserTopY + browserHeight) ) {
            inst._calendarDiv.css('top', (pos[1] - calDiv.offsetHeight) + 'px');
        }
    },

    /* Hide the calendar from view.
       @param  id     string/object - the ID of the current calendar instance,
            or the instance itself
       @param  speed  string - the speed at which to close the calendar
       @return void */
    hideCalendar: function(id, speed) {
        var inst = this._getInst(id);
        if (popUpCal._popUpShowing) {
            speed = (speed != null ? speed : inst._get('speed'));
            inst._calendarDiv.hide(speed, function() {
                popUpCal._tidyDialog(inst);
            });
            if (speed == '') {
                popUpCal._tidyDialog(inst);
            }
            popUpCal._popUpShowing = false;
            popUpCal._lastInput = null;
            inst._settings.prompt = null;
            if (popUpCal._inDialog) {
                popUpCal._dialogInput.css('position', 'absolute').
                    css('left', '0px').css('top', '-100px');
                if ($.blockUI) {
                    $.unblockUI();
                    $('body').append(this._calendarDiv);
                }
            }
            popUpCal._inDialog = false;
        }
        popUpCal._curInst = null;
    },

    /* Tidy up after a dialog display. */
    _tidyDialog: function(inst) {
        inst._calendarDiv.removeClass('calendar_dialog');
        $('.calendar_prompt', inst._calendarDiv).remove();
    },

    /* Close calendar if clicked elsewhere. */
    _checkExternalClick: function(event) {
        if (!popUpCal._curInst) {
            return;
        }
        var target = $(event.target);
        if( (target.parents("#calendar_div").length == 0)
            && (target.attr('class') != 'calendar_trigger')
            && popUpCal._popUpShowing 
            && !(popUpCal._inDialog && $.blockUI) )
        {
            popUpCal.hideCalendar(popUpCal._curInst, '');
        }
    },

    /* Adjust one of the date sub-fields. */
    _adjustDate: function(id, offset, period) {
        var inst = this._getInst(id);
        inst._adjustDate(offset, period);
        this._updateCalendar(inst);
    },

    /* Action for current link. */
    _gotoToday: function(id) {
        var date = new Date();
        var inst = this._getInst(id);
        inst._selectedDay = date.getDate();
        inst._selectedMonth = date.getMonth();
        inst._selectedYear = date.getFullYear();
        this._adjustDate(inst);
    },

    /* Action for selecting a new month/year. */
    _selectMonthYear: function(id, select, period) {
        var inst = this._getInst(id);
        inst._selectingMonthYear = false;
        inst[period == 'M' ? '_selectedMonth' : '_selectedYear'] =
            select.options[select.selectedIndex].value - 0;
        this._adjustDate(inst);
    },

    /* Restore input focus after not changing month/year. */
    _clickMonthYear: function(id) {
        var inst = this._getInst(id);
        if (inst._input && inst._selectingMonthYear && !$.browser.msie) {
            inst._input[0].focus();
        }
        inst._selectingMonthYear = !inst._selectingMonthYear;
    },

    /* Action for changing the first week day. */
    _changeFirstDay: function(id, a) {
        var inst = this._getInst(id);
        var dayNames = inst._get('dayNames');
        var value = a.firstChild.nodeValue;
        for (var i = 0; i < 7; i++) {
            if (dayNames[i] == value) {
                inst._settings.firstDay = i;
                break;
            }
        }
        this._updateCalendar(inst);
    },

    /* Action for selecting a day. */
    _selectDay: function(id, td) {
        var inst = this._getInst(id);
        inst._selectedDay = $("a", td).html();
        this._selectDate(id);
    },

    /* Erase the input field and hide the calendar. */
    _clearDate: function(id) {
        this._selectDate(id, '');
    },

    /* Update the input field with the selected date. */
    _selectDate: function(id, dateStr) {
        var inst = this._getInst(id);
        dateStr = (dateStr != null ? dateStr : inst._formatDate());
        if (inst._input) {
            inst._input.val(dateStr);
        }
        var onSelect = inst._get('onSelect');
        if (onSelect) {
            onSelect(dateStr, inst);  // trigger custom callback
        }
        else {
            inst._input.trigger('change'); // fire the change event
        }
        if (inst._inline) {
            this._updateCalendar(inst);
        }
        else {
            this.hideCalendar(inst, inst._get('speed'));
        }
    },

    /* Set as customDate function to prevent selection of weekends.
       @param  date  Date - the date to customise
       @return [boolean, string] - is this date selectable?, what is its CSS class? */
    noWeekends: function(date) {
        var day = date.getDay();
        return [(day > 0 && day < 6), ''];
    },

    /* Find an object's position on the screen. */
    _findPos: function(obj) {
        while (obj && (obj.type == 'hidden' || obj.nodeType != 1)) {
            obj = obj.nextSibling;
        }
        var curleft = curtop = 0;
        if (obj && obj.offsetParent) {
            curleft = obj.offsetLeft;
            curtop = obj.offsetTop;
            while (obj = obj.offsetParent) {
                var origcurleft = curleft;
                curleft += obj.offsetLeft;
                if (curleft < 0) {
                    curleft = origcurleft;
                }
                curtop += obj.offsetTop;
            }
        }
        return [curleft,curtop];
    }
});

/* Individualised settings for calendars applied to one or more related inputs.
   Instances are managed and manipulated through the PopUpCal manager. */
function PopUpCalInstance(settings, inline) {
    this._id = popUpCal._register(this);
    this._selectedDay = 0;
    this._selectedMonth = 0; // 0-11
    this._selectedYear = 0; // 4-digit year
    this._input = null; // The attached input field
    this._inline = inline; // True if showing inline, false if used in a popup
    this._calendarDiv = (!inline ? popUpCal._calendarDiv :
        $('<div id="calendar_div_' + this._id + '" class="calendar_inline"></div>'));
    // customise the calendar object - uses manager defaults if not overridden
    this._settings = extendRemove({}, settings || {}); // clone
    if (inline) {
        this._setDate(this._getDefaultDate());
    }
}

$.extend(PopUpCalInstance.prototype, {
    /* Get a setting value, defaulting if necessary. */
    _get: function(name) {
        return (this._settings[name] != null ? this._settings[name] : popUpCal._defaults[name]);
    },

    /* Parse existing date and initialise calendar. */
    _setDateFromField: function(input) {
        this._input = $(input);
        var dateFormat = this._get('dateFormat');
        var currentDate = this._input.val().split(dateFormat.charAt(3));
        if (currentDate.length == 3) {
            this._currentDay = parseInt(currentDate[dateFormat.indexOf('D')], 10);
            this._currentMonth = parseInt(currentDate[dateFormat.indexOf('M')], 10) - 1;
            this._currentYear = parseInt(currentDate[dateFormat.indexOf('Y')], 10);
        }
        else {
            var date = this._getDefaultDate();
            this._currentDay = date.getDate();
            this._currentMonth = date.getMonth();
            this._currentYear = date.getFullYear();
        }
        this._selectedDay = this._currentDay;
        this._selectedMonth = this._currentMonth;
        this._selectedYear = this._currentYear;
        this._adjustDate();
    },
    
    /* Retrieve the default date shown on opening. */
    _getDefaultDate: function() {
        var offsetDate = function(offset) {
            var date = new Date();
            date.setDate(date.getDate() + offset);
            return date;
        };
        var defaultDate = this._get('defaultDate');
        return (defaultDate == null ? new Date() :
            (typeof defaultDate == 'number' ? offsetDate(defaultDate) : defaultDate));
    },

    /* Set the date directly. */
    _setDate: function(date) {
        this._selectedDay = this._currentDay = date.getDate();
        this._selectedMonth = this._currentMonth = date.getMonth();
        this._selectedYear = this._currentYear = date.getFullYear();
        this._adjustDate();
    },

    /* Retrieve the date directly. */
    _getDate: function() {
        return new Date(this._currentYear, this._currentMonth, this._currentDay);
    },

    /* Generate the HTML for the current state of the calendar. */
    _generateCalendar: function() {
        var today = new Date();
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // clear time
        // build the calendar HTML
        var controls = '<div class="calendar_control">' +
            '<a class="calendar_clear" onclick="popUpCal._clearDate(' + this._id + ');">' +
            this._get('clearText') + '</a>' +
            '<a class="calendar_close" onclick="popUpCal.hideCalendar(' + this._id + ');">' +
            this._get('closeText') + '</a></div>';
        var prompt = this._get('prompt');
        var closeAtTop = this._get('closeAtTop');
        var hideIfNoPrevNext = this._get('hideIfNoPrevNext');
        // controls and links
        var html = (prompt ? '<div class="calendar_prompt">' + prompt + '</div>' : '') +
            (closeAtTop && !this._inline ? controls : '') + '<div class="calendar_links">' +
            (this._canAdjustMonth(-1) ? '<a class="calendar_prev" ' +
            'onclick="popUpCal._adjustDate(' + this._id + ', -1, \'M\');">' + this._get('prevText') + '</a>' :
            (hideIfNoPrevNext ? '' : '<label class="calendar_prev">' + this._get('prevText') + '</label>')) +
            (this._isInRange(today) ? '<a class="calendar_current" ' +
            'onclick="popUpCal._gotoToday(' + this._id + ');">' + this._get('currentText') + '</a>' : '') +
            (this._canAdjustMonth(+1) ? '<a class="calendar_next" ' +
            'onclick="popUpCal._adjustDate(' + this._id + ', +1, \'M\');">' + this._get('nextText') + '</a>' :
            (hideIfNoPrevNext ? '' : '<label class="calendar_next">' + this._get('nextText') + '</label>')) +
            '</div><div class="calendar_header">';
        var minDate = this._get('minDate');
        var maxDate = this._get('maxDate');
        // month selection
        var monthNames = this._get('monthNames');
        if (!this._get('changeMonth')) {
            html += monthNames[this._selectedMonth] + '&nbsp;';
        }
        else {
            var inMinYear = (minDate && minDate.getFullYear() == this._selectedYear);
            var inMaxYear = (maxDate && maxDate.getFullYear() == this._selectedYear);
            html += '<select class="calendar_newMonth" ' +
                'onchange="popUpCal._selectMonthYear(' + this._id + ', this, \'M\');" ' +
                'onclick="popUpCal._clickMonthYear(' + this._id + ');">';
            for (var month = 0; month < 12; month++) {
                if ((!inMinYear || month >= minDate.getMonth()) &&
                        (!inMaxYear || month <= maxDate.getMonth())) {
                    html += '<option value="' + month + '"' +
                        (month == this._selectedMonth ? ' selected="selected"' : '') +
                        '>' + monthNames[month] + '</option>';
                }
            }
            html += '</select>';
        }
        // year selection
        if (!this._get('changeYear')) {
            html += this._selectedYear;
        }
        else {
            // determine range of years to display
            var years = this._get('yearRange').split(':');
            var year = 0;
            var endYear = 0;
            if (years.length != 2) {
                year = this._selectedYear - 10;
                endYear = this._selectedYear + 10;
            }
            else if (years[0].charAt(0) == '+' || years[0].charAt(0) == '-') {
                year = this._selectedYear + parseInt(years[0], 10);
                endYear = this._selectedYear + parseInt(years[1], 10);
            }
            else {
                year = parseInt(years[0], 10);
                endYear = parseInt(years[1], 10);
            }
            year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
            endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
            html += '<select class="calendar_newYear" onchange="popUpCal._selectMonthYear(' +
                this._id + ', this, \'Y\');" ' + 'onclick="popUpCal._clickMonthYear(' +
                this._id + ');">';
            for (; year <= endYear; year++) {
                html += '<option value="' + year + '"' +
                    (year == this._selectedYear ? ' selected="selected"' : '') +
                    '>' + year + '</option>';
            }
            html += '</select>';
        }
        html += '</div><table class="calendar" cellpadding="0" cellspacing="0"><thead>' +
            '<tr class="calendar_titleRow">';
        var firstDay = this._get('firstDay');
        var changeFirstDay = this._get('changeFirstDay');
        var dayNames = this._get('dayNames');
        for (var dow = 0; dow < 7; dow++) { // days of the week
            html += '<td>' + (!changeFirstDay ? '' : '<a onclick="popUpCal._changeFirstDay(' +
                this._id + ', this);">') + dayNames[(dow + firstDay) % 7] +
                (changeFirstDay ? '</a>' : '') + '</td>';
        }
        html += '</tr></thead><tbody>';
        var daysInMonth = this._getDaysInMonth(this._selectedYear, this._selectedMonth);
        this._selectedDay = Math.min(this._selectedDay, daysInMonth);
        var leadDays = (this._getFirstDayOfMonth(this._selectedYear, this._selectedMonth) - firstDay + 7) % 7;
        var currentDate = new Date(this._currentYear, this._currentMonth, this._currentDay);
        var selectedDate = new Date(this._selectedYear, this._selectedMonth, this._selectedDay);
        var printDate = new Date(this._selectedYear, this._selectedMonth, 1 - leadDays);
        var numRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
        var customDate = this._get('customDate');
        var showOtherMonths = this._get('showOtherMonths');
        for (var row = 0; row < numRows; row++) { // create calendar rows
            html += '<tr class="calendar_daysRow">';
            for (var dow = 0; dow < 7; dow++) { // create calendar days
                var customSettings = (customDate ? customDate(printDate) : [true, '']);
                var otherMonth = (printDate.getMonth() != this._selectedMonth);
                var unselectable = otherMonth || !customSettings[0] ||
                    (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                html += '<td class="calendar_daysCell' +
                    ((dow + firstDay + 6) % 7 >= 5 ? ' calendar_weekEndCell' : '') + // highlight weekends
                    (otherMonth ? ' calendar_otherMonth' : '') + // highlight days from other months
                    (printDate.getTime() == selectedDate.getTime() ? ' calendar_daysCellOver' : '') + // highlight selected day
                    (unselectable ? ' calendar_unselectable' : '') +  // highlight unselectable days
                    (otherMonth && !showOtherMonths ? '' : ' ' + customSettings[1] + // highlight custom dates
                    (printDate.getTime() == currentDate.getTime() ? ' calendar_currentDay' : // highlight current day
                    (printDate.getTime() == today.getTime() ? ' calendar_today' : ''))) + '"' + // highlight today (if different)
                    (unselectable ? '' : ' onmouseover="$(this).addClass(\'calendar_daysCellOver\');"' +
                    ' onmouseout="$(this).removeClass(\'calendar_daysCellOver\');"' +
                    ' onclick="popUpCal._selectDay(' + this._id + ', this);"') + '>' + // actions
                    (otherMonth ? (showOtherMonths ? printDate.getDate() : '&nbsp;') : // display for other months
                    (unselectable ? printDate.getDate() : '<a>' + printDate.getDate() + '</a>')) + '</td>'; // display for this month
                printDate.setDate(printDate.getDate() + 1);
            }
            html += '</tr>';
        }
        html += '</tbody></table>' + (!closeAtTop && !this._inline ? controls : '') +
            '<div style="clear: both;"></div>';
        return html;
    },

    /* Adjust one of the date sub-fields. */
    _adjustDate: function(offset, period) {
        var date = new Date(this._selectedYear + (period == 'Y' ? offset : 0),
            this._selectedMonth + (period == 'M' ? offset : 0),
            this._selectedDay + (period == 'D' ? offset : 0));
        // ensure it is within the bounds set
        var minDate = this._get('minDate');
        var maxDate = this._get('maxDate');
        date = (minDate && date < minDate ? minDate : date);
        date = (maxDate && date > maxDate ? maxDate : date);
        this._selectedDay = date.getDate();
        this._selectedMonth = date.getMonth();
        this._selectedYear = date.getFullYear();
    },

    /* Find the number of days in a given month. */
    _getDaysInMonth: function(year, month) {
        return 32 - new Date(year, month, 32).getDate();
    },

    /* Find the day of the week of the first of a month. */
    _getFirstDayOfMonth: function(year, month) {
        return new Date(year, month, 1).getDay();
    },

    /* Determines if we should allow a "next/prev" month display change. */
    _canAdjustMonth: function(offset) {
        var date = new Date(this._selectedYear, this._selectedMonth + offset, 1);
        if (offset < 0) {
            date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
        }
        return this._isInRange(date);
    },

    /* Is the given date in the accepted range? */
    _isInRange: function(date) {
        var minDate = this._get('minDate');
        var maxDate = this._get('maxDate');
        return ((!minDate || date >= minDate) && (!maxDate || date <= maxDate));
    },

    /* Format the given date for display. */
    _formatDate: function() {
        var day = this._currentDay = this._selectedDay;
        var month = this._currentMonth = this._selectedMonth;
        var year = this._currentYear = this._selectedYear;
        month++; // adjust javascript month
        var dateFormat = this._get('dateFormat');
        var dateString = '';
        for (var i = 0; i < 3; i++) {
            dateString += dateFormat.charAt(3) +
                (dateFormat.charAt(i) == 'D' ? (day < 10 ? '0' : '') + day :
                (dateFormat.charAt(i) == 'M' ? (month < 10 ? '0' : '') + month :
                (dateFormat.charAt(i) == 'Y' ? year : '?')));
        }
        return dateString.substring(dateFormat.charAt(3) ? 1 : 0);
    }
});

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
    $.extend(target, props);
    for (var name in props) {
        if (props[name] == null) {
            target[name] = null;
        }
    }
    return target;
}

/* Attach the calendar to a jQuery selection.
   @param  settings  object - the new settings to use for this calendar instance (anonymous)
   @return jQuery object - for chaining further calls */
$.fn.calendar = function(settings) {
    return this.each(function() {
        // check for settings on the control itself - in namespace 'cal:'
        var inlineSettings = null;
        for (attrName in popUpCal._defaults) {
            var attrValue = this.getAttribute('cal:' + attrName);
            if (attrValue) {
                inlineSettings = inlineSettings || {};
                try {
                    inlineSettings[attrName] = eval(attrValue);
                }
                catch (err) {
                    inlineSettings[attrName] = attrValue;
                }
            }
        }
        var nodeName = this.nodeName.toLowerCase();
        if (nodeName == 'input') {
            var instSettings = (inlineSettings ? $.extend($.extend({}, settings || {}),
                inlineSettings || {}) : settings); // clone and customise
            var inst = (inst && !inlineSettings ? inst :
                new PopUpCalInstance(instSettings, false));
            popUpCal._connectCalendar(this, inst);
        } 
        else if (nodeName == 'div' || nodeName == 'span') {
            var instSettings = $.extend($.extend({}, settings || {}),
                inlineSettings || {}); // clone and customise
            var inst = new PopUpCalInstance(instSettings, true);
            popUpCal._inlineCalendar(this, inst);
        }
    });
};

/* Initialise the calendar. */
$(document).ready(function() {
   popUpCal = new PopUpCal(); // singleton instance
});


// Make a set of elements into a disambiguation cluster. Call as:
//
// $.disambiguator('element');
//
// Assumes the existence of #element, #element-id, #element-loading, and #element-others
// for feedback display. Will set #element-id to the geonames id of the disambiguated place.
// There is nothing in place for non-JS functionality, chiz chiz.

jQuery.disambiguator = function( id, win_callback, fail_callback, start_callback ) {  
  // everything is scoped to this function - no globals. Calling this function
  // more than once on different elements will create new scoped objects,
  // so they won't interfere.
  var text_element = $("#"+id+"-text");
  var id_element = $("#"+id)
  var loading_element = $("#"+id+"-loading")
  var feedback_element = $("#"+id+"-feedback")
  var feedback_wrapper_element = $("#"+id+"-feedback-wrapper")
  var other_cities_element = $("#"+id+"-others")
    
  // should be in the template, but make sure.
  loading_element.hide();
  feedback_wrapper_element.hide();

  var changed = false; // has the content of the search field changed? Used so tabbing through is safe
  var timeout = null; // holds the setTimeout object

  // called on keydown in the search field.
  // if the key was important, defer a call to the ajax callback
  function defer_placename_check(evt) {
    if(timeout) clearTimeout(timeout);
    
    if(!deadkey(evt)) {
      changed = true; // content of search box is changed
      feedback_element.empty().hide();
      other_cities_element.empty().hide();
      feedback_wrapper_element.hide();
      id_element.val('');
      if ( evt.which == 13 ) {
        // return - kick off disambiguate step now
        timeout = setTimeout(do_placename_check, 100);
      } else {
        // disambiguate later
        timeout = setTimeout(do_placename_check, 2000);
      }
    }

      
  }

  // called onblur, and also once the keydown has expired.
  // Makes the ajax callback to disambiguate the city.
  function do_placename_check() {
    if(timeout) clearTimeout(timeout);

    var val = text_element.val();
    
    // boring case - no change, or too short - do nothing
    if (!val || ( val.length <= 2 && val.toLowerCase() != 'la' /* FNORD */ ) || !changed)
      return;

    if (start_callback) start_callback();

    // We're thinking. Clear the feedback and id elements,
    // show spinner, etc, etc.
    feedback_element.empty().hide();
    other_cities_element.empty().hide();
    id_element.val("");
    loading_element.show();
    // feedback_wrapper_element.show(); IE7 displays the div. ungh.
    feedback_wrapper_element.hide();
    
    // we're kicking off a search. There's no point in doing it again.
    changed = false;
    
    $.ajax({
      dataType: "json",
      url: "/city/search",
      data: {q:val},
      success: got_places,
      complete: function() { loading_element.hide() },
      error: function() { loading_element.hide(); feedback_wrapper_element.hide(); }
    });
  }

  // We have a response from the ajax callback.
  function got_places(data) {
    // populate the other_cities drop-down, even if we're not going to
    // show it.
    other_cities_element.hide().html( data.html );
    // connect the thickbox overlay links
    tb_init( other_cities_element.find("a.thickbox") );
    // connect the 'choose this city' links
    other_cities_element.find("a.choose-placename").unbind('click').click(function() {
      // I've abused the DOM to hide the geoname_id in an attribute of the link
      choose_placename( $(this).attr("title"), $(this).attr("geoname_id") );
      other_cities_element.hide();
      return false;
    });

    if(data.cities.length == 0) {
      feedback_element.html("<p class='blurb'>Seems like we can't find the destination you're looking for. Please check that you have spelt its name correctly. Sometimes a typo can confuse our system.<br/><br/>We'd suggest you use cities or towns, instead of islands, countries or resorts, to encourage more coincidences. If your destination is very small, you might want to try a bigger city, town or village that's nearby. If you've tried all these and it's still not working, <a href='http://help.dopplr.com/contact/'>send us a note</a> and we'll see what we can do to help.</p>");
      if (fail_callback) fail_callback();
    }
    else if('iata' in data.fields) {
      feedback_element.html("<p class='blurb'>We recognised " + data.fields.iata + " as an IATA airport code, and the nearest big city is " + h(data.cities[0].title) + ".</p>");
      choose_placename(data.cities[0].title, data.cities[0].geoname_id);
    }
    else if(data.fields.geocoded && data.cities[0].title != data.query) {
      feedback_element.html("<p class='blurb'>We couldn't find exactly what you typed, but we believe this may be nearby: " + h(data.cities[0].title) + ".</p>");
      choose_placename(data.cities[0].title, data.cities[0].geoname_id);
    }
    else if(data.cities.length == 1) {
      feedback_element.html("<p class='blurb'>We know about just one place in the world that matches what you've typed: " + h(data.cities[0].title) + ".</p>");
      choose_placename(data.cities[0].title, data.cities[0].geoname_id);
    }
    else if(data.cities.length > 1) {
      if (data['default']) {
        choose_placename(data.cities[0].title, data.cities[0].geoname_id);
        defaulted = true;
        feedback_element.html("<p class='blurb'>We think you mean " + h(data.cities[0].title) + ". However, there are " + data.cities.length + " places that could match what you've typed. <a href='#' class='other-cities'>See them now</a>.</p>");
      } else {
        feedback_element.html("<p class='blurb'>There are " + data.cities.length + " places that could match what you've typed. To see them, <a href='#' class='other-cities'>click here</a>.</p>");
        if (fail_callback) fail_callback();
      }
      // connect the 'expand other cities chooser' link
      feedback_element.find("a.other-cities").unbind('click').click(function() {
        other_cities_element.slideDown(1000);
        feedback_element.hide();
        return false;
      });
    }
    
    // having populated the feedback element..
    feedback_element.show();
    feedback_wrapper_element.show();
  }
  
  // populates the input elements with the chosen place. Called both automatically
  // in the ajax callback, and when the user deliberately clicks a placename
  function choose_placename(name, geoname_id) {
    text_element.val(name);
    id_element.val(geoname_id);
    changed = false;
    // if we've been given a callback function, call it.
    if (win_callback) win_callback( name, geoname_id );
  }

  // conect actions to the element
  text_element.keyup(defer_placename_check);
  text_element.keydown(function(evt) {
    if (evt.which == 13) {
      // return - start a placename check _now_, but don't submit the form
      do_placename_check();
      return false;
    }
    return true;
  });
  text_element.blur( do_placename_check );
  
  id_element;
}



/*
 * Superfish v1.4.8 - jQuery menu widget
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 * CHANGELOG: http://users.tpg.com.au/j_birch/plugins/superfish/changelog.txt
 */
;(function($){$.fn.superfish=function(op){var sf=$.fn.superfish,c=sf.c,$arrow=$(['<span class="',c.arrowClass,'"> &#187;</span>'].join('')),over=function(){var $$=$(this),menu=getMenu($$);clearTimeout(menu.sfTimer);$$.showSuperfishUl().siblings().hideSuperfishUl();},out=function(){var $$=$(this),menu=getMenu($$),o=sf.op;clearTimeout(menu.sfTimer);menu.sfTimer=setTimeout(function(){o.retainPath=($.inArray($$[0],o.$path)>-1);$$.hideSuperfishUl();if(o.$path.length&&$$.parents(['li.',o.hoverClass].join('')).length<1){over.call(o.$path);}},o.delay);},getMenu=function($menu){var menu=$menu.parents(['ul.',c.menuClass,':first'].join(''))[0];sf.op=sf.o[menu.serial];return menu;},addArrow=function($a){$a.addClass(c.anchorClass).append($arrow.clone());};return this.each(function(){var s=this.serial=sf.o.length;var o=$.extend({},sf.defaults,op);o.$path=$('li.'+o.pathClass,this).slice(0,o.pathLevels).each(function(){$(this).addClass([o.hoverClass,c.bcClass].join(' ')).filter('li:has(ul)').removeClass(o.pathClass);});sf.o[s]=sf.op=o;$('li:has(ul)',this)[($.fn.hoverIntent&&!o.disableHI)?'hoverIntent':'hover'](over,out).each(function(){if(o.autoArrows)addArrow($('>a:first-child',this));}).not('.'+c.bcClass).hideSuperfishUl();var $a=$('a',this);$a.each(function(i){var $li=$a.eq(i).parents('li');$a.eq(i).focus(function(){over.call($li);}).blur(function(){out.call($li);});});o.onInit.call(this);}).each(function(){var menuClasses=[c.menuClass];if(sf.op.dropShadows&&!($.browser.msie&&$.browser.version<7))menuClasses.push(c.shadowClass);$(this).addClass(menuClasses.join(' '));});};var sf=$.fn.superfish;sf.o=[];sf.op={};sf.IE7fix=function(){var o=sf.op;if($.browser.msie&&$.browser.version>6&&o.dropShadows&&o.animation.opacity!=undefined)
this.toggleClass(sf.c.shadowClass+'-off');};sf.c={bcClass:'sf-breadcrumb',menuClass:'sf-js-enabled',anchorClass:'sf-with-ul',arrowClass:'sf-sub-indicator',shadowClass:'sf-shadow'};sf.defaults={hoverClass:'sfHover',pathClass:'overideThisToUse',pathLevels:1,delay:800,animation:{opacity:'show'},speed:'normal',autoArrows:true,dropShadows:true,disableHI:false,onInit:function(){},onBeforeShow:function(){},onShow:function(){},onHide:function(){}};$.fn.extend({hideSuperfishUl:function(){var o=sf.op,not=(o.retainPath===true)?o.$path:'';o.retainPath=false;var $ul=$(['li.',o.hoverClass].join(''),this).add(this).not(not).removeClass(o.hoverClass).find('>ul').hide().css('visibility','hidden');o.onHide.call($ul);return this;},showSuperfishUl:function(){var o=sf.op,sh=sf.c.shadowClass+'-off',$ul=this.addClass(o.hoverClass).find('>ul:hidden').css('visibility','visible');sf.IE7fix.call($ul);o.onBeforeShow.call($ul);$ul.animate(o.animation,o.speed,function(){sf.IE7fix.call($ul);o.onShow.call($ul);});return this;}});})(jQuery);

/*
 * Supersubs v0.2b - jQuery plugin
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *
 * This plugin automatically adjusts submenu widths of suckerfish-style menus to that of
 * their longest list item children. If you use this, please expect bugs and report them
 * to the jQuery Google Group with the word 'Superfish' in the subject line.
 *
 */
;(function($){$.fn.supersubs=function(options){var opts=$.extend({},$.fn.supersubs.defaults,options);return this.each(function(){var $$=$(this);var o=$.meta?$.extend({},opts,$$.data()):opts;var fontsize=$('<li id="menu-fontsize">&#8212;</li>').css({'padding':0,'position':'absolute','top':'-999em','width':'auto'}).appendTo($$).width();$('#menu-fontsize').remove();$ULs=$$.find('ul');$ULs.each(function(i){var $ul=$ULs.eq(i);var $LIs=$ul.children();var $As=$LIs.children('a');var liFloat=$LIs.css('white-space','nowrap').css('float');var emWidth=$ul.add($LIs).add($As).css({'float':'none','width':'auto'}).end().end()[0].clientWidth/fontsize;emWidth+=o.extraWidth;if(emWidth>o.maxWidth){emWidth=o.maxWidth;}
else if(emWidth<o.minWidth){emWidth=o.minWidth;}
emWidth+='em';$ul.css('width',emWidth);$LIs.css({'float':liFloat,'width':'100%','white-space':'normal'}).each(function(){var $childUl=$('>ul',this);var offsetDirection=$childUl.css('left')!==undefined?'left':'right';$childUl.css(offsetDirection,emWidth);});});});};$.fn.supersubs.defaults={minWidth:9,maxWidth:25,extraWidth:0};})(jQuery);

/* hoverIntent by Brian Cherne */
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY;};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev]);}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev]);};var handleHover=function(e){var p=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget;while(p&&p!=this){try{p=p.parentNode;}catch(e){p=this;}}
if(p==this){return false;}
var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);}
if(e.type=="mouseover"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob);},cfg.timeout);}}};return this.mouseover(handleHover).mouseout(handleHover);};})(jQuery);