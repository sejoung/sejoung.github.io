---
layout: post
title: "dgding lesson1(그래픽 시스템)"
date: 2017-02-15 08:53:00 +0900
comments: true
tags : ["css","html","javascript"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

그래픽 시스템

기본은 점(도트) 

fixed number : 정형화 되있는 좌표를 가지고 점으로 숫자나 그래픽을 그릴수 있음, 단점 업데이트가 어렵다(좌표를 다시 계산 해야됨)

abstract calculator : fixed number를 추상화 시킴 예) %, left, right, top, block, inline, float 등..

component : button, img, div, textarea 등..

frameworks : 상위 레벨

 
---


	fixed number

		|

	abstract calculator

		|

	component

		|

	frameworks

	
	
---


rendering system : 시각화 되지 않은걸 시각화 시키는것 예) html -> 웹

geometry calculator : 랜더링시 위치를 잡는 시스템

fragment fill : 픽셀을 채워 가는 행위(색칠)

html 강점 : 텍스트 랜더링이 강함 예) ligature (러시아어 필기체)

아래 내용이 먼가 알고는 있었지만 의식하지 않고 있었는데 의식을 하게 되는 계기가 된거 같다

개발자들 사이에서 버그가 나면 에러를 다른 사람이 잡아주면서 말한다 컴퓨터는 거짓말을 안한다 라고 

그 내용과 일맥상통하는 내용인듯

---

	공리나 가정 

		|
	
	그시대 사람이 믿고 있는것(패러다임)

		|
	
	자연과학엔 패러다임이 존재함 
	
		|
	
	컴퓨터 사이언스에는 공리가 없다.(무조건 실제로 만들 수 있다.)

		|
	
	지식이 점진적으로 쌓인다.


---

css[cascading style sheets]랑 html의 분리는 의미와 표현의 분리 -> 실제로 html만 보면 의미만 존재 -> 예외 완전 기능적 태그(이미지, 비디오, 오디오) 깍뚜기 div, span…(검색엔진이 무시하기 편함) -> div는 궁극적으로 적게쓰는것이 좋음

html의 class는 오직 스타일과의 바인딩만을 위해 사용

css는 declaration block과 selector로 구성된것을 rule이라고 부름 옆에 링크는 css1 표준 지금 내용은 Basic concepts에서 나오고 있다.

1. sheet는 rule집합 
2. cascade는 계단식 상속 
3. cascading style sheets 

위에서 설명한 모든 내용이 css 표준에 나오고 있다.[CSS1](https://www.w3.org/TR/2008/REC-CSS1-20080411/)

html에도 default stylesheet가 있다 표준링크[CSS2](https://www.w3.org/TR/CSS2/sample.html)

그럼 cascade 관련 문서는 여기를 참조 하면 된다. [w3 cascade](https://www.w3.org/TR/CSS2/cascade.html)

첫번째 수업때 block과 inline도 배웠는데 이것에 대한 상세 설명은 두번째 수업때 있어서 생략한다

표준을 보라고 말씀하셨는데 표준에 대해서 알고있으면서 나조차 보지 않고 있었다 이제는 보고 왜? 이렇게 되는지 잘알아야겠다 

이제 나도 개자이너 입문 ㅋ


# 참조 
-----

* [강의자료](https://1drv.ms/b/s!As25AGJ08guuga5eZK-jL6MeCLyyuQ)


