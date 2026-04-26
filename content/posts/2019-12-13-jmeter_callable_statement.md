---
layout: post
title: "jmeter에서 프로시저 call 하기"
date: 2019-12-13 17:35 +0900
comments: true
tags : ["성능테스트","jmeter","jmeter에서 프로시저 call 하기"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## jmeter에서 프로시저 call 하기

JDBC Request에서 callalble statement 를 선택하면 된다 


```sql

call SP_TEST('014', '${pid}', '20191212', '1', ?, ?)

```

뒤에 2개는 out 파라미터인데 위 처럼 선언하고 아래 처럼 셋팅하면 정상적으로 동작한다.


![UI1](https://sejoung.github.io/images/2019_12_13_09.png)


# 참조
-----

