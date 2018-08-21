---
layout: post
title: "ajax_https_cookies"
date: 2018-08-21 16:54 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### https에서 ajax 호출시에 cookies 정보가 않넘어와요 ㅜㅜ

XMLHttpRequest spec에 보면 withCredentials이라는 속성이 있습니다. 이부분은 기본 값이 false 입니다.

해당 값이 나타내는 바는 아래와 같습니다.

```
인증서 가 cross-origin request에 포함될 경우 true 입니다. cross-origin request에서 제외 될 때 및 cookies가 응답에서 무시되어야하는 경우 거짓입니다. 처음에는 거짓.

When set : 발생에 " InvalidStateError" DOMException경우 상태가 아닌 보내지 않은 이나 열 , 또는 경우 send()플래그가 설정됩니다.

```

그럼 우리는 jquery ajax를 사용했으니 jquery에서 사용법은 아래 처럼 사용하면 되는데 이 속성은 1.5.1버전 부터 추가 되었습니다.

```javascript

$.ajax({
   url: a_cross_domain_url,
   xhrFields: {
      withCredentials: true
   }
});


```
 

# 참조 
-----
* [XMLHttpRequest#the-withcredentials-attribute](https://xhr.spec.whatwg.org/#the-withcredentials-attribute)
* [jquery.ajax](http://api.jquery.com/jQuery.ajax/)
* [http-cookies-and-ajax-requests-over-https](https://stackoverflow.com/questions/10230341/http-cookies-and-ajax-requests-over-https)
