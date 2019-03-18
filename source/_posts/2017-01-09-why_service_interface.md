---
layout: post
title: "왜 Spring service에 Interface를 만들어야 할까?"
date: 2017-01-09 10:40:00 +0900
comments: true
tags : ["spring","Interface","java"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# Service 부분에 interface를 사용하는 이유는 단위 컴포넌트로서 경계가 되는 부분이며, transaction 처리, exception 처리 등의 AOP 처리가 주로 service 부분에 지정되기 때문(?)

-----

 1. Spring AOP는 두가지 Type의 Proxy를 지원 그 첫번째는 JDK의 Proxy 기능을 이용 두번째 방법은 CGLIB의 Enhancer 클래스를 이용
 2. JDK Proxy는 인터페이스에 대한 Proxy만을 지원 CGLIB의 Enhancer 클래스를 사용해서 만들면 되는것 그래서 위의 이유로는 설명이 안됨
 
 * 강제로 CGLIB 통한 프록시객체 생성방법
 * aop:config 태그에 다음 속성 추가 : proxy-target-class="true"
 * 어노테이션의 경우

```xml
<aop:aspectj-autoproxy proxy-target-class="true" />
```

 * [egovframe의 답변](http://open.egovframe.go.kr/cop/bbs/selectBoardArticle.do?bbsId=BBSMSTR_000000000013&nttId=12689)
 
 * [자바지기님의 사이트 성능측정 내용](http://wiki.javajigi.net/pages/viewpage.action?pageId=1065)


-----

# interface는 어느 시점에 생성하는 것이 적절한가?

-----
"interface를 만드는 것에 대한 거부감은 스프링이 등장하면서 지식을 전파할 때 대부분의 책과 관련 문서에서 Service와 Dao에는 interface를 반드시 만드는 방식으로 예제 소스를 만들다보니 현재 대부분의 프로젝트에서 interface를 왜 만들어야 되는지도 모르는 상태에서 interface를 만드는 상황이 생기다 보니 발생한 것"

자바지기님의 글에서 보듯이 나도 아무 생각없이 만들어서 이용을 했었던것 같다 자바지기님의 포스팅에도 나와있듯이 나도 필요한시점에 만들어서 쓰는것이 좋을것 같다. 

인터페이스가 필요한 이유를 스스로가 설명할 수 있고, 그로 인해 얻는 이득을 정확히 알 수 있을 때 도입하는 것이 좋다고 생각한다. 

이것은 내 의견이고 지인중 한명은 생성후에(확장이 더이상 안된다고 보장할수 없음므로) 먼저 생성한다는 사람도 있다.

이런 고민을 한번쯤 해보는 것도 좋을것 같다.


* [Business Layer에 Interface를 만들어야 할까?](https://slipp.net/questions/19)
* [interface는 어느 시점에 생성하는 것이 적절한가?](https://slipp.net/questions/55)


