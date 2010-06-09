<?php
/* vim: set expandtab tabstop=4 shiftwidth=4: */
// +----------------------------------------------------------------------+
// | PHP Version 4                                                        |
// +----------------------------------------------------------------------+
// | Copyright (c) 1997-2004 The PHP Group                                |
// +----------------------------------------------------------------------+
// | This source file is subject to version 3.0 of the PHP license,       |
// | that is bundled with this package in the file LICENSE, and is        |
// | available at through the world-wide-web at                           |
// | http://www.php.net/license/3_0.txt.                                  |
// | If you did not receive a copy of the PHP license and are unable to   |
// | obtain it through the world-wide-web, please send a note to          |
// | license@php.net so we can mail you a copy immediately.               |
// +----------------------------------------------------------------------+
// | Authors: Aidan Lister <aidan@php.net>                                |
// +----------------------------------------------------------------------+
//
// $Id$
//


/**
 * Replace str_split()
 *
 * @category    PHP
 * @package     PHP_Compat
 * @link        http://php.net/function.str_split
 * @author      Aidan Lister <aidan@php.net>
 * @version     $Revision$
 * @since       PHP 5
 * @require     PHP 4.0.1 (trigger_error)
 */
if (!function_exists('str_split'))
{
    function str_split ($string, $split_length = 1)
    {
        if (!is_numeric($split_length)) {
            trigger_error('str_split() expects parameter 2 to be long, ' . gettype($split_length) . ' given', E_USER_WARNING);
            return false;
        }

        if ($split_length < 1) {
            trigger_error('str_split() The the length of each segment must be greater then zero', E_USER_WARNING);
            return false;
        }

        preg_match_all('/.{1,' . $split_length . '}/s', $string, $matches);
        return $matches[0];
    }
}

?>