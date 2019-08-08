---
layout: post
title: "DriverManagerDataSource"
date: 2019-08-08 10:16 +0900
comments: true
tags : ["spring","DriverManagerDataSource","connection pool"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## DriverManagerDataSource 

서비스를 동작시키는데 특정 포트가 오픈된 소켓개수가 너무 많았다. 

확인해 보니 DB포트이다 이상해서 어플리케이션의 커넥션 풀을 확인해보는데 DriverManagerDataSource를 사용한 것이다.

DriverManagerDataSource는 아래처럼 내용이다.

```

표준 JDBC DataSource인터페이스 의 간단한 구현 , DriverManagerBean 등록 정보를 통해 일반 이전 JDBC 구성 및 Connection모든 getConnection호출 에서 새 JDBC 를 리턴합니다.
참고 :이 클래스는 실제 연결 풀이 아닙니다. 실제로는 연결을 풀링하지 않습니다.
 이는 완전한 연결 풀을 간단하게 대체하여 동일한 표준 인터페이스를 구현하지만 모든 호출에서 새 연결을 작성합니다.

```

커넥션 풀을 사용하지 않는것이다. 코드를 수정했다. 


# 참조
-----
* [DriverManagerDataSource](https://docs.spring.io/spring/docs/5.0.5.RELEASE/javadoc-api/org/springframework/jdbc/datasource/DriverManagerDataSource.html)
