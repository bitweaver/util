<?php
  
class HTMLPurifier_Filter_SafeIframe extends HTMLPurifier_Filter
{
    public $name = 'SafeIframe';

    public function preFilter($html, $config, $context) {
        return preg_replace("/iframe/", "img class=\"SafeIframe\" ", preg_replace("/<\/iframe>/", "", $html));
    }

    public function postFilter($html, $config, $context) {
       $post_regex = '#<img class="SafeIframe" ([^>]+)>#';
        return preg_replace_callback($post_regex, array($this, 'postFilterCallback'), $html);
    }

    protected function postFilterCallback($matches) {
        return '<iframe '.$matches[1].'></iframe>';
    }
}

