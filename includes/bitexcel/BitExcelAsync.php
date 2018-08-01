<?php
/**
 * @version $Header:$
 *
 * Copyright (c) 2006 bitweaver.org
 * All Rights Reserved. See below for details and a complete list of authors.
 * Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See http://www.gnu.org/copyleft/lesser.html for details
 *
 * @package bitexcel
 */

/**
 * required setup
 */
require_once( UTIL_PKG_INC.'PHPAsync.php' );

require_once( UTIL_PKG_INC.'bitexcel/BitExcel.php' );

/**
 * @package bitexcel
 */
class BitExcelAsync extends BitExcel{

	private $mAsync;

	public function __construct( $pConfig=array() ){
		parent::__construct( $pConfig );
	}

	public function writeWorkbookAsync( $pParamHash ){
		$config = array( 
			'append_log' => TRUE,
			'memory_limit' => '256M',
		);
		$this->mAsync = new PHPAsync( NULL, $config );
		$this->mAsync->runProcess( $this, 'writeWorkbook', $pParamHash, 'getUpdateInitOutput' ); 
	}

	public function writeWorkbook( $pParamHash ){
		if( $rslt = parent::writeWorkbook( $pParamHash ) ){
			// notify async
			$this->mAsync->updateStatus( $rslt );
		}else{
			$this->mAsync->updateStatus( 'There was a problem' );
		}
	}

	public function getUpdateInitOutput(){
		return tra( "Generating Export File... please be patient" );
	}	

	public function getUpdateStatus( $pPidId ){
		$this->mAsync = new PHPAsync( $pPidId );
		if( $status = $this->mAsync->getStatus() ){
			return $status;
		}
		return 'Error: '.$this->mAsync->getErrorValue('get_status'); 
	}
}
