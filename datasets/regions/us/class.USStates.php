<?php
/* USStates is singleton class holding 
 * a list of all USStates
 * usage: $states = USStates::getStates(); 
 */
class USStates {

    private static $uniqueInstance;

    private static $mStates;

    private function __construct(){
        $this->loadStates();
    }

	public static function getDataset(){
        if( !isset( self::$uniqueInstance ) ){
            self::$uniqueInstance = new USStates();
		}
		return self::$uniqueInstance->mStates;
	}

    public function loadStates(){
        if ( empty( $this->mStates ) ) {
			$this->mStates = array(
				"AL" => tra("Alabama"),
				"AK" => tra("Alaska"),
				"AZ" => tra("Arizona"),
				"AR" => tra("Arkansas"),
				"CA" => tra("California"),
				"CO" => tra("Colorado"),
				"CT" => tra("Connecticut"),
				"DE" => tra("Delaware"),
				"DC" => tra("District of Columbia"),
				"FL" => tra("Florida"),
				"GA" => tra("Georgia"),
				"HI" => tra("Hawaii"),
				"ID" => tra("Idaho"),
				"IL" => tra("Illinois"),
				"IN" => tra("Indiana"),
				"IA" => tra("Iowa"),
				"KS" => tra("Kansas"),
				"KY" => tra("Kentucky"),
				"LA" => tra("Louisiana"),
				"ME" => tra("Maine"),
				"MD" => tra("Maryland"),
				"MA" => tra("Massachusetts"),
				"MI" => tra("Michigan"),
				"MN" => tra("Minnesota"),
				"MS" => tra("Mississippi"),
				"MO" => tra("Missouri"),
				"MT" => tra("Montana"),
				"NE" => tra("Nebraska"),
				"NV" => tra("Nevada"),
				"NH" => tra("New Hampshire"),
				"NJ" => tra("New Jersey"),
				"NM" => tra("New Mexico"),
				"NY" => tra("New York"),
				"NC" => tra("North Carolina"),
				"ND" => tra("North Dakota"),
				"OH" => tra("Ohio"),
				"OK" => tra("Oklahoma"),
				"OR" => tra("Oregon"),
				"PA" => tra("Pennsylvania"),
				"PR" => tra("Puerto Rico"),
				"RI" => tra("Rhode Island"),
				"SC" => tra("South Carolina"),
				"SD" => tra("South Dakota"),
				"TN" => tra("Tennessee"),
				"TX" => tra("Texas"),
				"UT" => tra("Utah"),
				"VT" => tra("Vermont"),
				"VA" => tra("Virginia"),
				"WA" => tra("Washington"),
				"WV" => tra("West Virginia"),
				"WI" => tra("Wisconsin"),
				"WY" => tra("Wyoming"),
			);
		}
        return count( $this->mStates );
    }
}
