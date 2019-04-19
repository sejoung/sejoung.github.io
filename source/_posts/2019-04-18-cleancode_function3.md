---
layout: post
title: "클린코드(함수)3"
date: 2019-04-18 09:08 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### 함수

#### 명령과 조회를 분리 하라.

함수는 먼가를 수행하거나 먼가를 답하거나 둘 중 하나만 해야 된다.

```java
package com.github.sejoung.function.order;

public abstract class Sample {
	public abstract boolean set(String attribute, String value);

	public void run() {
		if (set("username", "unclebob")) {
		}

	}
}
```

위에 set이라는 메소드가 있다. 
설계자의 의도는 attribute있는지를 찾고 있으면 값을 바꾸고 true 없으면 false를 리턴한다는 의도이다.

하나의 메소드에서 두가지 일을 하니 이름도 모호하고 어색하다.

```java

package com.github.sejoung.function.order;

public abstract class Sample {

	public abstract boolean attributeExist(String attribute);
	public abstract void setAttribute(String attribute, String value);

	public void run() {

		if (attributeExist("username")) {
			setAttribute("username", "unclebob");
		}
	}
}

```
위에 처럼 명령과 조회를 분리하면 혼란을 에초에 분리하는것이다.


# 참조
-----

