---
layout: post
title: "argocd 사용자 추가"
date: 2023-02-24 17:57 +0900
comments: true
tags : ["argocd add user"," argocd 사용자 추가"]
categories : ["kubernetes","k8s","argocd"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# argocd 사용자 추가

먼저 admin 패스워드 확인 방법은 아래의 방법을 사용하면 조회가 된다.

```shell
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

argocd CLI 인스톨 방법

```shell
brew install argocd
```

CLI로 접속

```shell
argocd login <hostname> --username admin --grpc-web-root-path /
```
argocd-cm configmap 다운로드

```shell

kubectl get configmap argocd-cm -n argocd -o yaml > argocd-cm.yml

```

```yaml

data:
  accounts.sanaes: login
  accounts.sanaes.enabled: "true"

```
위 처럼 사용자 추가

```shell
kubectl apply -f argocd-cm.yml
```

사용자 확인

```shell
argocd account list
```

패스워드 업데이트

```shell
argocd account update-password --account <user-id> --new-password <new-password> --current-password <admin-password>
```

# 참조

-----
* [argocd user management](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/)
