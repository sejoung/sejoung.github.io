---
layout: post
title: "rabbitmq 설치후 prometheus 플러그인 port 변경"
date: 2020-08-03 17:22 +0900
comments: true
tags : ["rabbitmq","레빗엠큐","rabbitmq-prometheus","포트 변경","port"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## rabbitmq 설치후 prometheus 플러그인 port 변경

advanced.config

```
[
    {rabbitmq_prometheus,[
        {tcp_config, [{port, 29876}]}
    ]}
].

```

# 참조 
-----
* [rabbitmq configure](https://www.rabbitmq.com/configure.html#supported-environment-variables)
* [rabbitmq_prometheus.snippets](https://github.com/rabbitmq/rabbitmq-prometheus/blob/89b557d04c8af507576f8841fdc0999972774f5f/test/config_schema_SUITE_data/rabbitmq_prometheus.snippets)
