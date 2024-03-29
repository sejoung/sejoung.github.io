---
layout: post
title: "CHAPTER 4 액션에서 계산 빼내기"
date: 2024-01-24 09:45 +0900
comments: true
tags: [ "쏙쏙 들어오는 함수형 코딩","심플한 코드로 복잡한 소프트웨어 길들이기" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# CHAPTER 4 액션에서 계산 빼내기

## 테스트하기 쉽게 만들기
* DOM 업데이트와 비즈니스 규칙은 분리되어야 한다
* 전역변수가 없어야 한다

## 재사용하기 쉽게 만들기
* 전역변수에 의존하지 않아야 한다
* DOM을 사용할 수 있는 곳에서 실행된다고 가정하면 안됩니다
* 함수가 결과값을 리턴해야 한다
## 함수에는 입력과 출력이 있습니다
* 입력은 함수가 계산을 하기 위한 외부정보
* 출력은 함수 밖으로 나오는 정보나 어떤 동작

입력과 출력은 명시적이거나 암묵적일 수 있다

함수의 암묵적 입력과 출력이 있으면 액션이 된다

## 테스트와 재사용성은 입출력과 관련 있습니다

* DOM 업데이트와 비즈니스 규칙은 분리되어야 한다
* 전역변수가 없어야 한다
* 전역변수에 의존하지 않아야 한다
* DOM을 사용할 수 있는 곳에서 실행된다고 가정하면 안됩니다
* 함수가 결과값을 리턴해야 한다
  * 암묵적 출력 대신 명시적 출력을 사용하자

## 액션에서 계산 빼내기
* 서브루틴 추출하기
* 암묵적 입출력 제거
  * 명시적으로 표현

## 계산 추출을 단계별로 알아보기
* 계산 코드를 찾아 빼낸다
* 새 함수에 암묵적 입력과 출력을 찾는다
* 암묵적 입력은 인자로 암묵적 출력은 리턴값으로 바꿉니다


# 참조
-----

* [쏙쏙 들어오는 함수형 코딩(심플한 코드로 복잡한 소프트웨어 길들이기)](https://www.yes24.com/Product/Goods/108748841)
