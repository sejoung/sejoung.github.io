---
layout: post
title: "HttpMessageNotReadableException 에러"
date: 2020-06-01 13:30 +0900
comments: true
tags : ["ContentCachingRequestWrapper","HttpServletRequest","getInputStream","getReader","HttpMessageNotReadableException"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## HttpMessageNotReadableException 에러

먼저 아래의 에러가 나는 이유는 request를 2번 읽어서 처리 할려고 해서 나는 에러 이다.

```
[org.springframework.http.converter.HttpMessageNotReadableException: Required request body is missing

```

위에 에러는 톰켓의 아래의 코드를 보면 이해 할수 있다.

```java
    @Override
    public ServletInputStream getInputStream() throws IOException {

        if (usingReader) {
            throw new IllegalStateException(sm.getString("coyoteRequest.getInputStream.ise"));
        }

        usingInputStream = true;
        if (inputStream == null) {
            inputStream = new CoyoteInputStream(inputBuffer);
        }
        return inputStream;

    }

    @Override
    public BufferedReader getReader() throws IOException {

        if (usingInputStream) {
            throw new IllegalStateException(sm.getString("coyoteRequest.getReader.ise"));
        }

        // InputBuffer has no easily accessible reference chain to the Context
        // to check for a default request character encoding at the Context.
        // Therefore, if a Context default should be used, it is set explicitly
        // here. Need to do this before setting usingReader.
        if (coyoteRequest.getCharacterEncoding() == null) {
            // Nothing currently set explicitly.
            // Check the content
            Context context = getContext();
            if (context != null) {
                String enc = context.getRequestCharacterEncoding();
                if (enc != null) {
                    // Explicitly set the context default so it is visible to
                    // InputBuffer when creating the Reader.
                    setCharacterEncoding(enc);
                }
            }
        }

        usingReader = true;

        inputBuffer.checkConverter();
        if (reader == null) {
            reader = new CoyoteReader(inputBuffer);
        }
        return reader;
    }

```

코드를 보면 inputStream 이나 reader 는 두 번 읽어서 처리 할수 없게 되어 있습니다.

하지만 스프링의 유틸 클래스인 `ContentCachingRequestWrapper` 를 사용하면 처리 할수 있는 방법이 있습니다.

`ContentCachingRequestWrapper`는 입력 스트림 과 리더 에서 읽은 모든 내용을 캐시 하고 있습니다. 
캐쉬된 내용은 `getContentAsByteArray()` 메소드를 사용해서 처리 할수 있습니다. 하지만 `getInputStream` 과 `getReader`를 두번 사용할 수 있는것은 아닙니다.

간단한 시나리오를 보면 filter를 통해서 request의 값을 읽어서 처리를 해야 될수도 있습니다.(예: 인증처리를 위해) 


```java

    @PostMapping(value = "test")
    public void test(
        @RequestBody InputTest inputTest) {

        log.debug("inputTest = {}", inputTest);

    }

```

위의 코드에서 스프링의 `@RequestBody`를 사용하려고 하면 `HttpMessageNotReadableException` 이 발생한다. 
왜냐 하면 `getInputStream` 과 `getReader`를 두번 사용할 수 없어서 이다. 

`ContentCachingRequestWrapper`를 재사용 가능하게 바꾸는 논의도 있었는데 거절 당한 이력이 있다. 
해당 클래스틑 유틸 클래스이고 이렇게 사용되는것이 `ContentCachingRequestWrapper` 클래스가 디자인된 방식이라서 수용이 안된다. 라는 답변이 달려 있다.

해결 방법은 간단하게 재사용 가능한 wrapper 클래스를 만들어서 사용하면 된다. 아래의 `ReusableRequestWrapper` 클래스를 만들어서 처리 하면 된다.

```java


import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import org.apache.commons.io.IOUtils;
import org.springframework.util.StringUtils;

public class ReusableRequestWrapper extends HttpServletRequestWrapper {

    private final Charset encoding;
    private byte[] rawData;

    public ReusableRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);

        String characterEncoding = request.getCharacterEncoding();
        if (StringUtils.isEmpty(characterEncoding)) {
            characterEncoding = StandardCharsets.UTF_8.name();
        }
        this.encoding = Charset.forName(characterEncoding);

        try (InputStream inputStream = request.getInputStream()) {
            this.rawData = IOUtils.toByteArray(inputStream);
        }
    }

    @Override
    public ServletInputStream getInputStream() {

        return new CachedServletInputStream(this.rawData);
    }

    @Override
    public BufferedReader getReader() {
        return new BufferedReader(new InputStreamReader(this.getInputStream(), this.encoding));
    }

    private static class CachedServletInputStream extends ServletInputStream {

        private final ByteArrayInputStream buffer;

        public CachedServletInputStream(byte[] contents) {
            this.buffer = new ByteArrayInputStream(contents);
        }

        @Override
        public int read() throws IOException {
            return buffer.read();
        }

        @Override
        public boolean isFinished() {
            return buffer.available() == 0;
        }

        @Override
        public boolean isReady() {
            return true;
        }

        @Override
        public void setReadListener(ReadListener listener) {
            throw new UnsupportedOperationException("지원 하지 않은 기능 입니다.");
        }

    }

}

```

# 참조 
-----
* [Spring Interceptor(혹은 Servlet Filter)에서 POST 방식으로 전달된 JSON 데이터 처리하기](https://meetup.toast.com/posts/44)
* [tomcat Request](https://github.com/apache/tomcat/blob/master/java/org/apache/catalina/connector/Request.java)
* [ContentCachingRequestWrapper allow reading request once](https://github.com/spring-projects/spring-boot/issues/10452)
* [ContentCachingRequestWrapper cache input stream](https://github.com/spring-projects/spring-framework/issues/20577)
* [ContentCachingRequestWrapper](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/util/ContentCachingRequestWrapper.html)
* [MultiReadHttpServletRequest](https://www.jvt.me/posts/2020/05/25/read-servlet-request-body-multiple/)
