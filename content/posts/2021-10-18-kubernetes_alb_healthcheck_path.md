---
layout: post
title: "kubernetes alb ingress health check path 서비스마다 다르게 설정하기"
date: 2021-10-18 14:06 +0900
comments: true
tags : ["aws","alb","ingress","health check path","바꾸기"]
categories : ["kubernetes"]
sitemap :
changefreq : daily
priority : 1.0
--->
# kubernetes alb ingress health check path 서비스마다 다르게 설정하기


```yaml

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: "test-ingress"
  namespace: "test"
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/healthcheck-path: /actuator/health

```

위와 같이 Ingress를 설정하면 공통적으로 healthcheck-path를 지정하는데 이것을 서비스마다 바꾸려면 아래 처럼 서비스에서 지정해주면 된다.

```yaml

apiVersion: v1
kind: Service
metadata:
  name: "test-healthcheck-url-service"
  namespace: "test"
  annotations:
    alb.ingress.kubernetes.io/healthcheck-path: /test/actuator/health

```

# 참고자료

-----
* [aws-load-balancer-controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.1/guide/ingress/annotations/)
* [aws-load-balancer-controller/issues/1056](https://github.com/kubernetes-sigs/aws-load-balancer-controller/issues/1056)
* [aws-load-balancer-controller/issues/1073](https://github.com/kubernetes-sigs/aws-load-balancer-controller/issues/1073)
