---
layout: post
title: "도메인 주도 설계 구현-애플리케이션"
date: 2020-08-11 16:08 +0900
comments: true
tags : ["Implementing Domain-Driven Design"," 도메인 주도 설계 구현","Application","애플리케이션"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 도메인 주도 설계 구현

## 애플리케이션(Application)

핵심 도메인 모델과 상호 교류하며 이를 지원하기 위해 잘 조합된 컴포넌트의 집합

### 사용자 인터페이스

* 도메인 객체 랜더링
* 애그리게잇 인스턴스로 부터 데이터 전송 객체(DTO) 랜더링하기
* 애그리게잇 내부 상태를 발행하기 위해 중재자를 사용하자
* 도메인 페이로드 객체로부터 애그리게잇 인스턴스를 렌더링하라
* 애그리게잇 인스턴스의 상태 표현
* 유스케이스 최적 리파지토리 쿼리
* 다수의 개별 클라이언트 처리하기
* 변환 어댑터와 사용자 편집의 처리

### 애플리케이션 서비스

애플리케이션 서비스는 도메인 모델의 직접적인 클라이언트다.


# 참조
-----
* [implementing-domain-driven-design](https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/)

