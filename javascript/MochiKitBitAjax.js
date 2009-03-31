/* Dependencies: MochiKit Base Async */
BitAjax = {
	"updater": function(target, url, queryString) {
		BitBase.showSpinner();
		if (queryString != "" && queryString !=null){
			url += "?"+queryString+"&tk="+bitTk;
		}
		var r = doSimpleXMLHttpRequest(url);
		r.addCallback( BitAjax.updaterCallback, target ); 
		r.addErrback( BitAjax.error );
	},

	"updaterCallback": function(target, rslt){
		BitBase.hideSpinner();
		var e = document.getElementById(target);
		if (e != null){e.innerHTML = rslt.responseText;}
	},
	
	"error": function( rqst ) {
		alert( 'Sorry, there was a problem getting the requested data:\n'+rqst.message );
		BitBase.hideSpinner();
	},
	
	"getAndCall": function(elm, func, url, force) {
		if (!force && elm.loadedResponse) {
			func(elm.loadedResponse);
		} else {
			BitBase.showSpinner();
			var r = doSimpleXMLHttpRequest(url);
			r.addCallback( BitAjax.getAndCallCallback, elm, func ); 
			r.addErrback( BitAjax.error );
		}
	},
	
	"getAndCallCallback": function(elm, func, rslt){
		BitBase.hideSpinner();
		elm.loadedResponse = rslt.responseText || "No Response.";
		func(elm.loadedResponse);
	}
}
