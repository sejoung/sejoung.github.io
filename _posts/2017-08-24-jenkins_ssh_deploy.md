---
layout: post
title: "jenkins_ssh_deploy"
date: 2017-08-24 14:00:00 +0900
comments: false
---

sh /data/recommend/spring-boot.sh stop
rm -rf /data/recommend/recommend.jar
cp /data/recommend/$BUILD_ID/recommend.jar /data/recommend/
sh /data/recommend/spring-boot.sh start 8080

```

#!/bin/sh
SERVICE_NAME=recommend
PATH_TO_JAR=/data/recommend/recommend.jar
PID_PATH_NAME=/tmp/recommend-pid
case $1 in
    start)
        echo "Starting $SERVICE_NAME ..."
        if [ ! -f $PID_PATH_NAME ]; then
            /usr/local/jdk1.8.0_121/bin/java -jar -Dserver.port=$2 $PATH_TO_JAR /tmp 2>> /dev/null >> /dev/null &
                        echo $! > $PID_PATH_NAME
            echo "$SERVICE_NAME started ..."
        else
            echo "$SERVICE_NAME is already running ..."
        fi
    ;;
    stop)
        if [ -f $PID_PATH_NAME ]; then
            PID=$(cat $PID_PATH_NAME);
            echo "$SERVICE_NAME stoping ..."
            kill $PID;
            echo "$SERVICE_NAME stopped ..."
            rm $PID_PATH_NAME
            rm -rf /tmp/tomcat.*
            rm -rf /tmp/spring.log

        else
            echo "$SERVICE_NAME is not running ..."
        fi
    ;;
    restart)
        if [ -f $PID_PATH_NAME ]; then
            PID=$(cat $PID_PATH_NAME);
            echo "$SERVICE_NAME stopping ...";
            sudo kill $PID;
            echo "$SERVICE_NAME stopped ...";
            sudo rm $PID_PATH_NAME
            sudo rm -rf /tmp/tomcat.*
            echo "$SERVICE_NAME starting ..."
            /usr/local/jdk1.8.0_121/bin/java -jar -Dserver.port=$2 $PATH_TO_JAR /tmp 2>> /dev/null >> /dev/null &
                        echo $! > $PID_PATH_NAME
            echo "$SERVICE_NAME started ..."
        else
            echo "$SERVICE_NAME is not running ..."
        fi
    ;;
esac



```