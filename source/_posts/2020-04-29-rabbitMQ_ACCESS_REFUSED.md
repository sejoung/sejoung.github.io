---
layout: post
title: "rabbitmq 커넥션 에러"
date: 2020-04-29 16:19 +0900
comments: true
tags : ["rabbitmq","access_refused"]
categories : ["rabbitmq"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## rabbitmq 커넥션 에러

rabbitmq 에는 기본사용자인 guest가 있는데 해당 사용자는 localhost에서만 연결할수 있도록 연결제한이 걸려 있습니다.


```java
package com.github.sejoung.rabbitmq.helloworld;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import java.nio.charset.StandardCharsets;

public class Send {

	private final static String QUEUE_NAME = "hello";

	public static void main(String[] argv) throws Exception {
		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("192.168.100.100");
		
		try (Connection connection = factory.newConnection(); Channel channel = connection
				.createChannel()) {
			channel.queueDeclare(QUEUE_NAME, false, false, false, null);
			String message = "Hello World!";
			channel.basicPublish("", QUEUE_NAME, null, message.getBytes(StandardCharsets.UTF_8));
			System.out.println(" [x] Sent '" + message + "'");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}


```

위 처럼 코드를 실행시키면 아래의 에러가 난다 

```
ACCESS_REFUSED - Login was refused using authentication mechanism PLAIN
```

guest가 아닌 계정을 생성후에 factory에 넣어주면 정상적으로 실행이 된다.

사용자 계정 생성 

```
# create a user
rabbitmqctl add_user admin admin
# tag the user with "administrator" for full management UI and HTTP API access
rabbitmqctl set_user_tags admin administrator

```

위처럼 명령어로 실행 하던지 

```
rabbitmq-plugins enable rabbitmq_management

```

위처럼 플러그인을 설치해서 웹페이지에 접근 해서 처리 할수 있다. `http://{node-hostname}:15672/`


# 참조
-----
* [rabbitmq access-control](https://www.rabbitmq.com/access-control.html)

