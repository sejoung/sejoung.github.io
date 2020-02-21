---
layout: post
title: "톰캣 리모트 디버깅 설정하기"
date: 2020-02-21 13:44 +0900
comments: true
tags : ["톰캣 리모트 디버깅 설정하기","Java Platform Debugger Architecture","tomcat"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 톰캣 리모트 디버깅 설정하기

jpda(Java Platform Debugger Architecture)를 지원 하기 때문에 아래의 파라미터를 추가해서 해당 포트로 리모트 디버거를 실행 시킬수 있다.

windows

```

set JPDA_ADDRESS=8000
set JPDA_TRANSPORT=dt_socket
bin/catalina.bat jpda start

```

unix

```

export JPDA_ADDRESS=8000
export JPDA_TRANSPORT=dt_socket
bin/catalina.sh jpda start

```

```

C:\tomcat\bin> tomcat5w //ES//Tomcat5

-Xdebug
-Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n

```

위처럼 파라미터를 추가해도 된다.


# 참조
-----
