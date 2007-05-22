<?php

require_once 'HTMLPurifier/Filter.php';

class HTMLPurifier_Filter_YouTube extends HTMLPurifier_Filter
{
    
    var $name = 'YouTube preservation';
    
    function preFilter($html, $config, &$context) {
	// We snag width from object and height from emebed
	// so that we can avoid the order of width and height attributes
	// in the regular expression.
        $pre_regex = '#<object[^>]+width="?([0-9]+).+?>.+?'.
            'http://www.youtube.com/v/([A-Za-z0-9\-_]+).+?height="?([0-9]+)"?.+?</object>#s';
        $pre_replace = '<span class="youtube-embed w\1h\3" >\2</span>';
        return preg_replace($pre_regex, $pre_replace, $html);
    }
    
    function postFilter($html, $config, &$context) {
        $post_regex = '#<span class="youtube-embed w([0-9]+)h([0-9]+)">([A-Za-z0-9\-_]+)</span>#';
        $post_replace = '<object width="\1" height="\2" '.
            'data="http://www.youtube.com/v/\3">'.
            '<param name="movie" value="http://www.youtube.com/v/\3"></param>'.
            '<param name="wmode" value="transparent"></param>'.
            '<!--[if IE]>'.
            '<embed src="http://www.youtube.com/v/\3"'.
            'type="application/x-shockwave-flash"'.
            'wmode="transparent" width="\1" height="\2" />'.
            '<![endif]-->'.
            '</object>';
        return preg_replace($post_regex, $post_replace, $html);
    }
    
}

?>