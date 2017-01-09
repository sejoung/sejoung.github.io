---
layout: post
title: "왜 Business Layer에 Interface를 만들어야 할까?"
date: 2017-01-09 10:40:00 +0900
comments: false
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

====




http://okky.kr/article/259740

http://wiki.javajigi.net/pages/viewpage.action?pageId=1065

https://slipp.net/questions/55

https://slipp.net/questions/19

http://okjsp.net:8080/article/321136?note=1053403

http://www.okjsp.net:8080/article/315082?note=1037610

http://multifrontgarden.tistory.com/97
