#!/bin/sh

if [ ${DEBUG:-0} -eq 1 ] ; then
	echo --Program Starts-- 1>&2
fi

if [ "$REQUEST_METHOD" = "POST" ] ; then
	_F_QUERY_STRING=`dd count=$CONTENT_LENGTH bs=1 2> /dev/null`"&"
	if [ "$QUERY_STRING" != "" ] ; then
		_F_QUERY_STRING="$_F_QUERY_STRING""$QUERY_STRING""&"
	fi
	if [ ${DEBUG:-0} -eq 1 ] ; then
		echo --Posted String-- 1>&2
	fi
else
	_F_QUERY_STRING="$QUERY_STRING""&"
	if [ ${DEBUG:-0} -eq 1 ] ; then
		echo --Query String-- 1>&2
	fi
fi

if [ ${DEBUG:-0} -eq 1 ] ; then
 ( echo "  " $_F_QUERY_STRING
   echo --Adding Arguments-- ) 1>&2
fi

for _F_PAR in $* ; do
	_F_QUERY_STRING="$_F_QUERY_STRING""$_F_PAR""&"
	if [ ${DEBUG:-0} -eq 1 ] ; then
		echo "  " arg $_F_PAR 1>&2
	fi
done

if [ ${DEBUG:-0} -eq 1 ] ; then
 ( echo --With Added Arguments--
   echo "  " $_F_QUERY_STRING ) 1>&2
fi

if echo $PATH_INFO | grep = > /dev/null ; then
	_F_PATH_INFO="$PATH_INFO""//"
	if [ ${DEBUG:-0} -eq 1 ] ; then
		( echo --Adding Path Info--
		echo "  " $_F_PATH_INFO ) 1>&2
	fi

	while [ "$_F_PATH_INFO" != "" -a "$_F_PATH_INFO" != "/" ] ; do
		_F_QUERY_STRING="$_F_QUERY_STRING""`echo $_F_PATH_INFO | cut -d / -f 1`""&"
		_F_PATH_INFO=`echo $_F_PATH_INFO | cut -s -d / -f 2-`
	done
fi

_F_QUERY_STRING="$_F_QUERY_STRING""&"

if [ ${DEBUG:-0} -eq 1 ] ; then
 ( echo --Final Query String--
   echo "  " $_F_QUERY_STRING ) 1>&2
fi

while [ "$_F_QUERY_STRING" != "" -a "$_F_QUERY_STRING" != "&" ] ; do
	_F_VARDEF=`echo $_F_QUERY_STRING | cut -d \& -f 1`
	_F_VAR=`echo $_F_VARDEF | cut -d = -f 1`
	_F_VAL=`echo "$_F_VARDEF""=" | cut -d = -f 2`

	if echo $_F_QUERY_STRING | grep -c \& > /dev/null ; then
		_F_QUERY_STRING=`echo $_F_QUERY_STRING | cut -d \& -f 2-`
	else
		_F_QUERY_STRING=""
	fi

	if [ ${DEBUG:-0} -eq 1 ] ; then
	( echo --Got Variable--
    echo "  " var=$_F_VAR
    echo "  " val=$_F_VAL
    echo "  " rem=$_F_QUERY_STRING ) 1>&2
	fi
	
	if [ "$_F_VAR" = "" ] ; then
		continue
	fi

	_F_VAL="$_F_VAL""++"
	_F_TMP=

	while [ "$_F_VAL" != "" -a "$_F_VAL" != "+" -a "$_F_VAL" != "++" ] ; do
		_F_TMP="$_F_TMP""`echo $_F_VAL | cut -d + -f 1`"
		_F_VAL=`echo $_F_VAL | cut -s -d + -f 2-`

		if [ "$_F_VAL" != "" -a "$_F_VAL" != "+" ] ; then
			_F_TMP="$_F_TMP"" "
		fi
	done

	if [ ${DEBUG:-0} -eq 1 ] ; then
		echo "  " vrs=$_F_TMP 1>&2
	fi


	_F_TMP="$_F_TMP""%%"
	_F_VAL=

	while [ "$_F_TMP" != "" -a "$_F_TMP" != "%" ] ; do
		_F_VAL="$_F_VAL""`echo $_F_TMP | cut -d % -f 1`"
		_F_TMP=`echo $_F_TMP | cut -s -d % -f 2-`

		if [ "$_F_TMP" != "" -a "$_F_TMP" != "%" ] ; then
			if [ ${DEBUG:-0} -eq 1 ] ; then
				echo "  " got hex "%" $_F_TMP 1>&2
			fi
			_F_HEX=`echo $_F_TMP | cut -c 1-2 | tr "abcdef" "ABCDEF"`
			_F_TMP=`echo $_F_TMP | cut -c 3-`
			_F_VAL="$_F_VAL""`/bin/echo '\0'\`echo "16i8o"$_F_HEX"p" | dc\``"
		fi
	done

	_F_VAL=`echo $_F_VAL | tr "'" '\`'`

	if [ ${DEBUG:-0} -eq 1 ] ; then
		( echo --Final Assignment--
		echo "FORM_$_F_VAR"=\'$_F_VAL\' ) 1>&2
	fi
	
	echo "FORM_$_F_VAR"="'"$_F_VAL"'"
done

if [ ${DEBUG:-0} -eq 1 ] ; then
	echo done. 1>&2
fi

exit 0
