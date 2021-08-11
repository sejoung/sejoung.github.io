---
layout: post
title: "junit mockmvc 한글깨짐 처리시 restdocs 에러"
date: 2021-08-11 11:37 +0900
comments: true
tags : ["spring restdocs","junit 한글깨짐","restdocs","REST Docs configuration not found","Did you forget to apply a MockMvcRestDocumentationConfigurer when building the MockMvc instance"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# junit mockmvc 한글깨짐 처리시 restdocs 에러



```java

@BeforeEach
public void before(WebApplicationContext ctx) {
    this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx)
    .addFilters(new CharacterEncodingFilter("UTF-8", true))
    .alwaysDo(print())
    .build();
    }

```

일반적으로 한글깨짐 처리시 위에처럼 mockMvc를 생성할때 필터를 동작시키는 방법으로 처리를 한다. 그런데 rest docs를 같이 사용하면 아래의 에러를 볼수 있다. 

```
REST Docs configuration not found. Did you forget to apply a MockMvcRestDocumentationConfigurer when building the MockMvc instance?
java.lang.IllegalStateException: REST Docs configuration not found. Did you forget to apply a MockMvcRestDocumentationConfigurer when building the MockMvc instance?
```

처리 방안은 아래처럼 하나를 추가해주면 된다.

```java

@ExtendWith({RestDocumentationExtension.class})
@SpringBootTest
@AutoConfigureRestDocs
public class ControllerTest{
    @BeforeEach
    public void before(WebApplicationContext ctx, RestDocumentationContextProvider restDocumentationContextProvider) {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx)
            .apply(documentationConfiguration(restDocumentationContextProvider))
            .addFilters(new CharacterEncodingFilter("UTF-8", true))
            .alwaysDo(print())
            .build();
    }
}


```
위처럼 수정해주면 에러 없이 정상 동작을 한다.

# 참고자료

-----
