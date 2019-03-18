---
layout: post
title: "HTTP PUT 메소드"
date: 2018-09-21 10:51 +0900
comments: true
tags : ["spring","spring config"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### HTTP PUT 메소드

rest api 디자인을 해서 서비스를 하는데 PUT 메소드를 사용하면서 Form 파라미터를 선언해서 전달함.
HTML form에서는 PUT 메소드를 지원하지 않습니다.

그리고 응답 값을 200으로 전달하고 있는데 PUT 메소드에서는 PUT요청이 성공적으로 해당 자료를 생성 했다면
서버는 반드시 사용자 에이전트에게 201 (Created) 응답을 보내서 그 사실을 알려주어야 합니다.

자료가 정상적으로 수정 되었다면 서버는 반드시 200 (OK) 또는 204 (No Content) 를 응답으로 보내 성공적으로 요청을 마무리했다는 것을 알려주어야 합니다.

그리고 요즘 spring을 boot로만 사용하다 보니 설정을 잊고 있었습니다.
메세지 바디에 정상적으로 데이터를 던지고 객체형태로 받을때 @RequestBody 만 적으면 문제가 없는줄 알았는데 컨버팅이 되지 않았습니다.

아래의 messageConverter를 추가해줘서 처리했습니다 MappingJackson2HttpMessageConverter

```java

    @Bean
    public RequestMappingHandlerAdapter rmha() {
        RequestMappingHandlerAdapter rmha = new RequestMappingHandlerAdapter();
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<HttpMessageConverter<?>>(5);
        StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter();
        stringHttpMessageConverter.setWriteAcceptCharset(false);  // see SPR-7316
        messageConverters.add(new ByteArrayHttpMessageConverter());
        messageConverters.add(stringHttpMessageConverter);
        messageConverters.add(new SourceHttpMessageConverter<>());
        messageConverters.add(new AllEncompassingFormHttpMessageConverter());
        messageConverters.add(new MappingJackson2HttpMessageConverter());
        rmha.setMessageConverters(messageConverters);
        return rmha;
    }


```

boot에 익숙해지니 너무 잊고 있었네요 ㅜㅜ


# 참조 
-----
* [rfc7231_put](https://tools.ietf.org/html/rfc7231#section-4.3.4)
* [mozilla_HTTP_PUT_Methods](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/PUT)
* [stackoverflow Using PUT method in HTML form](https://stackoverflow.com/questions/8054165/using-put-method-in-html-form)
