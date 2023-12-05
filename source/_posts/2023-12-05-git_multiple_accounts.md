---
layout: post
title: "github 여러 계정 관리(ssh)"
date: 2023-11-21 10:02 +0900
comments: true
tags: [ "github","ssh","multiple accounts","멀티 계정","여러 계정" ]
categories: [ "ssh" ]
sitemap:
changefreq: daily
priority: 1.0
---

# github 여러 계정 관리(ssh)

## ssh 키 생성

```shell
ssh-keygen -t ed25519 -C "sejoung@gmail.com" -f "id_ed25519_sejoung"

ssh-keygen -t ed25519 -C "beni@realdraw.ai" -f "id_ed25519_beni"

```


## ssh 키 등록

```shell
ssh-add ~/.ssh/id_ed25519_sejoung

ssh-add ~/.ssh/id_ed25519_beni
```

등록된 ssh 키 등록 확인

```shell
ssh-add -l
```

## 키등록

```shell
cat ~/.ssh/id_ed25519_sejoung.pub

cat ~/.ssh/id_ed25519_beni.pub
```

## ssh config 설정

```shell

Host github.com
  HostName github.com
  User sejoung
  IdentityFile ~/.ssh/id_ed25519_sejoung

Host github.com-beni
  HostName github.com
  User beni
  IdentityFile ~/.ssh/id_ed25519_beni  

```

## 설정 후 테스트

```shell
ssh -T git@github.com

ssh -T git@github.com-beni
```

# 참조
-----

* [새 SSH 키 생성 및 ssh-agent에 추가](https://docs.github.com/ko/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
