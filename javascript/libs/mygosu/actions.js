// tooltips
function treeTooltipOn() { $("tree-tooltip").innerHTML = treeTooltips[treeElements.indexOf(this.id)]; }
function treeTooltipOff() { $("tree-tooltip").innerHTML = ""; }
var treeElements = ["tree-moveUp", "tree-moveDown", "tree-moveLeft", "tree-moveRight", "tree-remove", "tree-convert"];
var treeTooltips = ["Move Up", "Move Down", "Move Left", "Move Right", "Delete", "Convert between Document and Folder"];
for (var i = 0; i < treeElements.length; i++) {
	$(treeElements[i]).onmouseover = treeTooltipOn;
	$(treeElements[i]).onmouseout = treeTooltipOff;
}

// moving nodes
function treeMoveUp()    { if (tree.mayMoveUp())    { tree.moveUp();    treePluginExportBitweaver(); } }
function treeMoveDown()  { if (tree.mayMoveDown())  { tree.moveDown();  treePluginExportBitweaver(); } }
function treeMoveLeft()  { if (tree.mayMoveLeft())  { tree.moveLeft();  treePluginExportBitweaver(); } }
function treeMoveRight() { if (tree.mayMoveRight()) { tree.moveRight(); treePluginExportBitweaver(); } }

$("tree-moveUp").onclick	= treeMoveUp;
$("tree-moveDown").onclick  = treeMoveDown;
$("tree-moveLeft").onclick  = treeMoveLeft;
$("tree-moveRight").onclick = treeMoveRight;

if (document.all && !/opera/i.test(navigator.userAgent)) {
	$("tree-moveUp").ondblclick	   = treeMoveUp;
	$("tree-moveDown").ondblclick  = treeMoveDown;
	$("tree-moveLeft").ondblclick  = treeMoveLeft;
	$("tree-moveRight").ondblclick = treeMoveRight;
}

// remove node
$("tree-remove").onclick = treeRemove;
function treeRemove() { if (tree.mayRemove()) { if (confirm("Delete current node ?")) { tree.remove(); treePluginExportBitweaver(); } } }
// export string
function treePluginExportBitweaver() { $('structure_string').value = tree.exportToPhp(); }

/* Finds the index of the first occurence of item in the array, or -1 if not found */
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(item) {
		for (var i = 0; i < this.length; ++i) {
			if (this[i] === item) { return i; }
		}
		return -1;
	};
}

// convert node
$("tree-convert").onclick = function() { this.blur(); treePluginConvertType(); };
function treePluginConvertType() {
	if (tree.active) {
		var node = tree.getActiveNode();
		var type = (node.isFolder) ? "doc" : "folder";
		var o = {"href": node.href, "title": node.title, "target": node.target};
		if (type == "doc") {
			if (tree.mayRemove()) {
				tree.insertBefore("tree-"+(++tree.count), node.text, type, o);
				tree.remove();
			}
		} else {
			tree.insertBefore("tree-"+(++tree.count), node.text, type, o);
			tree.remove();
		}
	}
}
