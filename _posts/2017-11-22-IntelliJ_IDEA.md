---
layout: post
title: "IntelliJ_IDEA"
date: 2017-11-22 14:08:00 +0900
comments: false
---

# 인텔리제이 설정

```

플러그인

key promoter : 단축키를 보여주는 플러그인

Camelcase : 카멜케이스 변환 플러그인

Java Method Reference Diagram : 기본적으로 Ctrl+ALt+U(윈도우기반 단축키 기준)을 하면 UML을 보여주는데 이 플러그인을 설치하면 메소드 레퍼런스도 볼 수 있어요.  UML을 볼때 연관 Class들을 source explorer 에서 선택한 상태에서 보면 유용합니다.

Nyan Progress Bar : 고양이 Progress Bar 
-----

ctrl + E : 최근 작업 소스

shift + shift : 만능 서치
-----
windows

IDE_HOME\bin\<product>[bits][.exe].vmoptions

mac 

/Applications/<Product>.app/Contents/bin
-----
SVN checkout 에러

Cannot load supported formats: Cannot run program "svn": CreateProcess error=2, The system cannot find the file specified

Settings -> Version Controll -> Subversion -> Use command line client 체크 해제
-----
프로퍼티 에디터 
Settings -> Editor -> file encoding -> Transparent native-to-ascii conversion 체크
-----
VM 파라미터

-Xms256m
-Xmx2048m
-XX:ReservedCodeCacheSize=240m
-XX:+UseConcMarkSweepGC
-XX:SoftRefLRUPolicyMSPerMB=50
-Duser.name=kim se joung
-Dfile.encoding=UTF-8
-ea
-Dsun.io.useCanonCaches=false
-Djava.net.preferIPv4Stack=true
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow

-----
TOMCAT VM 파라미터
-----

-Dfile.encoding=UTF-8
-Dfile.client.encoding=UTF-8
-Dfile.encoding.override=UTF-8


```
-----
# 참조 
-----

* [인텔리제이 configuring-encoding-for-properties-files](https://www.jetbrains.com/help/idea/configuring-encoding-for-properties-files.html)

* [인텔리제이 단축키를 빨리 습득하고 싶으실떄 유용한 동영상](https://www.youtube.com/watch?v=eq3KiAH4IBI)
 
* [인텔리제이 JVM-options-and-platform-properties](https://intellij-support.jetbrains.com/hc/en-us/articles/206544869-Configuring-JVM-options-and-platform-properties)

* [툴박스 설명](https://blog.jetbrains.com/blog/2016/05/25/introducing-jetbrains-toolbox-app/)

* [Jetbrain 계열 IDE에서 SVN checkout 에러 해결](http://chomman.github.io/blog/tool/subversion/intellij-subversion-checkout-error/)

