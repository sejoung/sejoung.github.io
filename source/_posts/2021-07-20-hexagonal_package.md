---
layout: post
title: "헥사고날 아키텍처에서 패키지 구조"
date: 2021-07-20 22:24 +0900
comments: true
tags : ["hexagonal architecture","헥사고날","아키텍처","java","spring","clean architecture"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# 헥사고날 아키텍처에서 패키지 구조

## 모듈 설명

![클린 아키텍처](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

* core : 실제 도메인 처리 모듈 클린아카텍처의 엔티티 영역(port & entities)
* presentation : UI 담당 인터페이스(adapter)
* infrastructure : 백엔드 인프라 담당 인터페이스(adapter)
* external : 외부 시스템 API 연동(adapter)
* configuration : 서비스 간의 조합과 서버 기동을 담당하는 인터페이스(실제 구동 되는 server 모듈)

## 설계 원칙

모든 종속성은 밖에서 안으로만 가르킨다.

* 프레임워크와 무관합니다. 아키텍처는 기능이 포함된 소프트웨어의 일부 라이브러리의 존재에 의존하지 않습니다. 이렇게 하면 시스템에 제한된 제약을 가하지 않고 이러한 프레임워크를 도구로 사용할 수 있습니다.
* 테스트 가능. 비즈니스 규칙은 UI, 데이터베이스, 웹 서버 또는 기타 외부 요소 없이 테스트할 수 있습니다.
* UI와 무관합니다. UI는 시스템의 나머지 부분을 변경하지 않고도 쉽게 변경할 수 있습니다. 예를 들어 비즈니스 규칙을 변경하지 않고 웹 UI를 콘솔 UI로 교체할 수 있습니다.
* 데이터베이스에 독립적입니다. Oracle 또는 SQL Server를 Mongo, BigTable, CouchDB 등으로 교체할 수 있습니다. 비즈니스 규칙은 데이터베이스에 바인딩되지 않습니다.
* 외부 기관과 무관합니다. 사실 비즈니스 규칙은 외부 세계에 대해 전혀 알지 못합니다.


# 참고자료
-----
* [Alistair Cockburn hexagonal-architecture](https://alistair.cockburn.us/hexagonal-architecture/)
* [clean-architecture](http://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) 
