---
layout: post
title: "클린코드"
date: 2019-04-12 11:00 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### 의미 있는 이름

#### 검색하기 좋은 이름을 사용하

```java

package com.github.sejoung.naming.search;

public class TEST {

	private static final int WORK_DAYS_PER_WEEK = 5;
	private static final int NUMBER_OF_TASKS = 34;

	private void asis() {
		int[] t = {1, 2};
		int s = 0;
		for (int i = 0; i < 34; i++) {
			s += (t[i] * 4) / 5;
		}
		System.out.println(s);
	}


	private void tobe() {
		int [] taskEstimate = {1, 2};
		int realDaysPerIdealDay = 4;
		int sum = 0;

		for (int i = 0; i < NUMBER_OF_TASKS; i++) {
			int realTaskDays =taskEstimate[i] * realDaysPerIdealDay;
			int realTaskWeeks = (realTaskDays/WORK_DAYS_PER_WEEK);
			sum += realTaskWeeks;
		}
		System.out.println(sum);
	}

}


```

위에 asis코드와 tebe코드중 어느것이 검색에 더 편하겠나? 일단 숫자형식은 검색하기 매우 까다롭다 이름을 의미 있게 지으면 검색하기 편해진다.


#### 인코딩은 피하라

##### 헝가리식 표기법

옛날 원도우 C API는 헝가리식 표기법을 매우 중요하게 생각했다. 실제로 컴파일하기 전에도 해당 변수가 어떤 타입인줄 알수있다.

요즘은 IDE가 매우 좋아졌다.

##### 맴버 변수 접두어

이제는 맴버 변수 접두어를(m_)를 붙힐 필요가 없다. 

```java

package com.github.sejoung.naming.encoding;

public class Part {

	private String m_dsc;
	
	private void setName(String name) {
		this.m_dsc = name;
	}

}

```

```java

package com.github.sejoung.naming.encoding;

public class Part {
	
	private String description;

	public void setDescription(String description) {
		this.description = description;
	}

}

```

어떤 방식이 더 좋다고 느껴지나

##### 인터페이스 클래스와 구현클래스

인터페이스이름과 구현 클래스 이름을 어떻게 지어야 될까? 인터페이스에 I나 구현 클래스에 C를 붙이는거 보다는 Impl 이 낫다


#### 자신의 기억력을 자랑하지 마라

변수명을 a b c 아님 축약어를 쓰지마라 자신에 기억력이 좋다고 자랑 하지 마라.

#### 클래스 이름 

클래스 이름과 객체 이름은 명사나 명사구가 좋다.

#### 메소드 이름

메소드 이름은 동사나 동사구가 좋다.

#### 기발한 이름은 피하자.

이름이 너무 기발하면 저자와 유머 감각이 비슷한 사람만, 그리고 농담기억하는 동안만 이름을 기억한다.

#### 개념 하나에 단어 하나를 사용하라.

추상적인 개념 하나에 단어 하나를 선택해 고수한다.

#### 말장난을 하지마라

프로그래머는 코드를 최대한 이해하기 쉽도록 짜야 한다. 의도를 밝힐 책임이 저자에게 있다.

#### 해법 영역에서 사용하는 이름을 사용하라.

코드를 읽는 사람도 프로그래머라는 사실을 명심한다. 그러므로 전산용어 알고리즘 이름 패턴이음 수학용어등을 사용해도 괜찮다.

#### 문제 영역과 관련 있는 이름을 사용하라.

적절한 프로그래머 용어가 없다면 문제 영역의 이름을 가지고 온다.

#### 의미 있는 맥락을 추가하라.

예를 들면 street, zipcode, state, city 등의 변수를 사용하면 주소라는 사실을 알수 있다. 
하지만 어느 메소드에서 state 하나만 사용하면 주소라는 사실을 알수 있을까?

#### 불필요한 맥락을 없에라

LG에서 프로젝트를 한다고 모든 클래스에 LG를 붙이는건 아주 않좋다.


# 참조
-----

