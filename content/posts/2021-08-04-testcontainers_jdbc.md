---
layout: post
title: "테스트 컨테이너를 통해서 단위 테스트 실행하기"
date: 2021-08-04 22:42 +0900
comments: true
tags : ["testcontainers","docker","테스트 컨테이너"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# 테스트 컨테이너를 통해서 데이터베이스 단위 테스트 실행하기

Testcontainers 를 통하면 H2가 에뮬레이트하지 않는 데이터베이스 기능에 의존하는 DAO 단위 테스트 지원 할수 있다.

가장 간단하게 spring에 적용하는 법으로 jdbc url을 바꿔주는 방법이 있다.

```
driver-class-name: org.testcontainers.jdbc.ContainerDatabaseDriver
jdbc-url: jdbc:tc:postgresql:12.7:///test
```
위와 같이 간단한 선언 만으로 db를 실행시켜서 테스트를 통과 시킬수가 있다.

# 참고자료

-----
* [testcontainers jdbc](https://www.testcontainers.org/modules/databases/jdbc/)
