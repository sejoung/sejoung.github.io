---
layout: post
title: "Passing Arguments to Event Handlers"
date: 2019-06-17 17:25 +0900
comments: true
tags : ["event","es6"]
categories : ["javascript"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 이벤트 처리에 인수를 전달하는 방법


```html

<button onClick=(e) => this.deleteRow(id, e)>Delete Row</button>


```

위 처럼 익명 함수를 이용해 이벤트를 처리 가능하다.

vuejs에는 $event가 있다.


```html

<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

```

```javascript

// ...
methods: {
  warn: function (message, event) {
    // now we have access to the native event
    if (event) event.preventDefault()
    alert(message)
  }
}

```

# 참조
-----
* [How to pass parameters into the function?](https://github.com/vuejs/vue-touch/issues/16)
* [Passing Arguments to Event Handlers](https://reactjs.org/docs/handling-events.html)
* [vuejs events](https://vuejs.org/v2/guide/events.html)
