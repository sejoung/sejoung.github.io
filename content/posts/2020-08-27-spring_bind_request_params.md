---
layout: post
title: "spring에서 form으로 전송시 setter 없이 bind 하기"
date: 2020-08-27 18:00 +0900
comments: true
tags : ["spring","bind request params","application/x-www-form-urlencoded","bind"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# spring에서 form으로 전송시 setter 없이 bind 하기

```java

@ControllerAdvice
public class BindingControllerAdvice {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.initDirectFieldAccess();
    }

}

```

위 처럼 컨트롤러 어드바이스에 등록시키면 setter 없이도 바인드가 된다

# 참조
-----
* [how-to-bind-request-params-without-setters](https://stackoverflow.com/questions/40896217/how-to-bind-request-params-without-setters)
