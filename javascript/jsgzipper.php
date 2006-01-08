<?php
/**
 * $Header: /cvsroot/bitweaver/_bit_util/javascript/Attic/jsgzipper.php,v 1.1.2.1 2006/01/08 15:27:43 squareing Exp $
 * adapted from tinyMCE gzipper
 */

// initial setup
require_once( "../../bit_setup_inc.php" );

// General options
$expiresOffset = 3600 * 24 * 10;		// 10 days util client cache expires
$jsfile = ( !empty( $_REQUEST['jsfile'] ) ? UTIL_PKG_PATH."javascript/".$_REQUEST['jsfile'] : ( !empty( $_REQUEST['jspath'] ) ? $_REQUEST['jspath'] : NULL ) );

// Only gzip the contents if clients and server support it
$encodings = array();
if( isset( $_SERVER['HTTP_ACCEPT_ENCODING'] ) ) {
	$encodings = explode(',', strtolower( $_SERVER['HTTP_ACCEPT_ENCODING'] ) );
}

// Check for gzip header or norton internet securities
if( ( in_array( 'gzip', $encodings ) || isset( $_SERVER['---------------'] ) ) && function_exists( 'ob_gzhandler' ) && !ini_get( 'zlib.output_compression' ) ) {
	ob_start( "ob_gzhandler" );
}

// Output rest of headers
header( "Content-type: text/javascript; charset: UTF-8" );
// header("Cache-Control: must-revalidate");
header( "Vary: Accept-Encoding" ); // Handle proxies
header( "Expires: " . gmdate( "D, d M Y H:i:s", time() + $expiresOffset ) . " GMT" );

// get the file contents
if( !empty( $jsfile ) && is_readable( $jsfile ) ) {
	echo file_get_contents( $jsfile );
}
while( @ob_end_flush() );
?>
