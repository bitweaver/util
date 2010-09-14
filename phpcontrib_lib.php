<?php
// a collection of functions that are very useful
// but not commonly needed.

// extract_to
/**
 * @see http://www.php.net/manual/en/function.extract.php#63234
 * 
 * This function provides exactly the same functionality as extract except 
 * that a parameter was added defining the extract target.
 * This function can be used if your PHP installation does not support the 
 * required Flags or more important if you would like to extract arrays 
 * to another destination as to $GLOBALS, i.e. other arrays or objects.
 * The only difference to extract is that extract_to moves the array pointer 
 * of $arr to the end as $arr is passed by reference to support the EXTR_REFS flag.
 */
function extract_to( &$arr, &$to, $type=EXTR_OVERWRITE, $prefix=false ){
   
	if( !is_array( $arr ) ) return trigger_error("extract_to(): First argument should be an array", E_USER_WARNING );
   
	if( is_array( $to ) ) $t=0;
	else if( is_object( $to ) ) $t=1;
	else return trigger_error("extract_to(): Second argument should be an array or object", E_USER_WARNING );
   
	if( $type==EXTR_PREFIX_SAME || $type==EXTR_PREFIX_ALL || $type==EXTR_PREFIX_INVALID || $type==EXTR_PREFIX_IF_EXISTS )
		if( $prefix===false ) return trigger_error("extract_to(): Prefix expected to be specified", E_USER_WARNING );
		else $prefix .= '_';
   
	$i=0;
	foreach( $arr as $key=>$val ){
	   
		$nkey = $key;
		$isset = $t==0 ? isset( $to[$key] ) : isset( $to->$key );
	   
		if( ( $type==EXTR_SKIP && $isset )
			|| ( $type==EXTR_IF_EXISTS && !$isset ) )
				continue;
	   
		else if( ( $type==EXTR_PREFIX_SAME && $isset )
			|| ( $type==EXTR_PREFIX_ALL )
			|| ( $type==EXTR_PREFIX_INVALID && !preg_match( '#^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$#', $key ) ) )
				$nkey = $prefix.$key;
			   
		else if( $type==EXTR_PREFIX_IF_EXISTS )
			if( $isset ) $nkey = $prefix.$key;
			else continue;

		if( !preg_match( '#^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$#', $nkey ) ) continue;
	   
		if( $t==1 )
			if( $type & EXTR_REFS ) $to->$nkey = &$arr[$key];
			else $to->$nkey = $val;
		else
			if( $type & EXTR_REFS ) $to[$nkey] = &$arr[$key];
			else $to[$nkey] = $val;
	   
		$i++;
	}
   
	return $i;
}

/**
 * array_is_indexed
 * a crud check if an array is an indexed array with the limitation that
 * it works for arrays where every element is as if it had been assigned doing $array[] = $value
 */
function array_is_indexed( $pArray ){
	return (count(array_diff_key($pArray, array_values($pArray))) == 0);
}
