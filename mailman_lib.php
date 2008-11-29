<?php
// $Header: /cvsroot/bitweaver/_bit_util/mailman_lib.php,v 1.5 2008/11/29 17:55:08 tekimaki_admin Exp $
// Copyright (c) bitweaver Group
// All Rights Reserved.
// Licensed under the GNU LESSER GENERAL PUBLIC LICENSE. See license.txt for details.

/**
* mailman lib 
* library of functions to manipulate mailman lists
*
* @date created 2008-APR-06
* @author wjames <will@tekimaki.com> spider <spider@viovio.com>
*/

function mailman_verify_list( $pListName ) {
	$error = NULL;
	if( $matches = preg_match( '/[^A-Za-z0-9]/', $pListName ) ) {
		$error = tra( 'Invalid mailing list name' ).': '.tra( 'List names can only contain letters and numbers' );
	} else {
		$lists = mailman_list_lists();
		if( !empty( $lists[strtolower($pListName)] ) ) {
			$error = tra( 'Invalid mailing list name' ).': '.tra( 'List already exists' );
		}
	}
	return $error;
}

function mailman_list_lists() {
	$ret = array();
	if( $ret_code = mailman_command( 'list_lists', $output) ) {
		mailman_fatal(tra('Unable to list lists.'), $ret_code);
	}
	else {
		foreach( $output as $o ) {
			if( strpos( $o, '-' ) ) {
				list( $name, $desc ) = split( '-', $o );
				$ret[strtolower( trim( $name ) )] = trim( $desc );
			}
		}
	}
	return( $ret );
}


function mailman_list_members( $pListName ) {
	$ret = array();
	$options = escapeshellarg( $pListName );
	if( $ret = mailman_command( 'list_members', $output, $options ) ) {
	  //		mailman_fatal(tra('Unable to get members for list: ').$pListName, $ret);
	}
	return( $output );
}


// pParamHash follows naming convention off newlist --help usage instructions
function mailman_newlist( $pParamHash ) {
	$error = NULL;
	if( !($error = mailman_verify_list( $pParamHash['listname'] )) ) {
		$options = ' -q '.escapeshellarg( $pParamHash['listname'] );
		$options .= ' '.escapeshellarg( $pParamHash['listadmin-addr'] ).' ';
		$options .= ' '.escapeshellarg( $pParamHash['admin-password'] ).' ';
		
		if( $ret = mailman_command( 'newlist', $output, $options ) ) {
			mailman_fatal(tra('Unable to create list: ').$pParamHash['listname'], $ret);
		}

		$options = ' -i '.escapeshellarg(UTIL_PKG_PATH.'mailman.cfg');
		$options .= ' '.escapeshellarg( $pParamHash['listname'] );
		if( $ret = mailman_command( 'config_list', $output, $options) ) {
			mailman_fatal(tra('Unable to configure list: ').$pParamHash['listname'], $ret);
		}

		$newList = $pParamHash['listname'];
		$mailman = mailman_get_mailman_command();
		$newAliases = "
## $newList mailing list
$newList:              \"|$mailman post $newList\"
$newList-admin:        \"|$mailman admin $newList\"
$newList-bounces:      \"|$mailman bounces $newList\"
$newList-confirm:      \"|$mailman confirm $newList\"
$newList-join:         \"|$mailman join $newList\"
$newList-leave:        \"|$mailman leave $newList\"
$newList-owner:        \"|$mailman owner $newList\"
$newList-request:      \"|$mailman request $newList\"
$newList-subscribe:    \"|$mailman subscribe $newList\"
$newList-unsubscribe:  \"|$mailman unsubscribe $newList\"";

		// Make sure we unlock the semaphore
		ignore_user_abort(true);
		// Get a lock. flock is not reliable (NFS, FAT, etc)
		// so we use a semaphore instead.
		$sem_key = ftok(mailman_get_aliases_file(), 'm');
		if( $sem_key != -1 ) {
			// Get the semaphore
			$sem = sem_get($sem_key);
			if( $sem ) {
				if( sem_acquire($sem) ) {
					if( $fh = fopen( mailman_get_aliases_file(), 'a' ) ) {
						fwrite( $fh, $newAliases );
						fclose( $fh );
						mailman_newalias();
					} else {
						$error = "Could not open /etc/aliases for appending.";
					}
					if( !sem_release($sem) ) {
						$error = "Error releasing a sempahore.";
					}
				} else {
					$error = "Unable to aquire a semaphore.";
				}
			} else {
				$error = "Unable to get a semaphore.";
			}
		} else {
			$error = "Couldn't create semaphore key.";
		}
		// Let the user cancel again
		ignore_user_abort(false);
	}
	return $error;
}

function mailman_remove_member( $pListName, $pEmail ) {
	$ret = '';
	if( $fullCommand = mailman_get_command( 'remove_members' ) ) {
		$cmd = "echo ".escapeshellarg( $pEmail )." | $fullCommand  -f - ".escapeshellarg( $pListName );
		exec( $cmd, $ret );
	} else {
		bit_log_error( 'Groups mailman command failed (remove_members) File not found: '.$fullCommand );
	}
}

function mailman_setmoderator( $pListName, $pEmail ) {
	$ret = '';
	if( $fullCommand = mailman_get_command( 'withlist' ) ) {
	  $cmd = $fullCommand." -q -l -r mailman_lib.setMemberModeratedFlag ".escapeshellarg( $pListName )." ".escapeshellarg( $pEmail );
	  $cmd = "/bin/sh -c \"PYTHONPATH=".UTIL_PKG_PATH." $cmd\"";
	  exec( $cmd, $ret );
	} else {
		bit_log_error( 'Groups mailman command failed (withlist) File not found: '.$fullCommand );
	}
	return $ret;
}

function mailman_addmember( $pListName, $pEmail ) {
	$ret = '';
	if( $fullCommand = mailman_get_command( 'add_members' ) ) {
		$cmd = "echo ".escapeshellarg( $pEmail )." | $fullCommand  -r - ".escapeshellarg( $pListName );
		exec( $cmd, $ret );
	} else {
		bit_log_error( 'Groups mailman command failed (add_members) File not found: '.$fullCommand );
	}
}

function mailman_findmember( $pListName, $pEmail ) {
	$options = ' -l '.escapeshellarg( $pListName ).' '.escapeshellarg( $pEmail );
	if( $ret = mailman_command( 'find_member', $output, $options ) ) {
		mailman_fatal(tra('Unable to find member in list: ').$pListName, $ret);
	}
	return $output;
}

function mailman_rmlist( $pListName ) {
	$error = NULL;
	if( mailman_verify_list( $pListName ) ) {
		$options = ' -a '.escapeshellarg( $pListName );
		if( $ret = mailman_command( 'rmlist', $output, $options ) ) {
			mailman_fatal(tra('Unable to remove list: ').$pListName, $ret);
		}

		$newList = $pListName;

		$mailman = mailman_get_mailman_command();

		$aliasesLines = array(
				      "## $newList mailing list",
				      "$newList",
				      "$newList-admin",
				      "$newList-bounces",
				      "$newList-confirm",
				      "$newList-join",
				      "$newList-leave",
				      "$newList-owner",
				      "$newList-request",
				      "$newList-subscribe",
				      "$newList-unsubscribe"
				      );
		// Make sure we unlock the semaphore
		ignore_user_abort(true);
		// Get a lock. flock is not reliable (NFS, FAT, etc)
		// so we use a semaphore instead.
		$sem_key = ftok(mailman_get_aliases_file(), 'm');
		if( $sem_key != -1 ) {
			// Get the semaphore
			$sem = sem_get($sem_key);
			if( $sem ) {
				if( sem_acquire($sem) ) {
					if( $fh = fopen( mailman_get_aliases_file(), 'r+' ) ) {
						// cull out all aliase lines for the mailing list and rewrite the file
						$newContents = '';
						while( $line = fgets( $fh ) ) {
							@list( $alias, $value ) = split( ':', $line );
							$alias = trim( $alias );
							if( !in_array($alias, $aliasesLines) ) {
								$newContents .= $line;
							}
						}

						// Truncate the file
						if( ftruncate($fh, 0) != 1) {
							$error = "Unable to truncate /etc/aliases";
						} else {
							if( !rewind($fh) ) {
								$error = "Unable to seek /etc/aliases";
							}
							else {
								if( empty( $newContents ) ) {
									$error = "Empty aliases for /etc/aliases";
								} elseif( !fwrite( $fh, $newContents ) ) {
									$error = "Could not write new /etc/aliases";
								}
							}
						}

						fclose( $fh );
						mailman_newalias();
					} else {
						$error = "Could not open /etc/aliases for appending.";
					}

					if( !sem_release($sem) ) {
						$error = "Error releasing a sempahore.";
					}
				} else {
					$error = "Unable to aquire a semaphore.";
				}
			} else {
				$error = "Unable to get a semaphore.";
			}
		} else {
			$error = "Couldn't create semaphore key.";
		}
		// Let the user cancel again
		ignore_user_abort(false);
	}
	return $error;
}

function mailman_newalias() {
	global $gBitSystem;
	exec( $gBitSystem->getConfig('server_newaliases_cmd', '/usr/bin/newaliases' ));
}

function mailman_get_aliases_file() {
	global $gBitSystem;
	return $gBitSystem->getConfig('server_aliases_file', '/etc/aliases');
}

function mailman_command( $pCommand, &$output, $pOptions=NULL ) {
	$ret = NULL;
	if( $fullCommand = mailman_get_command( $pCommand ) ) {
		$cmd = $fullCommand.' '.$pOptions;
		if( !defined( 'IS_LIVE' ) || !IS_LIVE ) {
			bit_log_error( 'mailman LOG: '.$cmd );
		}
		exec( $cmd, $output, $ret_code );
		if( $ret_code ) {
			bit_log_error('Error running command: '. $cmd . ' Command returned: '.$ret_code);
		}
	} else {
		bit_log_error( 'Groups mailman command failed ('.$pCommand.'): File not found: '.$fullCommand );
	}
	return $ret_code;
}

function mailman_fatal($pMessage, $pRetCode) {
	global $gBitSystem;
	$gBitSystem->fatalError($pMessage.tra(' Command returned: ').$pRetCode);
	die;
}

function mailman_get_mailman_command() {
	global $gBitSystem;
	$mailman =  $gBitSystem->getConfig( 'server_mailman_cmd', '/usr/lib/mailman/mail/mailman' );
	return $mailman;
}

function mailman_get_command( $pCommand ) {
	global $gBitSystem;
	$ret = NULL;
	// Support for legacy configurations
	$fullCommand = $gBitSystem->getConfig( 'server_mailman_bin' ) .'/'.$pCommand;
	$fullCommand = str_replace( '//', '/', $fullCommand );
	if( file_exists( $fullCommand ) ) {
		$ret = $fullCommand;
	}
	return $ret;
}

?>
