/***************************************************************************\
*                                                                           *
*  please modify this file and leave plenty of comments. when done, please  *
*  visit http://dean.edwards.name/packer/ to compress this and place the    *
*  compressed output in the loaded version of this file                     *
*                                                                           *
\***************************************************************************/

/*--------------------------------------------------------------------------\
|							   Tab Pane 1.02								|
|---------------------------------------------------------------------------|
|						 Created by Erik Arvidsson							|
|				  (http://webfx.eae.net/contact.html#erik)					|
|					  For WebFX (http://webfx.eae.net/)						|
|---------------------------------------------------------------------------|
|				  Copyright (c) 1998 - 2003 Erik Arvidsson					|
\--------------------------------------------------------------------------*/

// This function is used to define if the browser supports the needed
// features
function hasSupport() {

	if (typeof hasSupport.support != "undefined") {
		return hasSupport.support;
	}

	var ie55 = /msie 5\.[56789]/i.test( navigator.userAgent );

	hasSupport.support = ( typeof document.implementation != "undefined" && document.implementation.hasFeature( "html", "1.0" ) || ie55 );

	// IE55 has a serious DOM1 bug... Patch it!
	if ( ie55 ) {
		document._getElementsByTagName = document.getElementsByTagName;
		document.getElementsByTagName = function ( sTagName ) {
			if ( sTagName == "*" ) {
				return document.all;
			} else {
				return document._getElementsByTagName( sTagName );
			}
		};
	}

	return hasSupport.support;
}


// The constructor for tab panes
// el : HTMLElement		The html element used to represent the tab pane
// bUseCookie : Boolean	Optional. Default is true. Used to determine whether to us
//						persistance using cookies or not

function WebFXTabPane( el, bUseCookie ) {
	if ( !hasSupport() || el == null ) { return; }

	this.element = el;
	this.element.tabPane = this;
	this.pages = [];
	this.selectedIndex = null;

	// <--- quick hack to set persistence only on pages where referrer == location
	var ref = document.referrer.split( "?" );
	var loc = document.location.href.split( "?" );
	if( loc[0] != ref[0] ) {
		WebFXTabPane.setCookie( "webfxtab_" + this.element.id, 0 );
	}
	// end quick hack - xing --->

	this.useCookie = bUseCookie != null ? bUseCookie : true;

	// add class name tag to class name
	this.element.className = this.classNameTag + " " + this.element.className;

	// add tab row
	this.tabRow = document.createElement( "div" );
	this.tabRow.className = "tabcontainer";
	el.insertBefore( this.tabRow, el.firstChild );

	var tabIndex = 0;
	if ( this.useCookie ) {
		tabIndex = Number( WebFXTabPane.getCookie( "webfxtab_" + this.element.id ) );
		if ( isNaN( tabIndex ) ) {
			tabIndex = 0;
		}
	}
	this.selectedIndex = tabIndex;

	// loop through child nodes and add them
	var cs = el.childNodes;
	var n;
	for (var i = 0; i < cs.length; i++) {
		if (cs[i].nodeType == 1 && cs[i].className == "tabpage") {
			this.addTabPage( cs[i] );
		}
	}
}

WebFXTabPane.prototype.classNameTag = "tabsystem";

WebFXTabPane.prototype.setSelectedIndex = function ( n ) {
	if (this.selectedIndex != n) {
		if (this.selectedIndex != null && this.pages[ this.selectedIndex ] != null ) {
			this.pages[ this.selectedIndex ].hide();
		}
		this.selectedIndex = n;
		this.pages[ this.selectedIndex ].show();

		if ( this.useCookie ) {
			WebFXTabPane.setCookie( "webfxtab_" + this.element.id, n, 1 );
		}
	}
};

WebFXTabPane.prototype.getSelectedIndex = function () {
	return this.selectedIndex;
};

WebFXTabPane.prototype.addTabPage = function ( oElement ) {
	if ( !hasSupport() ) { return; }

	if ( oElement.tabPage == this )	{
		return oElement.tabPage;
	}

	var n = this.pages.length;
	var tp = this.pages[n] = new WebFXTabPage( oElement, this, n );
	tp.tabPane = this;

	// move the tab out of the box
	this.tabRow.appendChild( tp.tab );

	if ( n == this.selectedIndex ) {
		tp.show();
	} else {
		tp.hide();
	}

	return tp;
};

WebFXTabPane.prototype.dispose = function () {
	this.element.tabPane = null;
	this.element = null;
	this.tabRow = null;

	for (var i = 0; i < this.pages.length; i++) {
		this.pages[i].dispose();
		this.pages[i] = null;
	}
	this.pages = null;
};



// Cookie handling
WebFXTabPane.setCookie = function ( sName, sValue, nDays ) {
	var expires = "";
	if ( nDays ) {
		var d = new Date();
		d.setTime( d.getTime() + nDays * 24 * 60 * 60 * 1000 );
		expires = "; expires=" + d.toGMTString();
	}

	document.cookie = sName + "=" + sValue + expires + "; path="+bitCookiePath;
};

WebFXTabPane.getCookie = function (sName) {
	var re = new RegExp( "(\;|^)[^;]*(" + sName + ")\=([^;]*)(;|$)" );
	var res = re.exec( document.cookie );
	return res != null ? res[3] : null;
};

WebFXTabPane.removeCookie = function ( name ) {
	setCookie( name, "", -1 );
};


// The constructor for tab pages. This one should not be used.
// Use WebFXTabPage.addTabPage instead
// el : HTMLElement			The html element used to represent the tab pane
// tabPane : WebFXTabPane	The parent tab pane
// nindex :	Number			The index of the page in the parent pane page array

function WebFXTabPage( el, tabPane, nIndex ) {
	if ( !hasSupport() || el == null ) { return; }

	this.element = el;
	this.element.tabPage = this;
	this.index = nIndex;

	var cs = el.childNodes;
	for (var i = 0; i < cs.length; i++) {
		if (cs[i].nodeType == 1 && cs[i].className == "tab") {
			this.tab = cs[i];
			break;
		}
	}

	// insert a tag around content to support keyboard navigation


	var a = document.createElement( "A" );
	this.aElement = a;
	a.href = "#";
	a.onclick = function () { return false; };
	while ( this.tab.hasChildNodes() ) {
		a.appendChild( this.tab.firstChild );
	}
	this.tab.appendChild( a );


	// hook up events, using DOM0
	var oThis = this;
	this.tab.onclick = function () { oThis.select(); };
	this.tab.onmouseover = function () { WebFXTabPage.tabOver( oThis ); };
	this.tab.onmouseout = function () { WebFXTabPage.tabOut( oThis ); };
}

WebFXTabPage.prototype.show = function () {
	var el = this.tab;
	var s = el.className + " tab-active";
	s = s.replace(/ +/g, " ");
	el.className = s;

	this.element.style.display = "block";
};

WebFXTabPage.prototype.hide = function () {
	var el = this.tab;
	var s = el.className;
	s = s.replace(/ tab\-active/g, "");
	el.className = s;

	this.element.style.display = "none";
};

WebFXTabPage.prototype.select = function () {
	this.tabPane.setSelectedIndex( this.index );
};

WebFXTabPage.prototype.dispose = function () {
	this.aElement.onclick = null;
	this.aElement = null;
	this.element.tabPage = null;
	this.tab.onclick = null;
	this.tab.onmouseover = null;
	this.tab.onmouseout = null;
	this.tab = null;
	this.tabPane = null;
	this.element = null;
};

WebFXTabPage.tabOver = function ( tabpage ) {
	var el = tabpage.tab;
	var s = el.className + " tab-hover";
	s = s.replace(/ +/g, " ");
	el.className = s;
};

WebFXTabPage.tabOut = function ( tabpage ) {
	var el = tabpage.tab;
	var s = el.className;
	s = s.replace(/ tab\-hover/g, "");
	el.className = s;
};


// This function initializes all uninitialized tab panes and tab pages
function setupAllTabs() {
	if ( !hasSupport() ) { return; }

	var all = document.getElementsByTagName( "*" );
	var l = all.length;
	var tabPaneRe = /tabpane/;
	var tabPageRe = /tabpage/;
	var cn, el;
	var parentTabPane;

	for ( var i = 0; i < l; i++ ) {
		el = all[i];
		cn = el.className;

		// no className
		if ( cn == "" ) { continue; }

		// uninitiated tab pane
		if ( tabPaneRe.test( cn ) && !el.tabPane ) {
			new WebFXTabPane( el );
		}

		// unitiated tab page wit a valid tab pane parent
		else if ( tabPageRe.test( cn ) && !el.tabPage && tabPaneRe.test( el.parentNode.className ) ) {
			el.parentNode.tabPane.addTabPage( el );
		}
	}
}

function disposeAllTabs() {
	if ( !hasSupport() ) { return; }

	var all = document.getElementsByTagName( "*" );
	var l = all.length;
	var tabPaneRe = /tabpane/;
	var cn, el;
	var tabPanes = [];

	for ( var i = 0; i < l; i++ ) {
		el = all[i];
		cn = el.className;

		// no className
		if ( cn == "" ) { continue; }

		// tab pane
		if ( tabPaneRe.test( cn ) && el.tabPane ) {
			tabPanes[tabPanes.length] = el.tabPane;
		}
	}

	for (var i = tabPanes.length - 1; i >= 0; i--) {
		tabPanes[i].dispose();
		tabPanes[i] = null;
	}
}


// initialization hook up

// DOM2
if ( typeof window.addEventListener != "undefined" ) {
	window.addEventListener( "load", setupAllTabs, false );
} else if ( typeof window.attachEvent != "undefined" ) {
	window.attachEvent( "onload", setupAllTabs );
	window.attachEvent( "onunload", disposeAllTabs );
} else {
	if ( window.onload != null ) {
		var oldOnload = window.onload;
		window.onload = function ( e ) {
			oldOnload( e );
			setupAllTabs();
		};
	} else {
		window.onload = setupAllTabs;
	}
}