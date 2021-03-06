---
layout: post
title: "애플리케이션 아키텍처와 객체지향"
date: 2019-06-18 04:40 +0900
comments: true
tags : ["domain","layer"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 애플리케이션 아키텍처와 객체지향

### 레이어 아키텍처

트렌젝션 스크립트 - 절차지향

도메인 모델 - 객체지향 

### 도메인 

개념 또는 후보 객체 선정

#### 트랜젝션 스크립트 구현

##### 절차적으로 구현

데이터와 프로세스를 따로 분리한다.

데이터 모델을 만든다.

anermic domain model - 로직이 없는 객체 생성

어떻게 처리 할것인가 - 서비스 생성

절차적인 예매 로직

서비스 안에서 모든 로직을 처리함

#### 도메인 모델

프로새스와 데이터를 하나로 생각하는것

협력하는 객체들의 공동체

상태와 행동을 같이 갖는다.

##### CRC CARD

책임과 협력을 표현하기 위한 객체지향 설계도구

후보

책임

협력자

##### 예매 생성 책임 할당

필요한 정보의 전문가에가 할당하라.

요구 사항을 먼저 생각하고 객체를 생각한다.

showing

##### 가격 꼐산 책임 할당

영화에 책임을 할당

movie

discount strategy

##### 할인 여부를 판단할 책임 할당

rule

#### 객체지향

위임식, 분산식 제어 스타일

### 도메인 레이어와 아키텍처

#### 도메인 모델을 사용할때

도메인 로직을 처리 하기 위한 작업이 필요함

#### 도메인 레이어의 캡슐화
도메인 객체는 캡슐화를 한다.

##### 서비스 레이어

서비스 레이어는 도메인 레이어를 캡슐화를 하기 위해 생성

어플리케이션 경계
애플리케이션 로직
도메인 로직의 재사용 촉진

서비스 레이어에서 트랜젝션 바우더리를 설정

어플리케이션 로직은 서비스로 도메인 로직은 도메인으로 (관심사의 분리)

#### 트랜잭션 스크립트를 사용할때

트랜잭션 관리 + 어플리케이션 로직 + 도메인 로직

##### 서비스 레이어가 불필요

개념상 도메인 레이어

#### 데이터소스 레이어

##### 도메인 모델

객체-관계 임피던스 불일치

###### 데이터 매퍼(ORM)

도메인 객체와 디비의 불일치를 해소

JPA - 임피던스 불일치를 해결하기 위해서 나옴

##### 트랜젝션 스크립트를 사용할때

데이터 관점으로 개발됨

테이블과 1:1 매핑됨

테이블 데이터 게이트웨이(DAO)

### 선택의 기로

변햐지 않는 것은 모든것이 변한다는 사실이다. - 헤라클레이토스

#### 트랜젝션 스크립트

기존 코드를 수정해야 됨 ㅜㅜ 두려움

암묵적인 개념 

#### 도메인 모델

컴포지트 디자인 패턴 - 하나의 단위로 묶음

암묵적인 개념이 명시적으로 표현됨

기존 코드를 수정하지 않고 새로운 코드를 추가

개방 패쇄 원칙 

추상화를 기준으로 분리

의존성 역전 원칙

계속 변한다면 도메인 모델을 사용해야됨

대부분 현재 코드는 요구 사항 변경에 부적합

변경될때 마다 리팩토링을 해야됨



# 참조
-----
* [[KSUG Seminar] Growing Application - 2nd. 애플리케이션 아키텍처와 객체지향](https://www.youtube.com/watch?reload=9&v=26S4VFUWlJM)



