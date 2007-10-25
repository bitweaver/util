/* Dependencies: MochiKit Base Async */
BitAjax = {
	"updater": function(target, url, queryString) {
		BitAjax.showSpinner();
		if (queryString != "" && queryString !=null){
			url += "?"+queryString;
		}
		var r = doSimpleXMLHttpRequest(url);
		r.addCallback( BitAjax.updaterCallback, target ); 
		r.addErrback( BitAjax.error );
	},

	"updaterCallback": function(target, rslt){
		BitAjax.hideSpinner();
		var e = document.getElementById(target);
		if (e != null){e.innerHTML = rslt.responseText;}
	},
	
	"error": function( request ) {
		BitAjax.hideSpinner();
		alert( 'Sorry, there was a problem getting the requested data.' );
	},
	
	"getAndCall": function(elm, func, url, force) {
		if (!force && elm.loadedResponse) {
			func(elm.loadedResponse);
		} else {
			BitAjax.showSpinner();
			var r = doSimpleXMLHttpRequest(url);
			r.addCallback( BitAjax.getAndCallCallback, elm ); 
			r.addErrback( BitAjax.error );
		}
	},
	
	"getAndCallCallback": function(elm, rslt){
		BitAjax.hideSpinner();
		elm.loadedResponse = rslt.responseText || "No Response.";
		func(elm.loadedResponse);
	},
	
	"showSpinner": function() {
		var e = document.getElementById('spinner')
		if (e != null){ e.style.display='block' };
	},
	
	"hideSpinner": function() {
		var e = document.getElementById('spinner')
		if (e != null){ e.style.display='none' };
	}
}
