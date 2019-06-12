---
layout: post
title: "Component template should contain exactly one root element. If you are using v-if on multiple elements, use v-else-if to chain them instead."
date: 2019-06-12 17:59 +0900
comments: true
tags : ["vuejs","Component template should contain exactly one root element. If you are using v-if on multiple elements, use v-else-if to chain them instead."]
categories : ["javascript"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## Component template should contain exactly one root element. If you are using v-if on multiple elements, use v-else-if to chain them instead.

7년만에 자바스크립트를 하는데 어려운 점이 많네요 ㅜㅜ 

일단 뷰에서 컴포넌트를 선언할때 위에 같은 에러가 나는데

컴포넌트에 templet에  root element 는 하나 이상 선언할수 없습니다.

```javascript

const testTemplate = {
    template:`
    <div></div>
    <div></div>
    `
};

```

위와 같이 선언 할때 에러가 납니다.

위와 같은 것이면 아래처럼 감싸서 하나로 선언해주세요 ㅜㅜ


```javascript

const testTemplate = {
    template:`
    <div>
        <div></div>
        <div></div>
    </div>
    `
};

```


# 참조
-----

