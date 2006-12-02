<?php

/**
 * Defines a set of immutable value object tokens for HTML representation.
 * 
 * @file
 */

/**
 * Abstract base token class that all others inherit from.
 */
class HTMLPurifier_Token {
    var $type; /**< Type of node to bypass <tt>is_a()</tt>. @public */
    
    /**
     * Copies the tag into a new one (clone substitute).
     * @return Copied token
     */
    function copy() {
        trigger_error('Cannot copy abstract class', E_USER_ERROR);
    }
}

/**
 * Abstract class of a tag token (start, end or empty), and its behavior.
 */
class HTMLPurifier_Token_Tag extends HTMLPurifier_Token // abstract
{
    /**
     * Static bool marker that indicates the class is a tag.
     * 
     * This allows us to check objects with <tt>!empty($obj->is_tag)</tt>
     * without having to use a function call <tt>is_a()</tt>.
     * 
     * @public
     */
    var $is_tag = true;
    
    /**
     * The lower-case name of the tag, like 'a', 'b' or 'blockquote'.
     * 
     * @note Strictly speaking, XML tags are case sensitive, so we shouldn't
     * be lower-casing them, but these tokens cater to HTML tags, which are
     * insensitive.
     * 
     * @public
     */
    var $name;
    
    /**
     * Associative array of the tag's attributes.
     */
    var $attributes = array();
    
    /**
     * Non-overloaded constructor, which lower-cases passed tag name.
     * 
     * @param $name         String name.
     * @param $attributes   Associative array of attributes.
     */
    function HTMLPurifier_Token_Tag($name, $attributes = array()) {
        //if ($attributes === null) var_dump(debug_backtrace());
        $this->name = ctype_lower($name) ? $name : strtolower($name);
        foreach ($attributes as $key => $value) {
            // normalization only necessary when key is not lowercase
            if (!ctype_lower($key)) {
                $new_key = strtolower($key);
                if (!isset($attributes[$new_key])) {
                    $attributes[$new_key] = $attributes[$key];
                }
                if ($new_key !== $key) {
                    unset($attributes[$key]);
                }
            }
        }
        $this->attributes = $attributes;
    }
}

/**
 * Concrete start token class.
 */
class HTMLPurifier_Token_Start extends HTMLPurifier_Token_Tag
{
    var $type = 'start';
    function copy() {
        return new HTMLPurifier_Token_Start($this->name, $this->attributes);
    }
}

/**
 * Concrete empty token class.
 */
class HTMLPurifier_Token_Empty extends HTMLPurifier_Token_Tag
{
    var $type = 'empty';
    function copy() {
        return new HTMLPurifier_Token_Empty($this->name, $this->attributes);
    }
}

/**
 * Concrete end token class.
 * 
 * @warning This class accepts attributes even though end tags cannot. This
 * is for optimization reasons, as under normal circumstances, the Lexers
 * do not pass attributes.
 */
class HTMLPurifier_Token_End extends HTMLPurifier_Token_Tag
{
    var $type = 'end';
    function copy() {
        return new HTMLPurifier_Token_End($this->name);
    }
}

/**
 * Concrete text token class.
 * 
 * Text tokens comprise of regular parsed character data (PCDATA) and raw
 * character data (from the CDATA sections). Internally, their
 * data is parsed with all entities expanded. Surprisingly, the text token
 * does have a "tag name" called #PCDATA, which is how the DTD represents it
 * in permissible child nodes.
 */
class HTMLPurifier_Token_Text extends HTMLPurifier_Token
{
    
    var $name = '#PCDATA'; /**< PCDATA tag name compatible with DTD. @public */
    var $type = 'text';
    var $data; /**< Parsed character data of text. @public */
    var $is_whitespace; /**< Bool indicating if node is whitespace. @public */
    
    /**
     * Constructor, accepts data and determines if it is whitespace.
     * 
     * @param $data String parsed character data.
     */
    function HTMLPurifier_Token_Text($data) {
        $this->data = $data;
        $this->is_whitespace = ctype_space($data);
    }
    function copy() {
        return new HTMLPurifier_Token_Text($this->data);
    }
    
}

/**
 * Concrete comment token class. Generally will be ignored.
 */
class HTMLPurifier_Token_Comment extends HTMLPurifier_Token
{
    var $data; /**< Character data within comment. @public */
    var $type = 'comment';
    /**
     * Transparent constructor.
     * 
     * @param $data String comment data.
     */
    function HTMLPurifier_Token_Comment($data) {
        $this->data = $data;
    }
    function copy() {
        return new HTMLPurifier_Token_Comment($this->data);
    }
}

?>