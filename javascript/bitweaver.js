// $Header: /cvsroot/bitweaver/_bit_util/javascript/bitweaver.js,v 1.56 2010/02/24 18:40:19 spiderr Exp $

// please modify this file and leave plenty of comments. This file will be
// compressed automatically. Please make sure you only use comments beginning
// with '//' and put comments on separate lines otherwise the packer will choke

// the beginning of the clean up of bitweaver core js - use name spaces
// if you are adding new features to this file add them to the BitBase object.
BitBase = {
	// constants
	// DATE - set in init()
	// newWindow used in closeWin()
	"newWindow":null,

	//-- initialization --//
	// desc:		setup called at the end of this file
	"init": function(){
		var self = BitBase;
		self.DATE = new Date();
		var tz_offset = -(self.DATE.getTimezoneOffset() * 60);
		self.DATE.setFullYear(self.DATE.getFullYear() + 1);
		self.setCookie("tz_offset", tz_offset);
		self.setCookie("javascript_enabled", "y");
	},

	"deprecatedFunc": function ( funcName ){
		alert( 'Warning: Use of deprecated global function ' + funcName + ' use name space BitBase: BitBase.' + funcName )
	},

	// Adds a function to be called at page load time
	"addLoadHook": function(func) {
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
	},

	//-- cookie coercion --//
	// desc:		Creates a Cookie
	// params:		name = the name of the cookie
	//				value = the value placed in the cookie
	//				[expires] (optional) = the expiration date of the cookie (defaults to end of current session)
	//				[path] (optional) = the path for which the cookie is valid (defaults to path of calling document)
	//				[domain] (optional) = the domain for which the cookie is valid (defaults to domain of calling document)
	//				[secure] (optional) = Boolean value indicating if the cookie transmission requires a secure transmission
	// NOTE:	* an argument defaults when it is assigned null as a placeholder
	// 			* a null placeholder is not required for trailing omitted arguments
	"setCookie": function(name, value, expire, path, domain, secure) {
		var self = BitBase;
		var path = (path) ? path : bitCookiePath;
		var domain = escape((domain) ? domain : bitCookieDomain);
		var cookie_path = ((path) ? "; path=" + path : "");
		var cookie_domain = ((domain) ? "; domain=" + domain : "");
		var cookie_expire = ((expire)?expire:((self.DATE) ? "; expires=" + self.DATE.toGMTString() : ""));
		var cookie_secure =	((secure) ? "; secure" : "");
		var curCookie = name + "=" + escape(value)
				+ cookie_path
				+ cookie_domain
				+ cookie_expire
				+ cookie_secure;
		document.cookie = curCookie;
	},

	// desc:		creates a cookie if required and sets the element in the array
	// params: 		name - cookie name / key - in the cookie array / val - value to store
	"setCookieArray": function(name, key, val){
		var self = BitBase;
		var curval = self.getCookie(name);
		var newval;
		if (curval != null) {
			newval = self.unserialize(curval);
			newval[key] = val;
		}
		else {
			newval = new Array();
			newval[key] = val;
		}
		self.setCookie(name, BitBase.serialize(newval));
	},

	// desc:		Gets a Cookie and returns it's value
	// params:		name = the name of the desired cookie
	"getCookie": function(name) {
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
	},

	// desc:		Returns a value from a key stored in an array in a cookie.
	// params: 		name - cookie name / key - in the cookie array
	"getCookieArray": function(name, key) {
		var self = BitBase;
		var curval = self.getCookie(name);
		var val;
		if (curval != null) {
			var arr = self.unserialize(curval);
			val = arr[key];
		}
		return val;
	},

	// desc:		Deletes a Cookie
	// params:		name = the name of the cookie
	//				[path] (optional) = the path of the cookie (must be same path used when created)
	//				[domain] (optional) = the domain of the cookie (must be same domain used when created)
	// NOTE:		path and domain default if assigned null or omitted if no explicit argument proceeds
	"deleteCookie": function(name, path, domain) {
		var cookie_path = (path) ? path : bitCookiePath;
		var cookie_domain = escape((domain) ? domain : bitCookieDomain);
		if (getCookie(name)) {
			document.cookie = name + "="
				+ "; path=" +  cookie_path + "; domain=" + cookie_domain + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	},

	//-- DOM coercion --//
	// desc:		returns a dom element
	// parms:		id - element id to look up or if id is an element it will be returned
	"getElement": function(id){
		if(typeof(id) == "string"){
			if(document.layers){
				return document.layers[id];
			}else if(document.all){
				return document.all[id];
			}else if(document.getElementById){
				return document.getElementById(id);
			}
		}
		return id;
	},

	// desc:		sets display style
	// params:		elm a DOM element or id / val the style value to toggle / useCookie to persist the setting
	"setElementDisplay": function( elm, val, useCookie ){
		var self = BitBase;
		var obj = self.getElement( elm );
		if( obj != null ){ obj.style.display=val; }
		if (useCookie && obj.id) { self.setCookieArray('showhide', obj.id, (val=='none'?"c":"o")); }
	},

	// desc:		toggles an element's style between the value and none
	// params:		elm a DOM element or id / val the style value to toggle / useCookie to persist the setting
	"toggleElementDisplay": function( elm, val, useCookie ){
		var self = BitBase;
		var obj = self.getElement( elm );
		if( typeof(val) == 'undefined' ) {
			val = 'block';
		}
		var value = obj.style.display == 'none'?val:'none';
		self.setElementDisplay( obj, value, useCookie );
	},

	// desc:		convenience
	// params:		elm - ad DOM element or id / useCookie = any value (not 0 or null) to turn cookies on
	"showById": function( elm, useCookie ) {
		BitBase.setElementDisplay( elm, 'block', useCookie );
	},

	// desc:		convenience
	// params:		elm - ad DOM element or id / useCookie = any value (not 0 or null) to turn cookies on
	"hideById": function( elm, useCookie) {
		BitBase.setElementDisplay( elm, 'none', useCookie );
	},

	// shows or hides based on the showhide cookie
	"setupShowHide": function() {
		var self = BitBase;
		var curval = self.getCookie('showhide');
		if (curval != null) {
			var ids = self.unserialize(curval);
			for (id in ids) {
				if (ids[id] == "o") {
					self.showById(id);
				}
				else {
					self.hideById(id);
				}
			}
		}
	},

	// desc:		Toggles the visibility of dynamic variable passed to it
	// params:		name
	"toggleDynamicVar": function(name) {
		var self = BitBase;
		var elm1 = self.getElement('dyn_'+name+'_display');
		var elm2 = self.getElement('dyn_'+name+'_edit');
		if(elm1.style.display == "none") {
			elm2.style.display = "none";
			elm1.style.display = "inline";
		} else {
			elm1.style.display = "none";
			elm2.style.display = "inline";
		}
	},

	// desc:		convenience
	"showSpinner": function() {
		BitBase.setElementDisplay( 'spinner','block' );
	},

	// desc:		convenience
	"hideSpinner": function() {
		BitBase.setElementDisplay( 'spinner','none' );
	},

	// desc:		No Idea - used by insertAt
	"setSelectionRange": function(textarea, selectionStart, selectionEnd) {
		if (textarea.setSelectionRange) {
			textarea.focus();
			textarea.setSelectionRange(selectionStart, selectionEnd);
		} else if (textarea.createTextRange) {
			var range = textarea.createTextRange();
			textarea.collapse(true);
			textarea.moveEnd('character', selectionEnd);
			textarea.moveStart('character', selectionStart);
			textarea.select();
		}
	},

	// desc:		No Idea - used by insertAt
	"setCaretToPos": function(textarea, pos) {
		BitBase.setSelectionRange(textarea, pos, pos);
	},

	// desc:		inserts replaceString in elementId - used by QuickTags & Plugin Help
	// params:		elementId = a HTML Id / replaceString = string
	"insertAt": function(elementId, replaceString) {
		var self = BitBase;
		//inserts given text at selection or cursor position
		//substrings in replaceString to be replaced by the selection if a selection was done
		var toBeReplaced = /text|page|textarea_id/;

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

		var textarea = document.getElementById(elementId);

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
				self.setSelectionRange(textarea, selectionStart, selectionStart + newString.length);
			// set caret
			} else {
				textarea.value = textarea.value.substring(0, selectionStart)
					+ replaceString
					+ textarea.value.substring(selectionEnd);
				self.setCaretToPos(textarea, selectionStart + replaceString.length);
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
			var obj = self.getElement(elementId);
			obj.getElement(elementId).value = obj.value + replaceString;
			//alert("don't know yet how to handle insert" + document);
		}
	},

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
	"flipArr":[0,0,0],
	"flipMulti": function(elementIdStart,elementIdNum,elements,zen){
		var self = BitBase;
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
				if(self.flipArr[zen-1]!=0) self.hideById(self.flipArr[zen-1]+(elementIdNum+i));
				self.showById(elementIdStart+(elementIdNum+i));
			} while (++i <= elements-1);
			self.flipArr[zen-1]=elementIdStart;
		}
	},

	// desc:		Toggles a HTML elements visibility with an Icon. Use Cookies to make it stay that way.
	// params:		elementId is an HTML Id for the window to be displayed/hidden
	"flipIcon": function(elementId) {
		var self = BitBase;
		var pic = new Image();
		if (elementId && document.getElementById(elementId).style && document.getElementById(elementId).style.display && document.getElementById(elementId).style.display == "none") {
			pic.src = bitIconDir + "/expanded.gif";
			self.showById(elementId,1);
		} else {
			pic.src = bitIconDir + "/collapsed.gif";
			self.hideById(elementId,1);
		}
		document.getElementById(elementId+"img").src = pic.src;
	},

	// desc:		Toggles the state of a flipped List after page reload
	// params:		foo = a HTML Id of a List
	"setFlipIcon": function(elementId) {
		var self = BitBase;
		var pic = new Image();
		if (self.getCookie(elementId) == "o") {
			pic.src = bitIconDir + "/expanded.gif";
			self.showById(elementId);
		} else {
			pic.src = bitIconDir + "/collapsed.gif";
			self.hideById(elementId);
		}
		document.getElementById(elementId+"img").src = pic.src;
	},

	// desc:		Used to Expand/Collapse Lists
	// params:		elementId = a HTML Id
	"flipWithSign": function(elementId,cookie) {
		var self = BitBase;
		if( flipperEle = document.getElementById( "flipper"+elementId ) ) {
			if (document.getElementById(elementId).style.display == "none") {
				self.showById(elementId,cookie);
				flipperEle.firstChild.nodeValue = "[-]";
			} else {
				self.hideById(elementId,cookie);
				flipperEle.firstChild.nodeValue = "[+]";
			}
		}
	},

	// desc:		Toggles the state of a flipped List after page reload
	// params:		elementId = a HTML Id of a List
	"setFlipWithSign": function(elementId) {
		var self = BitBase;
		if( flipperEle = document.getElementById( "flipper"+elementId ) ) {
			if (self.getCookie(elementId) == "o") {
				self.showById(elementId);
				flipperEle.firstChild.nodeValue = "[-]";
			} else {
				self.hideById(elementId);
				flipperEle.firstChild.nodeValue = "[+]";
			}
		}
	},

	// desc:		Simple fade in/out of element based on http://www.switchonthecode.com/tutorials/javascript-tutorial-simple-fade-animation
	// params:		elementId = a HTML Id, fadeTime = millisecond to fade out
	"fade": function(elementId,fadeTime,direction) {
		var element = document.getElementById(elementId);
		if(element) {
			if( fadeTime==null ) {
				fadeTime = 500.0;
			}
			if(element.FadeState == null) {
				if(element.style.opacity == null || element.style.opacity == '' || element.style.opacity == '1') {
					element.FadeState = 2;
				} else {
					element.FadeState = -2;
				}
			}

			if(element.FadeState == 1 || element.FadeState == -1) {
				element.FadeState = element.FadeState == 1 ? -1 : 1;
				element.FadeTimeLeft = fadeTime - element.FadeTimeLeft;
			} else {
				element.FadeState = element.FadeState == 2 ? -1 : 1;
				element.FadeTimeLeft = fadeTime;
				setTimeout("BitBase.animateFade(" + new Date().getTime() + ",'" + elementId + "',"+fadeTime+")", 33);
			}  
		}
	},

	"animateFade": function(lastTick, elementId,fadeTime) {  
		var curTick = new Date().getTime();
		var elapsedTicks = curTick - lastTick;
		var element = document.getElementById(elementId);

		if(element) {
			if(element.FadeTimeLeft <= elapsedTicks) {
				if( element.FadeState == 1 ) {
					element.style.opacity = '1';
					element.style.filter = 'alpha(opacity = 100)';
					element.FadeState = 2;
				} else {
					element.style.opacity = '0';
					element.style.filter = 'alpha(opacity = 0)';
					element.FadeState = -2;
					element.style.display = 'none';
				}
				return;
			}

			element.FadeTimeLeft -= elapsedTicks;
			var newOpVal = element.FadeTimeLeft/fadeTime;
			if(element.FadeState == 1) {
				element.style.display = ''; // revert to default display
				newOpVal = 1 - newOpVal;
			}

			element.height = Math.round(newOpVal*element.offsetHeight)+"px";
			element.style.opacity = newOpVal;
			element.style.filter = 'alpha(opacity = ' + (newOpVal*100) + ')';

			setTimeout("BitBase.animateFade(" + curTick + ",'" + elementId + "',"+fadeTime+")", 33);
		}
	},

	// desc:		get the value of form elements: <input type=...>, <textarea ...> ... </textarea> and <select ...> ... </select>.
	// params:		elm - an element or id
	/*
	Script by RoBorg
	RoBorg@geniusbug.com
	http://javascript.geniusbug.com | http://www.roborg.co.uk
	Please do not remove or edit this message
	Please link to this website if you use this script!
	*/
	"getElementValue": function(elm){
		if(formElement = BitBase.getElement(elm)) {
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
	},

	// desc:		set the value of form elements: <input type=...>, <textarea ...> ... </textarea> and <select ...> ... </select>.
	// params:		elm - an element or id, value to set form to
	/*
	Script by RoBorg
	RoBorg@geniusbug.com
	http://javascript.geniusbug.com | http://www.roborg.co.uk
	Please do not remove or edit this message
	Please link to this website if you use this script!
	*/
	"setElementValue": function(elm, value){
		if(formElement = BitBase.getElement(elm)) {
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
	},

	// function:	switchCheckboxes
	// desc:		Will Check / Uncheck all Checkboxes
	// params:		the_form = a HTML Id of a form
	//				elements_name = the name of the checkbox / see note
	//				switcher_name = UNKNOWN
	// NOTE:		checkboxes need to have the same name as elements_name
	// Example:	<input type="checkbox" name="my_ename[]">, will arrive as Array in php.
	"switchCheckboxes": function(the_form, elements_name, switcher_name) {
		var elements = document.getElementById(the_form).elements[elements_name];
		var elements_cnt = ( typeof (elements.length) != 'undefined') ? elements.length : 0;

		if (elements_cnt) {
			for (var i = 0; i < elements_cnt; i++) {
				elements[i].checked = document.forms[the_form].elements[switcher_name].checked;
			}
		} else {
			elements.checked = document.forms[the_form].elements[switcher_name].checked;
		}
		return true;
	},

	// desc:		disable form stuff after submission
	// params:		id = a HTML Id
	// note:		a button you disable with this function will not appear in $_REQUEST
	"disableSubmit": function(id) {
		if(document.getElementById) {
			// this is the way the standards work
			document.getElementById(id).disabled = true;
			document.getElementById(id).value = "Please Wait...";
		} else if(document.all) {
			// this is the way old msie versions work
			document.all[id].disabled = true;
		} else if(document.layers) {
			// this is the way nn4 works
			document.layers[id].disabled = true;
		}
	},

	// desc:		added for use in navigation dropdown
	// params:		elementId = a HTML Id
	// Example:	<select name="anything" onchange="go(this);">
	//			<option value="http://bitweaver.org">bitweaver.org</option>
	// 			</select>
	"go": function(o) {
		if (o.options[o.selectedIndex].value != "") {
			location = o.options[o.selectedIndex].value;
		}
		return false;
	},

	// desc:		Closes the window stored in newWindow - used by popUpWin
	// params:		None
	"closeWin": function(){
		var self = BitBase;
		if (self.newWindow != null)
			if(!self.newWindow.closed) self.newWindow.close();
	},

	// function:	popUpWin
	// desc:		span a new window which is XHTML 1.0 Strict compliant and in accordance with WCAG
	// params:		url:		the url for the new window
	//				type:		standard or fullscreen
	//				strWidth:	width of the window
	//				strHeight:	height of the spawned window
	// usage:		<a href="<URL>" title="{tr}Opens link in new window{/tr}" onkeypress="popUpWin(this.href,'standard',600,400);" onclick="popUpWin(this.href,'standard',600,400);return false;">{tr}FooBar{/tr}</a>
	"popUpWin": function(url, type, strWidth, strHeight) {
		var self = BitBase;
		self.closeWin();
		if (type == "fullScreen") {
			strWidth = screen.availWidth - 10;
			strHeight = screen.availHeight - 160;
		}
		var tools="";
		if (type == "standard" || type == "fullScreen") tools = "resizable,toolbar=no,location=no,scrollbars=yes,menubar=no,width="+strWidth+",height="+strHeight+",top=0,left=0";
		if (type == "console") tools = "resizable,toolbar=no,location=no,scrollbars=yes,width="+strWidth+",height="+strHeight+",left=0,top=0";
		self.newWindow = window.open(url, 'newWin', tools);
		self.newWindow.focus();
	},

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
	"utf16to8": function(str) {
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
	},

	"utf8to16": function(str) {
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
	},

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

	"serialize": function(o) {
		var self = BitBase;
		var p = 0, sb = [], ht = [], hv = 1;
		var classname = function(o) {
			if (typeof(o) == "undefined" || typeof(o.constructor) == "undefined") return '';
			var c = o.constructor.toString();
			c = self.utf16to8(c.substr(0, c.indexOf('(')).replace(/(^\s*function\s*)|(\s*$)/ig, ''));
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
			var utf8 = self.utf16to8(s);
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
	 },

	 "unserialize": function(ss) {
		 var self = BitBase;
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
			 var s = self.utf8to16(ss.substring(p, p += l));
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
			 var cn = self.utf8to16(ss.substring(p, p += l));
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
			 var cn = self.utf8to16(ss.substring(p, p += l));
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
	},
	// end swipe

	// params:		w1 / w2 / w3
	"genPass": function(w1, w2, w3) {
		var vo = "aeiouAEU";
		var co = "bcdfgjklmnprstvwxzBCDFGHJKMNPQRSTVWXYZ0123456789_$%#";
		var s = Math.round(Math.random());
		var l = 8;
		var p = '';
		var has_num = false;
		for (i = 0; i < l; i++) {
			if (s) {
				letter = vo.charAt(Math.round(Math.random() * (vo.length - 1)));
				s = 0;
			} else {
				letter = co.charAt(Math.round(Math.random() * (co.length - 1)));
				s = 1;
			}
			
			if( ! isNaN( letter ) ) // Keep track of weather we put a number in the password
				has_num = true;
			
			p = p + letter;
		}
		
		if( ! has_num ) // If we never put a number in the password we'll put one in a random place now
			p = p.replace( p.charAt( Math.round(Math.random() * p.length - 1 ) ), Math.round(Math.random() * 9 ) );
		
		document.getElementById(w1).value = p;
		document.getElementById(w2).value = p;
		document.getElementById(w3).value = p;
	},

	/**
	 * XHConn - Simple XMLHTTP Interface - bfults@gmail.com - 2005-04-08        **
	 * Code licensed under Creative Commons Attribution-ShareAlike License      **
	 * http://creativecommons.org/licenses/by-sa/2.0/                           **
	 *
	 * var fnWhenDone = function ( pResponse ) {
	 *    	 alert( pResponse.responseText );
	 *     };
	 *     var ajax = new BitBase.SimpleAjax();
	 *     ajax.connect("mypage.php", "POST", "foo=bar&baz=qux", fnWhenDone);
	 * };
	 *
	 **/
	"SimpleAjax": function() {
		var xmlhttp, bComplete = false;
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e) { try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
		catch (e) { try { xmlhttp = new XMLHttpRequest(); }
		catch (e) { xmlhttp = false; }}}
		if (!xmlhttp) return null;
		this.connect = function(sURL, sVars, fnDone, sMethod) {
			if (!xmlhttp) return false;
			bComplete = false;
			sMethod = sMethod || 'POST';
			sMethod = sMethod.toUpperCase();

			try {
				if (sMethod == "GET") {
					xmlhttp.open(sMethod, sURL+"?"+sVars, true);
					sVars = "";
				} else {
					xmlhttp.open(sMethod, sURL, true);
					xmlhttp.setRequestHeader("Method", "POST "+sURL+" HTTP/1.1");
					xmlhttp.setRequestHeader("Content-Type",
					"application/x-www-form-urlencoded");
				}
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && !bComplete) {
						bComplete = true;
						fnDone(xmlhttp);
					}
				};
					xmlhttp.setRequestHeader('X_REQUESTED_WITH', 'XMLHttpRequest');
				xmlhttp.send(sVars);
			}
			catch(z) { return false; }
			return true;
		};
		this.update = function( pUpdateEleId, sURL, sVars, sMethod ) {
			this.connect( sURL, sVars, function( pResponse ) { document.getElementById( pUpdateEleId ).innerHTML = pResponse.responseText; }, sMethod );
		};
		return this;
	},

	/**
	 *     Extremely lightweight fixIEDropMenu function to support css drop menus for all browsers without need for 30K of fixes/ie7.js
	 **/
	"fixIEDropMenu": function( pMenuId ) {
		if(document.getElementById(pMenuId)){
			var menuItems = document.getElementById(pMenuId).getElementsByTagName("LI");
			for( var i=0; i< menuItems.length; i++ ) {
				menuItems[i].onmouseover = function() {
					this.className += " iemenuhover";
				};
				menuItems[i].onmouseout = function() {
					this.className = this.className.replace(new RegExp(" iemenuhover\\b"), "");
				};
				/* In IE6 brute add iframes to anything that might have a z-index - someone else can narrow this better it doesn't need to be on all LIs */
				BitBase.bgIframe( menuItems[i] );
			}
		}
	},

	/**
	 * This mess right here ads an iframe behind any element you need to float over selects in that POS IE6
	 **/
	"bgIframe": function(e, s) {
		/* This is only for IE6 */
		if( document.all && (navigator.userAgent.toLowerCase().indexOf("msie 6.") != -1) ){
			/* @TODO enable override of params */
			s = {
				top : 'auto', /* auto == .currentStyle.borderTopWidth */
				left : 'auto', /* auto == .currentStyle.borderLeftWidth */
				width : 'auto', /* auto == offsetWidth */
				height : 'auto', /* auto == offsetHeight */
				opacity : true,
				src : 'javascript:void(0);'
			};

			var prop = function(n){return n&&n.constructor==Number?n+'px':n;},
			html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
			'style="display:block;position:absolute;z-index:-1;'+
			(s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
			'top:'+(s.top=='auto'?((parseInt(e.parentNode.style.borderTopWidth)||0)*-1)+'px':prop(s.top))+';'+
			'left:'+(s.left=='auto'?((parseInt(e.parentNode.style.borderLeftWidth)||0)*-1)+'px':prop(s.left))+';'+
			'width:'+(s.width=='auto'?e.parentNode.offsetWidth+'px':prop(s.width))+';'+
			'height:'+(s.height=='auto'?e.parentNode.offsetHeight+'px':prop(s.height))+';'+
			'"/></iframe>';
			e.innerHTML = html+e.innerHTML;
		}
	},

	/**
	 * This common short cut can raise all kinds of hell, since it behaves differently for different Ajax libraries
	 * in particularly, jQuery which does things like $('.someclass') to address multiple elements.
	 *
	 * It's use is strongly discouraged, particularly in distro'ed packages
	 **/

	"$": function() {
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


};

// init
BitBase.init();


//-- Slated for removal - as part of the clean up goal everything below is to eventually be removed --//

// NOTICE: this only appears to be used in quicktags - put it there
// function:	textareasize
// desc:		Modifies the dimensions of a textarea
// date:		Pre-bitweaver
// params:		elementId = a HTML Id to a textarea
//				height = nb pixels to add to the height (the number can be negative)
//				width = nb pixels to add to the width
//				formid = a HTML Id to form - see Note:
// Note:		* The form must have 2 input rows and cols
function textareasize(elementId, height) {
	textarea = document.getElementById( elementId );
	if (textarea && height != 0 && textarea.rows + height > 5) {
		textarea.rows += height;
		setCookie('rows', textarea.rows);
	}
}

// NOTICE: Slated for delete - no use in bitweaver known and redundant to getElementValue
function getRadioValue(elementName) {
	var element = document.getElementsByName(elementName);
	var bt_count = element.length; // can't use element.length in the loop, as it would decrement

	for( var i = 0; i < bt_count; i++ ) {
		if (element[i].checked == true) {
			return element[i].value;
		}
	}
}

// NOTICE: Slated for delete - no use in bitweaver known
// function:	setUserModuleFromCombo
// desc:		No Idea
// date:		Pre-bitweaver
// params:		id = a HTML Id
function setUserModuleFromCombo(id) {
	document.getElementById('usermoduledata').value = document.getElementById('usermoduledata').value
		+ document.getElementById(id).options[document.getElementById(id).selectedIndex].value;
}

// NOTICE: Slated for delete - no use in bitweaver known except this file
// function:	setSomeElement
// desc:		Adds a String to the value of elementId
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
//				strng = the string to be added
function setSomeElement(elementId, strng) {
	document.getElementById(elementId).value = document.getElementById(elementId).value + strng;
}

// NOTICE: ALL the following are deprecated. See pass through call for replacement
function addLoadHook(func) {
	BitBase.deprecatedFunc( 'addLoadHook' );
	BitBase.addLoadHook(func);
}
function setCookieArray(cookie, key, value) {
	BitBase.deprecatedFunc( 'setCookieArray' );
	BitBase.setCookieArray(cookie, key, value);
}
function getCookieArray(cookie, key) {
	BitBase.deprecatedFunc( 'getCookieArray' );
	BitBase.getCookieArray(cookie, key);
}
function setCookie(name, value, expire, path, domain, secure) {
	BitBase.deprecatedFunc( 'setCookie' );
	BitBase.setCookie(name, value, expire, path, domain, secure);
}
function getCookie(name) {
	BitBase.deprecatedFunc( 'getCookie' );
	BitBase.getCookie(name);
}
function deleteCookie(name, path, domain) {
	BitBase.deprecatedFunc( 'deleteCookie' );
	BitBase.deleteCookie(name, path, domain);
}
function flip(elementId) {
	BitBase.deprecatedFunc( 'flip' );
	BitBase.toggleElementDisplay( elementId, 'block' );
}
function toggle(elementId) {
	BitBase.deprecatedFunc( 'toggle' );
	BitBase.toggleElementDisplay( elementId, 'block', 1 );
}
function setupShowHide() {
	BitBase.deprecatedFunc( 'setupShowHide' );
	BitBase.setupShowHide();
}
function utf16to8(str) {
	BitBase.deprecatedFunc( 'utf16to8' );
	BitBase.utf16to8(str);
}
function utf8to16(str) {
	BitBase.deprecatedFunc( 'utf8to16' );
	BitBase.utf8to16(str);
}
function serialize(o) {
	BitBase.deprecatedFunc( 'serialize' );
	BitBase.serialize(o);
}
function unserialize(ss) {
	BitBase.deprecatedFunc( 'unserialize' );
	BitBase.unserialize(ss);
}
function genPass(w1, w2, w3) {
	BitBase.deprecatedFunc( 'genPass' );
	BitBase.genPass(w1, w2, w3);
}
function toggle_dynamic_var(name) {
	BitBase.deprecatedFunc( 'toggle_dynamic_var' );
	BitBase.toggleDynamicVar( name );
}
function setSelectionRange(textarea, selectionStart, selectionEnd) {
	BitBase.deprecatedFunc( 'setSelectionRange' );
	BitBase.setSelectionRange(textarea, selectionStart, selectionEnd);
}
function setCaretToPos (textarea, pos) {
	BitBase.deprecatedFunc( 'setCaretToPos' );
	BitBase.setCaretToPos(textarea, pos);
}
function insertAt(elementId, replaceString) {
	BitBase.deprecatedFunc( 'insertAt' );
	BitBase.insertAt(elementId, replaceString);
}
function showById(elementId,useCookie) {
	BitBase.deprecatedFunc( 'showById' );
	BitBase.showById(elementId,useCookie);
}
function hideById(elementId,useCookie) {
	BitBase.deprecatedFunc( 'hideById' );
	BitBase.hideById(elementId,useCookie);
}
function flipMulti(elementIdStart,elementIdNum,elements,zen){
	BitBase.deprecatedFunc( 'flipMulti' );
	BitBase.flipMulti(elementIdStart,elementIdNum,elements,zen);
}
function flipIcon(elementId) {
	BitBase.deprecatedFunc( 'flipIcon' );
	BitBase.flipIcon(elementId);
}
function setFlipIcon(elementId) {
	BitBase.deprecatedFunc( 'setFlipIcon' );
	BitBase.setFlipIcon(elementId);
}
function flipWithSign(elementId,cookie) {
	BitBase.deprecatedFunc( 'flipWithSign' );
	BitBase.flipWithSign(elementId,cookie);
}
function setFlipWithSign(elementId) {
	BitBase.deprecatedFunc( 'setFlipWithSign' );
	BitBase.setFlipWithSign(elementId);
}
function getElementValue(formElementId){
	BitBase.deprecatedFunc( 'getElementValue' );
	BitBase.getElementValue(formElementId);
}
function setElementValue(formElementId, value){
	BitBase.deprecatedFunc( 'setElementValue' );
	BitBase.setElementValue(formElementId, value);
}
function switchCheckboxes(the_form, elements_name, switcher_name) {
	BitBase.deprecatedFunc( 'switchCheckboxes' );
	BitBase.switchCheckboxes(the_form, elements_name, switcher_name);
}
function disableSubmit(id) {
	BitBase.deprecatedFunc( 'disableSubmit' );
	BitBase.disableSubmit(id);
}
function go(o) {
	BitBase.deprecatedFunc( 'go' );
	BitBase.go(o);
}
function popUpWin(url, type, strWidth, strHeight) {
	BitBase.deprecatedFunc( 'popUpWin' );
	BitBase.popUpWin(url, type, strWidth, strHeight);
}
function closeWin(){
	BitBase.deprecatedFunc( 'closeWin' );
	BitBase.closeWin();
}
