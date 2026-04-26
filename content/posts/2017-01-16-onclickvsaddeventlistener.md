---
layout: post
title: "html에서 onclick 이벤트와 addeventlistener를 사용하는것중 어떤것이 더 좋을까요?"
date: 2017-01-16 10:39:00 +0900
comments: true
tags : ["event"]
categories : ["javascript"]
sitemap :
  changefreq : daily
  priority : 1.0
---

html에서 onclick 이벤트와 addeventlistener를 사용하는것중 어떤것이 더 좋을까요?

```html

<button onclick="doSomething()">

```

위에 처럼 예전에는 onclick 속성에 자바스크립트를 써서 코딩을 했습니다. 

위에 문제점은 이벤트 처리가 코드 전체에 퍼져있고 한군데서 컨트롤이 되지 않고 외부에서 js파일을 includes할때는 브라우저의 캐싱을 할수 없게 된다는 것이 였습니다.

그래서 아래처럼 바꿨습니다. 바꾸면 캐싱기능 및 소스 컨트롤 외에도 html 코드와 완벽한 분리가 가능합니다. 

복잡한 코드를 작성시에 좀 더 코드관리가 쉽게 할수있습니다.(spaghettification vs structure)

```html

<script type="text/javascript">
  document.getElementById("test").onclick = doSomething;
    function doSomething() {
      alert("something!");
    }
</script>
<button id="test">

```

그럼 onclick 에서 이벤트를 주는것과 addeventlistener를 사용하는것에 차이점에 대해서 보면

먼저 간단한 예제 소스를 만들어 보겠다. [https://jsfiddle.net/1gb0q135](https://jsfiddle.net/1gb0q135/1/)
  
```html

<button id="btn">Click me!</button>
<script>
var btn = document.getElementById('btn');
btn.onclick = function() { 
  // will be overwritten! 
  console.log('[onclick] 바'); 
}
btn.onclick = function() { 
  
  console.log('[onclick] 보');
}
btn.addEventListener('click', function() {
  console.log('[EventListener] 바');
});
btn.addEventListener('click', function() {
  console.log('[EventListener] 보');
});
</script>

```

onclick은 해당 기능을 update 하는 반면에 addEventListener는 add 하는 방식으로 진행이 됩니다.(위에 콘솔로그를 확인해보시면 이해가 되실것입니다.)

참고로 ie는 다른 메소드를 사용합니다.(attachEvent)

# 참조 
-----

* [W3C Handling_events_with_JavaScript](https://www.w3.org/wiki/Handling_events_with_JavaScript#The_evolution_of_events)
 
* [stackoverflow addeventlistener-vs-onclick](http://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick)

* [simonewebdesign addeventlistener-vs-onclick](http://www.simonewebdesign.it/onclick-vs-addeventlistener)




