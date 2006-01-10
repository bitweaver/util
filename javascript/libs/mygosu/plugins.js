function DynamicTreePlugins() {
	this.importFromHtml = function(html) {
		// dirty hack for ie (automatic conversion to absolute paths problem), see also DynamicTreeBuilder.parse()
		html = html.replace(/href=["']([^"']*)["']/g, 'href="dynamictree://dynamictree/$1"');
		$(this.id).innerHTML = html;
		this.reset();
	};
	this.exportToPhp = function(node) {
		var ret = "";
		if (node) {
			if (node.childNodes) {
				ret += "?'?' => array(\n".format(
					" ".repeat(4*node.getLevel()),
					node.title
				);
				for (var i = 0; i < node.childNodes.length; ++i) {
					ret += this.exportToPhp(node.childNodes[i]);
				}
				ret += "?)?\n".format(
					" ".repeat(4*node.getLevel()),
					node.isLast() ? "" : ","
				);
			} else {
				ret += "?'?' => null?\n".format(
					" ".repeat(4*node.getLevel()),
					node.title,
					node.isLast() ? "" : ","
				);
			}
		} else {
			var nodes = this.tree.childNodes;
			ret += "$tree['structure'] = array(\n";
			for (var i = 0; i < nodes.length; ++i) {
				ret += this.exportToPhp(nodes[i]);
			}
			ret += ");\n\n";
			ret += "$tree['data'] = array(\n";
			var cnt = 0, current = 0;
			for (var p in this.allNodes) {
				if (!this.allNodes[p]) { continue; }
				cnt++;
			}
			for (var p in this.allNodes) {
				if (!this.allNodes[p]) { continue; }
				current++;
				var node = this.allNodes[p];
				ret += "	'?' => array('parent_id' => '?', 'content_id' => '?')?\n".format(
					node.title,
					node.parentNode.title,
					node.target,
					cnt != current ? "," : ""
				);
			}
			ret += ");";
		}
		return ret;
	};
}

/* Repeat string n times */
if (!String.prototype.repeat) {
	String.prototype.repeat = function(n) {
		var ret = "";
		for (var i = 0; i < n; ++i) {
			ret += this;
		}
		return ret;
	};
}
