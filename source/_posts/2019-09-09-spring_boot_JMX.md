---
layout: post
title: "인텔리제이 spring-boot JMX 확인"
date: 2019-09-09 15:49 +0900
comments: true
tags : ["spring boot JMX","모니터링","인텔리제이","@ManagedAttribute"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## 인텔리제이 spring-boot JMX 확인

```java

package com.github.sejoung.integration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedResource;

@ConfigurationProperties(prefix = "service", ignoreUnknownFields = false)
@ManagedResource
public class ServiceProperties {

	private String greeting = "Hello";

	@ManagedAttribute
	public String getGreeting() {
		return this.greeting;
	}

	public void setGreeting(String greeting) {
		this.greeting = greeting;
	}

}


```

위와 같은 코드에서 @Managed 어너테이션은 JMX에서 확인을 하기위한 어너테이션이다. 위를 확인하는 방법은

![UI1](https://sejoung.github.io/images/2019_09_09_01.png)

Spring Boot는 Ultimate 버전에서만 사용할 수 있습니다.

```

-Dcom.sun.management.jmxremote.port=9999 -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false

```

위처럼 설정을 한후에 jmx 모니터링 툴을 이용하면 되는데 jconsole을 이용하는 방법이다.

![UI2](https://sejoung.github.io/images/2019_09_09_02.png)

위처럼 로그인을 하면 되고 ssl을 설정하지 않아 아래의 경고창이 뜬다.

![UI3](https://sejoung.github.io/images/2019_09_09_03.png)

확인 버튼을 누르면 아래처럼 확인이 가능하다.

![UI4](https://sejoung.github.io/images/2019_09_09_04.png)


# 참조
----- 
* [spring-boot](https://www.jetbrains.com/help/idea/spring-boot.html)
* [ManagedAttribute](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/jmx/export/annotation/ManagedAttribute.html)