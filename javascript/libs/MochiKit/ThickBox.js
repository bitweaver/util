
/*
 * Modified for use with MochiKit 1.4 rather than the originally-used jQuery library
 * Changes to comments also made - removed some, modified others, added some, etc.
 * Changes and additions Copyright (c) 2006 by Jason Bunting (http://www.jasonbunting.com)
 */
 
/*
 * Thickbox 2.1 - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Copyright (c) 2006 cody lindley
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */

/////////////////////////////////////////////////////////////////////
// initialize the page when it is done loading
connect(window, "onload", function() {
   //add thickbox to href elements that have a class of .thickbox
   forEach(list(getElementsByTagAndClassName("a", "thickbox")), function(element) {
      connect(element, "onclick", function(evt) {
         var title = element.title || element.name || null;
         var group = element.rel || false;
         TB_show(title, element.href, group);
         evt.stop();
      });
   });
});
/////////////////////////////////////////////////////////////////////

//function called when the user clicks on a thickbox link
function TB_show(caption, url, imageGroup) {

	try {
	
		if($("TB_HideSelect") == null) {
         appendChildNodes(currentDocument().body, createDOM(evalHTML("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>")));
		   connect("TB_overlay", "onclick", TB_remove);
		}
		caption = (caption || "");
		connect(window, "onscroll", TB_position);
		TB_overlaySize();
		appendChildNodes(currentDocument().body, createDOM(evalHTML("<div id='TB_load'><img src='images/loadingAnimation.gif' /></div>")));
		TB_load_position();
		
      // determine if there is a query string - if so, extract base url
      var baseURL = null;
	   if(url.indexOf("?") !== -1){ 
			baseURL = url.substr(0, url.indexOf("?"));
	   } else { 
	   	baseURL = url;
	   }
	   
	   var urlString = /\.jpg|\.jpeg|\.png|\.gif|\.bmp/g;
	   var urlType = baseURL.toLowerCase().match(urlString);
		
		// code to show images
		if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp') {	
			TB_PrevCaption = "";
			TB_PrevURL = "";
			TB_PrevHTML = "";
			TB_NextCaption = "";
			TB_NextURL = "";
			TB_NextHTML = "";
			TB_imageCount = "";
			TB_FoundURL = false;
			if(imageGroup){
				TB_TempArray = getElementsByTagNameAndAttributeValue("a", "rel", imageGroup);
				for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML == "")); TB_Counter++) {
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
			connect(imgPreloader, "onload", function() {
			   imgPreloader.onload = null;
   				
			   // Resizing large images - orginal by Christian Montoya edited by Cody Lindley.
			   var pageDimensions = getViewportDimensions();
			   var x = pageDimensions.w - 150;
			   var y = pageDimensions.h - 150;
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
			   
			   appendChildNodes("TB_window", createDOM(evalHTML("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/></a>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a></div>")));
            
   			connect("TB_closeWindowButton", "onclick", TB_remove);
   			
			   if (!(TB_PrevHTML == "")) {
				   function goPrev() {
					   removeElement("TB_window");
					   appendChildNodes(currentDocument().body, DIV({"id":"TB_window"}, null));
					   TB_show(TB_PrevCaption, TB_PrevURL, imageGroup);
					   return false;	
				   }
				   connect("TB_prev", "onclick", goPrev);
			   }
   			
			   if (!(TB_NextHTML == "")) {		
				   function goNext(){
					   removeElement("TB_window");
					   appendChildNodes(currentDocument().body, DIV({"id":"TB_window"}, null));
					   TB_show(TB_NextCaption, TB_NextURL, imageGroup);
					   return false;	
				   }
				   connect("TB_next", "onclick", goNext);
			   }
   			
			   document.onkeydown = function(e){ 	
				   if (e == null) { // ie
					   keycode = event.keyCode;
				   } else { // mozilla
					   keycode = e.which;
				   }
				   if(keycode == 27) { // close
					   TB_remove();
				   } else if(keycode == 190) { // display previous image
					   if(!(TB_NextHTML == "")) {
					      document.onkeydown = "";
					      goNext();
					   }
				   } else if(keycode == 188) { // display next image
					   if(!(TB_PrevHTML == "")) {
					      document.onkeydown = "";
					      goPrev();
					   }
				   }	
			   }
   				
			   TB_position();
			   removeElement("TB_load");
			   connect("TB_ImageOff", "onclick", TB_remove);
			   showElement("TB_window");
			   
			});

			imgPreloader.src = url;
			
		} else { //code to show html pages
			
			var queryString = url.replace(/^[^\?]+\??/,'');
			var params = parseQueryString(queryString);
			
			TB_WIDTH = (params["width"]*1) + 30;
			TB_HEIGHT = (params["height"]*1) + 40;
			ajaxContentW = TB_WIDTH - 30;
			ajaxContentH = TB_HEIGHT - 45;
			
         if(url.indexOf("TB_iframe") != -1) {
            urlNoQuery = url.split("TB_");		
            appendChildNodes("TB_window", createDOM(evalHTML("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a></div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' onload='TB_showIframe()'> </iframe>")));
         } else {            
            $("TB_window").innerHTML = $("TB_window").innerHTML + "<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>close</a></div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>";
         }

			connect("TB_closeWindowButton", "onclick", TB_remove);
			
			if(url.indexOf('TB_inline') != -1) {
				$("TB_ajaxContent").innerHTML = ($(params['inlineId']).innerHTML);
				TB_position();
				removeElement("TB_load");
				showElement("TB_window");
			} else if(url.indexOf('TB_iframe') != -1) {
				TB_position();
				if(frames['TB_iframeContent'] == undefined) {//be nice to safari
				   removeElement("TB_load");
				   showElement("TB_window");
					connect(currentDocument(), "onkeyup", function(evt) {
					   if(evt.key().code == 27) {
					      TB_remove();
                  } 
					});
				}
			} else {
			   var deferred = doSimpleXMLHttpRequest(url);
			   deferred.addCallback(function(xhr) {
			      var responseText = xhr.responseText;
			      $("TB_ajaxContent").innerHTML = responseText;
					TB_position();
					removeElement("TB_load");
					showElement("TB_window");			   
			   });
			}
			executeJavascript("TB_window");
		}
		connect(window, "onresize", TB_position);
		connect(currentDocument(), "onkeyup", function(evt) {
		   if(evt.key().code == 27) {
		      TB_remove();
         } 
		});		
	} catch(e) {
		logError(e);
	}
}

//helper functions below

function TB_showIframe() {
   removeElement("TB_load");
   showElement("TB_window");
}

function TB_remove() {
	forEach(["TB_window","TB_overlay","TB_HideSelect"], function(elem) {
	   removeElement(elem);
	});
}

function TB_position() {
	var pageDimensions = getViewportDimensions();
	var arrayPageScroll = TB_getPageScrollTop();
	setStyle("TB_window", {"width":(TB_WIDTH + "px"), "left":((arrayPageScroll[0] + (pageDimensions.w - TB_WIDTH)/2)+"px"), "top":((arrayPageScroll[1] + (pageDimensions.h-TB_HEIGHT)/2)+"px")});
}

function TB_overlaySize(){
	if (window.innerHeight && window.scrollMaxY || window.innerWidth && window.scrollMaxX) {	
		yScroll = window.innerHeight + window.scrollMaxY;
		xScroll = window.innerWidth + window.scrollMaxX;
	} else if (document.body.scrollHeight > document.body.offsetHeight || document.body.scrollWidth > document.body.offsetWidth){ // all but Explorer Mac
		yScroll = document.body.scrollHeight;
		xScroll = document.body.scrollWidth;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		yScroll = document.body.offsetHeight;
		xScroll = document.body.offsetWidth;
  	}
  	setElementDimensions("TB_overlay", {"w":xScroll,"h":yScroll});
   setElementDimensions("TB_HideSelect", {"w":xScroll,"h":yScroll});
}

function TB_load_position() {
   var pageDimensions = getViewportDimensions();
	var arrayPageScroll = TB_getPageScrollTop();
	setStyle("TB_load", {"left": (arrayPageScroll[0] + (pageDimensions.w - 100)/2)+"px", "top": (arrayPageScroll[1] + ((pageDimensions.h-100)/2))+"px", "display":"block"});
}


function TB_getPageScrollTop(){
	var yScrolltop;
	var xScrollleft;
	if (self.pageYOffset || self.pageXOffset) {
		yScrolltop = self.pageYOffset;
		xScrollleft = self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollTop || document.documentElement.scrollLeft ){	 // Explorer 6 Strict
		yScrolltop = document.documentElement.scrollTop;
		xScrollleft = document.documentElement.scrollLeft;
	} else if (document.body) {// all other Explorers
		yScrolltop = document.body.scrollTop;
		xScrollleft = document.body.scrollLeft;
	}
	arrayPageScroll = new Array(xScrollleft,yScrolltop) 
	return arrayPageScroll;
}

/////////////////////////////////////////////////////////////////////
/* From mochikit trac at http://trac.mochikit.com/wiki/ParsingHtml */
function evalHTML(value) {
   if (typeof(value) != "string") {
      return null;
   }
   value = MochiKit.Format.strip(value);
   if (value.length == 0) {
      return null;
   }
   var parser = MochiKit.DOM.DIV();
   var html = MochiKit.DOM.currentDocument().createDocumentFragment();
   var child;
   parser.innerHTML = value;
   while ((child = parser.firstChild)) {
      html.appendChild(child);
   }
   return html;
}
/////////////////////////////////////////////////////////////////////
function getElementsByTagNameAndAttributeValue(tagName, attribute, value) {
	var elements = [];
	forEach(list(document.getElementsByTagName(tagName)), function(element) {
		if(element[attribute] != null && element[attribute].toUpperCase() == value.toUpperCase()) {
			elements.push(element);
		}
	});
	return elements;
}
/////////////////////////////////////////////////////////////////////

function executeJavascript (element) {
    var element = MochiKit.DOM.getElement(element);
    if (element) {
      var st = element.getElementsByTagName("SCRIPT");
      var string_to_execute;

      for (var i=0;i<st.length; i++) {
        string_to_execute = st[i].innerHTML;
        try {
          eval(string_to_execute.split("<!--").join("").split("-->").join(""));
        } catch(e) {
          MochiKit.Logging.log(e);
        } // end try
      } // end for
    } // end if
} 
