<?php

/**
* 
* Parses for text marked as a code example block.
* 
* @category Text
* 
* @package Text_Wiki
* 
* @author Justin Patrin <papercrane@reversefold.com>
* @author Paul M. Jones <pmjones@php.net>
* 
* @license LGPL
* 
* @version $Id: Code.php,v 1.1 2005/06/19 05:21:36 bitweaver Exp $
* 
*/

/**
* 
* Parses for text marked as a code example block.
* 
* This class implements a Text_Wiki_Parse to find sections marked as code
* examples.  Blocks are marked as the string <code> on a line by itself,
* followed by the inline code example, and terminated with the string
* </code> on a line by itself.  The code example is run through the
* native PHP highlight_string() function to colorize it, then surrounded
* with <pre>...</pre> tags when rendered as XHTML.
*
* @category Text
* 
* @package Text_Wiki
* 
* @author Justin Patrin <papercrane@reversefold.com>
* @author Paul M. Jones <pmjones@php.net>
* 
*/

class Text_Wiki_Parse_Code extends Text_Wiki_Parse {
    
    
    /**
    * 
    * The regular expression used to find source text matching this
    * rule.
    * 
    * @access public
    * 
    * @var string
    * 
    */
    
    var $regex = '/^{CODE\((.+)?\)}\n(.+)\n{CODE}(\s|$)/Umsi';
    
    
    /**
    * 
    * Generates a token entry for the matched text.  Token options are:
    * 
    * 'text' => The full matched text, not including the <code></code> tags.
    * 
    * @access public
    *
    * @param array &$matches The array of matches from parse().
    *
    * @return A delimited token number to be used as a placeholder in
    * the source text.
    *
    */
    
    function process(&$matches)
    {
        // are there additional attribute arguments?
        $args = trim(html_entity_decode($matches[1]));

        $matches[2] = html_entity_decode($matches[2]);


        if ($args == '') {
            $options = array(
                'text' => $matches[2],
                'attr' => array('type' => '')
            );
        } else {
        	// get the attributes...
        	//$attr = $this->getAttrs($args);
            foreach (explode(',', $args) as $part) {
                if (false !== ($eq = strpos($part, '=')) && $eq != strlen($part) - 1) {
                    $attr[substr($part, 0, $eq)] = substr($part, $eq + 1 + ($part[$eq + 1] == '>' ? 1 : 0));
                } else {
                    $attr[$part] = '';
                }
            }
        	
            if (isset($attr['colors'])) {
                $attr['type'] = $attr['colors'];
                unset($attr['colors']);
            }

        	// ... and make sure we have a 'type'
        	if (!isset($attr['type'])) {
        		$attr['type'] = '';
        	}
        	
        	// retain the options
            $options = array(
                'text' => $matches[2],
                'attr' => $attr
            );
        }
        
        return $this->wiki->addToken($this->rule, $options) . $matches[3];
    }
}
?>