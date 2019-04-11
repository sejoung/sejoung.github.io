---
layout: post
title: "클린코드"
date: 2019-04-11 09:00 +0900
comments: true
tags : ["클린코드","cleancode"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 클린코드

### 클린코드

몇년만에 다시 클린코드를 읽으려고 한다. 또 다른 느낌을 줄수 있을것같다.

태도가 중요하다. 시간에 쫓겨서 아님 관리자 때문에 요구사항이 바껴서 이유를 되는데 문제는 프로그래머에 있다. 우리가 전문가 답지 못해서 이다.

우리는 저자다. 코드는 짜는 시간보다 읽는 시간이 훨씬 길다.

보이스카웃 규칙을 지키가 처음 왔을때 보다 더 깨끗하게 하고 떠나라.

### 의미 있는 이름

#### 의도를 분명히 밝혀라

```java

int d; // 경과시간(단위:날짜 수)

```

위에 처럼 주석이 필요하면 의도를 분명하게 밝히지 못한것이다 코드에 의도를 분명히 밝혀라

```java

int elapsedTimeInDay;

```

#### 그릇된 정보를 피하라.

hp, aix, sco는 변수명으로 적합하지 않다 유니스의 변종을 가르키는 용어이다.

그리고 실제로 List가 아니라면 List라고 명명하지 말자

#### 의미 있게 구분하라.

Product 라는 클래스가 있다고 가정하면 다른 클래스 ProductInfo 나 ProductData 라고 부른 다면 개념을 구분하지 않은체 이름을 다르게 한경우이다.

Info 나 Data는 a나 an the와 마찬가지로 의미가 불분명하다.

불용어는 중복이다. NameString이 Name보다 뭐가 나은가?

#### 발음하기 쉬운 이름을 사용하라.

사람들은 단어에 능숙하다. 

```java

class DtaRcrd102{
    private Data genymdhms;
}

```

```java

class Customer{
    private Data generationTimestamp;
}

```

위에 두개 코드중 어느것이 발음하기 편한가.


# 참조
-----

