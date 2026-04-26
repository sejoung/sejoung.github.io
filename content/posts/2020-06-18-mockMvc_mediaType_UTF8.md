---
layout: post
title: "MediaType.APPLICATION_JSON_UTF8 Deprecated"
date: 2020-06-18 10:23 +0900
comments: true
tags : ["MediaType.APPLICATION_JSON_UTF8 Deprecated","spring","mockMvc","한글깨짐"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## MediaType.APPLICATION_JSON_UTF8 Deprecated


```java

	/**
	 * Public constant media type for {@code application/json;charset=UTF-8}.
	 * @deprecated as of 5.2 in favor of {@link #APPLICATION_JSON}
	 * since major browsers like Chrome
	 * <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=438464">
	 * now comply with the specification</a> and interpret correctly UTF-8 special
	 * characters without requiring a {@code charset=UTF-8} parameter.
	 */
	@Deprecated
	public static final MediaType APPLICATION_JSON_UTF8;

```


MediaType APPLICATION_JSON_UTF8 이 위처럼 Deprecated 되었다 
기본적으로 스프링에서 mockMvc를 사용할때는 UTF8설정 없이도 한글이 깨지진 않았다

테스트 코드에서 다른 부분에서 한글이 문제가 되는것이 아니라 .andDo(print()) 할때 한글이 깨져서 보이는데 참 답답해 보였다 

그래서 처리 방법을 그냥 시작전에 필터로 response의 setCharacterEncoding 을 UTF8로 고정시켰다 

```java

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void setUp() {
        mockMvc = webAppContextSetup(wac).addFilter(((request, response, chain) -> {
            response.setCharacterEncoding("UTF-8");
            chain.doFilter(request, response);
        })).build();
    }

```

위와 같은 방법으로 프린트 시에 해당 값을 한글이 안깨지도록 나오게 했다.

# 참조 
-----
* [spring-deprecated-media-type](http://honeymon.io/tech/2019/10/23/spring-deprecated-media-type.html)
* [spring-framework issues 22788](https://github.com/spring-projects/spring-framework/issues/22788)
