<?php
/**

 Usage
 
 $yourObject = new YourClass();
 $yourObject->asyncProcess = new PHPAsync();
 $async->runProcess(
     $yourObject,
     'doSomeWork',
     'getBufferContent',
     'getLogHtml',
 );

 in YourClass::doSomeWork send notifications to the async log like so
 
 $this->asyncProcess->updateStatus( <percentage_complete> );  a numeric value, do not include "%"
 *
 * @package kernel
 */

/**
 * Setup
 */
require_once( UTIL_PKG_INC.'phpcontrib_lib.php' );

// written for bitweaver environment, but you can override 
if( !defined( 'PHPASYNC_TEMP_DIR' ) ){
	define( 'PHPASYNC_TEMP_DIR', TEMP_PKG_PATH.'phpasync' );
}

/**
 * @package kernel
 */
class PHPAsync extends BitBase{
	private $mPid;

	private $mLogFile;

	private $mUpdateLogHandler;

	private $mFileHandle;

	private $mStatus; // pct complete

	// default config
	public $mConfig = array();

	// constructor
	public function __construct( $pPidId = NULL, $pConfig = array() ){
		if( !empty( $pPidId ) ){
			// set id
			$this->mPid = $pPidId;

			// log file path
			$this->mLogFile = PHPASYNC_TEMP_DIR.'/'.$this->mPid; 
		}

		// set default config values
		$this->mConfig = array(
			'append_log' => FALSE,
			'max_execution_time' => "1200",
			'memory_limit' => '128M', 
			'no-gzip' => 1,
			'zlib.output_compression' => 0,
			'ignore_user_abort' => FALSE,
			);

		// override default config
		if( !empty( $pConfig ) ){
			extract_to( $pConfig, $this->mConfig, EXTR_IF_EXISTS );
		}

		parent::__construct();
	}

	// runProcess
	/**
	 * wraps a class instance method as a async process
	 * @param $pObject - The object instance whose process is being wrapped
	 * @param $pProcessHandler - The process being wrapped to run in the background
	 * @param $pOutputHandler - The output handler is invoked to get whatever page content should be returned to the user before the background process begins
	 * @param $pUpdateLogHandler - The update log handler is invoked when updateStatus is called by the wrapped process. the object can push customize content into the log by defining this callback
	 */
	public function runProcess( $pObject, $pProcessHandler, $pProcessHash = NULL, $pOutputHandler, $pUpdateLogHandler = NULL ){
		global $gBitSystem, $gBitSmarty;

		// create file tracking id
		$this->mLogFile = $this->genLogFile();

		$this->mPid = substr( $this->mLogFile, strlen(PHPASYNC_TEMP_DIR.'/') );

		$this->mProcessObject = $pObject;

		// register log callback
		if( !empty( $pUpdateLogHandler ) ){
			$this->mUpdateLogHandler = $pUpdateLogHandler;
		}

		// override some apache settings that might screw up flushing the buffer
		@apache_setenv('no-gzip', $this->getConfig('no-gzip') );
		@ini_set('zlib.output_compression', $this->getConfig('zlib.output_compression') );

		// set time and memory
		ini_set('max_execution_time', $this->getConfig('max_execution_time') ); 
		ini_set('memory_limit', $this->getConfig('memory_limit') );

		// allow disallow process abort
		ignore_user_abort( $this->getConfig('ignore_user_abort') );

		// create the file for writing
		$this->mFileHandle = fopen($this->mLogFile, 'wrx+');
		if (! $this->mFileHandle){
			$gBitSystem->fatalError( "Error in PHPAsync: could not create log file - process aborted. Please notify your website developer." );
		}

		// convenience make the pid available to smarty as most output handlers will want access to it
		$gBitSmarty->assign( 'pid', $this->mPid );

		// output Buffered content
		$this->outputBuffer( $pObject->$pOutputHandler() );

		// run the background process
		$pObject->$pProcessHandler( $pProcessHash );

		// clean up
		sleep(20);	// number of seconds the temp file should remain available for status check before it is deleted

		fclose($this->mFileHandle);

		// delete the progress file
		unlink($this->mLogFile);
		
		//return true if completed
		return true;
	}

	/**
	 * this is our output buffer
	 * send it anything and it will 
	 * send it to the browser
	 */
	public function outputBuffer( $pContent ){
		ob_start(); 

		echo( $pContent );
		
		$size = ob_get_length();
		header("Content-Length: $size");
		header('Connection: close');

		ob_end_flush();
		// ob_flush(); -- worked fine in preliminary test and was suggested by web sample, but causes warning here
		flush();
		session_write_close();
	}

	/**
	 * notifies our running process 
	 * of the percentage of a task completed
	 */
	public function updateStatus( $pPct, $pLogText = NULL ){
		global $gBitSystem;

		// crap - hack to store pct and msg - no other way to know without storing this info in table or session or something
		$logText = !empty( $pLogText )?$pPct.":".$pLogText:$pPct;

		if( (int)$pPct >= 100 ){
			$this->mStatus = 100;
		}else{
			$this->mStatus = $pPct;
		}

		// if a custom log message handler is registered get the log message from it 
		if( $func = $this->mUpdateLogHandler ){
			$this->mProcessObject->$func( $pPct );
		}
		// rewind to the beginning of the log file if append is false
		if( $this->getConfig( 'append_log' ) == FALSE ){
			rewind( $this->mFileHandle ); 
			ftruncate( $this->mFileHandle, 0 ); //filesize($this->mLogFile));
		}
		// update the log file
		if( fwrite( $this->mFileHandle, $logText ) == false ){ 
            $gBitSystem->fatalError( "Error in PHPAsync: Write to log file failed - process aborted. " . error_get_last() );
            exit;
        }
	}

	/**
	 * Retrieves the content of the log file. To be used by request checking on the status of the process
	 */
	public function getStatus(){ 
		if ( file_exists( $this->mLogFile ) ){
			if(! $progress = file_get_contents($this->mLogFile)){
				header('HTTP/1.1 500 Internal Server Error');
				exit;
			}
			// crap = hack to get pct and msg - see related hack in updateStatus
			$delimpos = strpos( $progress, ':' );
			$pct = substr( $progress, 0, $delimpos ); 
			$log = substr( $progress, $delimpos+1 ); 
			return array( 'pct_complete' => $pct, 'log' => $log );
		}else{
			$this->setError( 'get_status', 'log file not found' );
			return FALSE;
		}
	}

	public function getPidId(){
		if( !empty( $this->mPid ) ){
			return $this->mPid;
		}
		return NULL;
	}

	private function genLogFile(){
        if( !is_dir( PHPASYNC_TEMP_DIR )) {
            mkdir_p( PHPASYNC_TEMP_DIR );
        }
		return tempnam( PHPASYNC_TEMP_DIR, '');
	}

	private function setLogFile(){
		if( !empty( $this->mPid ) ){
			$this->mLogFile = PHPASYNC_TEMP_DIR.'/'.$this->mPid; 
		}
	}

	private function getConfig( $pKey ){
		if( isset( $this->mConfig[$pKey] ) ){
			return $this->mConfig[$pKey]; 
		}
		return NULL;
	}
}
