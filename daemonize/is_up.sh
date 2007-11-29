#!/bin/bash
# Wrapper script because in safe mode PHP gloms all those together.
ps -ef | grep -v $0 | grep $1 | grep daemonize | wc -l
