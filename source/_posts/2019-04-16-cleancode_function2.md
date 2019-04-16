---
layout: post
title: "클린코드(함수)"
date: 2019-04-16 09:02 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### 함수

#### 서술적인 이름을 사용하라

이름이 주는 가치는 아무리 강조해도 지나치지 않다. 이름이 길어도 상관없다.

#### 함수의 인수

함수에서 이상적인 인수갯수는 0개이다. 다음은 1개 그담은 2개 3개이상은 피하는것이 좋다.

##### 많이쓰는 단항형식

인수로 질문을 던지는경우

인수를 먼가로 변환해 결과를 반환하는경우

##### 플래그인수 

플래그 인수는 추하다. 함수가 대놓고 여러가지 일을 한다고 공표하는 것이니깐

##### 이항함수

1개의 인수보다 2개의 인수가 더 이해하기 어렵다.

하지만 적절한 경우가 있는데

```java
Point p = new Point(0,0);
```
위에 예가 좋은 예이다.

심지어 아주 당연하게 여겨지는 이항 함수 `assertEquals(expected, actual);`에도 문제는 있다 두 인자의 자연적인 순서가 없다

##### 삼항 함수

```java
assertEquals(message, expected, actual);
```

##### 인수 객체

인수가 2~3개가 필요하면 일부를 독자적인 클래스 변수로 선언할 가능성을 짚어 본다.

```java
Circle makeCircle(double x, double y, double radius);

Circle makeCircle(Point center, double radius);
```

위에서는 객체를 생성해 인수를 줄이는 방법이 눈속임이라 여겨질지 모르지만 변수를 묶어서 넘기려면 이름을 붙여야 하므로 결국은 개념을 표현하게 된다.

##### 인수 목록

때로는 인수 개수가 가변적인 함수도 필요하다. String.format 메소드가 좋은 예이다.

##### 동사와 키워드

함수의 의도와 인수의 순서와 의도를 제대로 표현하려면 좋은 함수 이름이 필수적이다.

#### 부수효과를 일으키지 마라.

부수효과는 거짓말이다. 함수에서 한 가지를 하겠다고 약속하고서는 남몰래 다른짓도 하니

```java

package com.github.sejoung.function.sideeffect;

public class UserValidator {

	private Cryptographer cryptographer;

	public boolean checkPassword(String userName, String password) {
		User user = UserGateway.findByName(userName);
		if (user != User.NULL) {
			String codedPhrase = user.getPhraseEncodedByPassword();
			String phrase = cryptographer.decrypt(codedPhrase, password);
			if ("Valid Password".equals(phrase)) {
				Session.initialize();
				return true;
			}
		}
		return false;
	}
}

```
위에 코드에서 `Session.initialize();`는 부수 효과이다.

##### 출력인수

일반적으로 우리는 인수를 함수 입력으로 해석한다. 

```java

appendFooter(StringBuffer report);

```

위에 함수는 코드를 한참 살펴보고 나서야 출력인자인지 알수있다.

이것은 차라리 `report.appendFooter(String html);` 이 낫다.

일반적으로 출력인수는 피해야 된다.

# 참조
-----

