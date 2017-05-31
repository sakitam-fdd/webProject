#!/bin/sh

sh /usr/local/localshell/get_log.sh &

echo "Content-type: text/plain;charset=utf-8"
echo 
echo get ok
echo 
#echo 日志文件将会在4分钟之后生成,请在路由器的外接存储设备所挂载的目录中查看,日志文件名称是log.txt.
