<?php

class SuggestLib {

	function exportXml( $pHash, $pFieldName ) {
		$ret = '<?xml version="1.0" ?><ajax-response><response type="object" id="'.$pFieldName.'_updater"><matches>';
		foreach( $pHash as $value=>$name ) {
			$ret .= "<entry><text>".htmlentities( $name )."</text><value>".htmlentities( $value )."</value></entry>";
		}
		$ret .= "</matches></response></ajax-response>";
		return $ret;
	}
}

?>
