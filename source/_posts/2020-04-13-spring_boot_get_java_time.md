---
layout: post
title: "스프링 부트에서 GET 메소드로 LocalDate, LocalDateTime 받기"
date: 2020-04-13 13:10 +0900
comments: true
tags : ["spring boot","LocalDate","LocalDateTime","GET 메소드"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 스프링 부트에서 GET 메소드로 LocalDate, LocalDateTime 받기

```java

package test;

import java.time.LocalDate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/test/")
public class TestRestController {

    @GetMapping("test")
    public void test(@RequestParam("startDate") LocalDate startDate) {

        log.debug("startDate = {}", startDate);
    }

}


```


```java

package test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class TestRestControllerTest {


    @Autowired
    private MockMvc mockMvc;


    @Test
    public void test() throws Exception {

        this.mockMvc.perform(get("/api/test/test")
            .param("startDate", "2020-03-01"))
            .andDo(print())
            .andExpect(status().isOk());
    }
}

```

위에 코드를 실행시키니 아래의 에러가 나옴

```
spring.mvc.date-format=yyyy-MM-dd

```

위에 프로퍼티를 추가해서 사용가능하게 처리 할려고 함 

하지만 안됨

```
2020-04-13 12:30:32.218 DEBUG 16947 --- [           main] .w.s.m.m.a.ServletInvocableHandlerMethod : Failed to resolve argument 0 of type 'java.time.LocalDate'

org.springframework.web.method.annotation.MethodArgumentTypeMismatchException: Failed to convert value of type 'java.lang.String' to required type 'java.time.LocalDate'; nested exception is org.springframework.core.convert.ConversionFailedException: Failed to convert from type [java.lang.String] to type [@org.springframework.web.bind.annotation.RequestParam java.time.LocalDate] for value '2020-03-01'; nested exception is java.lang.IllegalArgumentException: Parse attempt failed for value [2020-03-01]
	at org.springframework.web.method.annotation.AbstractNamedValueMethodArgumentResolver.resolveArgument(AbstractNamedValueMethodArgumentResolver.java:131)
	at org.springframework.web.method.support.HandlerMethodArgumentResolverComposite.resolveArgument(HandlerMethodArgumentResolverComposite.java:124)
	at org.springframework.web.method.support.InvocableHandlerMethod.getMethodArgumentValues(InvocableHandlerMethod.java:161)
	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:131)
	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:102)
	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:877)
	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:783)
	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:991)
	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:925)
	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:974)
	at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:866)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:635)
	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:851)
	at org.springframework.test.web.servlet.TestDispatcherServlet.service(TestDispatcherServlet.java:68)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:742)
	at org.springframework.mock.web.MockFilterChain$ServletFilterProxy.doFilter(MockFilterChain.java:166)
	at org.springframework.mock.web.MockFilterChain.doFilter(MockFilterChain.java:133)
	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:96)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.springframework.mock.web.MockFilterChain.doFilter(MockFilterChain.java:133)
	at org.springframework.test.web.servlet.setup.PatternMappingFilterProxy.doFilter(PatternMappingFilterProxy.java:104)
	at org.springframework.mock.web.MockFilterChain.doFilter(MockFilterChain.java:133)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:320)
	at org.springframework.security.web.access.intercept.FilterSecurityInterceptor.invoke(FilterSecurityInterceptor.java:127)
	at org.springframework.security.web.access.intercept.FilterSecurityInterceptor.doFilter(FilterSecurityInterceptor.java:91)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.access.ExceptionTranslationFilter.doFilter(ExceptionTranslationFilter.java:119)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.session.SessionManagementFilter.doFilter(SessionManagementFilter.java:137)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.authentication.AnonymousAuthenticationFilter.doFilter(AnonymousAuthenticationFilter.java:111)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter.doFilter(SecurityContextHolderAwareRequestFilter.java:170)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.savedrequest.RequestCacheAwareFilter.doFilter(RequestCacheAwareFilter.java:63)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:107)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:112)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.springframework.web.filter.CompositeFilter$VirtualFilterChain.doFilter(CompositeFilter.java:112)
	at org.springframework.web.filter.CompositeFilter.doFilter(CompositeFilter.java:73)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter.doFilter(AbstractAuthenticationProcessingFilter.java:200)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.authentication.logout.LogoutFilter.doFilter(LogoutFilter.java:116)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:74)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.context.SecurityContextPersistenceFilter.doFilter(SecurityContextPersistenceFilter.java:105)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:56)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:334)
	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:215)
	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:178)
	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:357)
	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:270)
	at org.springframework.mock.web.MockFilterChain.doFilter(MockFilterChain.java:133)
	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:99)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.springframework.mock.web.MockFilterChain.doFilter(MockFilterChain.java:133)
	at org.springframework.web.filter.HttpPutFormContentFilter.doFilterInternal(HttpPutFormContentFilter.java:109)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.springframework.mock.web.MockFilterChain.doFilter(MockFilterChain.java:133)
	at org.springframework.web.filter.HiddenHttpMethodFilter.doFilterInternal(HiddenHttpMethodFilter.java:81)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.springframework.mock.web.MockFilterChain.doFilter(MockFilterChain.java:133)
	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:200)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.springframework.mock.web.MockFilterChain.doFilter(MockFilterChain.java:133)
	at org.springframework.test.web.servlet.MockMvc.perform(MockMvc.java:165)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
	at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
	at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
	at org.springframework.test.context.junit4.statements.RunBeforeTestExecutionCallbacks.evaluate(RunBeforeTestExecutionCallbacks.java:73)
	at org.springframework.test.context.junit4.statements.RunAfterTestExecutionCallbacks.evaluate(RunAfterTestExecutionCallbacks.java:83)
	at org.springframework.test.context.junit4.statements.RunBeforeTestMethodCallbacks.evaluate(RunBeforeTestMethodCallbacks.java:75)
	at org.springframework.test.context.junit4.statements.RunAfterTestMethodCallbacks.evaluate(RunAfterTestMethodCallbacks.java:86)
	at org.springframework.test.context.junit4.statements.SpringRepeat.evaluate(SpringRepeat.java:84)
	at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.runChild(SpringJUnit4ClassRunner.java:251)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.runChild(SpringJUnit4ClassRunner.java:97)
	at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)
	at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)
	at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)
	at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)
	at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)
	at org.springframework.test.context.junit4.statements.RunBeforeTestClassCallbacks.evaluate(RunBeforeTestClassCallbacks.java:61)
	at org.springframework.test.context.junit4.statements.RunAfterTestClassCallbacks.evaluate(RunAfterTestClassCallbacks.java:70)
	at org.junit.runners.ParentRunner.run(ParentRunner.java:363)
	at org.springframework.test.context.junit4.SpringJUnit4ClassRunner.run(SpringJUnit4ClassRunner.java:190)
	at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
	at com.intellij.junit4.JUnit4IdeaTestRunner.startRunnerWithArgs(JUnit4IdeaTestRunner.java:68)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:33)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:230)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:58)
Caused by: org.springframework.core.convert.ConversionFailedException: Failed to convert from type [java.lang.String] to type [@org.springframework.web.bind.annotation.RequestParam java.time.LocalDate] for value '2020-03-01'; nested exception is java.lang.IllegalArgumentException: Parse attempt failed for value [2020-03-01]
	at org.springframework.core.convert.support.ConversionUtils.invokeConverter(ConversionUtils.java:46)
	at org.springframework.core.convert.support.GenericConversionService.convert(GenericConversionService.java:191)
	at org.springframework.beans.TypeConverterDelegate.convertIfNecessary(TypeConverterDelegate.java:166)
	at org.springframework.beans.TypeConverterDelegate.convertIfNecessary(TypeConverterDelegate.java:99)
	at org.springframework.beans.TypeConverterSupport.doConvert(TypeConverterSupport.java:73)
	at org.springframework.beans.TypeConverterSupport.convertIfNecessary(TypeConverterSupport.java:52)
	at org.springframework.validation.DataBinder.convertIfNecessary(DataBinder.java:692)
	at org.springframework.web.method.annotation.AbstractNamedValueMethodArgumentResolver.resolveArgument(AbstractNamedValueMethodArgumentResolver.java:123)
	... 106 common frames omitted
Caused by: java.lang.IllegalArgumentException: Parse attempt failed for value [2020-03-01]
	at org.springframework.format.support.FormattingConversionService$ParserConverter.convert(FormattingConversionService.java:206)
	at org.springframework.core.convert.support.ConversionUtils.invokeConverter(ConversionUtils.java:40)
	... 113 common frames omitted
Caused by: java.time.format.DateTimeParseException: Text '2020-03-01' could not be parsed at index 4
	at java.time.format.DateTimeFormatter.parseResolved0(DateTimeFormatter.java:1949)
	at java.time.format.DateTimeFormatter.parse(DateTimeFormatter.java:1851)
	at java.time.LocalDate.parse(LocalDate.java:400)
	at org.springframework.format.datetime.standard.TemporalAccessorParser.parse(TemporalAccessorParser.java:69)
	at org.springframework.format.datetime.standard.TemporalAccessorParser.parse(TemporalAccessorParser.java:46)
	at org.springframework.format.support.FormattingConversionService$ParserConverter.convert(FormattingConversionService.java:200)
	... 114 common frames omitted

```


내가 사용하고 있는 버전은 2.0.1 버전으로 코드를 확인 해봄 

`org.springframework.boot.autoconfigure.web.format.WebConversionService` 클래스에 

```java

	private void registerJsr310() {
		DateTimeFormatterRegistrar dateTime = new DateTimeFormatterRegistrar();
		if (this.dateFormat != null) {
			dateTime.setDateFormatter(DateTimeFormatter.ofPattern(this.dateFormat)
					.withResolverStyle(ResolverStyle.STRICT));
		}
		dateTime.registerFormatters(this);
	}

```
위에 메소드를 보면 `ResolverStyle.STRICT`로 되어 있다. 


```java


	private void registerJsr310() {
		DateTimeFormatterRegistrar dateTime = new DateTimeFormatterRegistrar();
		if (this.dateFormat != null) {
			dateTime.setDateFormatter(DateTimeFormatter.ofPattern(this.dateFormat)
					.withResolverStyle(ResolverStyle.SMART));
		}
		dateTime.registerFormatters(this);
	}

```

v2.0.5.RELEASE 에 `ResolverStyle.SMART` 로 변경 되었다

이렇게 되서 위에 `spring.mvc.date-format=yyyy-MM-dd` 추가 만으로도 잘 동작하게 됨 

# 참조 
-----
* [spring-boot application-properties](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)
* [spring boot v2.0.5.RELEASE](https://github.com/spring-projects/spring-boot/blob/v2.0.5.RELEASE/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/web/format/WebConversionService.java)
* [spring boot v2.0.4.RELEASE](https://github.com/spring-projects/spring-boot/blob/v2.0.4.RELEASE/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/web/format/WebConversionService.java)
* [spring-boot issues 13970](https://github.com/spring-projects/spring-boot/issues/13970)


