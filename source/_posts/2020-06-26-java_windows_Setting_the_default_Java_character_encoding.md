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
