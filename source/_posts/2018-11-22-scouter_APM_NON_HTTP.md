---
layout: post
title: "scouter APM 배치 모니터링"
date: 2018-11-22 10:09 +0900
comments: true
tags : ["scouter APM 배치 모니터링"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### scouter APM 배치 모니터링

스카우트 APM을 아주 잘 사용하고 있는데 내부적으로 http 서비스 왜에 쿼츠 스케줄을 통해서 
백엔드로 돌아가는것이 있는데 추적이 되지 않아 추적하기 위한 설정을 하였다.

아래의 링크 NON-HTTP 서비스 추적하기를 통해서 많은 도움이 되었다.

먼저 해당서비스에 hook_service_patterns을 등록시켜줘야 된다.

```

hook_service_patterns=com.mypkg.MyClass.myservice

```
 
저는 tomcat 에서 http와 스케줄이 같이 동작하고 있는형태라 해당 서비스를 통해서 등록해도 
서비스는 보이지만 해당 서비스 에서 db에 접근하고 쿼리하는 형태가 보이지 않았다.

그래서 아래의 설정을 추가하였다.

```

#Method set for preparestatement hooking
hook_jdbc_pstmt_classes=org.mariadb.jdbc.BasePrepareStatement 

#Method set for statement hooking
hook_jdbc_stmt_classes=org.mariadb.jdbc.MariaDbStatement

```

아 참고로 redis의 key값을 확인하기 위해 아래의 설정도 추가 하였다.

```

#make unknown redis key stringify by force. (using new String(byte[])
profile_redis_key_forcibly_stringify_enabled=true

```


# 참조
-----
* [NON-HTTP 서비스 추적하기](https://github.com/scouter-project/scouter/blob/master/scouter.document/use-case/NON-HTTP-Service-Trace_kr.md)
* [scouter APM](https://github.com/scouter-project/scouter)