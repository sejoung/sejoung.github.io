---
layout: post
title: "CHAPTER 8 계층형 설계 I"
date: 2024-02-02 11:01 +0900
comments: true
tags: [ "쏙쏙 들어오는 함수형 코딩","심플한 코드로 복잡한 소프트웨어 길들이기" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# CHAPTER 8 계층형 설계 I

## 소프트웨어 설계란 무엇입니까?
* 소프트 웨어 설계 : 코드를 만들고, 테스트하고, 유지보수하기 쉬운 프로그래밍 방법을 선택하기 위해 미적 감각을 사용하는 것

## 계층형 설계란 무엇인가요?

* 계층형 설계는 소프트웨어를 계층으로 구성하는 기술
  * 각 계층에 있는 함수는 바로 아래 계층에 있는 함수를 이용해 정의

## 설계 감각을 키우기
* 전문가의 저주
  * 전문가는 자신의 지식을 다른 사람에게 전달하기 어렵다.

## 계층형 설계 패턴 
* 패턴 1: 직접 구현
  * 함수 시그니처가 나타내고 있는 문제를 함수 본문에서 적절한 구체화 수준에서 해결해야 한다
* 패턴 2: 추상화의 벽
  * 중요한 세부 구현을 감추고 인터페이스로 제공한다
* 패턴 3: 작은 인터페이스
  * 중요한 인터페이스는 작고 강력한 동작으로 구성하는 것이 좋다
* 패턴 4: 편리한 계층
  * 그냥 좋아서 계층을 추가하면 안됨 코드와 그 코드가 속한 추상화 계층은 작업할 때 편리해야 한다

## 패턴 1: 직접 구현 
같은 계층에 있는 함수는 같은 목적을 가져야 한다

## 3단계 줌 레벨 

* 전역 줌 레벨
  * 전역 줌 레벨로 그래프 전체 중 필요한 부분을 살펴볼 수 있다
  * 함수가 가르키는 화살표를 계층간에 비교할 수 있다
* 계층 줌 레벨
  * 한계층과 연결된 바로 아래 계층을 볼수 있는 줌레벨
  * 함수 하나가 가진 화살표를 비교 할수 있다
* 함수 줌 레벨
  * 함수 하나와 바로 아래 연결된 함수들을 볼 수 있다

## 직접 구현 패턴 리뷰 
* 직접 구현한 코드는 한 단계의 구체화 수준에 관한 문제만 해결합니다
* 계층형 설계는 특정 구체화 단계에 집중할 수 있게 도와줍니다
* 호출 그래프는 구체화 단계에 대한 풍부한 단서를 보여준다
* 함수를 추출하면 더 일반적인 함수로 만들수 있다
* 일반적인 함수가 많을수록 재사용하기 좋다
* 복잡성을 감추지 않는다


# 참조
-----

* [쏙쏙 들어오는 함수형 코딩(심플한 코드로 복잡한 소프트웨어 길들이기)](https://www.yes24.com/Product/Goods/108748841)
