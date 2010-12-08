var $jq = jQuery.noConflict();
BitMultiForm = {
	'deleteContent':function(content_id, message, id) {
		var answer = confirm(message);
		if (answer){
			BitBase.showSpinner();
			jQuery.ajax({
			url:BitSystem.urls.liberty + 'ajax_delete.php',
                        type:'POST',
                        context:document.body,
                        data: {content_id: content_id},
                        success:function(dom){
				BitBase.hideSpinner();
				var result = jQuery.parseJSON(dom);
				alert(result.message);
				if (result.status == 1) {
					jQuery( '#'+id ).css('display', 'none');
				}
                        }
                      });
		}
	},
	'addList':function (template,value,title,target,max) {
		// Hide the option div
		$jq( '#'+template.replace("temp", value) ).css('display','none');
		// clone the input form
		var index = BitMultiForm.addForm(template, target, max);
		var name = template.replace("temp", index);
		// Set the values
		$jq( '#'+name+" .multiform_input" ).val(value);
		$jq( '#'+name+" .multiform_input" ).after(title);
		$jq( '#ordering_' + index ).val(index);
		// Refresh sortable
		$jq( '#'+name+"_sortable" ).sortable( "refresh" );
	},
	'addForm':function (template,target,max) {
		//Set Variables
		var index,cloneNode,curr_units,inputs;
		//Get all the form units from the master div that holds all the unique instances of the cloned input blocks
		curr_units = $jq('#'+target).find('.multiform_unit');
		
		//Count the number of instances of the form and increase the number by 1 to grab our new index
		button = template.replace("_temp",'_add_button');
		if( typeof( BitMultiForm.seqs[target] ) != 'undefined' ){
			BitMultiForm.seqs[target]++; // javascript is stupid
			BitMultiForm.total[button]++;
			index = BitMultiForm.seqs[target]; 
		}else{
			index = BitMultiForm.seqs[target] = curr_units.length;
			BitMultiForm.total[button] = curr_units.length;
		}
		if (typeof(max) != 'undefined' && BitMultiForm.total[button] >= max - 1) {
			$jq( '#' + button ).css('display', 'none');
			$jq( '.multiform_add' ).css('display', 'none');
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

		//Check if remove button exists, if exists, set the remove function and make visible
		var a = cloneElm.find('.multiform_remove');
		var rid = cloneElm.attr('id');
		if( a.length > 0 ){
			a[0].onclick = function(){BitMultiForm.removeForm(rid);};
		}

		$jq('#'+target).append(cloneElm);

		if( typeof( BitBase.setPlaceholders ) != 'undefined' ){
			BitBase.setPlaceholders();
		}

		return index;
	},
	'removeForm':function (elmId) {
		//Remove the form from the master div and make sure add shows
		button = elmId.replace(/_[0-9]+/, '_add_button');
		if( typeof( BitMultiForm.total[button] ) != 'undefined' ){
			BitMultiForm.total[button]--;
		}
		BitBase.setElementDisplay(button, 'block', false);
		$jq( '.multiform_add' ).css('display', 'block');
		BitBase.$(elmId).parentNode.removeChild( BitBase.$(elmId) );
	},
	'seqs':{},
	'total':{}
};

