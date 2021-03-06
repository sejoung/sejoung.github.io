---
layout: post
title: "클린아키텍쳐-패러다임 개요"
date: 2019-10-16 09:07 +0900
comments: true
tags : ["클린아키텍쳐","Clean Architecture","패러다임 개요"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린아키텍쳐

### 패러다임 개요

#### 구조적 프로그래밍

최초로 적용된 패러다임은 구조적 프로그래밍으로 데이크스트라가 발견했다.

데이크스트라는 점프(goto 문장)은 프로그램 구조에 해롭다는 사실을 제시

이러한 구조를 (if/then/else do/while/until)로 대채했다.

`구조적 프로그래밍은 제어흐름의 직접적인 전환에 대해 규칙을 부과한다.`

#### 객체지향 프로그래밍

두번째로 도입된 패러다임은 구조적 프로그래밍보다 사실 2년 앞선 1966년 요한 달과 크리스텐 니가드에 의해 등장했다.

두 프로그래머는 알골언어의 함수 호출 스택 프레임을 힙으로 옴기면서, 
함수 호출이 반환된 이후에도 함수에서 선언된 지역 변수가 오래 동안 유지될수 있음을 발견했다.

바로 이런 함수가 클래스의 생성자가 되었고 지역변수는 인스턴스 변수, 중첩함수는 메서드가 되었다.

함수 포인터를 특정 규칙에 따라 사용하는 과정을 통해 다형성이 등장

`객체 지향 프로그래밍은 제어흐름에 간접적인 전환에 대해 규칙을 부여한다.`

#### 함수형 프로그래밍

세 번째 패러다임은 최근에 들어서야 겨우 도입되기 시작했지만, 세 패러다임중 가장 먼저 만들어 졌다.

사실 함수형 프로그래밍은 컴퓨터 프로그래밍 자체보다 먼저 등장했다.

람다 계산법의 기초가 되는 개념은 불변성으로 심폴의 값이 변경되지 않는다는 개념이다.

`함수형 프로그래밍은 할당문에 대해 규칙을 부과한다.`


#### 생각할꺼리 

각 패러다임은 프로그래머에게서 권한을 박탈한다. 어느 패러다임도 새로운 권한을 부여하지 않는다.

최소한 부정적인 의도를 가진 패러다임으로는 이 세가지가 전부일것이다.

이유로는 1958년부터 1968년까지 3가지 패러다임이 다만들어 졌고 이후 수십년이 흘렀지만 다른 패러다임은 나오지 않았다.

#### 결론

세가지 패러다임과 아키텍쳐의 세가지 관심사(함수, 컴포넌트 분리, 데이터 관리)가 어떻게 서로 관계 되는지 생각하자.


# 참조
-----

