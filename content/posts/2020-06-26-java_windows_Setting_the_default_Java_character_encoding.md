---
layout: post
title: "원도우 자바 로그 파일 깨짐"
date: 2020-06-26 18:10 +0900
comments: true
tags : ["file.encoding","logback","한글깨짐"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 원도우 자바 로그 파일 깨짐

OS 마다 기본 문자열 셋트가 틀리므로 아래의 JVM 옵션으로 통일시킬수 있다.

```

-Dfile.encoding=UTF-8

```

위처럼 실행 옵션에도 UTF-8을 넣고 

```
        <encoder>
            <charset>UTF-8</charset>
        </encoder>

```

위처럼 로그백에도 charset을 지정하면 된다.

# 참조
-----
* [logback encoders](http://logback.qos.ch/manual/encoders.html)
* [java-may-use-utf-8-as-its-default-charset](https://dzone.com/articles/java-may-use-utf-8-as-its-default-charset)
