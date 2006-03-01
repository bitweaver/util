// $Header: /cvsroot/bitweaver/_bit_util/javascript/bitweaver.js,v 1.1.2.3 2006/03/01 16:23:48 starrrider Exp $
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
} /*----------- prototype - end -------------*/

// function:	toggle_dynamic_var
// desc:		Toggles the visibility of dynamic variable passed to it
// added by:
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
// desc:
// added by:
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
// desc:		Adds a String to the value of fooel
// added by:
// date:		Pre-bitweaver
// params:		fooel = a HTML Id / foo1 = the string to be added
function setSomeElement(fooel, foo1) {
	$(fooel).value = $(fooel).value + foo1;
}

// function:	setSelectionRange - used by insertAt
// desc:		No Idea
// added by:
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
// added by:
// date:		Pre-bitweaver
// params:		textarea = / pos =
function setCaretToPos (textarea, pos) {
	setSelectionRange(textarea, pos, pos);
}

// function:	insertAt - used by QuickTags & Plugin Help
// desc:		inserts replaceString in elementId
// added by:
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

// function:	show
// desc:		Displays a hidden HTML element. Can also set a cookie to make it stay that way.
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id / f = any value (not 0) to turn cookies on
// Note:		Modified to work with most Browser
function show(foo,f) {
	if (document.layers) document.layers[foo].display = "block";
	else if (document.all) document.all[foo].style.display = "block";
	else if (document.getElementById) document.getElementById(foo).style.display = "block";
	if (f) { setCookie(foo, "o"); }
}

// function:	hide
// desc:		Hides an HTML element. Can also set a cookie to make it stay that way.
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id /
//				f = any value (not 0) to turn cookies on
// Note:		Modified to work with most Browser
function hide(foo,f) {
	if (document.layers) document.layers[foo].display = "none";
	else if (document.all) document.all[foo].style.display = "none";
	else if (document.getElementById) document.getElementById(foo).style.display = "none";
	if (f) { setCookie(foo, "c"); }
}

// function:	flip
// desc:		Toggles a HTML elements visibility. Does not use Cookies so a refresh will restore to original state.
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id
//				bar - a boolean used to set starting visibility - if True foo is displayed
// Note:		Modified to work with most Browser
function flip(foo,bar) {
	if (	(bar) ||
			((document.layers) && (document.layers[foo].display == "none")) ||
			((document.all) && (document.all[foo].style.display == "none")) ||
			((document.getElementById) && (document.getElementById(foo).style.display == "none")) ) show(foo);
	else if	(	((document.layers) && (document.layers[foo].display == "block")) ||
				((document.all) && (document.all[foo].style.display == "block")) ||
				((document.getElementById) && (document.getElementById(foo).style.display == "block")) ) hide(foo);
		else show(foo);
}

// function:	toggle
// desc:		Toggles a HTML elements visibility. Use Cookies to make it stay that way.
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id
//				bar - a boolean used to set starting visibility - if True foo is displayed
// Note:		Modified to work with most Browser
function toggle(foo,bar) {
	if (	(bar) ||
			((document.layers) && (document.layers[foo].display == "none")) ||
			((document.all) && (document.all[foo].style.display == "none")) ||
			((document.getElementById) && (document.getElementById(foo).style.display == "none")) ) show(foo,1);
	else if	(	((document.layers) && (document.layers[foo].display == "block")) ||
				((document.all) && (document.all[foo].style.display == "block")) ||
				((document.getElementById) && (document.getElementById(foo).style.display == "block")) ) hide(foo,1);
		else show(foo,1);
}

// function:	flipMulti
// desc:		Toggles multiple HTML elements visibility
//				On the first pass - Shows the window id (foo) & saves it in a global variable
//				Other calls - Hides the saved window id and shows the new window id (foo)
//				If (foo) is zero(0) - Hides the saved window id (zen) and sets the global variable to 0
//				This function is used with a Selector's onChnage event to display only the needed window(s)
//				Multiple windows can be turned on providing the id numbers are sequencial.
//				An array is used for the global variable so that the function will only display the correct window Id's
// added by: 	StarRider
// date:		1/5/06
// params:		foo = the primary window Id - should be a HTML Id with style set to style.display == "none"
//				bar = a number (1-9/def=1) indicates how many windows to hide/display - The window id's must be successive numbers
//					(1 greater than the last with foo as the first) and set like this:
//					$Window_Id1 = (microtime() * 1000000); $Window_Id2 = $Window_Id1+1; $Window_Id3 = $Window_Id2+1;
//					<div id="{$Window_Id1}">Data</div>  <div id="{$Window_Id2}">Data</div>  <div id="{$Window_Id3}">Data</div>
//					and onchange="javascript:flipper($Window_Id1,3)"
//				zen = a number (1-3/def=1) determins where the window id is stored in the array - Allows flipper to be used by
//					multiple routines without interferring with each other
var flipArr=[0,0,0];
function flipMulti(foo,bar,zen){
	if(!zen || zen<1 || zen>3) zen=1;
	if(!bar || bar<1 || bar>9) bar=1;
	if(foo) foo=((foo*10)/10); // foo has to be a number
	var i=0;
	do {
		if(flipArr[zen-1]!=0) hide(flipArr[zen-1]+i);
		if(foo) show(foo+i);
	} while (++i <= bar-1);
	if(foo) flipArr[zen-1]=foo;
	else flipArr[zen-1]=0;
}

// function:	flipIcon
// desc:		Toggles a HTML elements visibility with an Icon. Use Cookies to make it stay that way.
// Note:		This functions replaces icntoggle & setfoldericonstate - No reason to use 2 functions when 1 will do
// added by: 	StarRider
// date:		12/15/05
// params:		foo is an HTML Id for the window to be displayed/hidden
function flipIcon(foo) {
	var pic = new Image();
	if (document.getElementById(foo).style.display == "none") {
		pic.src = bitIconDir + "/expanded.gif";
		show(foo,1);
	} else {
		pic.src = bitIconDir + "/collapsed.gif";
		hide(foo,1);
	}
	document.getElementById(foo+"img").src = pic.src;
}

// function:	flipWithSign
// desc:		Used to Expand/Collapse Lists
// Note:		Reworked to eliminate collapseSign / expandSign
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id
function flipWithSign(foo) {
	var bar = "flipper" + foo;
	if ($(foo).style.display == "none") {
		show(foo,1);
		$(bar).firstChild.nodeValue = "[-]";
	} else {
		hide(foo,1);
		$(bar).firstChild.nodeValue = "[+]";
}	}

// function:	setFlipWithSign
// desc:		Toggles the state of a flipped List after page reload
// Note:		Reworked to eliminate collapseSign / expandSign
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id of a List
function setFlipWithSign(foo) {
	var bar = "flipper" + foo;
	if (getCookie(foo) == "o") {
		show(foo);
		$(bar).firstChild.nodeValue = "[-]";
	} else {
		hide(foo);
		$(bar).firstChild.nodeValue = "[+]";
}	}

// function:	setCookie
// desc:		Creates a Cookie
// added by:
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
// added by:
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
// added by:
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
// added by:
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

// function:	go
// desc:		added for use in navigation dropdown
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id
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
// added by:
// date:		Pre-bitweaver
// params:		elementId = a HTML Id to a textarea
//				height = nb pixels to add to the height (the number can be negative)
//				width = nb pixels to add to the width
//				formid = a HTML Id to form - see Note:
// Note:	* The form must have 2 input rows and cols
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
	if (newWindow != null){
		if(!newWindow.closed) newWindow.close();
}	}

// function:	popUpWin
// desc:		span a new window which is XHTML 1.0 Strict compliant and in accordance with WCAG
// params:		url:		the url for the new window
//				type:		standard or fullscreen
//				strWidth:	width of the window
//				strHeight:	height of the spawned window
// usage:		<a href="<URL>" title="{tr}Opens link in new window{/tr}" onkeypress="popUpWin(this.href,'standard',600,400);" onclick="popUpWin(this.href,'standard',600,400);return false;">{tr}FooBar{/tr}</a>
function popUpWin(url, type, strWidth, strHeight) {
	closeWin();
	if (type == "fullScreen"){
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
// added by:
// date:		Pre-bitweaver
// params:		id = a HTML Id
function setUserModuleFromCombo(id) {
	$('usermoduledata').value = $('usermoduledata').value
		+ $(id).options[$(id).selectedIndex].value;
//$('usermoduledata').value='das';
}

/* ----------- These Functions are no longer in use
// function:	settogglestate
// desc:		Toggles the visibility of foo
// added by:
// date:
// params:		foo = a HTML Id
function settogglestate(foo) {
	if (getCookie(foo) == "o") {
		show(foo);
	} else {
		hide(foo);
}	}

// NOTE:		**********> Replaced by flipIcon
// function:	setfoldericonstate - used by icntoggle
// desc:		Toggles a HTML elements visibility with an Icon. Use Cookies to make it stay that way.
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id
function setfoldericonstate(foo) {
	pic = new Image();
	cookie_value = getCookie(foo);
	if (cookie_value == "o") {
		pic.src = bitIconDir + "expanded.gif";
	} else if (cookie_value == "c") {
		pic.src = bitIconDir + "collapsed.gif";
	} else {
		return;
	}
	$(foo+"img").src = pic.src;
}

// NOTE:		**********> Replaced by flipIcon
// function:	icntoggle - used in conjunction with setfoldericonstate
// desc:		Toggles a HTML elements visibility with an Icon. Uses Cookies to make it stay that way.
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id
function icntoggle(foo) {
	if ($(foo).style.display == "none") {
		show(foo,1);
	} else {
		hide(foo,1);
	}
	setfoldericonstate(foo);
}

// NOTE:		------ Reworked flipWithSign & setFlipWithSign to remove this function
// function:	expandSign - used by flipWithSign & setFlipWithSign
// desc:		Sets the state of a List Node to Expanded and changes it's Child to "[+]"
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id of a List
function expandSign(foo) {
	$(foo).firstChild.nodeValue = "[+]";
}

// NOTE:		------ Reworked flipWithSign & setFlipWithSign to remove this function
// function:	collapseSign - used by flipWithSign & setFlipWithSign
// desc:		Sets the state of a List Node to Collapsed and changes it's Child to "[-]"
// added by:
// date:		Pre-bitweaver
// params:		foo = a HTML Id of a List
function collapseSign(foo) {
	$(foo).firstChild.nodeValue = "[-]";
}

// NOTE:		------ This function does the same thing as Flip
// function:	toggleBlockDisplay
// desc:		Toggles the Display of the Block item
// Note:		This function is Browser Generic - should works with everything
// added by:
// date:
// params:		item = an HTML Id
function toggleBlockDisplay(item) {
	if (document.layers) {
		current = (document.layers[item].display == 'none') ? 'block' : 'none';
		document.layers[item].display = current;
	} else if (document.all) {
		current = (document.all[item].style.display == 'none') ? 'block' : 'none';
		document.all[item].style.display = current;
	} else if (document.getElementById) {
		vista = ($(item).style.display == 'none') ? 'block' : 'none';
		$(item).style.display = vista;
}	}

// NOTE:		------ This function does the same thing as Flip
// function:	setBlockDisplay
// desc:		Controls the Display of the Block item
// Note:		This function is Browser Generic - should works with everything
// added by:
// date:
// params:		item = an HTML Id
//				visFlag - a boolean - if True item is displayed
function setBlockDisplay(item,vizFlag) {
	current = (vizFlag) ? 'block' : 'none';
	if (document.layers) {
		document.layers[item].display = current;
	} else if (document.all) {
		document.all[item].style.display = current;
	} else if (document.getElementById) {
		$(item).style.display = current;
}	}

*/
