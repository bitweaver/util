<?php

require_once 'HTMLPurifier/Filter.php';

class HTMLPurifier_Filter_YouTube extends HTMLPurifier_Filter
{
    
    var $name = 'YouTube preservation';
    
    function preFilter($html, $config, &$context) {
        $pre_regex = '#<object.*?width="?([0-9]+)"?.*?height="?([0-9]+)"?.*?'.
            'http://www.youtube.com/v/([A-Za-z0-9\-_]+).+?</object>#s';
        $pre_replace = '<span class="youtube-embed w-\1 h-\2">\3</span>';
        $ret = preg_replace($pre_regex, $pre_replace, $html);
        return $ret;
    }
    
    function postFilter($html, $config, &$context) {
        $post_regex = '#<span class="youtube-embed w-([0-9]+) h-([0-9]+)">([A-Za-z0-9\-_]+)</span>#';
		$post_replace = '<div style="width:\1px; height:\2px;">'.
			'<object width="\1" height="\2" '.
            'data="http://www.youtube.com/v/\3">'.
            '<param name="movie" value="http://www.youtube.com/v/\3"></param>'.
            '<param name="wmode" value="transparent"></param>'.
            '<!--[if IE]>'.
            '<embed src="http://www.youtube.com/v/\3"'.
            'type="application/x-shockwave-flash"'.
            'wmode="transparent" width="\1" height="\2" />'.
            '<![endif]-->'.
			'</object>'.
			'</div>';
		$ret = preg_replace($post_regex, $post_replace, $html);
		return $ret;
    }
    
}

