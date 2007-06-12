#!/bin/sh
# Wrapper script because in safe mode PHP gloms all those together.
ps -ef | grep $1 | grep daemonize | wc -l
