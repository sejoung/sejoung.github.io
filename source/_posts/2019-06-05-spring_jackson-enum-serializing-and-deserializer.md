---
layout: post
title: "스프링 jackson enum deserializer"
date: 2019-06-05 09:37 +0900
comments: true
tags : ["enum","jackson", "spring"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 스프링 jackson enum deserializer

json 메시지를 받는 rest api를 만들때 enum을 사용해 메시지를 받을때 하는법

```java

package com.github.sejoung.constants;

import static java.util.stream.Collectors.toMap;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;

public enum BreakerStatus {

    RELAY_IN_OPEN("relayInOpen", "입구 열림 릴레이"),
    RELAY_OUT_OPEN("relayOutOpen", "출구 열림 릴레이"),
    RELAY_IN_CLOSE("relayInClose", "입구 닫힘 릴레이"),
    RELAY_OUT_CLOSE("relayOutClose", "출구 닫힘 릴레이");

    private static final Map<String, BreakerStatus> stringToEnum =
        Stream.of(values()).collect(toMap(Objects::toString, e -> e));

    private String code;

    private String desc;

    BreakerStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @JsonCreator
    public static BreakerStatus fromString(String symbol) {
        return stringToEnum.get(symbol);
    }

    @JsonValue
    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }
}


```
위에 enum 객체가 있는데 이부분에서 `@JsonCreator` 와 `@JsonValue` 를 사용하여 직렬화와 역직렬화를 하게 된다 

컨트롤러를 보면 

```java

package com.github.sejoung.controller;

import com.github.sejoung.model.BreakerMessage;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class BreakerAPIController {

	private static final Logger log = LoggerFactory.getLogger(BreakerAPIController.class);

	@RequestMapping(value = "/parkingBreaker", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public void parkingBreaker(@RequestBody @Valid BreakerMessage message) {
		log.debug("parkingBreaker = {}", message);
	}

}

```

위에 처럼 코딩을 하고 BreakerMessage를 받게 되는데 BreakerMessage 는 

```java

package com.github.sejoung.model;

import com.github.sejoung.constants.BreakerStatus;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class BreakerMessage {

	@NotNull
	private BreakerStatus event;

}


```

위에 처럼 BreakerStatus enum으로 구성되있다. 그럼 테스트 코드를 짜서 보면


```java

package com.github.sejoung.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.github.sejoung.constants.BreakerStatus;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class BreakerAPIControllerTest {


	private final String breakerAPIControllerParkingBreakerUrl = "/parkingBreaker";

	@Autowired
	private MockMvc mockMvc;

	@Test
	public void parkingBreakerIsOk() throws Exception {
		this.mockMvc.perform(post(breakerAPIControllerParkingBreakerUrl)
				.content("{\"event\":\"" + BreakerStatus.RELAY_IN_CLOSE.toString() + "\"}")
				.contentType(MediaType.APPLICATION_JSON_UTF8))
				.andDo(print())
				.andExpect(status().isOk());
	}

	@Test
	public void parkingBreakerNoEvent() throws Exception {
		this.mockMvc.perform(post(breakerAPIControllerParkingBreakerUrl)
				.content("{\"event\":\"\"}")
				.contentType(MediaType.APPLICATION_JSON_UTF8))
				.andDo(print())
				.andExpect(status().isBadRequest());
	}

	@Test
	public void parkingBreakerBadEvent() throws Exception {
		this.mockMvc.perform(post(breakerAPIControllerParkingBreakerUrl)
				.content("{\"event\":\"test\"}")
				.contentType(MediaType.APPLICATION_JSON_UTF8))
				.andDo(print())
				.andExpect(status().isBadRequest());
	}
}

```

이렇게 해서 볼수 있는데 잘못된 코드를 넘어 왔을때와 값을 않넣었을때 를 테스트 해서 볼수 있다.



# 참조
-----
* [jackson-enum-serializing-and-deserializer](https://stackoverflow.com/questions/12468764/jackson-enum-serializing-and-deserializer)


