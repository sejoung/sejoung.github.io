---
layout: post
title: "ssh config 설정"
date: 2021-06-21 13:08 +0900
comments: true
tags : ["ssh config","ssh"]
categories : ["ssh"]
sitemap :
changefreq : daily
priority : 1.0
--->
# ssh config 설정

## 설정

`~/.ssh/` 폴더에 config 파일 설정으로 편하게 접속가능하게 설정 할수 있다.

```

Host 이름
    HostName 서버 아이피
    User 계정명
    IdentityFile 인증서 경로
    Port 포트(기본 22)

예) 
Host aws-ubuntu1
    HostName 11.132.9.67
    User centos
    IdentityFile ~/.ssh/test.pem
    Port 101010

```

## 권한 설정
`chmod 440 ~/.ssh/config`

# 참고자료
* [ssh_config](http://taewan.kim/post/ssh_config/)
