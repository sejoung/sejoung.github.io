---
layout: post
title: "클린코드(Smells and Heuristics)-part2"
date: 2019-05-27 10:00 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### 냄새와 발견법(Smells and Heuristics)-part2

#### 함수

##### 부정 조건은 피하라.

부정 조건은 긍정 조건보다 이해하기 어렵다 가능하면 긍정 조건으로 표현하라.

```java

if(buffer.shoudCompact())

```
위에 코드가 아래 코드 보다 낫다.

```java

if(buffer.shoudNotCompact())

```
###### 함수는 한가지 일만 해야 한다.

함수를 짜다 보면 한 함수 안에다 여러 단락을 이어서 일련의 작업을 수행하고픈 유혹에 빠진다. 
이런 함수는 한가지만 수행 하는 함수가 아니다. 한가지만 수행하는 작은 함수로 나눠야 된다.

##### 숨겨진 시간적인 결합

```java

package com.github.sejoung.function.time.old;

import com.github.sejoung.function.time.Gradient;
import com.github.sejoung.function.time.Spline;
import java.util.ArrayList;
import java.util.List;

public class MoogDiver {

	Gradient gradient;
	List<Spline> splines;

	public void dive(String reason) {
		saturateGradient();
		reticulateSplines();
		diveForMoog(reason);
	}

	private void saturateGradient() {
		gradient = new Gradient();
	}

	private void reticulateSplines() {
		System.out.println(this.gradient);
		splines = new ArrayList<>();
	}

	private void diveForMoog(String reason) {
		System.out.println(this.splines);
		System.out.println(reason);
	}
}


```

위처럼 숨겨진 시간 결합 보다는 아래 코드가 더 낫다.

```java

package com.github.sejoung.function.time.renew;

import com.github.sejoung.function.time.Gradient;
import com.github.sejoung.function.time.Spline;
import java.util.ArrayList;
import java.util.List;

public class MoogDiver {

	Gradient gradient;
	List<Spline> splines;

	public void dive(String reason) {
		Gradient gradient = saturateGradient();
		List<Spline> splines = reticulateSplines(gradient);
		diveForMoog(splines, reason);
	}

	private Gradient saturateGradient() {

		return new Gradient();

	}

	private List<Spline> reticulateSplines(Gradient gradient) {

		List<Spline> splines = new ArrayList<>();

		return splines;
	}

	private void diveForMoog(List<Spline> splines, String reason) {

	}

}


```

위처럼 명시적으로 보여주는것이 좋다.

##### 일관성을 유지하라.

코드 구조를 잡을 때는 이유를 고민하라. 그리고 그 이유를 코드 구조로 명백히 표현하라.

##### 경계 조건을 캠슐화 하라.

경계 조건은 빼먹거나 놓치기 십상이다. 경계 조건은 한곳에서 별도로 처리한다.

```java

if(level +1 < tag.length){
    parts = new Parse(body, tags, level + 1, offset + endTag);
}

```

위코드 보다는 아래 코드가 더 낫다.

```java

int nextLevel = level +1;

if(nextLevel < tag.length){
    parts = new Parse(body, tags, nextLevel, offset + endTag);
}

```

##### 함수는 추상화 수준 한 단계만 내려가야 한다.

함수 내 모든 문장은 추상화 수준이 동일해야 한다.

```java

package com.github.sejoung.function.abstraction;

public class Render {

	private int size;

	public String render() throws Exception {
		StringBuffer html = new StringBuffer("<hr");
		if (size > 0) {
			html.append(" size=\"").append(size + 1).append("\"");
		}
		html.append(">");
		return html.toString();
	}

}


```

위에 코드는 추상화 레벨이 뒤섞여 있다. 첫번째는 같은 레벨에 길이가 있다는것 두번째는 hr 테그 자체의 문법

```java

package com.github.sejoung.function.abstraction;

public class Render2 {

	private int exterDashes;

	public String render() throws Exception {

		HtmlTag hr = new HtmlTag("hr");

		if (exterDashes > 0) {
			hr.addAttribute("size", hrSize(exterDashes));
		}

		return hr.html();
	}

	private String hrSize(int height) {
		int hrSize = height + 1;
		return String.format("%d", hrSize);
	}

}

```

위 처럼 추상화 레벨을 맞추었다.

##### 구성 정보는 최상위 단계에 두어라.

구성 상수는 최상위 단계에 둔다. 그래야 변경하기도 쉽다. 구성 변수는 나머지 코드에 인수로 넘긴다. 저차원 함수에 상수 값을 정의하면 안된다.

##### 추이적 탐색을 피하라.

일반적으로 한 모듈은 주변 모듈을 모를수록 좋다. 디미터의 법칙이라고 한다.

```java
a.getB().getC().getD();
``` 
위에 코드는 부끄럼 타는 코드라고도 한다. 

요지는 자신이 직접 사용하는 모듈만 알아야 한다.

위에 코드처럼 나올것이면 모듈을 만들어야 한다.

#### 자바

##### 긴 import 목록을 피하고 와일드 카드를 사용하라.

이부분은 동의를 못할듯 

##### 상수는 상속하지 않는다.

어떤 프로그래머는 상수를 인터페이스에 넣은 다음 그 인터페이스를 상속해 상수를 사용한다.

차라리 static import를 사용하자.

##### 상수 대 Enum

Enum을 마음껏 활용하라. Enum은 강력한 도구다 문법을 자세히 보라.

#### 이름 

##### 서술적인 이름을 사용하라.

소프트웨어 가독성의 90%는 이름이 결정한다. 그러므로 시간을 들여서 현명한 이름을 선택하고 유효한 상태로 유지한다.

##### 적절한 추상화 수준에서 이름을 선택하라.

구현을 드러내는 이름은 피하라. 추상화 수준을 반영하는 이름을 선택하라.

##### 가능하다면 표준 명명법을 사용하라.

기존 명명법을 사용하는 이름은 이해하기 더 쉽다.

##### 명확한 이름

함수나 변수의 목적을 명확히 밝히는 이름을 선택

##### 긴 범위는 긴이름을 사용하라.

이름 길이는 범위 길이에 비례해야 한다. 범위가 5줄 안팎이면 i나 j 같은 변수 이름도 괜찮다.

##### 인코딩은 피하라.

이름에 유형 정보나 범위 정보를 넣어서는 안된다.

##### 이름으로 부수 효과를 설명하라.

함수, 변수, 클래스가 하는 일은 모두 기술하는 이름을 사용한다.

#### 테스트 

##### 불충분한 테스트

테스트 케이스는 몇 개나 만들어야 충분할까? 테스트 케이스는 모든 조건 모든 계산에 맞게 작성해야 한다.

##### 커버리지 도구를 사용하라.

커버리지 도구는 테스트가 빠뜨리는 공백을 알려준다.

##### 사소한 테스트를 건너뛰지 마라.

사소한 테스트가 제공하는 문서적 가치는 구현에 드는 비용을 넘어선다.

##### 무시한 테스트는 모호함을 뜻한다.

때로는 요구사항이 불분명하기에 프로그램이 돌아가는 방식을 확신하기 어렵다.
모호함이 존재하는 테스트 케이스가 컴파일 가능한지 불가능 한지 달렸다.

##### 경계 조건을 테스트 하라.

경계조건은 각별히 신경써서 테스트 한다.

##### 버그 주변은 철저하게 테스트하라.

버그는 서로 모이는 경향이 있다. 한 함수에서 버그를 발견했다면 그함수를 철저히 테스트 하는 편이 좋다.

##### 실패 패턴을 살펴라

때로는 테스트 케이스가 실패하는 패턴으로 문제를 진단 할수 있다. 꼼꼼한 테스트 케이스는 함리적인 순서로 정렬하면 패턴이 드러난다.

##### 테스트 커버리지 패턴을 살펴라.

통과하는 테스트 케이스가 실행하는 코드나 실행하지 않는 코드를 살펴보면 실패하는 테스트 케이스가 실패하는 이유가 있다.

##### 테스트는 빨라야 한다.

느린 테스트 케이스는 실행하지 않게 된다. 테스트 케이스가 빨리 돌아가도록 최대한 노력한다.

#### 결론

일군의 규칙만 따른다고 클린 코드가 얻어지지 않는다. 발견법 목록을 익힌다고 소프트웨어 장인이 되지는 못한다. 
전문가 정신과 장인 정신은 가치에서 나온다. 그 가치에 기반을 둔 규율과 절제가 필요하다.

# 참조
-----



