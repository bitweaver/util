{strip}
{if $gBitSystem->isPackageActive('jscalendar') && $gBitSystem->isFeatureActive( 'site_use_jscalendar' )}
	<link rel="stylesheet" title="{$style}" type="text/css" href="{$smarty.const.UTIL_PKG_URL}javascript/dynarch/jscalendar/calendar-system.css" media="all">
	<script async src="{$smarty.const.UTIL_PKG_URL}javascript/dynarch/jscalendar/calendar.js"></script>
	<script async src="{$smarty.const.UTIL_PKG_URL}javascript/dynarch/jscalendar/lang/calendar-en.js"></script>
	<script async src="{$smarty.const.UTIL_PKG_URL}javascript/dynarch/jscalendar/calendar-setup.js"></script>
{/if}
{/strip}
