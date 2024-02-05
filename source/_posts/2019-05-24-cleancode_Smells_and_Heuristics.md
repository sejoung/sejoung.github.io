---
layout: post
title: "클린코드(Smells and Heuristics)-part1"
date: 2019-05-24 10:12 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### 냄새와 발견법(Smells and Heuristics)-part1

#### 주석

##### 부적절한 정보

다른 시스템(svn, git, 이슈트렉커 등등)에 저장될 정보는 주석으로 부적절하다.

주석은 코드의 설계에 기술적인 설명을 부연하는 수단이다.

##### 쓸모 없는 주석

오래된 주석, 엉뚱한 주석, 잘못된 주석은 더이상 쓸모가 없다.

##### 중복된 주석

코드만으로 설명이 가능한데 구구절절 설명한 주석이다.

```java

i++;// i 증가

```

또 다른 예로 함수 시그니처만 달랑 기술하는 javadoc이다.

##### 성의 없는 주석

작성할 가치가 있는 주석은 잘 작성할 가치도 있다.

##### 주석 처리된 코드

주석으로 처리된 코드는 흉물 그자체이다. 주석으로 처리된 코드를 발견하면 그 즉시 지워라

#### 환경

##### 빌드에 여러 단계가 걸린다.

빌드는 간단히 한단계로 끝나야 된다, 소스 컨트롤 시스템에서 여러개를 다운 할 필요 없이 하나의 명령으로 빌드 되야 한다.

##### 테스트에 여러 단계가 걸린다.

모든 단위 테스트는 한명령으로 돌려야 한다.

#### 함수

##### 너무 많은 인수

함수에서 인수 개수는 작을 수록 좋다. 넷이상은 그가치가 아주 의심스러우므로 피한다.

##### 출력인수

출력인수는 직관에 위배한다. 먼가 상태를 변경해야 된다면 함수가 속한 객체의 상태를 변경한다.

##### 플래그 인수

boolean 인수는 함수가 여러기능을 수행한다는 명백한 증거이다.

##### 죽은 함수

아무도 호출하지 않는 함수는 삭제한다.

#### 일반

##### 한소스 파일에 여러 언어를 사용한다.

이상적으로 한소스 파일이 한 언어만 사용하는것이 좋다.

##### 당연한 동작을 구현하지 않는다.

최소 놀람의 원칙에 의거해 함수나 클래스는 다른 프로그래머가 당연하게 여길 만한 동작과 기능을 제공해야 한다.

##### 경계를 올바로 처리하지 않는다.

코드는 올바로 동작해야 한다.

스스로의 직관에 의존하지 마라. 모든 경계 조건을 찾아내고, 모든 경계조건을 테스트 하는 테스트 케이스를 작성하라.

##### 안전 절차 무시

체르노빌 원전사고는 책임자가 안전 절차를 차례로 무시하는 바람에 일어났다. 
안전 절차를 무시하면 위험하다 경고를 무시하지 마라.

##### 중복

여기서 가장 중요한 원칙중 하나.
코드에서 중복을 발견하면 추상화할 기회로 생각하라

어디서든 중복을 발견하면 없애라.

##### 추상화 수준이 올바르지 못하다.

추상화는 저차원 상세 개념에서 고차원 일반 개념을 분리한다. 
추상화 수준을 맞춰야 된다.


##### 기본 클래스가 파생 클래스에 의존한다.

고차원의 기본 클래스가 파생클래스를 알아야 되면 문제가 있다.

##### 과도한 정보

잘 정의된 모듈은 인터페이스가 아주 작다. 정보를 너무 많이 주면 잘못 설계된 모듈일 가능성이 높다.

##### 죽은 코드

죽은 코드란 실행되지 않는 코드를 가리킨다. 죽은 코드를 발견하면 시스템에서 제거하라.

##### 수평 분리

변수와 함수는 사용되는 위치에 가까이 정의한다. private 함수는 처음으로 호출한 직후에 정의한다.


##### 일관성 부족

어떤 개념을 한방식으로 구현했다면 유사한 개념도 같은 방식으로 구현한다.

##### 잡동사니

비어있는 기본생성자가 왜 필요한가? 쓸모없이 코드만 복잡하게 만든다. 아무도 호출하지 않는 함수, 정보를 제공하지 못하는 주석 좋은 예다.
보이는 즉시 삭제하자 소스 파일은 언제나 깔끔 한것이 좋다.

##### 인의적 결합

서로 무관한 개념을 인위로 결합하지 않는다. 예를 들면 일반적인 enum은 특정 클래스에 속할 이유가 없다.

##### 기능 욕심

기능을 욕심을 내서 클래스를 분리했지만 해당 클래스가 다른 클래스에 결합도가 높다면 해당 클래스에 속하는것이 좋다.

##### 선택기 인수

3항식(Ternary operator)은 큰함수를 작은 함수로 쪼개기 싫은 게으름의 소산이다.

근데 selector arguments 라는데 3항식 부분을 이야기 한거 같고 오묘하네 책을 봐야 이해가 될듯

##### 애매한 의도

코드를 짤 때는 의도를 최대한 분명히 밝힌다.

##### 잘못된 책임을 부가한 

코드의 배치가 될곳은 최소 놀람의 원칙을 적용한다.

##### 부적절한 static 함수

보통 static 함수보다 인스턴스 함수가 더 낫다. 조금이라도 의심스러우면 인스턴스 함수로 정의한다.

만약 static 함수를 정의 하겠다면 재정의 할 가능성이 없는지 다시 한번 고려 해야 한다.

##### 서술적 변수

서술 적인 변수 이름은 많이 써도 괜찮다. 일반적으로 많을 수록 더 좋다.

##### 이름과 기능이 일치하는 함수

```java

Date newDate = date.add(5);

```
위에 코드는 이름이 해당 기능을 표현 해주지 못한다. 

addDayTo나 이런식의 이름을 정하는것이 좋다.

##### 알고리즘을 이해하라.

프로그램은 흔히 탐험이다. 구현이 끝났다고 선언하기 전에 함수가 돌아가는 방식을 확실히 이애하는지 확인하라.

##### 논리적 의존성은 물리적으로 드러내라

한 모듈이 다른 모듈에 의존한다면 의존성은 물리적이어야 한다. 논리적 의존성만으로는 부족하다.

의존하는 정보를 명시적으로 요청하는 편이 낫다.

##### if/else 혹은 switch/case 문보다 다형성을 사용하라.

선택유형 하나에는 switch 문은 하나 만 사용한다. 다형성 객체를 생성해 switch문을 대신한다.

##### 매직 숫자는 명명된 상수로 교체하라.

```java

assertEquals(7777,Employee.find("John Doe").employeeNumber());

```
위에 코드에서 매직 넘버는 7777, John Doe 이다. 이부분을 상수로 교체하자.

##### 정확하라.

코드에서 모호성과 부정화은 의견차나 게으름의 결과다.

##### 관례보다 구조를 사용하라.

설계 결정을 강제할때는 규칙보다 관례를 사용한다. 명명 관례도 좋지만 구조 자체로 강제하면 더 좋다.

##### 조건을 캡슐화 하라.

부울 논리는 (if나 while 문에 넣어서 생각하지 않아도)이해하기 어렵다. 조건에 의도를 분명히 밝히는 함수로 표현하라.

예를 들어.

```java

if(shouldBeDeleted(timer))

```

위보다 아래의 코드가 더 낫다.

```java

if(timer.hasExpired() && !timer.isRecurrent())

```

# 참조
-----


