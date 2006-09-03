#!/bin/bash
echo "This script will update all your custom templates to use the new set of
icons used in bitweaver R2. To run this script please copy it to your theme
directory and execute it with: sh $0"

if [[ ( $1 == '--help' ) || ( $1 == '-h' ) || ( $1 == '?' ) ]]
then
	exit
fi

# Check to see if we've already made a backup
if [ -f theme_backup.tar.gz ]
then
	echo "I have found a css backup file. Please rename or remove the file
theme_backup.tar.gz before executing this script again."
	exit
fi

echo "Creating backup of theme."
tar -czf theme_backup.tar.gz *
echo
echo "The script will continue in 5 seconds - hit <ctrl-c> to abort."
echo 5; sleep 1
echo 4; sleep 1
echo 3; sleep 1
echo 2; sleep 1
echo 1; sleep 1
echo
echo "====== Executing substitutions ======"
echo
echo "------ Doing Biticons Now ------"
echo

# we should make sure that ipackage comes before iname - this is true in bitweaver but who knows in custom templates...
#find . -name "*.tpl" -exec perl -i -wpe 's/{biticon([^}]*?)iname="?(\w+)"?([^}]*?)ipackage="?(\w+)"?/{biticon$1ipackage="$4"$3iname="$2" /g' {} \;

echo substituting liberty biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\baccept"?\s/{biticon$1ipackage="icons"$2iname="dialog-ok" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\badministration"?\s/{biticon$1ipackage="icons"$2iname="preferences-system" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bassign"?\s/{biticon$1ipackage="icons"$2iname="mail-attachment" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bback"?\s/{biticon$1ipackage="icons"$2iname="go-previous" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bbithelp"?\s/{biticon$1ipackage="icons"$2iname="help-browser" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bcancel"?\s/{biticon$1ipackage="icons"$2iname="dialog-cancel" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bclose"?\s/{biticon$1ipackage="icons"$2iname="window-close" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bconfig"?\s/{biticon$1ipackage="icons"$2iname="document-properties" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bcopy"?\s/{biticon$1ipackage="icons"$2iname="edit-copy" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bcopy_folder"?\s/{biticon$1ipackage="icons"$2iname="edit-copy" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bcurrent"?\s/{biticon$1ipackage="icons"$2iname="emblem-default" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bedit"?\s/{biticon$1ipackage="icons"$2iname="accessories-text-editor" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bedit_small"?\s/{biticon$1ipackage="icons"$2iname="accessories-text-editor" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bdelete"?\s/{biticon$1ipackage="icons"$2iname="edit-delete" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bdelete_small"?\s/{biticon$1ipackage="icons"$2iname="edit-delete" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bdownload"?\s/{biticon$1ipackage="icons"$2iname="emblem-downloads" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\berror"?\s/{biticon$1ipackage="icons"$2iname="dialog-error" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bexport"?\s/{biticon$1ipackage="icons"$2iname="document-save-as" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bfind"?\s/{biticon$1ipackage="icons"$2iname="edit-find" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bdirectory"?\s/{biticon$1ipackage="icons"$2iname="folder" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bfolder"?\s/{biticon$1ipackage="icons"$2iname="folder" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bfolder_open"?\s/{biticon$1ipackage="icons"$2iname="folder-open" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bhelp"?\s/{biticon$1ipackage="icons"$2iname="help-contents" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bhistory"?\s/{biticon$1ipackage="icons"$2iname="appointment-new" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bhome"?\s/{biticon$1ipackage="icons"$2iname="go-home" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bimport"?\s/{biticon$1ipackage="icons"$2iname="document-open" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\binfo"?\s/{biticon$1ipackage="icons"$2iname="dialog-information" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\binsert"?\s/{biticon$1ipackage="icons"$2iname="insert-object" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bmail_send"?\s/{biticon$1ipackage="icons"$2iname="mail-forward" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bnote"?\s/{biticon$1ipackage="icons"$2iname="x-office-document" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bnav_up"?\s/{biticon$1ipackage="icons"$2iname="go-up" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bnav_down"?\s/{biticon$1ipackage="icons"$2iname="go-down" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bnav_next"?\s/{biticon$1ipackage="icons"$2iname="go-next" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bnav_prev"?\s/{biticon$1ipackage="icons"$2iname="go-previous" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bnav_first"?\s/{biticon$1ipackage="icons"$2iname="go-first" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bnav_last"?\s/{biticon$1ipackage="icons"$2iname="go-last" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bnew"?\s/{biticon$1ipackage="icons"$2iname="document-new" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bpermissions"?\s/{biticon$1ipackage="icons"$2iname="emblem-shared" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bpermissions_set"?\s/{biticon$1ipackage="icons"$2iname="emblem-readonly" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bplugin"?\s/{biticon$1ipackage="icons"$2iname="applications-accessories" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bprint"?\s/{biticon$1ipackage="icons"$2iname="document-print" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\brefresh"?\s/{biticon$1ipackage="icons"$2iname="view-refresh" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\breply"?\s/{biticon$1ipackage="icons"$2iname="mail-reply-sender" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\breply_quote"?\s/{biticon$1ipackage="icons"$2iname="mail-reply-all" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bsave"?\s/{biticon$1ipackage="icons"$2iname="document-save" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bsettings"?\s/{biticon$1ipackage="icons"$2iname="emblem-system" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bsort_asc"?\s/{biticon$1ipackage="icons"$2iname="view-sort-ascending" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bsort_desc"?\s/{biticon$1ipackage="icons"$2iname="view-sort-descending" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bsuccess"?\s/{biticon$1ipackage="icons"$2iname="dialog-ok" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bupload"?\s/{biticon$1ipackage="icons"$2iname="applications-internet" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bview"?\s/{biticon$1ipackage="icons"$2iname="document-open" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bwarning"?\s/{biticon$1ipackage="icons"$2iname="dialog-warning" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\berror_large"?\s/{biticon$1ipackage="icons"$2iname="dialog-error" ipath="large" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bwarning_large"?\s/{biticon$1ipackage="icons"$2iname="dialog-warning" ipath="large" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\blist"?\s/{biticon$1ipackage="icons"$2iname="format-justify-fill" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bcollapsed"?\s/{biticon$1ipackage="icons"$2iname="list-add" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bexpanded"?\s/{biticon$1ipackage="icons"$2iname="list-remove" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bpost"?\s/{biticon$1ipackage="icons"$2iname="mail-forward" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bsecurity"?\s/{biticon$1ipackage="icons"$2iname="emblem-readonly" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bsort"?\s/{biticon$1ipackage="icons"$2iname="emblem-symbolic-link" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\btree"?\s/{biticon$1ipackage="icons"$2iname="folder-remote" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\bactive"?\s/{biticon$1ipackage="icons"$2iname="face-smile" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bliberty\b"?([^}]*?)iname="?\binactive"?\s/{biticon$1ipackage="icons"$2iname="face-sad" /g' {} \;

echo substituting users biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\bbatch-assign"?\s/{biticon$1ipackage="icons"$2iname="mail-attachment" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\btasks"?\s/{biticon$1ipackage="icons"$2iname="task-due" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\busers"?\s/{biticon$1ipackage="icons"$2iname="system-users" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\bunknown_user"?\s/{biticon$1ipackage="icons"$2iname="user-offline" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\bfavorite"?\s/{biticon$1ipackage="icons"$2iname="emblem-favorite" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\bsend_msg_small"?\s/{biticon$1ipackage="icons"$2iname="mail-forward style="width:8px;height:8px;"" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\btasks"?\s/{biticon$1ipackage="icons"$2iname="x-office-calendar" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\bhome"?\s/{biticon$1ipackage="icons"$2iname="go-home" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\bbookmarks"?\s/{biticon$1ipackage="icons"$2iname="system-file-manager" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\bgroups"?\s/{biticon$1ipackage="icons"$2iname="preferences-desktop" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\bwatch"?\s/{biticon$1ipackage="icons"$2iname="weather-clear" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\busers\b"?([^}]*?)iname="?\bunwatch"?\s/{biticon$1ipackage="icons"$2iname="weather-clear-night" /g' {} \;

echo substituting bitboards biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\bedit_add"?\s/{biticon$1ipackage="icons"$2iname="list-add" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\bedit_remove"?\s/{biticon$1ipackage="icons"$2iname="list-remove" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\bsticky"?\s/{biticon$1ipackage="icons"$2iname="emblem-important" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\bmake_sticky"?\s/{biticon$1ipackage="icons"$2iname="go-top" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\bmove"?\s/{biticon$1ipackage="icons"$2iname="go-jump" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\bnew_topic"?\s/{biticon$1ipackage="icons"$2iname="mail-message-new" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\bpost_reply"?\s/{biticon$1ipackage="icons"$2iname="mail-reply-sender" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\bnotify_off"?\s/{biticon$1ipackage="icons"$2iname="media-stop" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\bnotify_on"?\s/{biticon$1ipackage="icons"$2iname="media-record" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\btrack_new"?\s/{biticon$1ipackage="icons"$2iname="media-record" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\btrack_new_large"?\s/{biticon$1ipackage="icons"$2iname="media-record" ipath="large" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\btrack_old"?\s/{biticon$1ipackage="icons"$2iname="media-playback-pause" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboard\b"?([^}]*?)iname="?\btrack_old_large"?\s/{biticon$1ipackage="icons"$2iname="media-playback-pause" ipath="large" /g' {} \;

# move locked and unlocked to liberty
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboards\b"?([^}]*?)iname="?\blocked"?\s/{biticon$1ipackage="icons"$2iname="emblem-readonly" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bbitboards\b"?([^}]*?)iname="?\bunlocked"?\s/{biticon$1ipackage="icons"$2iname="emblem-default" /g' {} \;

echo substituting fisheye biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bfisheye\b"?([^}]*?)iname="?\blocked"?\s/{biticon$1ipackage="icons"$2iname="emblem-readonly" /g' {} \;

echo substituting gatekeeper biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bgatekeeper\b"?([^}]*?)iname="?\bsecurity"?\s/{biticon$1ipackage="icons"$2iname="emblem-readonly" /g' {} \;

echo substituting messages biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bmessages\b"?([^}]*?)iname="?\bflagged"?\s/{biticon$1ipackage="icons"$2iname="mail-mark-important" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bmessages\b"?([^}]*?)iname="?\bmail"?\s/{biticon$1ipackage="icons"$2iname="mail-message-new" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bmessages\b"?([^}]*?)iname="?\brecieve_mail"?\s/{biticon$1ipackage="icons"$2iname="mail-send-receive" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bmessages\b"?([^}]*?)iname="?\bsend_mail"?\s/{biticon$1ipackage="icons"$2iname="mail-send-receive" /g' {} \;

echo substituting nexus biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bnexus\b"?([^}]*?)iname="?\bmenu"?\s/{biticon$1ipackage="icons"$2iname="folder-remote" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bnexus\b"?([^}]*?)iname="?\borganise"?\s/{biticon$1ipackage="icons"$2iname="view-refresh" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bnexus\b"?([^}]*?)iname="?\bremove_dead"?\s/{biticon$1ipackage="icons"$2iname="mail-mark-junk" /g' {} \;

echo substituting pigeonholes biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bpigeonholes\b"?([^}]*?)iname="?\borganise"?\s/{biticon$1ipackage="icons"$2iname="view-refresh" /g' {} \;

echo substituting quota biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bquota\b"?([^}]*?)iname="?\bquota"?\s/{biticon$1ipackage="icons"$2iname="drive-harddisk" /g' {} \;

echo substituting rss biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\brss\b"?([^}]*?)iname="?\brss"?\s/{biticon$1ipackage="icons"$2iname="network-wireless" /g' {} \;

echo substituting wiki biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bwiki\b"?([^}]*?)iname="?\blocked"?\s/{biticon$1ipackage="icons"$2iname="emblem-readonly" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bwiki\b"?([^}]*?)iname="?\bunlocked"?\s/{biticon$1ipackage="icons"$2iname="emblem-default" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bwiki\b"?([^}]*?)iname="?\bs5"?\s/{biticon$1ipackage="icons"$2iname="x-office-presentation" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bwiki\b"?([^}]*?)iname="?\bslides"?\s/{biticon$1ipackage="icons"$2iname="x-office-presentation" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bwiki\b"?([^}]*?)iname="?\btree"?\s/{biticon$1ipackage="icons"$2iname="already dealt with" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bwiki\b"?([^}]*?)iname="?\bwebhelp"?\s/{biticon$1ipackage="icons"$2iname="help-browser" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bwiki\b"?([^}]*?)iname="?\bwebhelp_toc"?\s/{biticon$1ipackage="icons"$2iname="help-contents" /g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bwiki\b"?([^}]*?)iname="?\bbook"?\s/{biticon$1ipackage="icons"$2iname="x-office-address-book" /g' {} \;

echo substituting gigaupload biticons
find . -name "*.tpl" -exec perl -i -wpe 's/{biticon\b([^}]*?)ipackage="?\bgigaupload\b"?([^}]*?)iname="?\bbusy"?\s/{biticon$1ipackage="icons"$2iname="busy" /g' {} \;

echo;echo;echo
echo "------ Doing Smartlinks Now ------"
echo
echo substituting liberty smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/accept"#{smartlink$1ibiticon="icons/dialog-ok"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/administration"#{smartlink$1ibiticon="icons/preferences-system"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/assign"#{smartlink$1ibiticon="icons/mail-attachment"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/back"#{smartlink$1ibiticon="icons/go-previous"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/bithelp"#{smartlink$1ibiticon="icons/help-browser"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/cancel"#{smartlink$1ibiticon="icons/dialog-cancel"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/close"#{smartlink$1ibiticon="icons/window-close"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/config"#{smartlink$1ibiticon="icons/document-properties"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/copy"#{smartlink$1ibiticon="icons/edit-copy"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/copy_folder"#{smartlink$1ibiticon="icons/edit-copy"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/current"#{smartlink$1ibiticon="icons/emblem-default"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/edit"#{smartlink$1ibiticon="icons/accessories-text-editor"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/edit_small"#{smartlink$1ibiticon="icons/accessories-text-editor"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/delete"#{smartlink$1ibiticon="icons/edit-delete"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/delete_small"#{smartlink$1ibiticon="icons/edit-delete"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/download"#{smartlink$1ibiticon="icons/emblem-downloads"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/error"#{smartlink$1ibiticon="icons/dialog-error"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/export"#{smartlink$1ibiticon="icons/document-save-as"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/find"#{smartlink$1ibiticon="icons/edit-find"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/directory"#{smartlink$1ibiticon="icons/folder"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/folder"#{smartlink$1ibiticon="icons/folder"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/folder_open"#{smartlink$1ibiticon="icons/folder-open"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/help"#{smartlink$1ibiticon="icons/help-contents"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/history"#{smartlink$1ibiticon="icons/appointment-new"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/home"#{smartlink$1ibiticon="icons/go-home"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/import"#{smartlink$1ibiticon="icons/document-open"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/info"#{smartlink$1ibiticon="icons/dialog-information"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/insert"#{smartlink$1ibiticon="icons/insert-object"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/mail_send"#{smartlink$1ibiticon="icons/mail-forward"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/note"#{smartlink$1ibiticon="icons/x-office-document"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/nav_up"#{smartlink$1ibiticon="icons/go-up"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/nav_down"#{smartlink$1ibiticon="icons/go-down"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/nav_next"#{smartlink$1ibiticon="icons/go-next"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/nav_prev"#{smartlink$1ibiticon="icons/go-previous"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/nav_first"#{smartlink$1ibiticon="icons/go-first"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/nav_last"#{smartlink$1ibiticon="icons/go-last"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/new"#{smartlink$1ibiticon="icons/document-new"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/permissions"#{smartlink$1ibiticon="icons/emblem-shared"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/permissions_set"#{smartlink$1ibiticon="icons/emblem-readonly"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/plugin"#{smartlink$1ibiticon="icons/applications-accessories"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/print"#{smartlink$1ibiticon="icons/document-print"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/refresh"#{smartlink$1ibiticon="icons/view-refresh"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/reply"#{smartlink$1ibiticon="icons/mail-reply-sender"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/reply_quote"#{smartlink$1ibiticon="icons/mail-reply-all"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/save"#{smartlink$1ibiticon="icons/document-save"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/settings"#{smartlink$1ibiticon="icons/emblem-system"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/sort_asc"#{smartlink$1ibiticon="icons/view-sort-ascending"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/sort_desc"#{smartlink$1ibiticon="icons/view-sort-descending"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/success"#{smartlink$1ibiticon="icons/dialog-ok"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/upload"#{smartlink$1ibiticon="icons/applications-internet"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/view"#{smartlink$1ibiticon="icons/document-open"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/warning"#{smartlink$1ibiticon="icons/dialog-warning"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/error_large"#{smartlink$1ibiticon="liberty/large/dialog-error"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/warning_large"#{smartlink$1ibiticon="liberty/large/dialog-warning"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/list"#{smartlink$1ibiticon="icons/format-justify-fill"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/collapsed"#{smartlink$1ibiticon="icons/list-add"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/expanded"#{smartlink$1ibiticon="icons/list-remove"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/post"#{smartlink$1ibiticon="icons/mail-forward"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/security"#{smartlink$1ibiticon="icons/emblem-readonly"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/sort"#{smartlink$1ibiticon="icons/emblem-symbolic-link"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/tree"#{smartlink$1ibiticon="icons/folder-remote"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/active"#{smartlink$1ibiticon="icons/face-smile"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="liberty/inactive"#{smartlink$1ibiticon="icons/face-sad"#g' {} \;

echo substituting users smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/batch-assign"#{smartlink$1ibiticon="icons/mail-attachment"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/tasks"#{smartlink$1ibiticon="icons/task-due"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/users"#{smartlink$1ibiticon="icons/system-users"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/unknown_user"#{smartlink$1ibiticon="icons/user-offline"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/favorite"#{smartlink$1ibiticon="icons/emblem-favorite"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/send_msg_small"#{smartlink$1ibiticon="icons/mail-forward style="#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/tasks"#{smartlink$1ibiticon="icons/x-office-calendar"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/home"#{smartlink$1ibiticon="icons/go-home"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/bookmarks"#{smartlink$1ibiticon="icons/system-file-manager"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/groups"#{smartlink$1ibiticon="icons/preferences-desktop"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/watch"#{smartlink$1ibiticon="icons/weather-clear"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="users/unwatch"#{smartlink$1ibiticon="icons/weather-clear-night"#g' {} \;

echo substituting bitboards smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/edit_add"#{smartlink$1ibiticon="icons/list-add"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/edit_remove"#{smartlink$1ibiticon="icons/list-remove"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/sticky"#{smartlink$1ibiticon="icons/emblem-important"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/make_sticky"#{smartlink$1ibiticon="icons/go-top"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/move"#{smartlink$1ibiticon="icons/go-jump"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/new_topic"#{smartlink$1ibiticon="icons/mail-message-new"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/post_reply"#{smartlink$1ibiticon="icons/mail-reply-sender"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/notify_off"#{smartlink$1ibiticon="icons/media-stop"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/notify_on"#{smartlink$1ibiticon="icons/media-record"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/track_new"#{smartlink$1ibiticon="icons/mail-mark-read"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/track_new_large"#{smartlink$1ibiticon="icons/large/mail-mark-read"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/track_old"#{smartlink$1ibiticon="icons/mail-mark-unread"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboard/track_old_large"#{smartlink$1ibiticon="icons/large/mail-mark-unread"#g' {} \;

# move locked and unlocked to liberty
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboards/locked"#{smartlink$1ibiticon="icons/emblem-readonly"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="bitboards/unlocked"#{smartlink$1ibiticon="icons/emblem-default"#g' {} \;

echo substituting fisheye smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="fisheye/locked"#{smartlink$1ibiticon="icons/emblem-readonly"#g' {} \;

echo substituting gatekeeper smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="gatekeeper/security"#{smartlink$1ibiticon="icons/emblem-readonly"#g' {} \;

echo substituting messages smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="messages/flagged"#{smartlink$1ibiticon="icons/mail-mark-important"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="messages/mail"#{smartlink$1ibiticon="icons/mail-message-new"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="messages/recieve_mail"#{smartlink$1ibiticon="icons/mail-send-receive"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="messages/send_mail"#{smartlink$1ibiticon="icons/mail-send-receive"#g' {} \;

echo substituting nexus smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="nexus/menu"#{smartlink$1ibiticon="icons/folder-remote"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="nexus/organise"#{smartlink$1ibiticon="icons/view-refresh"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="nexus/remove_dead"#{smartlink$1ibiticon="icons/mail-mark-junk"#g' {} \;

echo substituting pigeonholes smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="pigeonholes/organise"#{smartlink$1ibiticon="icons/view-refresh"#g' {} \;

echo substituting quota smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="quota/quota"#{smartlink$1ibiticon="icons/drive-harddisk"#g' {} \;

echo substituting rss smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="rss/rss"#{smartlink$1ibiticon="icons/network-wireless"#g' {} \;

echo substituting wiki smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="wiki/locked"#{smartlink$1ibiticon="icons/emblem-readonly"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="wiki/unlocked"#{smartlink$1ibiticon="icons/emblem-default"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="wiki/s5"#{smartlink$1ibiticon="icons/x-office-presentation"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="wiki/slides"#{smartlink$1ibiticon="icons/x-office-presentation"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="wiki/tree"#{smartlink$1ibiticon="icons/already dealt with"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="wiki/webhelp"#{smartlink$1ibiticon="icons/help-browser"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="wiki/webhelp_toc"#{smartlink$1ibiticon="icons/help-contents"#g' {} \;
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="wiki/book"#{smartlink$1ibiticon="icons/x-office-address-book"#g' {} \;

echo substituting gigaupload smartlinks
find . -name "*.tpl" -exec perl -i -wpe 's#{smartlink\b([^}]*?)ibiticon="gigaupload/busy"#{smartlink$1ibiticon="icons/busy"#g' {} \;


# original testing line
# find . -name "*.tpl" -exec perl -i -wpe 's/{smartlink\b([^}]*?)ibiticon=""/{smartlink ibiticon=""$1/g' {} \;


# - keep original:
# busy
# move_up
# move_down
# move_left
# move_right
# move_left_right
# generating_thumbnail


# - remove:
# enlargeH
# reduceH
# lulu
# imagick_logo
# gd_logo
# spy
# liberty/pdf


# todo
# boards/move
