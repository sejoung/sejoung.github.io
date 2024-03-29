---
layout: post
title: "CHAPTER 1 코드 품질"
date: 2023-01-27 20:27 +0900
comments: true
tags : ["좋은코드 나쁜코드: 프로그래머의 코드 품질 개선법"]
categories : ["book"]
sitemap :
changefreq : daily
priority : 1.0
---

# 좋은코드 나쁜코드: 프로그래머의 코드 품질 개선법(PART I 이론)
## CHAPTER 1 코드 품질

고품질 코드는
* 좀 더 신뢰할 수 있다
* 유지보수가 쉽다
* 버그가 적은 소프트웨어를 생산

좋은 코드는 좋은 소프트웨어를 만들기 위한 유일한 조건은 아니지만 중요한 조건중에 하나다

### 코드는 어떻게 소프트웨어가 되는가

* 코드베이스 : 소프트웨어를 빌드할 수 있는 코드가 저장된 저장소
* 코드 제출 : 코드 커밋 or mr(pr)
* 코드 리뷰 : 코드 제출 전에 다른 프로그래머가 리뷰 해주는것
* 제출 전 검사 : 병합전 훅, 병합전 점검, 커밋전 점검 이라고 하며 테스트가 실패하거나 컴파일 되지 않으면 병합되지 않도록 차단한다
* 배포 : 소프트웨어는 코드베이스의 스냅샷을 기반으로 빌드된다.
* 프로덕션 : 실제 서비드되는 환경을 가르킨다.

### 코드 품질의 목표

* 안전하고
* 실제로 작동하고
* 고장 나지 않고
* 예측 가능한 행동을하는

필자가 생각하는 상위수준의 목표
* 작동해야 한다
  * 문제를 해결하기위해 목적한 대로 동작해야 된다
* 작동이 멈춰서는 안 된다
  * 코드는 다른 코드에 의존할 수 있는데, 그 코드가 수정되고 변경될 수 있다.
  * 새로운 기능이 필요할 때 코드를 수정해야 할 수도 있다.
  * 해결해야 될 문제는 시간이 지남에 따라 변경 된다.
* 변화하는 요구 사항에 적응해야 한다
  * 시나리오 A : 모든 요구사항이 어떻게 변할지 정확히 예측하고 잠재적인 변화를 모두 수용하기 위한 코드를 설계하려고 노력한다
  * 시나리오 B : 요구사항이 변할 수 있다는 사실을 완전히 무시한다. 현재의 요구 사항만 충족시키기 위한 코드만 작성하고 적응력 높은 코드를 작성하기 위한 노력은 하지 않는다.
  * 두개의 시나리오는 서로 대립하는 극단을 보여준다 두가지 사이에 어떤 지점을 선택해서 개발해야 된다
* 이미 존재하는 기능을 또다시 구현해서는 안 된다
  * 시간과 노력을 절약한다
  * 버그 가능성을 줄여준다
  * 기존 전문지식을 활용한다
  * 코드가 이해하기 쉽다

### 코드 품질의 핵심 요소

* 코드는 읽기 쉬워야 한다
  * 코드가 하는일
  * 어떻게 그 일을 수행하는지
  * 어떤 것을 필요로 하는지
  * 코드 실행 결과물
* 코드는 예측 가능해야 한다
  * 코드가 예상을 벗어나면 명백하게 이상한 일이 발견되기 전까지 시스템은 계속 비정상적으로 작동한다.
* 코드를 오용하기 어렵게 만들라
  * tv 제조 업체는 전원 코드와 HDMI 케이블을 잘못 꽃게 하지 않게 모양을 틀리게 만들었다(요즘 노트북은 모두 USB-C....)
  * 코드 계약은 근본적으로 코드 오용을 어럽게 만들어주는 기술 이다.
* 코드를 모듈화하라
  * 모듈화는 개체나 시스템의 구성 요소가 독립적으로 교환되거나 교체될 수 있음을 의미한다.
* 코드를 재사용 가능하고 일반화할 수 있게 작성하라
  * 재사용성 : 어떤 문제를 해결하기 위한 무언가가 여러 가지 다른 상황에서도 사용될 수 있음
  * 일반화성 : 개념적으로 유사하지만 서로 미묘하게 다른 문제들을 해결할 수 있음을 의미
  * 모듈화된 코드 역시 더 높은 재사용성과 일반화성을 갖는다
* 테스트가 용이한 코드를 작성하고 제대로 테스트하라
  * 버그나 제대로 동작하지 않는 기능을 갖는 코드가 코드베이스에 병합되지 않도록 방지
  * 버그나 제대로 동작하지 않는 기능을 갖는 코드가 베포되지 않도록 막고 서비스 환경에서 실행되지 않도록 보장
  * 테스트 : 코드 혹은 소프트웨어 전체를 테스트하는 것과 관련이 있다
    * 단위 테스트 : 일반적으로 개별 함수나 클래스와 같은 작은 단위의 코드를 테스트한다.
    * 통합 테스트 : 시스템은 일반적으로 여러 구성 요소, 모듈, 하위 시스템으로 구성된다 이러한 하위시스템을 연결하는 과정을 통합이라고 한다
    * 종단간 테스트 : 이 테스트는 처음부터 끝까지 전체 소프트웨어 시스템에서 작동 흐름을 테스트 한다.
  * 테스트 용이성 : 실제 코드가 얼마나 테스트하기 적합한지를 나타낸다

### 고품질 코드 작성은 일정을 지연시키는가?

* 단기적으로는 고품질 코드를 작성하는데 시간이 더 걸릴수 있다
* 중장기적으로는 개발 시간을 단축시켜준다.

`서두르지 않으면 더 빠르다`

### 요약

* 좋은 소프트웨어를 만들려면 고품질 코드를 작성해야 한다
* 실제 서비스 환경에서 실행되는 소프트웨어가 되기 전에 코드는 일반적으로 여러 단계의 검사와 테스트를 통과해야 한다
* 버그나 제대로 동작하지 않는 기능이 사용자에게 제공되거나 비즈니스에 중요한 시스템에서 실행 되는 것을 이러한 검사를 통해 막을수 있다
* 테스트는 코드를 작성하는 모든 단계에서 고려하는 것이 좋다. 코드를 다 작성하고 난 후에 고려 하는 것이 아니다
* 고품질 코드를 작성하면 처음에는 시간이 오래 걸리지만 중장기적으로 개발 시간이 단축되는 경우가 많다.


# 참조

-----
* [좋은코드 나쁜코드: 프로그래머의 코드 품질 개선법](http://www.yes24.com/Product/Goods/109366833)
