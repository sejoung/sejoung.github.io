---
layout: post
title: "클린코드(주석)"
date: 2019-04-23 09:10 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### 주석
우리가 코드로 의도를 표현할때 주석은 필요 없다. 주석은 코드가 아니라 썩는다.
부정확한 주석은 독자를 현혹하고 모호하게 만든다.

#### 주석은 나쁜코드를 보완하지 못한다.
 
코드에 주석을 추가하는 일반적인 이유는 코드가 나빠서이다. 

이런 주석을 달아야 겠어가 아니라 코드를 수정해야 겠어가 맞다.

#### 코드로 의도를 표현하라.

코드로 의도를 표현하는것이 어렵다. 많은 경우 주석을 달려고 하는 의도를 함수로 만들면 된다.

#### 좋은 주석 

##### 법적인 주석
카피라이터나 법적인 조항을 헤더에 달때 이다.

##### 정보를 제공하는 주석
때로는 주석으로 기본적인 정보를 제공하면 편하다.

##### 의도를 설명하는 주석
저자의 결정에 깔린의도를 설명하는 주석

##### 의미를 명료하게 밝히는 주석
애매한 인수나 반환 값은 그의미를 읽기 좋게 표현하면 읽기 좋아진다.

##### 결과를 경고하는 주석
다른 프로그래머에게 결과를 경고할 목적인 주석

##### TODO 주석
때로는 할일을 TODO주석으로 남기면 편하다

#### 나쁜주석

##### 주절거리는 주석
특별한 이유 없이 의무감으로 혹은 프로세스에서 하라고 하니깐 마지못해 주석을 남기는것

##### 같은 이야기를 중복하는 주석
간단한 함수인데 함수의 내용을 설명하는 주석

##### 오해할 여지가 있는 주석
주석에 살짝 잘못된 정보로 인해 오해의 소지가 생긴다.

##### 의무적으로 다는 주석
의무적으로 다는 주석은 아무런 가치가 없다 오히려 코드만 더 헷갈리게 만든다.

##### 이력을 기록하는 주석
예전에는 cvs, svn, git같은 코드 이력 관리 시스템이 없어서 그랬지만 지금은 혼란만 가중시킨다.

##### 있으나 마나하는 주석
너무 쉽거나 당연한 사실을 언급하는 주석

##### 무서운 잡음
저자가 주의를 기울리지 않았다면 독자에게 무슨 소용이 있나

##### 함수나 변수로 표현할수 있으면 주석을 달지마라
함수나 변수로 표현 할수 있으면 주석은 하지 않는것이 좋다.

##### 위치를 표시하는 주석
베너는 너무 자주사용하지 않으면 주의를 환기시킨다. 너무 남용하지 말자

##### 닫는 괄호에 다는 주석
닫는 괄호에 주석을 달고 싶으면 함수를 줄이려 시도 하자.

##### 공로를 돌리거나 저자를 표시하는 주석
코드 제어시스템은 누가 했는지 귀신 같이 기억한다. 굳이 코드를 오염시킬 필요가 없다.

##### 주석으로 처리한 코드
주석으로 처리한 코드는 다른사람이 지우길 주저한다 이유가 있어서 남겨놓았으니 중요하다고 생각한다.
어차피 코드제어시스템이 있으니 주석으로 처리할 필요가 없다. 그냥 삭제하자.

##### HTML 주석
주석에 HTML를 삽입하는 책임은 프로그래머가 아니라 도구가 져야 한다.

##### 전역정보
주석을 달아야 한다면 근처에 있는 코드만 기술하라 전반적인 정보를 기술하지 마라.

##### 너무 많은 정보
주석에다 흥미로운 역사나 너무 많은 정보를 담지 마라.

##### 모호한 관계
주석과 주석이 설명하는 코드는 둘 사이 관계가 명백해야 한다.

##### 함수 헤더
잛은 함수는 긴설명이 필요 없다

##### 비공개 코드에서 javadocs
공개하지 않을 코드에 javadocs는 필요 없다.




# 참조
-----
