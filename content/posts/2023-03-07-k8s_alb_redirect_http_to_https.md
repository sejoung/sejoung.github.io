---
layout: post
title: "EKS에서 HTTP를 HTTPS로 Redirect"
date: 2023-03-07 23:30 +0900
comments: true
tags : ["AWS Load Balancer Controller","ALB","ingress","https"]
categories : ["kubernetes","k8s","AWS"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# EKS에서 HTTP를 HTTPS로 Redirect

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
    name: ingress
    annotations:
        kubernetes.io/ingress.class: alb
        alb.ingress.kubernetes.io/scheme: internet-facing
        alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
        alb.ingress.kubernetes.io/healthcheck-path: '/health'
        alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-west-2:xxxx:certificate/xxxxxx
        alb.ingress.kubernetes.io/actions.ssl-redirect: '{"Type": "redirect", "RedirectConfig": { "Protocol": "HTTPS", "Port": "443", "StatusCode": "HTTP_301"}}'
spec:
    rules:
        - host: "www.sejoung.com"
          http:
              paths:
                  - pathType: ImplementationSpecific
                    path: /*
                    backend:
                        service:
                            name: ssl-redirect
                            port:
                                name: use-annotation
                  - pathType: ImplementationSpecific
                    path: /*
                    backend:
                        service:
                            name: "sejoung-develop"
                            port:
                                number: 8080
```

`alb.ingress.kubernetes.io/listen-ports` 설정에 `[{"HTTP": 80}, {"HTTPS": 443}]` 2개 포트를 열어야 됨

`alb.ingress.kubernetes.io/certificate-arn` 설정이 되어 있어야 됨

`alb.ingress.kubernetes.io/actions.ssl-redirect: '{"Type": "redirect", "RedirectConfig": { "Protocol": "HTTPS", "Port": "443", "StatusCode": "HTTP_301"}}'` 설정이 되어 있어야 됨

최종적으로 제일 처음위치에 아래의 설정이 필요하다

```yaml
  - pathType: ImplementationSpecific
    path: /*
    backend:
        service:
            name: ssl-redirect
            port:
                name: use-annotation
```

# 참조

-----
* [alb Redirect Traffic from HTTP to HTTPS](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/guide/tasks/ssl_redirect/)
