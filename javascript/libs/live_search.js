/*
Written by: Adam Crownoble (adam@bryan.edu)
Date: April 3 2006
License: LGPL (http://www.gnu.org/copyleft/lesser.html)
*/

var LiveSearch = Class.create();
LiveSearch.prototype = {
	initialize: function(searchBox, results) {
		this.form = searchBox.form;
		this.searchBox = searchBox;
		this.results = results;
		this.url = this.form.action;
		this.method = this.form.method;
		this.stopSubmit = true;
		this.searchString = this.searchBox.value;
		this.starterText = this.searchString;
		this.searchingMessage = 'Searching...';
		this.minLength = 3;
		this.timeoutID = 0;
		this.delay = 500;

		Event.observe(this.form, 'submit', this.submit.bind(this));
		Event.observe(this.searchBox, 'keyup', this.update.bind(this));
		Event.observe(this.searchBox, 'focus', this.handleStarterText.bind(this));
		Event.observe(this.searchBox, 'blur', this.handleStarterText.bind(this));

		this.form.reset();
	},

	handleStarterText: function(event) {
		switch(event.type) {
			case 'focus':
				if(this.searchBox.value == this.starterText) {
					Field.clear(this.searchBox);
				}
			break;

			case 'blur':
				if(this.searchBox.value == '') {
					this.searchBox.value = this.starterText;
				}
			break;
		}
	},

	update: function() {
		if(this.searchString != this.searchBox.value && this.searchBox.value != this.starterText) {

			this.searchString = this.searchBox.value;
			clearTimeout(this.timeoutID);

			if(this.searchString.length >= this.minLength) {
				this.results.innerHTML = this.searchingMessage;
				this.timeoutID = setTimeout(this.search.bind(this), this.delay);
			} else {
				this.results.innerHTML = '';
			}
		}
	},

	search: function() {
		var parameters = Form.serialize(this.form);
		var ajax = new Ajax.Updater(this.results, this.url, { method: this.method, parameters: parameters });
	},

	submit: function(event) {
		if(this.stopSubmit) { Event.stop(event); }
	}
};
