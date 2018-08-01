<?php

require_once 'HTMLPurifier/Filter.php';

class HTMLPurifier_Filter_CNBC extends HTMLPurifier_Filter
{
    
    public $name = 'CNBC';
    
    public function preFilter($html, $config, &$context) {
        $pre_regex = '#<object(.(?!<object))*?width="?([0-9]+)"?(.(?!<object))*?height="?([0-9]+)"?(.(?!</object))*?'.
            'http://plus.cnbc.com/rssvideosearch/action/player/id/([A-Za-z0-9\-_]+).+?</object>#s';
        $pre_replace = '<span class="cnbc-embed w-\2 h-\4">\6</span>';
        $ret = preg_replace($pre_regex, $pre_replace, $html);
        return $ret;
    }
    
    public function postFilter($html, $config, &$context) {
		$width = '\1';
		$height = '\2';

		/* the CNBC embed size may be fixed by the swf app and so it may never be possible to override
		// @config->def->info['bitweaver']['CNBC'] params width and height will force the size of the video
		if( !empty( $config->def->info['bitweaver']['CNBC'] ) ){
			$moviesize = $config->def->info['bitweaver']['CNBC'];
			$width = $moviesize['width'];
			$height = $moviesize['height'];
		}
		*/

		$src_url='http://plus.cnbc.com/rssvideosearch/action/player/id/\3/code/cnbcplayershare';
		
        $post_regex = '#<span class="cnbc-embed w-([0-9]+) h-([0-9]+)">([A-Za-z0-9\-_]+)</span>#';
		$post_replace = '<div style="width:'.$width.'px; height:'.$height.'px;">
			<object width="'.$width.'" height="'.$height.'" data="'.$src_url.'" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" type="application/x-shockwave-flash">
			<param name="allowfullscreen" value="true" />
			<param name="quality" value="best"/>
			<param name="scale" value="noscale" />
			<param name="wmode" value="transparent"/>
			<param name="bgcolor" value="#000000"/>
			<param name="salign" value="lt"/>
			<param name="movie" value="'.$src_url.'"/>
            <!--[if IE]>'.
			'<embed src="'.$src_url.'" type="application/x-shockwave-flash" width="'.$width.'" height="'.$height.'"'. 
			'name="cnbcplayer" pluginspage="http://www.macromedia.com/go/getflashplayer"'. 
			'allowfullscreen="true" bgcolor="#000000" quality="best"'. 
			'wmode="transparent" scale="noscale" salign="lt"></embed>'. 
            '<![endif]-->
			</object>
			</div>';
		$ret = preg_replace($post_regex, $post_replace, $html);
		return $ret;
    }
    
}

