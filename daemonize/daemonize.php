<?php
/* This script daemonizes a PHP CLI script.

Based on code from Dewi Morgan, http://www.thudgame.com/node/254
Modified by bitweaver.org - spider@viovio.com, et al

This code is explicitly released onto the public domain by myself,
Dewi Morgan, the author. As such, it is not subject to copyright.
You may do with it as you will. Credit, while appreciated, need not
be given. This notice does not need to be included.

Call from cron every minute as:
* * * * * /path/to/bin/php /path/to/script/daemonize.php /path/to/script/daemon.php 2>&1 >> /path/to/logfile
Could be trivially modified to take the script and other globals
as arguments. But that seems a  bit pointless to me.
*/

function usage_die( $pError ) {
	die( "ERROR: $pError\nUsage: /path/to/bin/php /path/to/script/daemonize.php /path/to/script/daemon.php [--debug] [--nohup] [--pidfile=/path/to/lock/daemon.pid]\n\n" );
}

$PHP = $_SERVER['_']; # Remember to change the #! line above, too.
if( empty( $argv[1] ) || !file_exists( $argv[1] ) ) {
	usage_die( 'daemon script not found' );	
}
$daemonScript = $argv[1];

$debug = FALSE;
if( !empty( $argv[2] ) ) {
	// convert any remaining arguments into local variables
	for( $i=2; $i < count( $argv ); $i++ ) {
		$arg = preg_replace( '/^[-]*/', '', $argv[$i] ); 
		@list( $name, $val ) = @split( '=', $arg );
		${$name} = (!empty( $val ) ? $val : TRUE);
	}
}


if( empty( $pidfile ) ) {
	$pidfile = '/var/lock/php-' . basename( $daemonScript,'.php' ).'.pid';
}

# Must contain any of nohup, perl, daemonise.pl, is_up.php and this script
# That you intend to use.
# Get the following values from "kill -l" or /usr/include/linux/signal.h
# Should be correct for most unixes.
$SIGTERM = 15;
$SIGKILL = 9;

# If we've self-bootstrapped, then load the bot and run with it.
if ( !empty( $nohup ) ) {
  to_log("arg detected, bootstrapping daemon through require.");
  require( $daemonScript );
  to_log("killing daemon child.");
  exit(0);
}

# If we're already started, then don't bother running.
if( empty( $nohup ) ) {
  $test = 0;
  $lines = array(0, 0);
  $pid_data = "unread";

  #to_log("Testing for pre-existing... $pidfile"); # Can get spammy.
  if (file_exists($pidfile)) {
    $pid_data = file_get_contents($pidfile);
    $lines = explode("\n", $pid_data);
    if (!empty($lines[0]) && is_numeric($lines[0]) && !empty($lines[1]) && is_numeric($lines[1])) {
      # Kill hung processes.
      if ($lines[1] + 300 < time()) { // If it's an OLD pidfile...
        to_log("$pidfile OLD pidfile found from $lines[1] - ".date('d/M/Y:H:i:s O',$lines[1]).": $pid_data");
        zero_file($pidfile);

        # If found, kill. If it won't die, kill it harder. Then give up.
        # In practice, it can take a bit longer than 20 seconds to die, but it
        # tries again in a minute's time, and works.
        if (is_alive($lines[0])) {
          to_log("killing and waiting a few secs...");
          posix_kill($lines[0], $SIGTERM);
          # Loop for 10 seconds, or until it dies.
          for ($i=0; $i<20 && is_alive($lines[0]); $i++) {
            sleep(1);
            if ($i == 10) { # After ten seconds, kill it harder.
              to_log("Failed to kill it. Killing it harder!");
              posix_kill($lines[0], $SIGKILL);
            }
          }
          if (is_alive($lines[0])) {
            to_log("Failed to kill it. Giving up.");
            exit(0);
          }
        }
      } else {
        #to_log("Young pidfile found.");  # Can get spammy.
      }
      if (is_alive($lines[0])) {
		to_log( "DAEMON $lines[0] : $daemonScript running. Last seen at ".date('d/M/Y:H:i:s O', $lines[1] ) );
        exit(0);
      } else {
        to_log("$pidfile pidfile $lines[0] found, but process is dead.");
      }
    }
    else {
      to_log("$pidfile Bad format pidfile found, zeroing, restarting...");
      zero_file($pidfile);
    }
  }
  else {
    to_log("pidfile not found: $pidfile");
  }
  to_log("NOT found running.");
}

# If pcntl_fork() doesn't exist, we need to load ourselves in the background, then die.
if (!function_exists("pcntl_fork")) {
  to_log("no pcntl, calling self with nohup and param");
  system("nohup $PHP $argv[1] -nohup &", $return);
  if ($return == 0) { exit(0); }
  # If there was a problem, we have one more ace in the hole - perl!
  to_log("nohup failed with return $return, calling self with perl");
  system("perl ".dirname( $argv[0] )."daemonize.pl &", $return);
  to_log("killing daemon parent with return $return");
  exit(0);
}

# If we've got the right functions to play with, all the above becomes moot.
to_log("we have pcntl! Doing it all ourselves!");

# Replace file handles
$fh_unused = array(STDIN, STDOUT);

ob_implicit_flush();

# Daemon Rule 1) Fork and exit the parent.
$pid = pcntl_fork();
if ($pid == -1) {
  die("could not fork");
}
else if ($pid) {
  exit();  # Kill the parent
}

# Daemon Rule 2) become session leader, pg leader, no term
$session_id = posix_setsid();
if (!$session_id) {
  die("Could not detach from terminal.");
}

# Daemon Rule 3) cd to /
if (!chdir('/')) { die("Could not cd to rootfs"); }

# Daemon Rule 4) set file creation mask to 0
$oldmask = umask(00);

# Daemon Rule 5) Close unneeded file handles
foreach ($fh_unused as $fh) {
  if (!fclose($fh)) { die("Unable to close $fh"); }
}

# Daemon Rule 6) Set up signal handlers where necessary.
pcntl_signal(SIGTERM, "sig_handler");
pcntl_signal(SIGHUP, "sig_handler");


function sig_handler($signo) {
  switch ($signo) {
    case SIGTERM:
      # handle shutdown tasks
      die("Caught thud SIGTERM");
      break;
    case SIGHUP:
      # handle restart tasks
      die("Caught thud SIGHUP");
      break;
    default:
      # handle all other signals
  }
}

# Meat of the daemon goes here.
to_log("requiring $daemonScript");
chdir( dirname( $daemonScript ) );
require_once( $daemonScript );

exit(0);


# Access functions.
function is_alive($pid) {
	$output = array();
	exec( dirname( __FILE__ )."/is_up.sh $pid", $output );
	$result = $output[0];
	return (0 < $result);
}

function to_log($string) {
	error_log( date( 'd/M/Y:H:i:s O' )." - $string");
}

function zero_file($pidfile) {
  $fp = fopen($pidfile, "w");
  fwrite($fp, ""); # Zero the pidfile.
  fclose($fp);
}
?>
