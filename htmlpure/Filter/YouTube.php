<?php

require_once 'HTMLPurifier/Filter.php';

class HTMLPurifier_Filter_YouTube extends HTMLPurifier_Filter
{
    
    public $name = 'YouTube';
    
    public function preFilter($html, $config, &$context) {
        $pre_regex = '#<object.*?width="?([0-9]+)"?.*?height="?([0-9]+)"?.*?'.
            'http://www.youtube.com/v/([A-Za-z0-9\-_]+).+?</object>#s';
        $pre_replace = '<span class="youtube-embed w-\1 h-\2">\3</span>';
        $ret = preg_replace($pre_regex, $pre_replace, $html);
        return $ret;
    }
    
	// @config->def->info['bitweaver']['YouTube'] params width and height will force the size of the video
    public function postFilter($html, $config, &$context) {
		$width = '\1';
		$height = '\2';
		if( !empty( $config->def->info['bitweaver']['YouTube'] ) ){
			$moviesize = $config->def->info['bitweaver']['YouTube'];
			$width = $moviesize['width'];
			$height = $moviesize['height'];
		}
		
        $post_regex = '#<span class="youtube-embed w-([0-9]+) h-([0-9]+)">([A-Za-z0-9\-_]+)</span>#';
		$post_replace = '<div style="width:'.$width.'px; height:'.$height.'px;">'.
			'<object width="'.$width.'" height="'.$height.'" '.
            'data="http://www.youtube.com/v/\3">'.
            '<param name="movie" value="http://www.youtube.com/v/\3"></param>'.
            '<param name="wmode" value="transparent"></param>'.
            '<!--[if IE]>'.
            '<embed src="http://www.youtube.com/v/\3"'.
            'type="application/x-shockwave-flash"'.
            'wmode="transparent" width="'.$width.'" height="'.$height.'" />'.
            '<![endif]-->'.
			'</object>'.
			'</div>';
		$ret = preg_replace($post_regex, $post_replace, $html);
		return $ret;
    }
    
}

