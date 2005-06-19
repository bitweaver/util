<?php
if(!function_exists("get_include_path")) {
	function get_include_path() {
		return ini_get('include_path');
	}
}
?>
