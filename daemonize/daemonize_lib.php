<?php

function daemonize_init( $pPidfile ) {
	global $gDaemonTouchTimer;
	// Log our PID as the first thing, so other processes don't try to kill us.
	echo "writing pidfile $pPidfile\n";
	if( !$fp = fopen($pPidfile, "w") ) {
		die( "could not open pid file: $pPidfile\n\n" );
	}
	fwrite($fp, posix_getpid()."\n".time()."\n");
	fclose($fp);
	$gDaemonTouchTimer = 0; // Timer so we only touch the pidfile sometimes. 
}

function daemonize_refresh() {
  if ($gDaemonTouchTimer + 15 < time()) { // So the revivifier can tell we've hung.
    echo "Touching the file $pidfile to ".time()." - ".date("r")."\n";
    $fp = fopen($pidfile, "w");
    fwrite($fp, posix_getpid()."\n".time()."\n");
    fclose($fp);
    $gDaemonTouchTimer = time();
  } 
}
