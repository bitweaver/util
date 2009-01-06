// $Header: /cvsroot/bitweaver/_bit_util/javascript/bitweaver.js,v 1.36 2009/01/06 18:07:32 spiderr Exp $

// please modify this file and leave plenty of comments. This file will be
// compressed automatically. Please make sure you only use comments beginning
// with '//' and put comments on separate lines otherwise the packer will choke

// the beginning of the clean up of bitweaver core js - use name spaces
// if you are adding new features to this file add them to the BitBase object.
BitBase = {
	"getElement": function(id){
		return ((typeof(id) == "string") ?
			document.getElementById(id) : id);
	},

	"setElementDisplay": function( elm, val ){
		var self = BitBase;
		var obj = self.getElement( elm );
		if( obj != null ){ obj.style.display=val; }
	},

	"toggleElementDisplay": function( elm, val ){
		var self = BitBase;
		var obj = self.getElement( elm );
		var value = obj.style.display == val?'none':val;
		self.setElementDisplay( obj, value );
	},

	"showSpinner": function() {
		BitBase.setElementDisplay( 'spinner','block' );
	},
	
	"hideSpinner": function() {
		BitBase.setElementDisplay( 'spinner','none' );
	},

    "upperCaseFirst": function(str){
        var tmpChar = str.substring(0,1).toUpperCase();
        var postString = str.substring(1,str.length);
        var newString = tmpChar + postString;
        return newString;
    }
};

// This function is called by FCKEditor when/if it is loaded.
function FCKeditor_OnComplete( editorInstance )
{
	// We note that it is loaded so switchEditors doesn't throw an error
	// before the API object is created.
	document.FCKEditorLoaded = true;
}

var expires = new Date();
var offset = -(expires.getTimezoneOffset() * 60);
expires.setFullYear(expires.getFullYear() + 1);
setCookie("tz_offset", offset);
setCookie("javascript_enabled", "y");


// Adds a function to be called at page load time
function addLoadHook(func) {
	if ( typeof window.addEventListener != "undefined" ) {
		window.addEventListener( "load", func, false );
	} else if ( typeof window.attachEvent != "undefined" ) {
		window.attachEvent( "onload", func );
	} else {
		if ( window.onload != null ) {
			var oldOnload = window.onload;
			window.onload = function ( e ) {
				oldOnload( e );
		       		func(e);
			};
		} else {
			window.onload = func(e);
		}
	}
}

// shows or hides based on the showhide cookie
function setupShowHide() {
	var curval = getCookie('showhide');
	if (curval != null) {
		var ids = unserialize(curval);
		for (id in ids) {
			if (ids[id] == "o") { 
				showById(id);
			}
			else {
				hideById(id);
			} 
		}
	}
}

// swiped from this page: http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
// utf.js - UTF-8 <=> UTF-16 convertion
// 
// Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
// Version: 1.0
// LastModified: Dec 25 1999
// This library is free.  You can redistribute it and/or modify it.

// Interfaces:
// utf8 = utf16to8(utf16);
// utf16 = utf16to8(utf8);
function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
	c = str.charCodeAt(i);
	if ((c >= 0x0001) && (c <= 0x007F)) {
	    out += str.charAt(i);
	} else if (c > 0x07FF) {
	    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	    out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
	    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	} else {
	    out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
	    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	}
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
	c = str.charCodeAt(i++);
	switch(c >> 4)
	{ 
	  case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	    // 0xxxxxxx
	    out += str.charAt(i-1);
	    break;
	  case 12: case 13:
	    // 110x xxxx   10xx xxxx
	    char2 = str.charCodeAt(i++);
	    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	    break;
	  case 14:
	    // 1110 xxxx  10xx xxxx  10xx xxxx
	    char2 = str.charCodeAt(i++);
	    char3 = str.charCodeAt(i++);
	    out += String.fromCharCode(((c & 0x0F) << 12) |
					   ((char2 & 0x3F) << 6) |
					   ((char3 & 0x3F) << 0));
	    break;
	}
    }

    return out;
}

// swiped from this page: http://www.coolcode.cn/?p=171
// 
// phpserializer.js - JavaScript to PHP serialize / unserialize class.
// 
// This class is designed to convert php variables to javascript
// and javascript variables to php with a php serialize unserialize
// compatible way.
// 
// Copyright (C) 2006 Ma Bingyao <andot@ujn.edu.cn>
// Version: 3.0f
// LastModified: Nov 30, 2006
// This library is free.  You can redistribute it and/or modify it.
// http://www.coolcode.cn/?p=171
 
function serialize(o) {
    var p = 0, sb = [], ht = [], hv = 1;
    var classname = function(o) {
        if (typeof(o) == "undefined" || typeof(o.constructor) == "undefined") return '';
        var c = o.constructor.toString();
        c = utf16to8(c.substr(0, c.indexOf('(')).replace(/(^\s*function\s*)|(\s*$)/ig, ''));
        return ((c == '') ? 'Object' : c);
    };
    var is_int = function(n) {
        var s = n.toString(), l = s.length;
        if (l > 11) return false;
        for (var i = (s.charAt(0) == '-') ? 1 : 0; i < l; i++) {
            switch (s.charAt(i)) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9': break;
                default : return false;
            }
        }
        return !(n < -2147483648 || n > 2147483647);
    };
    var in_ht = function(o) {
        for (k in ht) if (ht[k] === o) return k;
        return false;
    };
    var ser_null = function() {
        sb[p++] = 'N;';
    };
    var ser_boolean = function(b) {
        sb[p++] = (b ? 'b:1;' : 'b:0;');
    };
    var ser_integer = function(i) {
        sb[p++] = 'i:' + i + ';';
    };
    var ser_double = function(d) {
        if (isNaN(d)) d = 'NAN';
        else if (d == Number.POSITIVE_INFINITY) d = 'INF';
        else if (d == Number.NEGATIVE_INFINITY) d = '-INF';
        sb[p++] = 'd:' + d + ';';
    };
    var ser_string = function(s) {
        var utf8 = utf16to8(s);
        sb[p++] = 's:' + utf8.length + ':"';
        sb[p++] = utf8;
        sb[p++] = '";';
    };
    var ser_array = function(a) {
        sb[p++] = 'a:';
        var lp = p;
        sb[p++] = 0;
        sb[p++] = ':{';
        for (var k in a) {
            if (typeof(a[k]) != 'function') {
                is_int(k) ? ser_integer(k) : ser_string(k);
                __serialize(a[k]);
                sb[lp]++;
            }
        }
        sb[p++] = '}';
    };
    var ser_object = function(o) {
        var cn = classname(o);
        if (cn == '') ser_null();
        else if (typeof(o.serialize) != 'function') {
            sb[p++] = 'O:' + cn.length + ':"';
            sb[p++] = cn;
            sb[p++] = '":';
            var lp = p;
            sb[p++] = 0;
            sb[p++] = ':{';
            if (typeof(o.__sleep) == 'function') {
                var a = o.__sleep();
                for (var kk in a) {
                    ser_string(a[kk]);
                    __serialize(o[a[kk]]);
                    sb[lp]++;
                }
            }
            else {
                for (var k in o) {
                    if (typeof(o[k]) != 'function') {
                        ser_string(k);
                        __serialize(o[k]);
                        sb[lp]++;
                    }
                }
            }
            sb[p++] = '}';
        }
        else {
             var cs = o.serialize();
             sb[p++] = 'C:' + cn.length + ':"';
             sb[p++] = cn;
             sb[p++] = '":' + cs.length + ':{';
             sb[p++] = cs;
             sb[p++] = "}";
         }
     };
     var ser_pointref = function(R) {
         sb[p++] = "R:" + R + ";";
     };
     var ser_ref = function(r) {
         sb[p++] = "r:" + r + ";";
     };
     var __serialize = function(o) {
         if (o == null || o.constructor == Function) {
             hv++;
             ser_null();
         }
         else switch (o.constructor) {
             case Boolean: {
                 hv++;
                 ser_boolean(o);
                 break;
             }
             case Number: {
                 hv++;
                 is_int(o) ? ser_integer(o) : ser_double(o);
                 break;
             }
             case String: {
                 hv++;
                 ser_string(o);
                 break;
             }
// @cc_on @
// @if (@_jscript)
//             case VBArray: {
//                 o = o.toArray();
//             }
// @end @
             case Array: {
                 var r = in_ht(o);
                 if (r) {
                     ser_pointref(r);
                 }
                 else {
                     ht[hv++] = o;
                     ser_array(o);
                 }
                 break;
             }
             default: {
                 var r = in_ht(o);
                 if (r) {
                     hv++;
                     ser_ref(r);
                 }
                 else {
                     ht[hv++] = o;
                     ser_object(o);
                 }
                 break;
             }
         }
     };
     __serialize(o);
     return sb.join('');
 }
  
 function unserialize(ss) {
     var p = 0, ht = [], hv = 1; r = null;
     var unser_null = function() {
         p++;
         return null;
     };
     var unser_boolean = function() {
         p++;
         var b = (ss.charAt(p++) == '1');
         p++;
         return b;
     };
     var unser_integer = function() {
         p++;
         var i = parseInt(ss.substring(p, p = ss.indexOf(';', p)));
         p++;
         return i;
     };
     var unser_double = function() {
         p++;
         var d = ss.substring(p, p = ss.indexOf(';', p));
         switch (d) {
             case 'NAN': d = NaN; break;
             case 'INF': d = Number.POSITIVE_INFINITY; break;
             case '-INF': d = Number.NEGATIVE_INFINITY; break;
             default: d = parseFloat(d);
         }
         p++;
         return d;
     };
     var unser_string = function() {
         p++;
         var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
         p += 2;
         var s = utf8to16(ss.substring(p, p += l));
         p += 2;
         return s;
     };
     var unser_array = function() {
         p++;
         var n = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
         p += 2;
         var a = [];
         ht[hv++] = a;
         for (var i = 0; i < n; i++) {
             var k;
             switch (ss.charAt(p++)) {
                 case 'i': k = unser_integer(); break;
                 case 's': k = unser_string(); break;
                 case 'U': k = unser_unicode_string(); break;
                 default: return false;
             }
             a[k] = __unserialize();
         }
         p++;
         return a;
     };
     var unser_object = function() {
         p++;
         var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
         p += 2;
         var cn = utf8to16(ss.substring(p, p += l));
         p += 2;
         var n = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
         p += 2;
         if (eval(['typeof(', cn, ') == "undefined"'].join(''))) {
             eval(['function ', cn, '(){}'].join(''));
         }
         var o = eval(['new ', cn, '()'].join(''));
         ht[hv++] = o;
         for (var i = 0; i < n; i++) {
             var k;
             switch (ss.charAt(p++)) {
                 case 's': k = unser_string(); break;
                 case 'U': k = unser_unicode_string(); break;
                 default: return false;
             }
			 // the \0 breaks the javascript packer - it outputs \ and the 0 is missing.
			 // \1 works fine though. perhaps we can fix the packer or find a way not to use \0 here
             //if (k.charAt(0) == '\0') {
             //    k = k.substring(k.indexOf('\0', 1) + 1, k.length);
             //}
             o[k] = __unserialize();
         }
         p++;
         if (typeof(o.__wakeup) == 'function') o.__wakeup();
         return o;
     };
     var unser_custom_object = function() {
         p++;
         var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
         p += 2;
         var cn = utf8to16(ss.substring(p, p += l));
         p += 2;
         var n = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
         p += 2;
         if (eval(['typeof(', cn, ') == "undefined"'].join(''))) {
             eval(['function ', cn, '(){}'].join(''));
         }
         var o = eval(['new ', cn, '()'].join(''));
         ht[hv++] = o;
         if (typeof(o.unserialize) != 'function') p += n;
         else o.unserialize(ss.substring(p, p += n));
         p++;
         return o;
     };
     var unser_unicode_string = function() {
         p++;
         var l = parseInt(ss.substring(p, p = ss.indexOf(':', p)));
         p += 2;
         var sb = [];
         for (var i = 0; i < l; i++) {
             if ((sb[i] = ss.charAt(p++)) == '\\') {
                 sb[i] = String.fromCharCode(parseInt(ss.substring(p, p += 4), 16));
             }
         }
         p += 2;
         return sb.join('');
     };
     var unser_ref = function() {
         p++;
         var r = parseInt(ss.substring(p, p = ss.indexOf(';', p)));
         p++;
         return ht[r];
     };
     var __unserialize = function() {
         switch (ss.charAt(p++)) {
             case 'N': return ht[hv++] = unser_null();
             case 'b': return ht[hv++] = unser_boolean();
             case 'i': return ht[hv++] = unser_integer();
             case 'd': return ht[hv++] = unser_double();
             case 's': return ht[hv++] = unser_string();
             case 'U': return ht[hv++] = unser_unicode_string();
             case 'r': return ht[hv++] = unser_ref();
             case 'a': return unser_array();
             case 'O': return unser_object();
             case 'C': return unser_custom_object();
             case 'R': return unser_ref();
             default: return false;
         }
     };
     return __unserialize();
}
// end swipe

//--- moved here from prototype - start ---
function $() {
	var elements = new Array();
	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == 'string')
			element = document.getElementById(element);
		if (arguments.length == 1)
			return element;
		elements.push(element);
	}
	return elements;
}
//----------- prototype - end -------------

// function:	toggle_dynamic_var
// desc:		Toggles the visibility of dynamic variable passed to it
// date:		Pre-bitweaver
// params:		$name
function toggle_dynamic_var($name) {
	name1 = 'dyn_'+$name+'_display';
	name2 = 'dyn_'+$name+'_edit';
	if($(name1).style.display == "none") {
		$(name2).style.display = "none";
		$(name1).style.display = "inline";
	} else {
		$(name1).style.display = "none";
		$(name2).style.display = "inline";
}	}

// function:	genPass
// date:		Pre-bitweaver
// params:		w1 / w2 / w3
function genPass(w1, w2, w3) {
	vo = "aeiouAEU";
	co = "bcdfgjklmnprstvwxzBCDFGHJKMNPQRSTVWXYZ0123456789_$%#";
	s = Math.round(Math.random());
	l = 8;
	p = '';
	for (i = 0; i < l; i++) {
		if (s) {
			letter = vo.charAt(Math.round(Math.random() * (vo.length - 1)));
			s = 0;
		} else {
			letter = co.charAt(Math.round(Math.random() * (co.length - 1)));
			s = 1;
		}
		p = p + letter;
	}
	$(w1).value = p;
	$(w2).value = p;
	$(w3).value = p;
}

// function:	setSomeElement
// desc:		Adds a String to the value of elementId
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
//				strng = the string to be added
function setSomeElement(elementId, strng) {
	$(elementId).value = $(elementId).value + strng;
}

// function:	setSelectionRange - used by insertAt
// desc:		No Idea
// date:		Pre-bitweaver
// params:		textarea = / selectionStart = / selectionEnd =
function setSelectionRange(textarea, selectionStart, selectionEnd) {
	if (textarea.setSelectionRange) {
		textarea.focus();
		textarea.setSelectionRange(selectionStart, selectionEnd);
	} else if (textarea.createTextRange) {
		var range = textarea.createTextRange();
		textarea.collapse(true);
		textarea.moveEnd('character', selectionEnd);
		textarea.moveStart('character', selectionStart);
		textarea.select();
}	}

// function:	setCaretToPos - used by insertAt
// desc:		No Idea
// date:		Pre-bitweaver
// params:		textarea = / pos =
function setCaretToPos (textarea, pos) {
	setSelectionRange(textarea, pos, pos);
}

// function:	insertAt - used by QuickTags & Plugin Help
// desc:		inserts replaceString in elementId
// date:		Pre-bitweaver
// params:		elementId = a HTML Id / replaceString = string
function insertAt(elementId, replaceString) {
	//inserts given text at selection or cursor position
	//substrings in replaceString to be replaced by the selection if a selection was done
	var toBeReplaced = /text|page|textarea_id/;

	textarea = $(elementId);

	// FCKEditor is completely different
	if (document.FCKEditorLoaded) {
		oEditor = FCKeditorAPI.GetInstance(elementId);
		// Check if it is a fckeditor. If not fall back on old code.
		if (oEditor) {
			// Fetching selection can't be done through the 'Selection'. Stupid.
		  	if (document.all) { 
				oSel = oEditor.EditorDocument.selection.createRange().text; 
			} else { 
				oSel = oEditor.EditorWindow.getSelection(); 
			}
			// Convert oSel to a string.
			oSel = "" + oSel;
			if (oSel.length > 0) {
				replaceString = replaceString.replace(toBeReplaced, oSel);
				// Delete selection 
				oEditor.Selection.Delete();
			}
			oEditor.InsertHtml(replaceString);
			return;
		}
	}
	
	textarea = $(elementId);
	if (textarea.setSelectionRange) {
		//Mozilla UserAgent Gecko-1.4
		var selectionStart = textarea.selectionStart;
		var selectionEnd = textarea.selectionEnd;
		 // has there been a selection
		if (selectionStart != selectionEnd) {
			var newString = replaceString.replace(toBeReplaced, textarea.value.substring(selectionStart, selectionEnd));
			textarea.value = textarea.value.substring(0, selectionStart)
				+ newString
				+ textarea.value.substring(selectionEnd);
			setSelectionRange(textarea, selectionStart, selectionStart + newString.length);
		// set caret
		} else {
			textarea.value = textarea.value.substring(0, selectionStart)
				+ replaceString
				+ textarea.value.substring(selectionEnd);
			setCaretToPos(textarea, selectionStart + replaceString.length);
		}
	} else if (document.selection) {
		//UserAgent IE-6.0
		textarea.focus();
		var range = document.selection.createRange();
		if (range.parentElement() == textarea) {
			var isCollapsed = range.text == '';
			if (! isCollapsed)	{
				range.text = replaceString.replace(toBeReplaced, range.text);
				range.moveStart('character', -range.text.length);
				range.select();
			} else {
				range.text = replaceString;
		}	}
	} else {
		//UserAgent Gecko-1.0.1 (NN7.0)
		setSomeElement(elementId, replaceString)
		//alert("don't know yet how to handle insert" + document);
}	}

// function:	showById
// desc:		Displays a hidden HTML element. Can also set a cookie to make it stay that way.
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
//				setCookie = any value (not 0) to turn cookies on
function showById(elementId,useCookie) {
	if (document.layers) {
		if (document.layers[elementId]) {
			document.layers[elementId].display = "block";
		}
	}
	else if (document.all) {
		if (document.all[elementId]) {
			document.all[elementId].style.display = "block";
		}
	}
	else if (document.getElementById) {
		if (document.getElementById(elementId)) {
			document.getElementById(elementId).style.display = "block";
		}
	}
	if (useCookie) { setCookieArray('showhide', elementId, "o"); }
}

// function:	hideById
// desc:		Hides an HTML element. Can also set a cookie to make it stay that way.
// date:		Pre-bitweaver
// params:		elementId = a HTML Id /
//				setCookie = any value (not 0) to turn cookies on
function hideById(elementId,useCookie) {
	if (document.layers) {
		if (document.layers[elementId]) {
			document.layers[elementId].display = "none";
		}
	}
	else if (document.all) {
		if (document.all[elementId]) {
			document.all[elementId].style.display = "none";
		}
	}
	else if (document.getElementById) {
		if (document.getElementById(elementId)) {
			document.getElementById(elementId).style.display = "none";
		}
	}
	if (useCookie) { setCookieArray('showhide', elementId, "c"); }
}

// function:	flip
// desc:		Flips the visibility of a HTML element. Cookies are not used.
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
function flip(elementId) {
	var ele = document.getElementById( elementId );
	if( ele ) {
		if(ele.style.display == "none") { 
			showById(elementId);
		} else { 
			hideById(elementId);
		}	
	}
}

// function:	toggle
// desc:		Toggles a HTML elements visibility. Cookies are used to make it stay that way.
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
function toggle(elementId) {
	var ele = document.getElementById( elementId );
	if( ele ) {
		if( ele.style.display == "none" ) { 
			showById(elementId,1);
		} else { 
			hideById(elementId,1);
		}
	}	
}

// function:	flipMulti
// desc:		Toggles visibility for multiple HTML elements - can be used with an HTML Selector
//				On the first call - Shows the window id's defined by (header) & (numbr) & saves them in a variable
//				On subsequent calls - Hide the saved windows and shows the new windows
// added by: 	StarRider
// date:		1/5/06
// Note			For Cross-Browser compatibility - An HTML elements id's must begin with a Letter or String.
//				Operates by appending a string (header) with the number (numbr) to show/hide the window id.
//				With multiple windows - the id's need to be sequencial eg. each id is 1 greater than the last
//				with the first being (numbr).
// example:		When used in a tpl file with div elements: $header='dog';
//				<div id="{$header}1" style="display:none;">This Data</div> / the id is "dog1"
//				<div id="{$header}2" style="display:none;">That Data</div> / the id is "dog2"
//				The Selector: <select size="15" onchange="javascript:flipMulti(this.options[this.selectedIndex].value,2,2)">
//				Each Option: <option value="{$header}">Whatever</option> / the value is "dog"
//				To display the first set of divs - use:
//				<script type="text/javascript"> flipMulti('{$header}',1,2); </script>
// params:		elementIdStart = The string portion of the elements Id.
//				elementIdNum = any number - that is appended to the elementIdStart forming the elements Id.
//					If elementIdStart="dog" & elementIdNum=1 then the elements Id is "dog1"
//				elements = a number (1-9/def=1) indicates how many elements to hide/display.
//				zen = a number (1-3/def=1) allows multiple routines to use the function at the same time. Stores the
//				text portion of the window Id (elementIdStart) in an array so that it can be hidden later.

// Only the header portion of the id is saved
var flipArr=[0,0,0];
function flipMulti(elementIdStart,elementIdNum,elements,zen){
	if(elementIdStart && elementIdNum) {
		if(arguments.length<1) elementIdNum=1;
		// elementIdNum has to be a number
		elementIdNum=(elementIdNum*10)/10;
		if(arguments.length<2) elements=1;
		// elements has to be a number
		elements=(elements*10)/10;
		if(elements<1 || elements>9) elements=1;
		if(arguments.length<3) zen=1;
		// zen has to be a number
		zen=(zen*10)/10;
		if(!zen || zen<1 || zen>3) zen=1;
		var i=0;
		do {
			if(flipArr[zen-1]!=0) hideById(flipArr[zen-1]+(elementIdNum+i));
			showById(elementIdStart+(elementIdNum+i));
		} while (++i <= elements-1);
		flipArr[zen-1]=elementIdStart;
}	}

// function:	flipIcon
// desc:		Toggles a HTML elements visibility with an Icon. Use Cookies to make it stay that way.
// Note:		This functions replaces icntoggle & setfoldericonstate - No reason to use 2 functions when 1 will do
// added by: 	StarRider
// date:		12/15/05
// params:		elementId is an HTML Id for the window to be displayed/hidden
function flipIcon(elementId) {
	var pic = new Image();
	if (elementId && $(elementId).style && $(elementId).style.display && $(elementId).style.display == "none") {
		pic.src = bitIconDir + "/expanded.gif";
		showById(elementId,1);
	} else {
		pic.src = bitIconDir + "/collapsed.gif";
		hideById(elementId,1);
	}
	$(elementId+"img").src = pic.src;
}

// function:	setFlipWithSign
// desc:		Toggles the state of a flipped List after page reload
// Note:		Reworked to eliminate collapseSign / expandSign
// date:		Pre-bitweaver
// params:		foo = a HTML Id of a List
function setFlipIcon(elementId) {
	var pic = new Image();
	if (getCookie(elementId) == "o") {
		pic.src = bitIconDir + "/expanded.gif";
		showById(elementId);
	} else {
		pic.src = bitIconDir + "/collapsed.gif";
		hideById(elementId);
	}
	$(elementId+"img").src = pic.src;
}

// function:	flipWithSign
// desc:		Used to Expand/Collapse Lists
// Note:		Reworked to eliminate collapseSign / expandSign
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
function flipWithSign(elementId,cookie) {
	if( flipperEle = document.getElementById( "flipper"+elementId ) ) {
		if ($(elementId).style.display == "none") {
			showById(elementId,cookie);
			flipperEle.firstChild.nodeValue = "[-]";
		} else {
			hideById(elementId,cookie);
			flipperEle.firstChild.nodeValue = "[+]";
		}
	}	
}

// function:	setFlipWithSign
// desc:		Toggles the state of a flipped List after page reload
// Note:		Reworked to eliminate collapseSign / expandSign
// date:		Pre-bitweaver
// params:		elementId = a HTML Id of a List
function setFlipWithSign(elementId) {
	if( flipperEle = document.getElementById( "flipper"+elementId ) ) {
		if (getCookie(elementId) == "o") {
			showById(elementId);
			flipperEle.firstChild.nodeValue = "[-]";
		} else {
			hideById(elementId);
			flipperEle.firstChild.nodeValue = "[+]";
		}
	}	
}

// function: setCookieArray
// desc: Creates a cookie if required and sets the element in the array
// date: 2007-march-1
// params: cookie - the name of the cookie
//         key - the name of the key in the cookie array
//         value - the value to set it to
function setCookieArray(cookie, key, value) {
	var curval = getCookie(cookie);
	var newval;
	if (curval != null) {
		newval = unserialize(curval);
		newval[key] = value;
	}
	else {
		newval = new Array();
		newval[key] = value;
	}
	setCookie(cookie, serialize(newval));
}

// function: getCookieArray
// desc: Returns a value from a key stored in an array in a cookie.
// date: 2007-march-1
// params: cookie - the name of the cookie
//         key - the name of the key in the cookie array
function getCookieArray(cookie, key) {
	var curval = getCookie(cookie);
	var val;
	if (curval != null) {
		var arr = unserialize(curval);
		val = arr[key];
	}
	return val;
}

// function:	setCookie
// desc:		Creates a Cookie
// date:		Pre-bitweaver
// params:		name = the name of the cookie
//				value = the value placed in the cookie
//				[expires] (optional) = the expiration date of the cookie (defaults to end of current session)
//				[path] (optional) = the path for which the cookie is valid (defaults to path of calling document)
//				[domain] (optional) = the domain for which the cookie is valid (defaults to domain of calling document)
//				[secure] (optional) = Boolean value indicating if the cookie transmission requires a secure transmission
// NOTE:	* an argument defaults when it is assigned null as a placeholder
// 			* a null placeholder is not required for trailing omitted arguments
function setCookie(name, value, expire, path, domain, secure) {
	var path = (path) ? path : bitCookiePath;
	var domain = escape((domain) ? domain : bitCookieDomain);	
	var cookie_path = ((path) ? "; path=" + path : "");
	var cookie_domain = ((domain) ? "; domain=" + domain : "");
	var cookie_expire = ((expires) ? "; expires=" + expires.toGMTString() : "");
	var cookie_secure =	((secure) ? "; secure" : ""); 
	var curCookie = name + "=" + escape(value)
			+ cookie_path
			+ cookie_domain
			+ cookie_expire
			+ cookie_secure;
//alert(curCookie);
	document.cookie = curCookie;
}

// function:	getCookie
// desc:		Gets a Cookie and returns it's value
// date:		Pre-bitweaver
// params:		name = the name of the desired cookie
// NOTE:		return string contains value of specified cookie or null if cookie does not exist
function getCookie(name) {
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0)
			return null;
	} else begin += 2;
	var end = document.cookie.indexOf(";", begin);
	if (end == -1)
		end = dc.length;
	return unescape(dc.substring(begin + prefix.length, end));
}

// function:	deleteCookie
// desc:		Deletes a Cookie
// date:		Pre-bitweaver
// params:		name = the name of the cookie
//				[path] (optional) = the path of the cookie (must be same path used when created)
//				[domain] (optional) = the domain of the cookie (must be same domain used when created)
// NOTE:		path and domain default if assigned null or omitted if no explicit argument proceeds
function deleteCookie(name, path, domain) {
	var cookie_path = (path) ? path : bitCookiePath;
	var cookie_domain = escape((domain) ? domain : bitCookieDomain);
	if (getCookie(name)) {
		document.cookie = name + "="
			+ "; path=" +  cookie_path + "; domain=" + cookie_domain + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
}	}

function getRadioValue(elementName) {
	var element = document.getElementsByName(elementName);
	var bt_count = element.length; // can't use element.length in the loop, as it would decrement

	for( var i = 0; i < bt_count; i++ ) {
		if (element[i].checked == true) {
			return element[i].value;
		}
	}
}


// function:	getElementValue
// desc:		get the value of form elements: <input type=...>, <textarea ...> ... </textarea> and <select ...> ... </select>. 
// date:		2008-01-06
// params:		formElementId
/*
Script by RoBorg
RoBorg@geniusbug.com
http://javascript.geniusbug.com | http://www.roborg.co.uk
Please do not remove or edit this message
Please link to this website if you use this script!
*/
function getElementValue(formElementId)
{
	if(formElement = document.getElementById(formElementId)) {
		if(formElement.length != null) {
			var type = formElement[0].type;
		}
		if((typeof(type) == 'undefined') || (type == 0)) {
			var type = formElement.type;
		}

		switch(type)
		{
			case 'undefined': return;

			case 'radio':
				for(var x=0; x < formElement.length; x++) {
					if(formElement[x].checked == true) {
						return formElement[x].value;
					}
				}
				break;

			case 'select-multiple':
				var myArray = new Array();
				for(var x=0; x < formElement.length; x++) 
					if(formElement[x].selected == true)
						myArray[myArray.length] = formElement[x].value;
				return myArray;

			case 'checkbox': return formElement.checked;
		
			default: return formElement.value;
		}
	}
}

// function:	setElementValue
// desc:		set the value of form elements: <input type=...>, <textarea ...> ... </textarea> and <select ...> ... </select>. 
// date:		2008-01-06
// params:		formElementId, value to set form to
/*
Script by RoBorg
RoBorg@geniusbug.com
http://javascript.geniusbug.com | http://www.roborg.co.uk
Please do not remove or edit this message
Please link to this website if you use this script!
*/
function setElementValue(formElementId, value)
{
	if(formElement = document.getElementById(formElementId)) {
		switch(formElement.type)
		{
			case 'undefined': return;
			case 'radio': formElement.checked = value; break;
			case 'checkbox': formElement.checked = value; break;
			case 'select-one': formElement.selectedIndex = value; break;

			case 'select-multiple':
				for(var x=0; x < formElement.length; x++) 
					formElement[x].selected = value[x];
				break;

			default: formElement.value = value; break;
		}
	}
}
// function:	switchCheckboxes
// desc:		Will Check / Uncheck all Checkboxes
// date:		Pre-bitweaver
// params:		the_form = a HTML Id of a form
//				elements_name = the name of the checkbox / see note
//				switcher_name = ??????????????
// NOTE:		checkboxes need to have the same name as elements_name
// Example:	<input type="checkbox" name="my_ename[]">, will arrive as Array in php.
function switchCheckboxes(the_form, elements_name, switcher_name) {
	var elements = $(the_form).elements[elements_name];
	var elements_cnt = ( typeof (elements.length) != 'undefined') ? elements.length : 0;

	if (elements_cnt) {
		for (var i = 0; i < elements_cnt; i++) {
			elements[i].checked = document.forms[the_form].elements[switcher_name].checked;
		}
	} else {
		elements.checked = document.forms[the_form].elements[switcher_name].checked;
	}
	return true;
}

// function:	disableSubmit
// desc:		disable form stuff after submission
// params:		id = a HTML Id
// note:		a button you disable with this function will not appear in $_REQUEST
function disableSubmit(id) {
	if(document.getElementById) {
		// this is the way the standards work
		$(id).disabled = true;
		$(id).value = "Please Wait...";
	} else if(document.all) {
		// this is the way old msie versions work
		document.all[id].disabled = true;
	} else if(document.layers) {
		// this is the way nn4 works
		document.layers[id].disabled = true;
}	}

// function:	go
// desc:		added for use in navigation dropdown
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
// Example:	<select name="anything" onchange="go(this);">
//			<option value="http://bitweaver.org">bitweaver.org</option>
// 			</select>
function go(o) {
	if (o.options[o.selectedIndex].value != "") {
		location = o.options[o.selectedIndex].value;
	}
	return false;
}

// function:	textareasize
// desc:		Modifies the dimensions of a textarea
// date:		Pre-bitweaver
// params:		elementId = a HTML Id to a textarea
//				height = nb pixels to add to the height (the number can be negative)
//				width = nb pixels to add to the width
//				formid = a HTML Id to form - see Note:
// Note:		* The form must have 2 input rows and cols
function textareasize(elementId, height) {
	textarea = $(elementId);
	if (textarea && height != 0 && textarea.rows + height > 5) {
		textarea.rows += height;
		setCookie('rows', textarea.rows);
}	}

// function:	closeWin - used by popUpWin
// desc:		Closes the window stored in newWindow
// params:		None
var newWindow = null;
function closeWin(){
	if (newWindow != null)
		if(!newWindow.closed) newWindow.close();
}

// function:	popUpWin
// desc:		span a new window which is XHTML 1.0 Strict compliant and in accordance with WCAG
// params:		url:		the url for the new window
//				type:		standard or fullscreen
//				strWidth:	width of the window
//				strHeight:	height of the spawned window
// usage:		<a href="<URL>" title="{tr}Opens link in new window{/tr}" onkeypress="popUpWin(this.href,'standard',600,400);" onclick="popUpWin(this.href,'standard',600,400);return false;">{tr}FooBar{/tr}</a>
function popUpWin(url, type, strWidth, strHeight) {
	closeWin();
	if (type == "fullScreen") {
		strWidth = screen.availWidth - 10;
		strHeight = screen.availHeight - 160;
	}
	var tools="";
	if (type == "standard" || type == "fullScreen") tools = "resizable,toolbar=no,location=no,scrollbars=yes,menubar=no,width="+strWidth+",height="+strHeight+",top=0,left=0";
	if (type == "console") tools = "resizable,toolbar=no,location=no,scrollbars=yes,width="+strWidth+",height="+strHeight+",left=0,top=0";
	newWindow = window.open(url, 'newWin', tools);
	newWindow.focus();
}

// function:	setUserModuleFromCombo
// desc:		No Idea
// date:		Pre-bitweaver
// params:		id = a HTML Id
function setUserModuleFromCombo(id) {
	$('usermoduledata').value = $('usermoduledata').value
		+ $(id).options[$(id).selectedIndex].value;
}
