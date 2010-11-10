/* form placeholder setup - dependence jquery 1.4.2 */
var $jq = jQuery.noConflict();
BitBase.clearPlaceholders = function(e){
    $jq('input[placeholder]')
		.attr('value', function(index,attr){
			return (attr === $jq(this).attr('placeholder')?'':attr);
		});
}

BitBase.setPlaceholders = function(){
    $jq('input[placeholder]')
		.bind('focus', function(e){
			$jq(this).attr('value', function(index,attr){ 
			return (attr === $jq(this).attr('placeholder')?'':attr) });
        })
		.bind('blur', function(e){
			$jq(this).attr('value', function(index,attr){ return (attr === ''?$jq(this).attr('placeholder'):attr) });
		})
		.attr('value', function(index,attr){ return (attr === ''?$jq(this).attr('placeholder'):attr); });
}

$jq(function(){
    BitBase.setPlaceholders();
    $jq('form').bind('submit', BitBase.clearPlaceholders);
});
