#!/bin/sh

eval `/www/cgi-bin/proccgi.sh $*`

if [ -n "$FORM_process" -a "$FORM_process" == "x_debug" ]; then
	local pid=$(pgrep xcloud_manager)
	if [ -n $pid ]; then
		local level=$FORM_level
		local use_syslog=$FORM_use_syslog
		if [ -n "$level" ]; then
			if [ $level -lt 0 ]; then
				level=0
			elif [ $level -gt 5 ]; then
				level=5
			fi
			uci set xcloudManager.x_debug.debug_level="$level"
		fi
		if [ -n "$use_syslog" ]; then
			if [ $use_syslog -lt 0 ]; then
				use_syslog=0
			elif [ $use_syslog -gt 1 ]; then
				use_syslog=1
			fi
			uci set xcloudManager.x_debug.use_syslog="$use_syslog"
		fi
		uci commit xcloudManager.x_debug
		kill -1 $pid
	fi
fi


echo Content-type: text/plain

echo 

echo set ok
