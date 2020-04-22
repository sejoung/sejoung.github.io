---
layout: post
title: "인텔리제이 High Contrast Theme 에서 Code Vision 이 보이지 않을때 해결 방법"
date: 2020-04-22 18:15 +0900
comments: true
tags : ["Code Vision","High Contrast Theme","IntelliJ"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 인텔리제이 High Contrast Theme 에서 Code Vision 이 보이지 않을때 해결 방법

인텔리제이 2020.1 버전에 코드에 관한 추가 정보 얻으면서 코드에 쉽게 집중할 수 있는 Code Vision이 처음으로 구현되었습니다.

해당 기능을 할성화 시키려면 아래 처럼 

설정 화면으로 진입후에

![인텔리제이 High Contrast Theme 에서 Code Vision 이 보이지 않을때 해결 방법1](https://sejoung.github.io/images/2020_04_22_01.png)

 Preferences > Editor > Inlay Hints > Java 경로에서 수정가능

![인텔리제이 High Contrast Theme 에서 Code Vision 이 보이지 않을때 해결 방법2](https://sejoung.github.io/images/2020_04_22_02.png)

High Contrast 테마를 사용하는데 해당 테마에서는 글자색이 검은색으로 보여서 보이지 않습니다.

![인텔리제이 High Contrast Theme 에서 Code Vision 이 보이지 않을때 해결 방법3](https://sejoung.github.io/images/2020_04_22_03.png)

위처럼 Preferences > Editor > Color Scheme > Language Defaults Inline parameter hints > Default 를 수정하면  

![인텔리제이 High Contrast Theme 에서 Code Vision 이 보이지 않을때 해결 방법4](https://sejoung.github.io/images/2020_04_22_04.png)

이제 잘 보이네요

# 참조
-----

