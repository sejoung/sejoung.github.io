---
layout: post
title: "bean validation Locale 수정"
date: 2021-08-02 21:50 +0900
comments: true
tags : ["bean validation","message","한글","벨리데이션","junit5"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# bean validation Locale 수정

```java

    @BeforeEach
    void before() {
        Locale.setDefault(Locale.US);
    }

```


# 참고자료
-----

