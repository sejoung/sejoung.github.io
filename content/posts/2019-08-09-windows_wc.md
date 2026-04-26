---
layout: post
title: "원도우에서 wc 명령어 사용하기"
date: 2019-08-09 13:27 +0900
comments: true
tags : ["wc","netstat","find","findstr"]
categories : ["windows"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## 원도우에서 wc 명령어 사용하기


```
netstat -na | findstr 8080
```

위처럼 특정 포트를 확인 할수 있는데 여기서 wc 명령어 사용을 하고 싶을때는 


```
netstat -na | findstr 8080 | find /c /v ""
```

이렇게 사용하면 된다.

# 참조
-----
