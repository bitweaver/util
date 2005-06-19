<?php
if(!function_exists("set_include_path")) {
	function set_include_path($path) {
		return ini_set('include_path', $path);
	}
}
?>
