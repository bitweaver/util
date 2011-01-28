<?php
  
class HTMLPurifier_Filter_SafeIframe extends HTMLPurifier_Filter
{
    public $name = 'SafeIframe';

    public function preFilter($html, $config, $context) {
		$pre_regex = '#<iframe(.+?)>#';
		$pre_replace = '<span class="safe-iframe">\1</span>';
		return preg_replace($pre_regex, $pre_replace, preg_replace("/<\/iframe>/", "", $html));
    }

    public function postFilter($html, $config, $context) {
		$post_regex = '#<span class="safe-iframe">(.+?)</span>#';
		return preg_replace_callback($post_regex, array($this, 'postFilterCallback'), $html);
    }

    protected function postFilterCallback($matches) {
        return '<iframe '.$matches[1].'></iframe>';
    }
}

