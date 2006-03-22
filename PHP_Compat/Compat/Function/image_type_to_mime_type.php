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
// $Id: image_type_to_mime_type.php,v 1.2 2006/03/22 10:24:33 squareing Exp $
//


if (!defined('IMAGETYPE_GIF')) {
    define('IMAGETYPE_GIF', 0);
}

if (!defined('IMAGETYPE_JPEG')) {
    define('IMAGETYPE_JPEG', 1);
}

if (!defined('IMAGETYPE_PNG')) {
    define('IMAGETYPE_PNG', 2);
}

if (!defined('IMAGETYPE_SWF')) {
    define('IMAGETYPE_SWF', 3);
}

if (!defined('IMAGETYPE_PSD')) {
    define('IMAGETYPE_PSD', 4);
}

if (!defined('IMAGETYPE_BMP')) {
    define('IMAGETYPE_BMP', 5);
}

if (!defined('IMAGETYPE_TIFF_II')) {
    define('IMAGETYPE_TIFF_II', 6);
}

if (!defined('IMAGETYPE_TIFF_MM')) {
    define('IMAGETYPE_TIFF_MM', 7);
}

if (!defined('IMAGETYPE_JPC')) {
    define('IMAGETYPE_JPC', 8);
}

if (!defined('IMAGETYPE_JP2')) {
    define('IMAGETYPE_JP2', 9);
}

if (!defined('IMAGETYPE_JPX')) {
    define('IMAGETYPE_JPX', 10);
}

if (!defined('IMAGETYPE_JB2')) {
    define('IMAGETYPE_JB2', 11);
}

if (!defined('IMAGETYPE_SWC')) {
    define('IMAGETYPE_SWC', 12);
}

if (!defined('IMAGETYPE_IFF')) {
    define('IMAGETYPE_IFF', 13);
}

if (!defined('IMAGETYPE_WBMP')) {
    define('IMAGETYPE_WBMP', 14);
}

if (!defined('IMAGETYPE_XBM')) {
    define('IMAGETYPE_XBM', 15);
}


/**
 * Replace image_type_to_mime_type()
 *
 * @category    PHP
 * @package     PHP_Compat
 * @link        http://php.net/function.image_type_to_mime_type
 * @author      Aidan Lister <aidan@php.net>
 * @version     $Revision: 1.2 $
 * @since       PHP 4.3.0
 * @require     PHP 3
 */
if (!function_exists('image_type_to_mime_type'))
{
    function image_type_to_mime_type ($imagetype)
    {
        static $image_type_to_mime_type = array (
            IMAGETYPE_GIF        => 'image/gif',
            IMAGETYPE_JPEG       => 'image/jpeg',
            IMAGETYPE_PNG        => 'image/png',
            IMAGETYPE_SWF        => 'application/x-shockwave-flash',
            IMAGETYPE_PSD        => 'image/psd',
            IMAGETYPE_BMP        => 'image/bmp',
            IMAGETYPE_TIFF_II    => 'image/tiff',
            IMAGETYPE_TIFF_MM    => 'image/tiff',
            IMAGETYPE_JPC        => 'application/octet-stream',
            IMAGETYPE_JP2        => 'image/jp2',
            IMAGETYPE_JPX        => 'application/octet-stream',
            IMAGETYPE_JB2        => 'application/octet-stream',
            IMAGETYPE_SWC        => 'application/x-shockwave-flash',
            IMAGETYPE_IFF        => 'image/iff',
            IMAGETYPE_WBMP       => 'image/vnd.wap.wbmp',
            IMAGETYPE_XBM        => 'image/xbm',
        );

        return (isset($image_type_to_mime_type[$imagetype]) ?
            $image_type_to_mime_type[$imagetype] :
            $image_type_to_mime_type[IMAGETYPE_JPC]);
    }
}

?>