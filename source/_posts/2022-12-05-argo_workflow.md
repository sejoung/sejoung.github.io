---
layout: post
title: "argo workflows 설치"
date: 2022-12-05 11:53 +0900
comments: true
tags : ["argo workflows","쿠버네티스","잡","workloads","kubernetes","k8s","job"]
categories : ["kubernetes","k8s"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# argo workflows 설치

로컬에서 테스트 하기 위해 [마니쿠베](https://minikube.sigs.k8s.io/docs/start/)를 인스톨 한다.

[argo workflows release](https://github.com/argoproj/argo-workflows/releases)
최신 릴리즈 버전을 인스톨 한다

```shell

kubectl create namespace argo
kubectl apply -n argo -f https://github.com/argoproj/argo-workflows/releases/download/v3.3.10/install.yaml

```

```shell
kubectl patch deployment \
  argo-server \
  --namespace argo \
  --type='json' \
  -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/args", "value": [
  "server",
  "--auth-mode=server"
]}]'

```

아래처럼 포트 포워딩후에 https://localhost:2746/ 접속한다.

```shell
kubectl -n argo port-forward deployment/argo-server 2746:2746
```


# 참조

-----
* [minikube](https://minikube.sigs.k8s.io/docs/start/)
* [argo workflows release](https://github.com/argoproj/argo-workflows/releases)
