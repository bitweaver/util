// $Header: /cvsroot/bitweaver/_bit_util/javascript/Attic/bitweaver_original.js,v 1.9 2006/09/01 14:34:10 wolff_borg Exp $

/***************************************************************************\
*                                                                           *
*  please modify this file and leave plenty of comments. when done, please  *
*  visit http://dean.edwards.name/packer/ to compress this and place the    *
*  compressed output in the loaded version of this file                     *
*                                                                           *
\***************************************************************************/

var expires = new Date();
var offset = -(expires.getTimezoneOffset() * 60);
expires.setFullYear(expires.getFullYear() + 1);
setCookie("tz_offset", offset);

/*--- moved here from prototype - start ---*/
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
/*----------- prototype - end -------------*/

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
	textarea = $(elementId);
	var toBeReplaced = /text|page|textarea_id/;//substrings in replaceString to be replaced by the selection if a selection was done
	if (textarea.setSelectionRange) {
		//Mozilla UserAgent Gecko-1.4
		var selectionStart = textarea.selectionStart;
		var selectionEnd = textarea.selectionEnd;
		if (selectionStart != selectionEnd) { // has there been a selection
			var newString = replaceString.replace(toBeReplaced, textarea.value.substring(selectionStart, selectionEnd));
			textarea.value = textarea.value.substring(0, selectionStart)
				+ newString
				+ textarea.value.substring(selectionEnd);
			setSelectionRange(textarea, selectionStart, selectionStart + newString.length);
		} else {// set caret
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
	} else { //UserAgent Gecko-1.0.1 (NN7.0)
		setSomeElement(elementId, replaceString)
		//alert("don't know yet how to handle insert" + document);
}	}

// function:	showById
// desc:		Displays a hidden HTML element. Can also set a cookie to make it stay that way.
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
//				setCookie = any value (not 0) to turn cookies on
function showById(elementId,useCookie) {
	if (document.layers) document.layers[elementId].display = "block";
	else if (document.all) document.all[elementId].style.display = "block";
	else if (document.getElementById) document.getElementById(elementId).style.display = "block";
	if (useCookie) { setCookie(elementId, "o"); }
}

// function:	hideById
// desc:		Hides an HTML element. Can also set a cookie to make it stay that way.
// date:		Pre-bitweaver
// params:		elementId = a HTML Id /
//				setCookie = any value (not 0) to turn cookies on
function hideById(elementId,useCookie) {
	if (document.layers) document.layers[elementId].display = "none";
	else if (document.all) document.all[elementId].style.display = "none";
	else if (document.getElementById) document.getElementById(elementId).style.display = "none";
	if (useCookie) { setCookie(elementId, "c"); }
}

// function:	flip
// desc:		Flips the visibility of a HTML element. Cookies are not used.
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
function flip(elementId) {
	if ($(elementId).style.display == "none") { showById(elementId);
	} else { hideById(elementId);
}	}

// function:	toggle
// desc:		Toggles a HTML elements visibility. Cookies are used to make it stay that way.
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
function toggle(elementId) {
	if ($(elementId).style.display == "none") { showById(elementId,1);
	} else { hideById(elementId,1);
}	}

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
var flipArr=[0,0,0]; // Only the header portion of the id is saved
function flipMulti(elementIdStart,elementIdNum,elements,zen){
	if(elementIdStart && elementIdNum) {
		if(arguments.length<1) elementIdNum=1;
		elementIdNum=(elementIdNum*10)/10; // elementIdNum has to be a number
		if(arguments.length<2) elements=1;
		elements=(elements*10)/10; // elements has to be a number
		if(elements<1 || elements>9) elements=1;
		if(arguments.length<3) zen=1;
		zen=(zen*10)/10; // zen has to be a number
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

// function:	flipWithSign
// desc:		Used to Expand/Collapse Lists
// Note:		Reworked to eliminate collapseSign / expandSign
// date:		Pre-bitweaver
// params:		elementId = a HTML Id
function flipWithSign(elementId) {
	var flipperName = "flipper" + elementId;
	if ($(elementId).style.display == "none") {
		showById(elementId,1);
		$(flipperName).firstChild.nodeValue = "[-]";
	} else {
		hideById(elementId,1);
		$(flipperName).firstChild.nodeValue = "[+]";
}	}

// function:	setFlipWithSign
// desc:		Toggles the state of a flipped List after page reload
// Note:		Reworked to eliminate collapseSign / expandSign
// date:		Pre-bitweaver
// params:		elementId = a HTML Id of a List
function setFlipWithSign(elementId) {
	var flipperName = "flipper" + elementId;
	if (getCookie(elementId) == "o") {
		showById(elementId);
		$(flipperName).firstChild.nodeValue = "[-]";
	} else {
		hideById(elementId);
		$(flipperName).firstChild.nodeValue = "[+]";
}	}

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
	var cookie_path = (path) ? path : bitCookiePath;
	var cookie_domain = escape((domain) ? domain : bitCookieDomain);
	var cookie_expire = (expire) ? expire.toGMTString() : expires.toGMTString();
	var curCookie = name + "=" + escape(value)
			+ "; path=" +  cookie_path
			+ "; domain=" + cookie_domain
			+ "; expires=" + cookie_expire
			+ ((secure) ? "; secure" : "");
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
	if(document.getElementById) { // this is the way the standards work
		$(id).disabled = true;
		$(id).value = "Please Wait...";
	} else if(document.all) {// this is the way old msie versions work
		document.all[id].disabled = true;
	} else if(document.layers) { // this is the way nn4 works
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
		o.options[o.selectedIndex] = 1;
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
