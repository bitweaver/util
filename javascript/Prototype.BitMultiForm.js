// Author: Al Sierra
// Version: 3.16.2010
// Description: Multi Forms
// Dependency: Prototype
BitMultiForm = {
	'addForm':function (template,target) {
		//Set Variables
		var index,cloneNode,curr_units,inputs;
		
		//Get all the form units from the master div that holds all the unique instances of the cloned input blocks
		curr_units = $(target).select('[class="multiform_unit"]');
		
		//Count the number of instances of the form and increase the number by 1 to grab our new index
		if( typeof( BitMultiForm.seqs[target] ) != 'undefined' ){
			BitMultiForm.seqs[target]++; // javascript is stupid
			index = BitMultiForm.seqs[target]; 
		}else{
			index = BitMultiForm.seqs[target] = curr_units.length;
		}
		
		//Clone the template node and set the attributes
		cloneElm = $(template).cloneNode(true);
		var id1 = cloneElm.readAttribute('id').replace('temp',index);
		cloneElm.setAttribute('id',id1);
		cloneElm.style.display ='block';
		
		//Grab all the input fields and loop through each of them to modify the attributes name and id 
		inputs = cloneElm.getElementsByTagName('input');
		for (var i=0;i<inputs.length;i++){
			var input = $(inputs[i]);
			var id2 = input.readAttribute('id').replace('temp',index);
			var name = input.readAttribute('name').replace('temp',index);
			input.setAttribute('id', id2 );
			input.setAttribute('name', name);
		}
		//Grab all the select fields and loop through each of them to modify the attributes name and id 
		var selects = cloneElm.getElementsByTagName('select');
		for (var i=0;i<selects.length;i++){
			var select = $(selects[i]);
			var id3 = select.readAttribute('id').replace('temp',index);
			var name = select.readAttribute('name').replace('temp',index);
			select.setAttribute('id', id3);
			select.setAttribute('name', name);
		}
		
		//Check if remove button exists, if exists, set the remove function
		var a = cloneElm.select('[class="multiform_remove"]');
		if( a.length > 0 ){
			a[0].onclick = function(){BitMultiForm.removeForm(id1);};
		}

		$(target).appendChild(cloneElm);

		if( typeof( BitBase.setPlaceholders ) != 'undefined' ){
			BitBase.setPlaceholders();
		}
	},
	'removeForm':function (elmId) {
		//Remove the form from the master div
		$(elmId).parentNode.removeChild( $(elmId) );
	},
	'seqs':{}
};

