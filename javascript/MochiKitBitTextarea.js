/* this is mostly lifted from a hack of Drupal textarea.js
 * see: http://drupal.org/files/issues/textarea-grow_2.patch
 */
/* Dependencies: MochiKit Base DOM Style*/
BitTextarea =  {
	"DUMMY_DIV":null,
	
	//add this to body.onload or call if ajaxing in a from
    "registerTextareas":function(){
		var BT = BitTextarea;
		//create a dummy container for measuring text
		oDiv1 = DIV( {'style':'position:absolute; top:0; left:0; overflow:hidden; visibility:hidden; height:10px;'}, null);
		oDiv2 = DIV({'style':'position:absolute; top:0; left:0;', 'id':'BitTextareaDummy'},null);
		//add these separately to avoid some weird bug in the div construction
		document.body.appendChild ( oDiv1 );
		oDiv1.appendChild( oDiv2 );
		BT.DUMMY_DIV = $('BitTextareaDummy');
    	//get all text areas on the page
    	aTextareas = document.getElementsByTagName( "textarea" );
    	//assign onchange listeners
    	for( n=0; n<aTextareas.length; n++ ){
    		aTextareas[n].onkeyup = partial( BT.onTextareaChange,  aTextareas[n] );
			BT.onTextareaChange( aTextareas[n] );
    	}
	},

    "onTextareaChange":function( e ){
		var BT = BitTextarea;
        //get current text area size
		oElmDims = MochiKit.Style.getElementDimensions( e );
		iTextareaH = oElmDims.h;
        //get text size
        iTextsizeH = BT.getTextHeight( e );
        //diff
        iDiff = iTextsizeH - iTextareaH;
        //check min and max
        //add diff to text area size
		iNewH = oElmDims.h;
        if ( iDiff > 0 ){
			iMaxHeight = BT.getMaxHeight();
        	iNewH = ( iTextsizeH > iMaxHeight ) ? iMaxHeight : iTextsizeH;
        }else if( iDiff < 0 ){
			iMinHeight = BT.getMinHeight();
        	iNewH = ( iTextsizeH < iMinHeight ) ? iMinHeight : iTextsizeH;
        }
		e.style.height = iNewH+"px";
    }, 
    
    "getMaxHeight":function(){
        return MochiKit.Style.getViewportDimensions().h - 40;
    },  
    
    "getMinHeight":function(){
        return 100;
    },

	"getTextHeight":function( e ){
		var BT = BitTextarea;
		oDiv = BT.DUMMY_DIV;
		oDiv.innerHTML = BT.encodeHTML(e.value);
		BT.cloneTextareaStyles( e, oDiv );
		return oDiv.clientHeight;
	},

	"cloneTextareaStyles":function( e,div ){
		var f = MochiKit.Style.getStyle;
		var style = {
			fontFamily: f( e, 'fontFamily')||'',
			fontSize: f( e, 'fontSize')||'',
			fontWeight: f( e, 'fontWeight')||'',
			fontStyle: f( e, 'fontStyle')||'',
			fontStretch: f( e, 'fontStretch')||'',
			fontVariant: f( e, 'fontVariant')||'',
			letterSpacing: f( e, 'letterSpacing')||'',
			wordSpacing: f( e, 'wordSpacing')||'',
			lineHeight: f( e, 'lineHeight')||'',
			textWrap: 'unrestricted'
		};
		MochiKit.Style.setStyle( div, style );
		div.style.width = MochiKit.Style.getElementDimensions( e ).w + "px"; 
	},

	"encodeHTML":function(str) {
		str = String(str);
		var aReplace = { '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' };
		for (var char in aReplace) {
			var regex = new RegExp(char, 'g');
			str = str.replace(regex, aReplace[char]);
		}
		str = str.replace(/(\r\n|[\r\n])/g, "<br />");
		return str;
	}
};
