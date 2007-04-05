function ajax_updater(target, url, data) {
	var myAjax = new Ajax.Updater(
		{success: target},
		url,
		{parameters: data, onFailure: ajax_error}
	);
}
function ajax_error( request ) {
	alert( 'Sorry, there was a problem getting the requested data.' );
}
function ajax_get_and_call(element, func, url, force) {
	if (!force && element.loadedResponse) {
		func(element.loadedResponse);
	} else {	
		var myAjax = new Ajax.Request(url,
		{
		    method:'get',
		    onSuccess: function(transport){
		      	element.loadedResponse = transport.responseText || "No Response.";
			func(element.loadedResponse);
		    },
		    onFailure: ajax_error
		});
	}
}
function show_spinner(id) {
	Ajax.Responders.register({
		onCreate: function() {
			if (Ajax.activeRequestCount > 0)
			Element.show(id);
		},
		onComplete: function() {
			if (Ajax.activeRequestCount == 0)
			Element.hide(id);
		}
	});
}
