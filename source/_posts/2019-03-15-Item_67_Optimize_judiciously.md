---
layout: post
title: "아이템 67. 최적화는 신중히 하라."
date: 2019-03-15 10:49 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 67. 최적화는 신중히 하라.

모든 사람들이 새겨야 할 최적화 격언 

맹목적인 어리석음을 포함해 그 어떤 핑계보다 효율성이라는 이름 아래 행해진 컴퓨팅 죄악이 더 많다 (심지어 효율을 높이지도 못하면서)

- 윌리엄 울프(Wulf72)

(전체의 97% 정도인) 자그마한 효율성은 모두 잊자. 섣부른 최적화가 만약의 근원이다. - 도널드 크누스(Knuth74)

최적화를 할 때는 다음 두 규칙을 따르라.

첫 번째, 하지마라.
두 번째, (전문가 한정) 아직 하지 마라. 다시 말해, 완전히 명백하고 최적화되지 않은 해법을 찾을 때까지는 하지 마라.
- M.A 잭슨 (Jackson75)

위에 격언은 자바가 탄생하기 20년전에 나온것임

* 빠른 프로그램 보다는 좋은 프로그램을 작성하라.
* 성능을 제한하는 설계를 피하라
* API를 설계할 때 성능에 주는 영향을 고려하라.
* 성능을 위해 API를 왜곡하는것은 않좋은 생각이다.
* 각각 최적화 시도 전후 성능을 측정하라.

프로파일링 도구를 활용하는것도 좋은 방법이다.


# 참조
-----
* [아이템 50. 적시에 방어적 복사본을 만들어라.](https://sejoung.github.io/2019/02/Make_defensive_copies_when_needed)
* [아이템 18. 상속보단 컴포지션을 사용하라](https://sejoung.github.io/2018/12/Favor_composition_over_inheritance)
* [아이템 64. 객체는 인터페이스를 사용해 참조하라.](https://sejoung.github.io/2019/03/Item_64_Refer_to_objects_by_their_interfaces)
