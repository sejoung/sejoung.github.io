---
layout: post
title: "RestTemplate에 인터셉터 설정으로 데이터 확인하기"
date: 2019-12-10 11:23 +0900
comments: true
tags : ["spring","RestTemplate","interceptors"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## RestTemplate에 인터셉터 설정으로 데이터 확인하기

아래 코드

```java

import java.io.IOException;
import java.nio.charset.Charset;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.StreamUtils;

@Slf4j
public class RequestResponseLoggingInterceptor implements ClientHttpRequestInterceptor {

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body,
        ClientHttpRequestExecution execution) throws IOException {
        logRequest(request, body);
        ClientHttpResponse response = execution.execute(request, body);
        logResponse(response);
        return response;
    }

    private void logRequest(HttpRequest request, byte[] body) throws IOException {
        log.debug(
            "===========================request begin================================================");
        log.debug("URI         : {}", request.getURI());
        log.debug("Method      : {}", request.getMethod());
        log.debug("Headers     : {}", request.getHeaders());
        log.debug("Request body: {}", new String(body, Charset.defaultCharset()));
        log.debug(
            "==========================request end================================================");
    }

    private void logResponse(ClientHttpResponse response) throws IOException {
        log.debug(
            "============================response begin==========================================");
        log.debug("Status code  : {}", response.getStatusCode());
        log.debug("Status text  : {}", response.getStatusText());
        log.debug("Headers      : {}", response.getHeaders());
        log.debug("Response body: {}",
            StreamUtils.copyToString(response.getBody(), Charset.defaultCharset()));
        log.debug(
            "=======================response end=================================================");
    }
}


```

일단 위에 클래스에서 해당 값을 찍고 


```java

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder) {
        ClientHttpRequestFactory factory = new BufferingClientHttpRequestFactory(
            new SimpleClientHttpRequestFactory());
        return restTemplateBuilder
            .rootUri(server).setReadTimeout(500)
            .setConnectTimeout(500).interceptors(new RequestResponseLoggingInterceptor())
            .customizers(restTemplate -> restTemplate.setRequestFactory(factory)).build();
    }

```

위처럼 factory를 바꿔줘야함



# 참조
-----


