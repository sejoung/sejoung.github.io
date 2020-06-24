---
layout: post
title: "인텔리제이에서 JPA: Cannot resolve Table 표시하지 않기"
date: 2020-06-18 18:10 +0900
comments: true
tags : ["JPA cannot resolve table","인텔리제이","JPA"]
categories : ["intellij"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 인텔리제이에서 JPA: Cannot resolve Table 표시하지 않기

![인텔리제이에서 JPA: Cannot resolve Table 표시하지 않기1](https://sejoung.github.io/images/2020_06_24_01.png)

위처럼 인텔리제이에서 JPA를 쓸때 에러처럼 표시를 하는데 그에 대한 해결방법이 2가지가 있다

### 첫번째 방법: 코드스타일에서 벨리데이션 하는 부분을 언체크를 한다.

![인텔리제이에서 JPA: Cannot resolve Table 표시하지 않기2](https://sejoung.github.io/images/2020_06_24_02.png)

위에 이미지처럼 해당 부분을 언체크 한다



### 두번째 방법: 데이터 베이스를 연결한다.

![인텔리제이에서 JPA: Cannot resolve Table 표시하지 않기3](https://sejoung.github.io/images/2020_06_24_03.png)

위에 탭에서 데이터 베이스를 설정후에

![인텔리제이에서 JPA: Cannot resolve Table 표시하지 않기4](https://sejoung.github.io/images/2020_06_24_04.png)

위처럼 연결을 시켜준다.


아래는 해결

![인텔리제이에서 JPA: Cannot resolve Table 표시하지 않기5](https://sejoung.github.io/images/2020_06_24_05.png)


# 참조 
-----
* [intellij 206228849-JPA-Cannot-resolve-Table-xxxx-](https://intellij-support.jetbrains.com/hc/en-us/community/posts/206228849-JPA-Cannot-resolve-Table-xxxx-)
* [code-inspection](https://www.jetbrains.com/help/idea/code-inspection.html)

