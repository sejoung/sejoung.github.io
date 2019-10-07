---
layout: post
title: "JPA missing table error"
date: 2019-10-07 15:48 +0900
comments: true
tags : ["jpa","missing table"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## JPA missing table error

일단 아래처럼 에러가 나기 시작했다. 

```

org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]: Invocation of init method failed; nested exception is javax.persistence.PersistenceException: [PersistenceUnit: default] Unable to build Hibernate SessionFactory; nested exception is org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation: missing table [xxx]


```

하지만 테이블인 이미 생성되 있는 상태였다. 이게 무슨 문제인지 한참을 찾았는데 해결방법은 간단했다

스프링에서 기본 전략은 

1. 점을 밑줄로 교체
1. 카멜케이스를 스네이크 케이스로 바꾸고
1. 소문자 테이블 이름

```

spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

```

위에 값을 설정하면 변수 이름을 그대로 사용한다. 그렇게 되면서 아래의 에러가 나오게 된다.

```
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]: Invocation of init method failed; nested exception is javax.persistence.PersistenceException: [PersistenceUnit: default] Unable to build Hibernate SessionFactory; nested exception is org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation: wrong column type encountered in column [holiday_etime] in table [xxx]; found [varchar (Types#VARCHAR)], but expecting [int (Types#INTEGER)]

```


# 참조
----- 

