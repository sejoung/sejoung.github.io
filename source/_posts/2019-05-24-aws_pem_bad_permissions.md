---
layout: post
title: "aws에 접속할때 load key bad permissions 에러 "
date: 2019-05-24 16:32 +0900
comments: true
tags : ["pem","bad permissions","load key bad permissions"]
categories : ["aws"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## aws에 접속할때 load key bad permissions 에러

```
ssh -i /path/my-key-pair.pem ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com

```
간만에 aws 접속하려고 명령어를 치는되 않됨

```
Warning: Permanently added 'test' (ECDSA) to the list of known hosts.
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for 'test.pem' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "test.pem": bad permissions

```

load key bad permissions 에러가 남 먼지를 찾아보 해당 pem 파일의 퍼미션을 높게 줘서 문제가 됨

```
chmod 400 test.pem 
```
위처럼 권한을 조정하니 다시 잘 접속이 됨

# 참조
-----


