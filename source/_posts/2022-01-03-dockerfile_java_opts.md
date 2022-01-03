---
layout: post
title: "Docker 에서 JAVA_OPTS 환경 변수 선언하기"
date: 2022-01-03 11:36 +0900
comments: true
tags : ["docker","dockerfile","JAVA_OPTS"]
categories : ["docker"]
sitemap :
changefreq : daily
priority : 1.0
--->
# Docker 에서 JAVA_OPTS 환경 변수 선언하기

아래 처럼 도커 ENTRYPOINT 에 JAVA_OPTS 환경변수를 선언하면 `could not find or load main class $java_opts` 오류가 나온다.
```dockerfile
ENTRYPOINT ["java","${JAVA_OPTS}","-jar","./app.jar"]
```
exec 명령어를 사용하면 오류 없이 정상동작이 된다.
```dockerfile
ENTRYPOINT exec java $JAVA_OPTS  -jar ./app.jar
```

# 참고자료

-----
* [Docker, Spring Boot and JAVA_OPTS](https://medium.com/@cl4r1ty/docker-spring-boot-and-java-opts-ba381c818fa2)

