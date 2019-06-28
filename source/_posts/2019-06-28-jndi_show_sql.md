---
layout: post
title: "log4jdbc 설정"
date: 2019-06-28 09:20 +0900
comments: true
tags : ["log4jdbc","log4jdbc 설정"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## log4jdbc 설정


```xml

<dependency>
    <groupId>org.bgee.log4jdbc-log4j2</groupId>
    <artifactId>log4jdbc-log4j2-jdbc4</artifactId>
    <version>1.16</version>
</dependency>

```

설정

```
jdbc:derby://localhost:1527//db-derby-10.2.2.0-bin/databases/MyDatabase

```

위처럼 되있는것을 아래 처럼 설정

```

jdbc:log4jdbc:derby://localhost:1527//db-derby-10.2.2.0-bin/databases/MyDatabase

```


아래는 로거 설정임 

```xml

<logger name="jdbc.sqlonly" level="DEBUG"/>    <!-- SQL문만을 로그로 남기며, PreparedStatement일 경우 관련된 argument 값으로 대체된 SQL문이 보여진다. -->
<logger name="jdbc.sqltiming" level="DEBUG"/>    <!-- SQL문과 해당 SQL을 실행시키는데 수행된 시간 정보(milliseconds)를 포함한다. -->
<logger name="jdbc.audit" level="ERROR"/>    <!-- ResultSet을 제외한 모든 JDBC 호출 정보를 로그로 남긴다. 많은 양의 로그가 생성되므로 특별히 JDBC 문제를 추적해야 할 필요가 있는 경우를 제외하고는 사용을 권장하지 않는다. -->
<logger name="jdbc.resultset" level="ERROR"/> <!-- ResultSet을 포함한 모든 JDBC 호출 정보를 로그로 남기므로 매우 방대한 양의 로그가 생성된다. -->


```

걍 스프링 부트에서는 starter를 넣고 끝냄

```xml

<dependency>
<groupId>com.integralblue</groupId>
<artifactId>log4jdbc-spring-boot-starter</artifactId>
<version>1.0.2</version>
</dependency>

```

위처럼 추가하고 프로퍼티에 

```
#개발시 sql 로그 확인
logging.level.jdbc.sqlonly=info
logging.level.jdbc.sqltiming=error
logging.level.jdbc.audit=error
logging.level.jdbc.resultset=error
logging.level.jdbc.resultsettable=error

```

위처럼 넣음 물론 logback 설정을 위에 xml 처럼 넣어도 됨 

# 참조
-----
* [log4jdbc](http://log4jdbc.brunorozendo.com/)

