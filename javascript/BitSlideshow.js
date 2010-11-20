BitSlideshow = {
	'showFieldset': function(id){
		var e = BitBase.$(id+'_fieldset');
		e.style.display = 'block';
		e = BitBase.$(id+'_selectbar');
		e.style.display = 'none';
	},
	'hideFieldset': function(id){
		var e = BitBase.$(id+'_selectbar');
		e.style.display = 'block';
		e = BitBase.$(id+'_fieldset');
		e.style.display = 'none';
	}
}
