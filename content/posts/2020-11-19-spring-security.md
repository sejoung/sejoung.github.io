---
layout: post
title: "spring security test code 작성시 UserDetails가 필요할때"
date: 2020-11-18 10:48 +0900
comments: true
tags : ["spring-security","WithMockUser","스프링 시큐리티","테스트 코드"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## spring security test code 작성시 UserDetails가 필요할때

스프링 시큐리티 테스트 코드 작성시 '@WithMockUser' 어너테이션을 사용해서 인증을 통과 시킨다
하지만 어떤 API는 UserDetails를 필요로 할수 있다 그럴때 커스텀 어너테이션을 만들어서 사용할수 있다.


```java

@Configuration
public class SecurityConfigruation extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.authorizeRequests().antMatchers("**").authenticated().and().formLogin()
            .disable().csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS).and()
            .exceptionHandling()
            .authenticationEntryPoint(new Http403ForbiddenEntryPoint())
            .accessDeniedHandler(new AccessDeniedHandlerImpl());
    }

}

```

위처럼 간단하게 인증을 걸고 API를 하나 만들어서 테스트 코드를 작성해서 테스트 해보았다.

```java

@Slf4j
@RequestMapping("/api/")
@RestController
public class TestController {

    @GetMapping("test")
    public ResponseEntity<String> getTest(Authentication principal) {

        var userName = principal.getName();
        log.debug("test ok {}", principal.getDetails());

        return ResponseEntity.ok(userName);
    }
}

```

위에 컨트롤러 하나 생성후에 테스트 코드를 작성해 보면

```java


@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class TestControllerTest {

    private static final String URL = "/api/test";

    @Autowired
    private MockMvc mockMvc;

    @DisplayName("인증실패")
    @Test
    void forbiddenTest() throws Exception {
        this.mockMvc.perform(get(URL)
            .contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isForbidden());
    }

    @DisplayName("WithMockUser 어너테이션 테스트")
    @WithMockUser
    @Test
    void withMockTest() throws Exception {
        this.mockMvc.perform(get(URL)
            .contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());
    }

}

```
인증실패 결과

```
MockHttpServletRequest:
      HTTP Method = GET
      Request URI = /api/test
       Parameters = {}
          Headers = [Content-Type:"application/json;charset=UTF-8", Accept:"application/json"]
             Body = null
    Session Attrs = {}

Handler:
             Type = null

Async:
    Async started = false
     Async result = null

Resolved Exception:
             Type = null

ModelAndView:
        View name = null
             View = null
            Model = null

FlashMap:
       Attributes = null

MockHttpServletResponse:
           Status = 403
    Error message = Access Denied
          Headers = [X-Content-Type-Options:"nosniff", X-XSS-Protection:"1; mode=block", Cache-Control:"no-cache, no-store, max-age=0, must-revalidate", Pragma:"no-cache", Expires:"0", X-Frame-Options:"DENY"]
     Content type = null
             Body = 
    Forwarded URL = null
   Redirected URL = null
          Cookies = []

```

WithMockUser 어너테이션 테스트 결과

```

MockHttpServletRequest:
      HTTP Method = GET
      Request URI = /api/test
       Parameters = {}
          Headers = [Content-Type:"application/json;charset=UTF-8", Accept:"application/json"]
             Body = null
    Session Attrs = {SPRING_SECURITY_CONTEXT=org.springframework.security.core.context.SecurityContextImpl@ca25360: Authentication: org.springframework.security.authentication.UsernamePasswordAuthenticationToken@ca25360: Principal: org.springframework.security.core.userdetails.User@36ebcb: Username: user; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; credentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: ROLE_USER; Credentials: [PROTECTED]; Authenticated: true; Details: null; Granted Authorities: ROLE_USER}

Handler:
             Type = io.github.sejoung.controller.TestController
           Method = io.github.sejoung.controller.TestController#getTest(Authentication)

Async:
    Async started = false
     Async result = null

Resolved Exception:
             Type = null

ModelAndView:
        View name = null
             View = null
            Model = null

FlashMap:
       Attributes = null

MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"application/json;charset=UTF-8", Content-Length:"4", X-Content-Type-Options:"nosniff", X-XSS-Protection:"1; mode=block", Cache-Control:"no-cache, no-store, max-age=0, must-revalidate", Pragma:"no-cache", Expires:"0", X-Frame-Options:"DENY"]
     Content type = application/json
             Body = user
    Forwarded URL = null
   Redirected URL = null
          Cookies = []

```

위에 결과를 보면 인증은 통과 했지만 `Details: null;` 이다.

그럼 값을 넣어 주는것을 테스트 해서 보면 

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import org.springframework.security.test.context.support.WithSecurityContext;

@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithMockCustomUserSecurityContextFactory.class)
public @interface WithMockCustomUser {

    String username() default "sejoung";

    String name() default "sejoung kim";
}

```
위 처럼 어너테이션을 생성 하고 

```java

public class WithMockCustomUserSecurityContextFactory
    implements WithSecurityContextFactory<WithMockCustomUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockCustomUser customUser) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        List<GrantedAuthority> grantedAuthorities = new ArrayList();
        grantedAuthorities.add(new SimpleGrantedAuthority("USER"));
        User principal = new User(customUser.username(), "1234", true, true, true, true,
            grantedAuthorities);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            principal, principal.getPassword(), principal.getAuthorities());

        authentication.setDetails(new Detail(customUser.username(), "aaaa"));
        context.setAuthentication(authentication);
        return context;
    }
}

```

위 처럼 팩토리를 하나 만들어서 사용하면 

테스트 코드는 하나 추가해서 보면

```java
    @DisplayName("커스텀 어너테이션 테스트")
    @WithMockCustomUser
    @Test
    void customWithMockTest() throws Exception {
        this.mockMvc.perform(get(URL)
            .contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
            .andDo(print()).andExpect(status().isOk());
    }

```
커스텀 어너테이션 테스트 결과

```

MockHttpServletRequest:
      HTTP Method = GET
      Request URI = /api/test
       Parameters = {}
          Headers = [Content-Type:"application/json;charset=UTF-8", Accept:"application/json"]
             Body = null
    Session Attrs = {SPRING_SECURITY_CONTEXT=org.springframework.security.core.context.SecurityContextImpl@b3ebb9fe: Authentication: org.springframework.security.authentication.UsernamePasswordAuthenticationToken@b3ebb9fe: Principal: org.springframework.security.core.userdetails.User@75d00a77: Username: sejoung; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; credentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: USER; Credentials: [PROTECTED]; Authenticated: true; Details: Detail(name=sejoung, data=aaaa); Granted Authorities: USER}

Handler:
             Type = io.github.sejoung.controller.TestController
           Method = io.github.sejoung.controller.TestController#getTest(Authentication)

Async:
    Async started = false
     Async result = null

Resolved Exception:
             Type = null

ModelAndView:
        View name = null
             View = null
            Model = null

FlashMap:
       Attributes = null

MockHttpServletResponse:
           Status = 200
    Error message = null
          Headers = [Content-Type:"application/json;charset=UTF-8", Content-Length:"7", X-Content-Type-Options:"nosniff", X-XSS-Protection:"1; mode=block", Cache-Control:"no-cache, no-store, max-age=0, must-revalidate", Pragma:"no-cache", Expires:"0", X-Frame-Options:"DENY"]
     Content type = application/json
             Body = sejoung
    Forwarded URL = null
   Redirected URL = null
          Cookies = []

```

`Details: Detail(name=sejoung, data=aaaa)` 이렇게 값이 들어간것을 볼수 있다.



# 참조
-----
* [spring-security test](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#test)
* [위에 테스트한 코드](https://github.com/sejoung/spring-security-test)

