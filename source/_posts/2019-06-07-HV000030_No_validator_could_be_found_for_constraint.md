---
layout: post
title: "HV000030: No validator could be found for constraint"
date: 2019-06-07 13:37 +0900
comments: true
tags : ["Java Bean Validation","error", "spring"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## HV000030: No validator could be found for constraint

내 로컬 맥북에서는 정상적으로 동작하는데 windows에 있는 tomcat에만 올리면 에러가 나기 시작한다. 

하지만 catalina.out에는 에러 로그가 찍히지 않고 리턴되는 값은 500에러로 아래의 값이 찍히기 시작했다.

```

HV000030: No validator could be found for constraint javax.validation.constraints.NotEmpty validating type java.lang.String Check configuration for deviceId
Description The server encountered an unexpected condition that prevented it from fulfilling the request.

```

너무 이상해서 하나씩 찾아 보았는데 maven에 hibernate-validator가 선언 되 있었다. 

```xml

<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>5.2.4.Final</version>
</dependency>

```

우리는 spring boot 2.0 버전을 사용하고 있는데 위에 hibernate-validator는 아래의 spring-boot-starter-web에 포함도있다.


```xml

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

```
spring-boot-starter-web에 포함된 버전

```xml

<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.0.9.Final</version>
</dependency>

```

그래서 위에 따로 선언한 것을 제거후에 정상동작되는것을 확인 되었다.


# 참조
-----
* [hv000030-no-validator-could-be-found-for-constraint-javax-validation-constrai](https://stackoverflow.com/questions/52608600/hv000030-no-validator-could-be-found-for-constraint-javax-validation-constrai)


