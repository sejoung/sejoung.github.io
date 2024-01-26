---
layout: post
title: "CHAPTER 6 변경 가능한 데이터 구조를 가진 언어에서 불변성 유지하기"
date: 2024-01-26 09:43 +0900
comments: true
tags: [ "쏙쏙 들어오는 함수형 코딩","심플한 코드로 복잡한 소프트웨어 길들이기" ]
categories: [ "books" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# CHAPTER 6 변경 가능한 데이터 구조를 가진 언어에서 불변성 유지하기

## 동작을 읽기, 쓰기 또는 둘 다로 분류하기
쓰기 동작은 불변성원칙에 따라 구현해야 한다
불변성 원칙은 카피-온-라이트(Copy-On-Write)라고 한다

## 카피-온-라이트 원칙 세 단계

* 복사본 만들기
* 복사본 변경하기
* 복사본 리턴하기

## 쓰기를 하면서 읽기도 하는 동작은 어떻게 해야 할까요?

* 읽기와 쓰기 함수로 각각 분리한다
* 함수에서 값을 두개 리턴한다

## 쓰면서 읽기도 하는 함수를 분리하기

* 읽기와 쓰기 동작으로 분리
* 쓰기 동작을 카피-온-라이트로 바꾸기

## 값을 두 개 리턴하는 함수로 만들기

* 동작 감싸기
* 읽으면서 쓰기도 하는 함수를 읽기 함수로 바꾸기
* 다른방법
  * 첫번째 접근방법(함수 분리)을 사용해 두값을 객체로 조합하는 방법

## 불변 데이터 구조를 읽는 것은 계산입니다

* 변경 가능한 데이터를 읽는 것은 액션
* 쓰기는 데이터를 변경 가능한 구조로 만듬
* 어떤 데이터에 쓰기가 없다면 데이터는 변경 불가능한 데이터
* 불변 데이터 구조를 읽는 것은 계산
* 쓰기를 읽기로 바꾸면 코드에 계산이 많아짐

## 애플리케이션에는 시간에 따라 변하는 상태가 있습니다

## 불변 데이터 구조는 충분히 빠릅니다
일반적으로 불변 데이터 구조는 변경 가능한 데이터 구조보다 메모리를 더 많이 쓰고 느리다
하지만 불변 데이터 구조를 사용하면서 대용량의 고성능 시스템을 구현하는 사례는 많이 있다 
이런 사례는 불변 데이터도 충분히 빠르다는 증거 입니다

* 언제든 최적화할 수 있다
* 가비지 콜렉터는 매우 빠르다
* 생각보다 많이 복사하지 않다
  * 얕은 복사(Shallow Copy) : 데이터의 최상위 단계만 복사
  * 얕은 복사는 같은 메모리를 가리키는 참조에 대한 복사본을 만든다 이것은 구조적 공유(Structural Sharing)라고 한다
  * 앝은 복사는 공유된 복사본이 변경되지 않는한 안전하다
* 함수형 프로그래밍 언어에는 빠른 구현체가 있다

### 앝은 복사를 구조적 복사라고 하는 이유

아래처럼 최상위는 정상적으로 복사 된다

```javascript
const original = ["beni", "hans"];
const copy = original.slice();
original.push("grace");
console.log(original);// [ 'beni', 'hans', 'grace' ]
console.log(copy);// [ 'beni', 'hans' ]
```

```javascript
const original = {name: "beni", age: 30, custom: [{hair: "black", eyes: "brown"}]};
const copy = Object.assign({}, original)
copy.name = "black";
console.log(original);//{ name: 'beni', age: 30, custom: [ { hair: 'black', eyes: 'brown' } ] }
console.log(copy);//{ name: 'black', age: 30, custom: [ { hair: 'black', eyes: 'brown' } ] }
```

아래처럼 하지만 하위 값은 복사가 안된다

```javascript
const original = {name: "beni", age: 30, custom: [{hair: "black", eyes: "brown"}]};
const copy = Object.assign({}, original)
copy.custom[0].eyes = "black";
console.log(original);//{ name: 'beni', age: 30, custom: [ { hair: 'black', eyes: 'black' } ] }
console.log(copy);//{ name: 'beni', age: 30, custom: [ { hair: 'black', eyes: 'black' } ] }
```

# 참조
-----

* [쏙쏙 들어오는 함수형 코딩(심플한 코드로 복잡한 소프트웨어 길들이기)](https://www.yes24.com/Product/Goods/108748841)
