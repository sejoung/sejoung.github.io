---
layout: post
title: "인텔리제이 junit4 자동생성 포멧 import 바꾸기"
date: 2019-05-16 16:26 +0900
comments: true
tags : ["intellij","junit"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 인텔리제이 junit4 자동생성 포멧 import 바꾸기


![인텔리제이 UI1](https://sejoung.github.io/images/2019_05_16_01.png)

위에 메뉴에 들어가서 보면 


```java
import static org.junit.Assert.*;
```
위에 Assert가 import 되어 있다.

난 assertj가 좋으니 아래 처럼 구문을 수정하면 된다.

```java
import static org.assertj.core.api.Assertions.assertThat;

```

# 참조
-----

