---
layout: post
title: "rabbitmq 설치후 port 변경"
date: 2020-06-02 14:46 +0900
comments: true
tags : ["rabbitmq","레빗엠큐","포트 변경","port"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## rabbitmq 설치후 port 변경

advanced.config

```
[
  {rabbit, [
      {tcp_listeners, [9876]}
    ]
  },
  {rabbitmq_management, [
	{listener, [{port, 19876}]}
	]
  }
].

```

# 참조 
-----
* [rabbitmq configure](https://www.rabbitmq.com/configure.html#supported-environment-variables)

