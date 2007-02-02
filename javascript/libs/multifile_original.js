/***************************************************************************\
*                                                                           *
*  please modify this file and leave plenty of comments. when done, please  *
*  visit http://dean.edwards.name/packer/ to compress this and place the    *
*  compressed output in the loaded version of this file                     *
*                                                                           *
\***************************************************************************/
// Multiple file selector by Stickman -- http://www.the-stickman.com
function MultiSelector( list_target, max ){
	this.list_target = list_target;
	this.count = 0;
	this.id = 0;
	if( max ){
		this.max = max;
	} else {
		this.max = -1;
	};

// BitMod allow us to know what the maximum for each named item is.
	this.max_elements = Array();

// BitMod allow us to add elements that are disabled and enabled in unison
	this.disable_array = Array();

// BitMod Added setType to allow us to add something besides a div.
	this.type = 'file';

	this.addDisableElement = function(element) {
	  this.disable_array[element] = element;
	};

	this.setType = function(type) {
	  this.type = type;
	};

// BitMod Added to allow us to include a title textbox
	this.includeText = 0;
	this.setIncludeText = function(include) {
	  this.includeText = include;
	};

// BitMod Added to allow us to set the new item dragable
	this.makeDragable = 0;
	this.setMakeDragable = function(drag) {
	  this.makeDragable = drag;
	};

// BitMod Added addNamedElement function to allow us to name these.
// Thus we can have multiple on the same form
	this.addNamedElement = function(element, name) {
// BitMod We need a way to tell where the end is to avoid an infinite
// loop when processing the uploads because ones in the middle may get removed
// so we can't reliably tell when we hit the end without some magic
	  	if(name in this.max_elements) {
			this.max_elements[name].value = this.id;
	  	}
	  	else {
		  	var max_element = document.createElement('input');
			max_element.type = 'hidden';
			max_element.name = name + '_max';
			max_element.value = this.count;
			this.max_elements[name] = max_element;
			this.list_target.appendChild(max_element);
		};
		if( element.tagName == 'INPUT' && element.type == 'file' ){
			element.base_name = name;
			element.name = name + '_' + this.id++;
			element.multi_selector = this;
			element.onchange = function(){
				var new_element = document.createElement( 'input' );
				new_element.type = 'file';
				this.parentNode.insertBefore( new_element, this );
				this.multi_selector.addNamedElement( new_element, element.base_name);
				this.multi_selector.addListRow( this , element.name);
				this.style.position = 'absolute';
				this.style.left = '-1000px';
			};
			if( this.max != -1 && this.count >= this.max ){
				element.disabled = true;
				for (var item in this.disable_array) {
				  var elem = document.getElementById(item);
				  if (elem) {
				    elem.disabled = true;
				  }
				}
			};
			this.count++;
			this.current_element = element;
		} else {
			alert( 'Error: not a file input element' );
		};
	};

	this.addElement = function( element ){
	  this.addNamedElement(element, 'file');
	};

	this.addListRow = function( element , name){
	  // BitMod create by type and set id so we can use it
	  // in a drag and drop li.
		var new_row = document.createElement( this.type );
		if (this.makeDragable) {
		  DragDrop.makeItemDragable(new_row);
		};
		new_row.id = name;
		var new_row_button = document.createElement( 'input' );
		new_row_button.type = 'button';
		new_row_button.value = 'Remove';
		new_row.element = element;
		new_row_button.onclick= function(){
			this.parentNode.element.parentNode.removeChild( this.parentNode.element );
			this.parentNode.parentNode.removeChild( this.parentNode );
			this.parentNode.element.multi_selector.count--;
			this.parentNode.element.multi_selector.current_element.disabled = false;
			for (var item in this.parentNode.element.multi_selector.disable_array) {
			  var elem = document.getElementById(item);
			  if (elem) {
			    elem.disabled = false;
			  };
			};
			return false;
		};
		new_row.innerHTML = '<span>'+element.value+'</span>';
		// BitMod to allow us to add a text box
		if (this.includeText) {
		  new_row.innerHTML += "<br />";
		  var new_row_text = document.createElement( 'input' );
		  new_row_text.type = 'text';
		  new_row_text.name = name + '_text';
		  new_row.appendChild(new_row_text);
		};
		new_row.appendChild( new_row_button );
		this.list_target.appendChild( new_row );
	};
};
