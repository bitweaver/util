// Author: Al Sierra
// Version: 3.16.2010
// Description: Multi Forms
// Dependency: Prototype
var $jq = jQuery.noConflict();
BitMultiForm = {
	'addForm':function (template,target) {
		//Set Variables
		var index,cloneNode,curr_units,inputs;
		
		//Get all the form units from the master div that holds all the unique instances of the cloned input blocks
		curr_units = $jq('#'+target).find('.multiform_unit');
		
		//Count the number of instances of the form and increase the number by 1 to grab our new index
		if( typeof( BitMultiForm.seqs[target] ) != 'undefined' ){
			BitMultiForm.seqs[target]++; // javascript is stupid
			index = BitMultiForm.seqs[target]; 
		}else{
			index = BitMultiForm.seqs[target] = curr_units.length;
		}
		
		//Clone the template node and set the attributes
		cloneElm = $jq( BitBase.$(template).cloneNode(true) );
		var id1 = cloneElm.attr('id',cloneElm.attr('id').replace('temp',index));
		cloneElm.css('display', 'block');
		
		//Grab all the input fields and loop through each of them to modify the attributes name and id 
		cloneElm.find('input').each(function(i){ 
			$jq(this).attr('id',$jq(this).attr('id').replace('temp',index));
			$jq(this).attr('name',$jq(this).attr('name').replace('temp',index));
		});

		//Grab all the select fields and loop through each of them to modify the attributes name and id 
		cloneElm.find('select').each(function(i){ 
			$jq(this).attr('id',$jq(this).attr('id').replace('temp',index));
			$jq(this).attr('name',$jq(this).attr('name').replace('temp',index));
		});

		//Check if remove button exists, if exists, set the remove function
		/*
		var a = cloneElm.find('.multiform_remove');
		if( a.length > 0 ){
			a[0].onclick = function(){BitMultiForm.removeForm(id1);};
		}
		*/

		$jq('#'+target).append(cloneElm);

		if( typeof( BitBase.setPlaceholders ) != 'undefined' ){
			BitBase.setPlaceholders();
		}
	},
	'removeForm':function (elmId) {
		//Remove the form from the master div
		BitBase.$(elmId).parentNode.removeChild( $(elmId) );
	},
	'seqs':{}
};

