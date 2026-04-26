---
layout: post
title: "dgding lesson2(html이 그림을 그리는 방법은)"
date: 2017-02-15 11:22:00 +0900
comments: true
tags : ["css","html","javascript"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

html이 그림을 그리는 방법은 [css specs](https://www.w3.org/Style/CSS/specs.en.html)

왜그렇게 되는지가 중요함 

이번시간 배울것 

---

1. box model

2. normal flow

3. display & float

---

* box model : 크롬 개발자 도구 element 탭에서 computed 보면 나옴 [w3schools box model](http://www.w3schools.com/css/css_boxmodel.asp)

margin -> border -> padding -> contents

박스의 크기를 결정할때(css3 이전)은 contents box기준이 였음

css3에서는 box-sizing: content-box|border-box|initial|inherit; 지금 제안중이다 [w3schools box sizing](http://www.w3schools.com/cssref/css3_pr_box-sizing.asp)

* normal flow : html이 랜더링을 할때 element에 position이 있는데 디폴트는 static position 이다. 표준문서에 9.3 Positioning schemes 에 나와있다. [w3 visuren](https://www.w3.org/TR/CSS2/visuren.html)

block or inline을 선택해서 사용가능 둘다는 안됨[w3 normal flow](https://www.w3.org/TR/CSS2/visuren.html#normal-flow)

세로로 배치하는것은 block [w3 block formatting context](https://www.w3.org/TR/CSS2/visuren.html#block-formatting)

가로로 배치하는것은 inline [w3 Inline formatting contexts](https://www.w3.org/TR/CSS2/visuren.html#inline-formatting)

block을 만들면 inline formatting 발동 이런것을 layering이라도 부른다.(block formatting context, Inline formatting contexts 요소의 집합)

자식 엘리먼트는 모두 포함된다.
새로운 BFC의 자식 엘리먼트는 포함하지 않는다.

[Containing blocks](https://www.w3.org/TR/CSS2/visuren.html#containing-block)
[Containing blocks details](https://www.w3.org/TR/CSS2/visudet.html#containing-block-details)

그리고 보여주신 예제 [링크](https://jsfiddle.net/sanaes/e6jq9zp5/) 

```html

<div style="background:rgb(39,241,188)">
	<div style="float:left;width:100px;height:100px;background:#f00">
		<div style="margin:10px;float:left;width:50px;height:200px;background:#ff0"></div>
	</div>
	sample inline text. sample inline text. sample inline text. sample inline text. sample inline text.
</div>

<div style="clear:both;margin-bottom:200px"></div>

<div style="overflow:hidden;background:rgb(39,241,188)">
	<div style="float:left;width:100px;height:100px;background:#f00">
		<div style="margin:10px;float:left;width:50px;height:200px;background:#ff0"></div>
	</div>
	sample inline text. sample inline text. sample inline text. sample inline text. sample inline text.
</div>


```

위에 예제에서 div가 저렇게 보이는 이유는 bfc가 발동 그럼 bfc에 발동 조건은 [mozilla Block_formatting_context](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context)

* the root element or something that contains it
* floats (elements where float is not none)
* absolutely positioned elements (elements where position is absolute or fixed)
* inline-blocks (elements with display: inline-block)
* table cells (elements with display: table-cell, which is the default for HTML table cells)
* table captions (elements with display: table-caption, which is the default for HTML table captions)
* block elements where overflow has a value other than visible
* flex boxes (elements with display: flex or inline-flex)
* display: flow-root

그중에 overflow value가 visible아니라서 아래에 overflow:hidden;으로 셋팅

[display](https://www.w3.org/TR/css-display-3/)

그런데 표준문서를 보다보니 이런것도 있다. 

Anonymous block boxes [예제](https://jsfiddle.net/sanaes/3y8pojgL/)


```html

<P style="background:rgb(39,241,188)">
This is anonymous text before the SPAN.
<SPAN style="background:#ff0">This is the content of SPAN.</SPAN>
This is anonymous text after the SPAN.
</P>

```

```css

p    { display: inline }
span { display: block }

```

위에서 보면 익명의 block box가 생겨서 나누어진것을 볼수있을것이다.


그럼 또 궁금한것은 기본적으로 block 과 inline 속성을 가진 객체들은 어떤것들이 있을까?


Block-level Elements

```html

<div>
<h1> - <h6>
<p>
<form>

```

Inline Elements

```html

<span>
<a>
<img>

```
이것들은 아래의 float 속성을 볼때 필요하다.

```html

<span>test1234</span>
<div style="float:left;">bbbb</div>

```

[float inline tag](https://jsfiddle.net/sanaes/7q3oenwv/)

```html

<div>test1234</div>
<div style="float:left;">bbbb</div>

```

[float block tag](https://jsfiddle.net/sanaes/djyyynLx/)

또 css selector 의 Pseudo classes에 대해서 배웠는데 [Pseudo-classes](https://developer.mozilla.org/en/docs/Web/CSS/Pseudo-classes)

Pseudo의 사전적 의미는 아래의 의미를 가지고 있다.

1. 허위의, 가짜의; 모조의
2. 꾸며 보이는 사람, 사칭자

전산학에서 pseudo

pseudo : 그 의미를 나타내고 있지만 대체가능하다, 가짜지만 진짜인 경우, 진짜는 아니지만 존재함 그래서 마우스 오버시에 색깔을 변하게 한다던지 이런 특수한 기능을 수행하는 것을 pseudo라고 한다.

css3에서는 이런것도 있다. [Pseudo-elements](https://developer.mozilla.org/en/docs/Web/CSS/Pseudo-elements)

css에 소스점은 몇자리까지 가능?

브라우져 마다 틀림 (최신은 길게 가능) 예) 비율로 줄때 33.3333% 보다 33.333333333333333333333%가 좋음(레티나 디스플레이를 생각하면 됨)


# 참조 
-----

* [강의자료](https://1drv.ms/b/s!As25AGJ08guuga501N3vJ6AckBxV_A)

