---
layout: post
title: "RestTemplate 으로 POST 전송시에 파라미터(application/x-www-form-urlencoded)로 메시지 보내기"
date: 2019-12-10 11:39 +0900
comments: true
tags : ["spring","RestTemplate","interceptors"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## RestTemplate 으로 POST 전송시에 파라미터(application/x-www-form-urlencoded)로 메시지 보내기
 
```java

            MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
            parameters.add("func_name", request.getFuncName());
          
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            HttpEntity formEntity = new HttpEntity<>(parameters, headers);

            ResponseEntity<DiscountCheckResponse> responseEntity = fareServerRestTemplate
                .postForEntity(DISCOUNT_CHECK, formEntity, Response.class);

```


위에처럼 객체를 전송하면 에러가 나지만 MultiValueMap에 맵핑을 시켜서 전송하면 문제가 없다.

# 참조
-----


