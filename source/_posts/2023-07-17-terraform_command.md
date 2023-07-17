---
layout: post
title: "테라폼 커멘드"
date: 2023-07-17 17:03 +0900
comments: true
tags: [ "terraform command","iac","테라폼 커멘드"]
categories: [ "terraform" ]
sitemap:
changefreq: daily
priority: 1.0
---

# 테라폼 커멘드

## 설치

```shell
  brew tap hashicorp/tap
  brew install hashicorp/tap/terraform
```
## 업데이트

```shell
brew update
brew upgrade hashicorp/tap/terraform
```

## 자동완성 설치

```shell
touch ~/.zshrc
terraform -install-autocomplete
```

## 초기화

```shell
terraform init
```

## 포멧 확인

```shell
terraform fmt
```

## 검증

```shell
terraform validate
```

## 인프라 생성

```shell
terraform apply
```

## 상태 검사

```shell
terraform show
```

## 인프라 삭제

```shell
terraform destroy
```

# 참조
-----

* [terraform docs](https://developer.hashicorp.com/terraform/docs)
