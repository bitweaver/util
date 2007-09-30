var liberty_uploader_under_way = 0;
function liberty_uploader(file, action, waitmsg, frmid) {
	if (liberty_uploader_under_way) {
		alert(waitmsg);
	}
	else {
		liberty_uploader_under_way = 1;
		showById('spinner');
		var old_target = file.form.target;
		file.form.target = frmid;
		var old_action = file.form.action;
		file.form.action=action;
		file.form.submit();
		file.form.target = old_target;
		file.form.action = old_action;
	}
}
function liberty_uploader_complete(frmid, divid, fileid) {
	hideById('spinner');
	var ifrm = document.getElementById(frmid);
	if (ifrm.contentDocument) {
		var d = ifrm.contentDocument;
	} else if (ifrm.contentWindow) {
		var d = ifrm.contentWindow.document;
	} else {
		var d = window.frames[frmid].document;
	}
	if (d.location.href == "about:blank") {
		return;
	}
	var div = document.getElementById(divid);
	if (div != null) {
		div.innerHTML = d.body.innerHTML;
		for (i=0;i<div.childNodes.length;i++) {
			if (div.childNodes[i].id == 'result_list') {
				div.removeChild(div.childNodes[i]);
			}
		}
	}
	divid = divid + '_tab';
	div = document.getElementById(divid);
	if (div != null) {
		div.innerHTML = d.body.innerHTML		
		for (i=0;i<div.childNodes.length;i++) {
			if (div.childNodes[i].id == 'result_tab') {
				div.removeChild(div.childNodes[i]);
			}
		}
	}
	liberty_uploader_under_way = 0;
	var file = document.getElementById(fileid);
	file.value = '';
}
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
