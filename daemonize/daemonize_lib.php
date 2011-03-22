<?php

function daemonize_init( $pPidfile ) {
	global $gDaemonTouchTimer;
	// Log our PID as the first thing, so other processes don't try to kill us.
	echo "DAEMON ".getmypid()." : writing pidfile $pPidfile\n";
	if( !$fp = fopen($pPidfile, "w") ) {
		die( "could not open pid file: $pPidfile\n\n" );
	}
	fwrite($fp, posix_getpid()."\n".time()."\n");
	fclose($fp);
	$gDaemonTouchTimer = 0; // Timer so we only touch the pidfile sometimes. 
}

function daemonize_refresh( $pPidfile ) {
	global $gDaemonTouchTimer;
	static $ticks = 0;
	if ($gDaemonTouchTimer + 15 < time()) { // So the revivifier can tell we've hung.
		if( ($ticks % 10) == 0 ) {
			// keep the noise down and only log a message once per minute
			echo date( 'd/M/Y:H:i:s O' )." - DAEMON ".getmypid()." : Touching the file $pPidfile to ".time()."\n";
		}
		if( $fp = fopen($pPidfile, "w") ) {
			fwrite($fp, posix_getpid()."\n".time()."\n");
			fclose($fp);
			$gDaemonTouchTimer = time();
		} else {
			die( "could not touch pid file: $pPidfile\n\n" );
		}
		$ticks++;
	} 
}
