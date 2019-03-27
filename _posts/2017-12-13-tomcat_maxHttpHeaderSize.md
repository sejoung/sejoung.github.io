---
layout: post
title: "tomcat_maxHttpHeaderSize"
date: 2017-12-13 11:51:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

# tomcat_maxHttpHeaderSize

기본적으로 tomcat에 헤더 사이즈를 설정 하지 않으면 tomcat 에서는 8 * 1024 bytes (8K) 지정이 된다 

보통 상황에서는 문제가 없을것이다 하지만 헤더에 많은 정보를 담을수 밖에 없는 서비스를 만들때는 고려를 해야된다.

일반적으로는 cookies에 클라이언트 단에 정보를 저장하는 방법을 취할수있는데 그정보가 http에서는 header에 실어져서 서버로 전송하게 된다.

cookies를 담는 헤더 정보는 아래는 4가지 정보가 있다.

```

Cookie
Contains stored HTTP cookies previously sent by the server with the Set-Cookie header.

Set-Cookie
Send cookies from the server to the user agent.

Cookie2 
Used to contain an HTTP cookie, previously sent by the server with the Set-Cookie2 header, but has been obsoleted by the specification. Use Cookie instead.

Set-Cookie2 
Used to send cookies from the server to the user agent, but has been obsoleted by the specification. Use Set-Cookie instead.


```

간단하게 테스트 해볼려고 한다. spring boot로 서비스를 만들어서 임베디드 톰캣으로 서비스를 확인 해볼려고 한다.

먼저 tomcat에 헤더 사이즈를 늘려서 호출 해보았다. 아래는 테스트 코드 spring을 사용하고 있어서 RestTemplate으로 테스트 코드를 작성해보았다.


```java

package com.github.sejoung.reactive.cookies;


import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.Charset;

public class CookiesTest {
    public static void main(String[] args) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
		// 아래의 쿠키 데이터를 많이 넣어서 사이즈를 늘리면서 테스트가 가능함
        headers.add("Cookie", "TEST=1" );
        ResponseEntity<String> response = restTemplate.exchange("http://localhost:8080/rest", HttpMethod.GET, new HttpEntity<String>(headers), String.class);

        System.out.println(response.getStatusCode());

    }
}



```

여기는 서버 프로그램 

```java

package com.github.sejoung.reactive.cookies;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;

@SpringBootApplication
public class CookiesTestApplication {

    @RestController
    public static class MyController {

        @GetMapping("/rest")
        public String rest(@CookieValue("TEST") String testCookie) {
            System.out.println("ok "+testCookie);
            return "ok";
        }

    }

    public static void main(String[] args) {
        SpringApplication.run(CookiesTestApplication.class, args);
    }
}



```

요청 헤더가 너무 크면 서버는 일반적으로 400 또는 413 으로 응답한다.

400코드를 응답 하였고 실제 로그로 아래의 메시지를 나타내었다.


```
java.lang.IllegalArgumentException: Request header is too large

```

그러면 최대 헤더 사이즈는 어떻게 되는건가 일반적인 서버 별로 헤더의 설정을 주지 않으면 나오는 헤더 사이즈이다.

```
Apache 2.0, 2.2: 8K
nginx: 4K - 8K
IIS: version별로 틀리다, 8K - 16K
Tomcat: version별로 틀리다, 8K - 48K (?!)

```

그러면 tomcat의 헤더 사이즈는 어디서 늘릴수 있는가?

Connector에 maxHttpHeaderSize를 추가해서 정보를 설정 할수 있다. 아래 참조


```xml

<Connector  connectionTimeout="20000" 
       port="8080" 
       protocol="HTTP/1.1" 
       redirectPort="8443" 
       maxHttpHeaderSize="8192" 
       maxThreads="150"
       minSpareThreads="25"
       enableLookups="false"
       acceptCount="100"
       disableUploadTimeout="true"
       maxPostSize="0"
       URIEncoding="UTF-8"/>

```

위에 정보는 http 커넥터에서만 설정을 한것이고 아파치와 tomcat간에 통신을 AJP로 한다고 하면 

AJP에도 설정을 해줘야 된다. 물론 ssl도 같은 정보로 테스트가 가능하다.

ssl 로 요청 했을때는 톰캣에서는 특별한 에러가 나오지 않는다.

```
-Djava.net.debug=ssl
 
 
record
Print a trace of each SSL record (at the SSL protocol level).
handshake
Print each handshake message as it is received
keygen
Print key generation data for the secret key exchange.
session
Print SSL session activity.
defaultctx
Print the default SSL initialization information.
sslctx
Print information about the SSL context.
sessioncache
Print information about the SSL session cache.
keymanager
Print information about calls to the key manager.
trustmanager
Print information about calls to the trust manager.dataFor handshake tracing, print out a hex dump of each message.verboseFor handshake tracing, print out verbose information.plaintextFor record tracing, print out a hex dump of the record.

-Djava.net.debug=record,keygen,handshake

```


위에 파라미터로 ssl 관련 디버그를 진행 할수있다 

설정을 하면 로그에 ssl 관련 로그들이 찍히면서 서버 내부동작에서 에러를 확인 할수가 있다.


# 참조 
-----
* [tomcat 8.5 http 설정](http://tomcat.apache.org/tomcat-8.5-doc/config/http.html)

* [http Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

* [maximum-on-http-header-values](https://stackoverflow.com/questions/686217/maximum-on-http-header-values)



