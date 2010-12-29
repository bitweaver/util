/* 
Javascript Pageflip v0.2 by Charles Mangin (http://option8.com)


Creative Commons License:

Javascript Pageflip v0.2 by Charles Mangin is licensed under a Creative Commons Attribution-Share Alike 3.0 United States License.

You are free:

to Share — to copy, distribute, display, and perform the work
to Remix — to make derivative works

Under the following conditions:

Attribution. You must attribute this work to Charles Mangin ( with link: http://option8.com ).

  
Share Alike. If you alter, transform, or build upon this work, you may distribute the resulting work only under the same, 
similar or a compatible license.

For any reuse or distribution, you must make clear to others the license terms of this work. The best way to do this is 
with a link to this web page: http://creativecommons.org/licenses/by-sa/3.0/us/

Any of the above conditions can be waived if you get permission from the copyright holder.

Apart from the remix rights granted under this license, nothing in this license impairs or restricts the author's moral rights.

*/

/**
 * Modifications performed 06.11.10:
 * - In pageLayout(), pageWidth and pageHeight are now set to the current values of .pageimage class
 *	 to enable dynamic resizing of pages
 * - Sixth page added to allow visibility thorough 2 consecutive pages with transparent elements.
 * - Initialize function changed to be called manually as opposed to window.onload()
 * - Add optional parameter to flipForward and flipBack to pass in callback function for when flipping is complete.
 * - Add variables to store callback functions for flipForward and flipBack
 * @author Brian Stegmann
 */

//Variables to hold callback functions for flipForward and FlipBack
var onFlipForwardFinish;
var onFlipBackFinish;

/* set up variables */

var imageArray = new Array();


// display page l/r. next spread l/r. previous spread l/r.
var pageN1, page0, page1, page2, page3, page4, page6;


// img tags within each page hold the contents
var pageN1img, page0img, page1img, page2img, page3img, page4img, page6img;;

// originally worked with bg images, but now the bg is shadow
var pageIndex = 0; // initial starting page

var page1image = new Image();   // Create new Image object  
var page2image = new Image();   // Create new Image object  

// next LEFT page
var page3image = new Image();   // Create new Image object  
var page3OriginX; // page 3 starting position
var page3x; // page 3 current position
var page3DeltaX; // frame-to-frame diff in page 3 x value
// next RIGHT page
var page4image = new Image();   // Create new Image object  

// previous RIGHT page
var page0image = new Image();   // Create new Image object  
var page0OriginX; // page 0 starting position
var page0x;
var page0DeltaX; // frame-to-frame diff in page 3 x value
// previous LEFT page
var pageN1image = new Image();   // Create new Image object  

//second next RIGHT page
var page6image = new Image();

// timer
var currentStep, totalSteps;


var pageWidth, page2Width, page3Width, page4Width, page6Width, page1Width, page0Width;
var pageHeight;


var page3TargetX; // page 3 aims for 0px
var page0TargetX; // page 0 aims for pagewidth px

// the div that holds it all
var pagesContainer;

// animating on/off
var flipping; 


function pageLayout() {

//	console.log("doing layout");


	page1image.src = imageArray[pageIndex].src; // Set source path
	page1img = 	document.getElementById('page1img');
	page1img.src = page1image.src ;
	
	if(typeof(imageArray[pageIndex+1]) != "undefined") {
		page2image.src = imageArray[pageIndex+1].src; // Set source path
		page2img = 	document.getElementById('page2img');
		page2img.src = page2image.src ;
	}

	if(typeof(imageArray[pageIndex+2]) != "undefined") {
		page3image.src = imageArray[pageIndex+2].src; // Set source path
		page3img = 	document.getElementById('page3img');
		page3img.src = page3image.src ;
	}	
	if(typeof(imageArray[pageIndex+3]) != "undefined") {
		page4image.src = imageArray[pageIndex+3].src; // Set source path
		page4img = 	document.getElementById('page4img');
		page4img.src = page4image.src ;
	}
	if(typeof(imageArray[pageIndex+5]) != "undefined") {
		page6image.src = imageArray[pageIndex+5].src; // Set source path
		page6img = 	document.getElementById('page6img');
		page6img.src = page6image.src ;
	}
	if(typeof(imageArray[pageIndex-1]) != "undefined") {
		page0image.src = imageArray[pageIndex-1].src; // Set source path
		page0img = document.getElementById('page0img');
		page0img.src = page0image.src ;
	}
	if(typeof(imageArray[pageIndex-2]) != "undefined") {
		pageN1image.src = imageArray[pageIndex-2].src; // Set source path
		pageN1img = document.getElementById('pageN1img');
		pageN1img.src = pageN1image.src ;
	}	
	
// set the page width all the pages key off. if image1 is an odd size, choose a different one to key	
	//pageWidth = page1image.width;
	//pageHeight = page1image.height;

	pageWidth = $('.pageimage').width();
	pageHeight = $('.pageimage').height();

//	console.log("page width = " + page1img.width);
	
	
// set up pages
	page1 = document.getElementById('page1');
		

	page2 = document.getElementById('page2');
	page3 = document.getElementById('page3');
	page4 = document.getElementById('page4');

	page6 = document.getElementById('page6');

	page0 = document.getElementById('page0');
	pageN1 = document.getElementById('pageN1');

// uniform height/width for the page DIVs
	page0.style.height = pageN1.style.height = page1.style.height = page2.style.height =
	 	page3.style.height = page4.style.height = page6.style.height = (pageHeight+2) + "px";
	

	page0.style.width = pageN1.style.width = page1.style.width = page2.style.width = 
		page3.style.width = page4.style.width = page6.style.width = (pageWidth+2) + "px";


	page0Width = pageWidth;
	page2Width = pageWidth;

// set the next/previous pages up for their animations
	page2.style.left = page4.style.left = page6.style.left = pageWidth + "px";
	page0.style.left = 0 + "px";
	page1.style.left = 0 + "px";

	page3TargetX = 0;
	page0TargetX = pageWidth;


	
// initial position for page 3 - flip forward
	page3OriginX = pageWidth * 2;
	page3.style.left = 	pageWidth * 2 + "px";
	page3Width = 0;
	page3.style.width = page3Width + "px";

// initial position for page 0 - flip back
	page0OriginX = 0;
	page0.style.left = 	0 + "px";
	page0Width = 0;
	page0.style.width = page0Width + "px";


// set up next page flip	
	currentStep = 1;
	totalSteps = flipTime/smoothness;
	
	// start out the page3 canvas at start position
	page3x = 2 * pageWidth;
	page0x = 0;
		
// hide the previous pages
	page0.style.display = "none";
	pageN1.style.display = "none";

// clicky cursor
	if(typeof(imageArray[pageIndex]) != "undefined") {
		page1.style.cursor="hand";
	} else {
		page1.style.cursor="default";
	}

	if(typeof(imageArray[pageIndex+1]) != "undefined") {
		page2.style.cursor="hand";
	} else {
		page2.style.cursor="default";
	}

	// ready to go...
	flipping = false;

}    


function flipForward() {
		
// linear
	//page3DeltaX = (page3TargetX-page3OriginX)/totalSteps; // distance per step
	//page3x += page3DeltaX;
	
	page3OldX = page3x;
	
// ease out
//	page3x = page3OriginX + (Math.sin( (currentStep/totalSteps) * (Math.PI/2) ) * (page3TargetX-page3OriginX) );

// ease in/out
	page3x = ((1 + Math.cos( (currentStep/totalSteps) * (Math.PI) ))/2) * (page3OriginX - page3TargetX);
	
	page3DeltaX = page3x - page3OldX;
		
	// shadow
	page3ShadowWidth = -4 * page3DeltaX;
	page3.style.paddingLeft =  page3ShadowWidth + "px"

	page3.style.left = page3x - page3ShadowWidth  + "px";

    page2Width += page3DeltaX;
	
	if(page2Width > 0) { // surprise, IE doesn't like negative width
		page2.style.width = Math.floor(page2Width) + "px";
	} else {
		page2Width = 0;
		page2.style.width = Math.floor(page2Width) + "px";
	}
	page3Width -= page3DeltaX/2;
	page3.style.width = Math.floor(page3Width) + "px";
	
	if(currentStep == totalSteps){
		clearInterval(nextPageFlip);
		pageIndex += 2;
		pageLayout();
		if(onFlipForwardFinish != null) {
			onFlipForwardFinish();
		}
	} 
	
	currentStep ++;

}

/**
 * Function to initiate forward flip.
 *
 * @param flipForwardOnComplete function 
 */
function nextPage( flipForwardOnComplete ) {

	onFlipForwardFinish = flipForwardOnComplete;	
	
	if((typeof(imageArray[pageIndex+2]) != "undefined")  && (flipping == false) ){
		nextPageFlip = setInterval(flipForward,smoothness);
		flipping = true;
	}
}
    
     
function flipBack() {

	page0.style.display = "block";
	pageN1.style.display = "block";

	
	page0OldX = page0x;
	

// ease in/out
	page0x = page0OriginX + ((1 - Math.cos( (currentStep/totalSteps) * (Math.PI) ))/2) * (page0TargetX - page0OriginX);
	
	page0DeltaX = page0x - page0OldX;
		

	page0.style.left = page0x  + "px";
	page1.style.left = page0x  + "px";	

	// move contents over to pretend we're cropping from the left
	page0.style.textIndent = -1 * pageWidth + page0x + "px";
	
// grow the -1 page to match the movement of page 0	
	pageN1.style.width = page0x + "px";

//shrink page 1 to match movement of page 0
	page1Width = page1.style.width.replace('px', '');
	

	page1Width -= page0DeltaX;
	if(page1Width < 0) {
		page1Width = 0;
	}

	page1.style.width = page1Width + 'px';
	page1img.style.width = page1Width + 'px';

	page0Width += page0DeltaX;

	// shadow
	page0ShadowWidth = 4 * page0DeltaX;
	page0.style.paddingRight =  page0ShadowWidth + "px"

	page0.style.width = Math.floor(page0Width) + page0ShadowWidth + "px";

	
	if(currentStep == totalSteps){
		clearInterval(nextPageFlip);
		pageIndex -= 2;
		page1img.style.width = pageWidth + 'px';
		pageLayout();
		if(onFlipBackFinish != null) {
			onFlipBackFinish();
		}
	} 
	
	currentStep ++;

}

/**
 * Function to initiate back flip.
 *
 * @param flipForwardOnComplete function 
 */
function previousPage( flipBackOnComplete ) {

	onFlipBackFinish = flipBackOnComplete;

	if( (typeof(imageArray[pageIndex-1]) != "undefined") && (flipping == false)){
		nextPageFlip = setInterval(flipBack,smoothness);
		flipping = true;
	}
}


function pageFlipInitialize() {

//	console.log("ready");

// build the image array from jquery
imageArray = $(".pageimage");

//console.log(imageArray[0].src);

	pageLayout();

};
// window ready
