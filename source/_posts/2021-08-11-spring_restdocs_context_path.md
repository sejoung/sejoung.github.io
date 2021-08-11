---
layout: post
title: "spring restdocs 문서에 context-path 표현하기"
date: 2021-08-11 09:46 +0900
comments: true
tags : ["spring restdocs","context-path","restdocs","does not start with contextPath"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# spring restdocs 문서에 context-path 표현하기

```
java.lang.IllegalArgumentException: requestURI [/] does not start with contextPath [/api]
```

```java

@AutoConfigureRestDocs
class ContextTest{
    void ok() throws Exception {
        var objectMapper = new ObjectMapper();
        var json = objectMapper.writeValueAsString(BranchLificCategoryDTOUtil.getBranchLificCategoryDTO());
        mockMvc.perform(post("/api/context-path").contextPath("/api")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(json))
            .andDo(print())
            .andExpect(status().isOk())
            .andDo(getDocument());
    }
}

```

restdoc를 할때 test code에 contextPath를 지정해 주면된다. 

실제 rest 코드에는 context-path가 지정되지 않는다.

```java

@RestController
public class TestController{
    @PostMapping(path = "/context-path", consumes = MimeTypeUtils.APPLICATION_JSON_VALUE, produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
    public void contextPath(@RequestBody @Valid ContextPathDTO dto) {
        log.debug("{}", dto);
    }
}


```

# 참고자료

-----
