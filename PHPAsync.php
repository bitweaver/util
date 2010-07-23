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

*/

require_once( UTIL_PKG_PATH.'phpcontrib_lib.php' );

// written for bitweaver environment, but you can override 
if( !defined( 'PHPASYNC_TEMP_DIR' ) ){
	define( 'PHPASYNC_TEMP_DIR', TEMP_PKG_PATH.'phpasync' );
}

class PHPAsync extends BitBase{
	private $mPidId;

	private $mLogFile;

	private $mUpdateLogHandler;

	private $mFileHandle;

	// default config
	private $mConfig = array();

	// constructor
	public function __construct( $pPidId = NULL, $pConfig = array() ){
		if( !empty( $pPidId ) ){
			// set id
			$this->mPidId = $pPidId;

			// log file path
			$this->mLogFile = PHPASYNC_TEMP_DIR.'/'.$this->mPidId; 
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

		parent::BitBase();
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
		global $gBitSystem;

		// create file tracking id
		$this->mLogFile = $this->genLogFile();

		$this->mPidId = substr( $this->mLogFile, strlen(PHPASYNC_TEMP_DIR.'/') );

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

		// output Buffered content
		$this->outputBuffer( $pObject->$pOutputHandler() );

		// run the background process
		$pObject->$pProcessHandler( $pProcessHash );

		// clean up
		sleep(20);	// number of seconds the temp file should remain available for status check before it is deleted

		fclose($this->mFileHandle);

		// delete the progress file
		unlink($this->mLogFile);
	}

	/**
	 * this is our output buffer
	 * send it anything and it will 
	 * send it to the browser
	 */
	public function outputBuffer( $pContent ){
		ob_start(); 

		echo( 'inbuffer<br>' );
		echo( 'pid: '.$this->mPidId.'<br>' );
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
	public function updateStatus( $pPct ){
		global $gBitSystem;

		$logText = $pPct;
		// if a custom log message handler is registered get the log message from it 
		if( $func = $this->mUpdateLogHandler ){
			$this->mProcessObject->$func( $pPct );
		}
		// rewind to the beginning of the log file if append is false
		if( $this->getConfig( 'append_log' ) == FALSE ){
			rewind( $this->mFileHandle ); 
			ftruncate( $this->mFileHandle, filesize($this->mLogFile));
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
			return $progress;
		}else{
			$this->setError( 'get_status', 'log file not found' );
			return FALSE;
		}
	}

	public function getPidId(){
		if( !empty( $this->mPidId ) ){
			return $this->mPidId;
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
		if( !empty( $this->mPidId ) ){
			$this->mLogFile = PHPASYNC_TEMP_DIR.'/'.$this->mPidId; 
		}
	}

	private function getConfig( $pKey ){
		if( isset( $this->mConfig[$pKey] ) ){
			return $this->mConfig[$pKey]; 
		}
		return NULL;
	}
}
