---
layout: post
title: "톰캣 windows StopTimeout 설정"
date: 2019-06-27 11:25 +0900
comments: true
tags : ["tomcat","windows 서비스"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 톰캣 windows StopTimeout 설정

톰캣을 원도우 서비스로 등록후에 재시동을 하는데 재기동 시간이 너무 오래 걸려서 옵션들을 조금 찾아 보게 되었다.

여기서 눈여겨 본 옵션은 

`--StopTimeout` 옵션으로 정지시에 타임아웃을 설정한것이다 하지만 설정을 했는데 제대로 되지 않았다.

여기서 다시 `--StartMode` 와 `--StopMode` 가 존재함 여기서 모드를 선택할수 있는데 3가지 모드가 있다.


```
jvm - jvm.dll 이용해서 실행
Java - exe를 이용해서 실행 %JAVA_HOME%\bin\java.exe 
exe - 이미지의 프로세스를 분리해서 실행

```
일단 jvm.dll과 java.exe 의 차이점에 대해서 알지 못하고 있다. 이부분은 조금더 알아 봐야 될것 같다.

하지만 원래 개발시에 실행하는 java.exe를 하는게 좋겠다는 생각으로 설정을하고 timeout 설정을 걸어서 정지 프로세스가 빨리 종료 될수 있게 하였다.

# 참조
-----
* [windows-service-howto](https://tomcat.apache.org/tomcat-8.5-doc/windows-service-howto.html)

