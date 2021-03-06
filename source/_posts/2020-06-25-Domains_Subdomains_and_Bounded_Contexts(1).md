---
layout: post
title: "도메인 주도 설계 구현-도메인, 서브도메인, 바운디드 컨텍스트(1)"
date: 2020-06-25 09:05 +0900
comments: true
tags : ["Implementing Domain-Driven Design"," 도메인 주도 설계 구현","도메인, 서브도메인, 바운디드 컨텍스트"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 도메인 주도 설계 구현

## 도메인, 서브도메인, 바운디드 컨텍스트

### 큰그림

넓은 의미에서 도메인이란 한 조직이 행하는 일과 그 조직 안의 세계를 일컫는다.

조직이 무엇을 어떻게 하는지에 관한 모든 것을 하나의 도메인 모델에 포함해선 안된다

거의 모든 소프트웨어 도메인에는 다수의 서브 도메인이 있다.

#### 서브도메인과 바운디드 컨텍스트의 할용

소프트웨어의 관심이 분명하게 분리시켜야 된다.

여러 서브도메인으로 나눌 수도 있는 소프트웨어 도메인 모델을 굳이 구분 짓지 않는 다면 변화가 계속됨에 따라 훨씬 큰부담을 지게 된다.

DDD를 도입하면서 도메인 모델에서 사용된 모든 용어의 의미가 잘 이해되도록 각 바운디드 컨텍스트를 잘 나누려 노력한다

하나의 바운디드 컨텍스트당 하나의 서브도메인이 있는 건 아니지만 그럴 경우도 있다는 점을 기억하자.

#### 핵심 도메인에 집중하기

핵심 도메인은 그 조직의 성공에 가장 중요한 비즈니스 도메인의 한 부분이다. 전략적 측면에서 비즈니스는 핵심 도메인에서 탁월함을 보여줘야 한다.

핵심 도메인의 구현에는 탁월함이 요구되는데 그 이유는 핵심 도메인이 비즈니스에 분명한 이점을 제공하기 때문이다.




# 참조
-----
* [implementing-domain-driven-design](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)

