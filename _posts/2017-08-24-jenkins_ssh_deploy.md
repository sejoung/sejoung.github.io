---
layout: post
title: "jenkins_ssh_deploy"
date: 2017-08-24 14:00:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---


```
sh /data/recommend/spring-boot.sh stop
rm -rf /data/recommend/recommend.jar
cp /data/recommend/$BUILD_ID/recommend.jar /data/recommend/
sh /data/recommend/spring-boot.sh start 8080

```

```

#!/bin/sh
SERVICE_NAME=recommend
PATH_TO_JAR=/data/recommend/recommend.jar
PID_PATH_NAME=/tmp/recommend-pid_$2
case $1 in
    start)
        echo "Starting $SERVICE_NAME ..."
        if [ ! -f $PID_PATH_NAME ]; then
            /usr/local/jdk1.8.0_121/bin/java -jar -Dspring.profiles.active=$3 -Dserver.port=$2 -Dscouter.config=/data/scouter/agent.java/conf/scouter.conf -Dobj_name=recommend_$2 -javaagent:/data/scouter/agent.java/scouter.agent.jar -Xms2048m -Xmx3072m -XX:NewSize=256m -XX:MaxNewSize=256m -XX:PermSize=256m -XX:MaxPermSize=256m -XX:+DisableExplicitGC $PATH_TO_JAR /tmp 2>> /dev/null >> /dev/null &
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
            rm -rf /tmp/*.$2

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
            sudo rm -rf /tmp/*.$2
            echo "$SERVICE_NAME starting ..."
            /usr/local/jdk1.8.0_121/bin/java -jar -Dspring.profiles.active=$3 -Dserver.port=$2 -Dscouter.config=/data/scouter/agent.java/conf/scouter.conf -Dobj_name=recommend_$2 -javaagent:/data/scouter/agent.java/scouter.agent.jar -Xms2048m -Xmx3072m -XX:NewSize=256m -XX:MaxNewSize=256m -XX:PermSize=256m -XX:MaxPermSize=256m -XX:+DisableExplicitGC $PATH_TO_JAR /tmp 2>> /dev/null >> /dev/null &
                        echo $! > $PID_PATH_NAME
            echo "$SERVICE_NAME started ..."
        else
            echo "$SERVICE_NAME is not running ..."
        fi
    ;;
esac

```

#참고자료
http://hreeman.tistory.com/m/136