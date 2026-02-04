---
layout: post
title: "쿠버네티스에서 command를 활용해서 APM agent 설치하기"
date: 2022-01-03 20:09 +0900
comments: true
tags : ["docker","kubernetes","apm","agent","command"]
categories : ["kubernetes"]
sitemap :
changefreq : daily
priority : 1.0
--->
# 쿠버네티스에서 command를 활용해서 APM agent 설치하기

command를 활용해서 해당 파일을 pod에 다운로드 하는 방법을 적어 놓는다.

```yaml
containers:
    command: [ "/bin/sh", "-c" ]
    args:
      - wget -O dd-java-agent.jar https://dtdg.co/latest-java-tracer;
        java $JAVA_OPTS -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE -jar app.jar;

```

위처럼 간단하네 커멘드 내용을 활용해서 처리를 했다 커멘드를 사용시에 주의사항은 dockerfile에 ENTRYPOINT가 사용되지 않아서 실제 실행까지 시켜줘야 된다.


# 참고자료

-----
* [kubernetes configmap](https://kubernetes.io/ko/docs/concepts/configuration/configmap/)
* [how-to-set-multiple-commands-in-one-yaml-file-with-kubernetes](https://stackoverflow.com/questions/33887194/how-to-set-multiple-commands-in-one-yaml-file-with-kubernetes)
