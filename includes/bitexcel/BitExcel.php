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
$php_excel_loaded = FALSE;
if (@include_once("PEAR.php")) {		
	ini_set('include_path', ini_get('include_path').':/usr/share/pear/PHPExcel/');
	if( @include_once("PHPExcel.php") )
		if( @include_once("PHPExcel/Writer/Excel2007.php") )
			$php_excel_loaded = TRUE;
}
if( !$php_excel_loaded ){
	require_once( EXTERNALS_PKG_PATH.'phpexcel/Classes/PHPExcel.php');
	require_once( EXTERNALS_PKG_PATH.'phpexcel/Classes/PHPExcel/Writer/Excel2007.php');
}

require_once( UTIL_PKG_INC.'phpcontrib_lib.php' );

require_once( LIBERTY_PKG_PATH . 'LibertyValidator.php' );

define( 'EXCEL_TEMP_PATH', TEMP_PKG_PATH.'excel/' );
define( 'EXCEL_TEMP_URL', TEMP_PKG_URL.'excel/' );

/**
 * @package bitexcel
 */
class BitExcel extends BitBase{

	private $mPHPExcel;

	private $mConfig;

	public function __construct( $pConfig=array() ){

		// set default config values
		$this->mConfig = array(
			'cache_method' => 'cache_in_memory',
			'auto_name_doc' => TRUE,
			'auto_sanitize_doc_name' => TRUE,
			);

		// override default config
		if( !empty( $pConfig ) ){
			extract_to( $pConfig, $this->mConfig, EXTR_IF_EXISTS );
		}

	}

	private function configExcel( $pParamHash ){
		// config PHPExcel

		// cache method
		switch( $this->getConfig( 'cache_method' ) ){
		case 'cache_to_discISAM':
			$cacheMethod = PHPExcel_CachedObjectStorageFactory::cache_to_discISAM;
			break;
		case 'cache_in_memory_serialized':
			$cacheMethod = PHPExcel_CachedObjectStorageFactory::cache_in_memory_serialized;
			break;
		case 'cache_in_memory':
		default:
			$cacheMethod = PHPExcel_CachedObjectStorageFactory::cache_in_memory;
			break;
		}
		PHPExcel_Settings::setCacheStorageMethod($cacheMethod);

		// create excel object
		if( !isset( $this->mPHPExcel ) ){
			$this->mPHPExcel = new PHPExcel();
		}

		// set doc properties
		$this->mPHPExcel->getProperties()->setTitle( $pParamHash['workbook']['title'] );
		// $this->mPHPExcel->getProperties()->setCreator("Maarten Balliauw");
		// $this->mPHPExcel->getProperties()->setLastModifiedBy("Maarten Balliauw");
		// $this->mPHPExcel->getProperties()->setSubject("Office 2007 XLSX Test Document");
		// $this->mPHPExcel->getProperties()->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.");
	}

	/**
	 * write Excel 2007 file
	 */
	public function writeWorkbook( $pParamHash ){
		if( $this->verifyWorkbook( $pParamHash ) ){
			// init the excel object
			$this->configExcel( $pParamHash );

			if( !is_dir( EXCEL_TEMP_PATH ) ){
				mkdir_p( EXCEL_TEMP_PATH );
			}

			/*
	 			$pParamHash['workbook'] = array(
					'title' => 								// document title used inside the document
					'doc_name' =>							// document doc name
					'worksheets' => array(  
						array(								// worksheet
							'title' => 'foo',				// worksheet title
							'rows' => array( 
								array( 						// row 
									<col> => <val>,		
									<col> => array( <val>, <val>, <val> ),
									<col> => array( <val>, array() ),
								),	
								array( ... ),
								array( ... ),
								)
							)
						),
						array( ... )						// worksheet
					)
				)

			*/

			// prep doc name
			// auto gen doc name
			if( $this->getConfig( 'auto_name_doc' ) ){ 
				$docName = "somedocName";
			// defined doc name
			}else{
				// get doc name from 
				$docName = $pParamHash['workbook']['doc_name'];
				// sanitize name
				if( $this->getConfig( 'auto_sanitize_doc_name' ) ){
					// replace white spaces
					$docName = str_replace( ' ', '-', $docName );
					// strip nasty chars
					$docName = preg_replace( '/[&$\?\*\%:\/\\\]/', '', $docName );
				}
			}

			// validate filename - we validate in all cases to be certain
			// a little hack so we can use validator
			$dataHash = array();
			$array1 = array( 'filename' => array( 'excel_file_name' => array(), ), );
			$array2 = array( 'excel_file_name' => $docName );
			LibertyValidator::validate(
				$array1,
				$array2,
				$this, 
				$dataHash
			);

			// construct the workbook
			if( count( $this->getErrors() ) == 0 ){
				foreach( $pParamHash['workbook']['worksheets'] as $index=>$worksheetData ){
					// first sheet is automatically generated, for all others create it
					if( $index > 0 ){
						// create sheet
						$index = $this->mPHPExcel->getIndex( $this->mPHPExcel->createSheet() );
					}
					$this->initWorksheet( $index, $worksheetData );
					$this->updateWorksheet( $index, $worksheetData );
				}

			}

			// no errors then write the doc 
			if( count( $this->getErrors() ) == 0 ){
				$fullDocName = $docName.'.xlsx';
				$xlsxFile = EXCEL_TEMP_PATH.$fullDocName;
				// echo date('H:i:s') . " Write to Excel2007 format\n";
				$objWriter = new PHPExcel_Writer_Excel2007( $this->mPHPExcel );
				$objWriter->save( $xlsxFile );
				// return the doc reference
				return $xlsxFile;
			}

			// default fail
			return FALSE;
		}
	}

	/**
	 * updateWorkbook
	 * adds data to an existing workbook
	 * @param pFileName 			- name of the workbook (without the extension)
	 * @param pParamHash['title']	- name of the worksheet to insert data into 
	 * @param pParamHash['rows']	- data to insert
	 * @return bool
	 */
	public function updateWorkbook( $pFileName, $pParamHash ){
		$xlsxFile = EXCEL_TEMP_PATH.$pFileName.".xlsx";
		if( !empty( $pParamHash['title'] ) && !empty( $pParamHash['rows'] ) ){
			if( file_exists( $xlsxFile ) ){
				require_once( EXTERNALS_PKG_PATH.'phpexcel/Classes/PHPExcel/IOFactory.php' );
				if( $this->mPHPExcel = PHPExcel_IOFactory::load( $xlsxFile ) ){
					// @TODO support adding any new sheet - for now we assume top level data has an existing sheet
					$index = $this->mPHPExcel->getIndex( $this->mPHPExcel->getSheetByName( $pParmaHash['title'] ) );
					$this->updateWorksheet( $index, $pParamHash );
					// return file path
					return $xlsxFile;
				}else{
					$this->setError( 'workbook', 'The workbook document failed to load' );
				}
			}else{
				$this->setError( 'workbook', 'The workbook document could not be found' );
			}
		}else{
			$this->setError( 'worksheet', 'No title or rows data provided' );
		}
		return FALSE;
	}

	public function saveWorkbook(){
		$xlsxFile = EXCEL_TEMP_PATH.$docName.'.xlsx';
		// echo date('H:i:s') . " Write to Excel2007 format\n";
		$objWriter = new PHPExcel_Writer_Excel2007( $this->mPHPExcel );
		$objWriter->save( $xlsxFile );
		// return the doc reference
		return $xlsxFile;
	}

	private function verifyWorkbook( $pParamHash ){
		if( empty( $pParamHash['workbook'] ) ){
			$this->setError( 'workbook', 'No workbook data provided' );
		}
		if( empty( $pParamHash['workbook']['title'] ) ){
			$this->setError( 'workbook', 'No workbook title provided' );
		}
		if( !$this->getConfig('auto_name_doc') && empty( $pParamHash['workbook']['doc_name'] ) ){
			$this->setError( 'workbook', 'No document name provided' );
		}

		// @TODO verify each worksheet has a title and rows

		return ( count($this->getErrors() ) == 0);
	}

	private function initWorksheet( $pIndex, $pParamHash ){
		$this->mPHPExcel->setActiveSheetIndex($pIndex);

		// create title
		// sanitize sheet titles
		$sheetTitle = preg_replace( '/[\[\]\?\*:\/\\\]/', '', $pParamHash['title'] );
		$this->mPHPExcel->getActiveSheet()->setTitle( $sheetTitle );

		// create column headers from first row of data
		$headings = array_keys( ( is_array( current( $pParamHash['rows'] ) )?current($pParamHash['rows']):$pParamHash['rows'] ) );

		// naturally in excel rows start at 1 
		$row = 1;
		$this->insertWorksheetRow( $pIndex, $headings, $row );
	}

	private function updateWorksheet( $pIndex, $pParamHash ){
		$this->mPHPExcel->setActiveSheetIndex($pIndex);

		// get next available row
		$row = $this->mPHPExcel->getActiveSheet()->getHighestRow();;
		$row++;

		// fill in rows
		foreach( $pParamHash['rows'] as $rowData ){
			// reset the col and val
			$col = 0;
			$val = NULL;
			// write row
			$this->insertWorksheetRow( $pIndex, $rowData, $row );
			$row++;
		}
	}

	/** 
	 * inserts a row into the active worksheet
	 * be sure you have set the active worksheet to the one you 
	 * want to insert into
	 */
	private function insertWorksheetRow( $pIndex, $pParamHash, $pRow=NULL ){
		$this->mPHPExcel->setActiveSheetIndex($pIndex);

		$row = $pRow;
		// undefined row get row autoamtically
		if( is_null( $pRow ) ){
			if( $row = $this->mPHPExcel->getActiveSheet()->getHighestRow() ){
				$row++;
			}else{
				// default first row
				$row = 1;
			}
		}
		// insert the data hash
		// key of hash can not always be trusted to be numeric so manage col value
		$col = 0;
		foreach( $pParamHash as $key=>$val ){
			// string insert into cel
			if( is_numeric( $val ) || is_string( $val ) || $val == '' ){
				$this->mPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($col, $row, $val);
			// array add to worksheet
			}elseif( is_array( $val ) ){

				$hasArrays = array_map( 'is_array', $val );
				$isNumeric = array_map( 'is_numeric', array_keys( $val ) );

				// array values contain arrays or the keys are strings
				if( in_array( TRUE, $hasArrays ) || in_array( FALSE, $isNumeric ) ){

					$worksheetData = array( 'title'=>$key,'rows'=>$val );

					// create a worksheet for these values if it doesnt already exist
					$sheets = $this->mPHPExcel->getSheetNames();
					// if keys are numeric proceed with filling out sheet
					if( !in_array( $key, $sheets ) ){
						$index = $this->mPHPExcel->getIndex( $this->mPHPExcel->createSheet() ); 
						$this->initWorksheet( $index, $worksheetData );
					// get the existing worksheet;
					}else{	
						$index = $this->mPHPExcel->getIndex( $this->mPHPExcel->getSheetByName($key) );
					}

					// entried nested in an array we update
					if( in_array( TRUE, $hasArrays ) ) {
						$this->mPHPExcel->setActiveSheetIndex($index);
						$remoteRow1 = $this->mPHPExcel->getActiveSheet()->getHighestRow() + 1;
						$this->updateWorksheet( $index, $worksheetData );
						$remoteRow = $this->mPHPExcel->getActiveSheet()->getHighestRow(); // last row inserted
						$remoteRowLink = "A".$remoteRow;
						if( $remoteRow1 != $remoteRow ){
							$remoteRowLink = "A".$remoteRow1.':A'.$remoteRow;
							$remoteRow = $remoteRow1.':'.$remoteRow;
						}
					// single entry we insert
					}else{
						$this->insertWorksheetRow( $index, $val );
						$remoteRow = $this->mPHPExcel->getActiveSheet()->getHighestRow(); // last row inserted
						$remoteRowLink = "A".$remoteRow;
					}

					// the active sheet was switched so switch back
					$this->mPHPExcel->setActiveSheetIndex($pIndex);
					$this->mPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($col, $row, tra('See sheet:').$key.' '.tra('row').$remoteRow );
					// create a link to the related sheet
					$sheetLink = "sheet://'".$key."'!".$remoteRowLink;
					$this->mPHPExcel->getActiveSheet()->getCellByColumnAndRow($col, $row)->getHyperlink()->setUrl($sheetLink);
					$this->mPHPExcel->getActiveSheet()->getCellByColumnAndRow($col, $row)->getHyperlink()->setTooltip(tra('Click for details'));
				}else{
				// array does not contain arrays and keys are numeric 
					$val2 = implode( ',', $val ); 
					$this->mPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($col, $row, $val2);
				}
			}
			$col++;
		}
	}

	private function getConfig( $pKey ){
		if( isset( $this->mConfig[$pKey] ) ){
			return $this->mConfig[$pKey]; 
		}
		return NULL;
	}

}

