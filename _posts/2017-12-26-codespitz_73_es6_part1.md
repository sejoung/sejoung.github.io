---
layout: post
title: "codespitz73_part1"
date: 2017-12-26 14:30:00 +0900
comments: false
---
## 코드스피츠73 part1

코드짤때 LINT TIME(IDE에서 에러를 보여줌)
컴파일 할때 COMPILE TIME(컴파일 시에 에러를 보여줌)
런타임 RUN TIME(실행중일때 에러)

현대 패러다임 런타임 스크립트(자바 스크립트..)

복잡성을 정복하는것은 격리

### lexical grammar
* control character 제어문자
* white space 공백문자
* line terminators 개행문자
* comments 주석
* keyword 예약어
* literals 리터럴

### language element
* statements 문(공문, 식문, 제어문, 선언문 | 단문, 중문)
* expression 식(값식, 연산식, 호출식)
* identifier 식별자(기본형, 참조형 | 변수 메모리 복사, 상수 메모리 참조)


#### 공문
;;;;

#### 식문
3-4;
3;2;1;

#### 연산식
연산자의 목적 - 자바스크립트 11가지

단항,이항,삼항,다항연산자(1,2,3,4), 우선순위 연산자, 호출식 연산자

### FLOW
폰노이만 머신이 한번에 적재되어 있는 메모리에 적제되어 있는 프로그램이 한번에 실행 되는것

#### SYNC FLOW
동기화 되서 한번에 소모 되고 있는 상황 멈출수 없음

#### 연산자 우선순위 
수학적 지식을 기반으로 오판하는 코드를 만들지 말아라
3*5/2*4
((3*5)/2)*4
(3*5)/(2*4)

#### 루틴(Routine) vs 코루틴(Coroutine)

루틴은 엔트리 포인트가 하나인 서브루틴이다.

코루틴은 엔트리 포인트가 여러개인 서브루틴이다.

#### 제어문에서 여러가지 표현이 있는경우
굴러만 간다고 코드가 아니다. 자신의 의도를 잘표현 하기 위해서 여러가지 문법이 존재함
자신의 의도를 섬세하게 표현하자



# 참조 
-----
* [코드스피츠73_ES6](https://www.youtube.com/watch?v=kG87PONfqkg)
* [The ABC Programming Language: a short introduction](https://homepages.cwi.nl/~steven/abc/)
*[implementing-coroutines-in-java](https://stackoverflow.com/questions/2846664/implementing-coroutines-in-java)