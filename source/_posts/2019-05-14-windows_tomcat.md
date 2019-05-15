---
layout: post
title: "원도우 톰캣 프로세스 확인"
date: 2019-05-14 11:57 +0900
comments: true
tags : ["tomcat","windows"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 원도우 톰캣 서비스 확인

PID 확인 서비스로 등록 시킨 톰캣

```
tasklist /FI "IMAGENAME eq tomcat*"
```


# 참조
-----
*[tomcat-windows-service-howto](https://tomcat.apache.org/tomcat-8.0-doc/windows-service-howto.html)


