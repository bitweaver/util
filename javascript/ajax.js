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
