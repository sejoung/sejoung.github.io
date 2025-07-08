---
layout: post
title: "GitHub Pages에서 Custom Domain 설정하기"
date: 2025-07-08 17:11 +0900
comments: true
tags: [ "github", "github pages", "도메인설정", "custom domain", "DNS 설정" ]
categories: [ "github" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# GitHub Pages에서 Custom Domain 설정하기

## A 레코드 설정

A 레코드 설정을 @로 해서 다음 IP 주소로 설정합니다. 

```

A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153

```

## 도메인 설정

```
CNAME tech.EXAMPLE.COM sejoung.github.io.
```


## 확인 방법

```
dig WWW.EXAMPLE.COM +nostats +nocomments +nocmd
> TECH.EXAMPLE.COM.             3592    IN      CNAME   sejoung.github.io.
sejoung.github.io.	3600	IN	A	185.199.108.153
sejoung.github.io.	3600	IN	A	185.199.109.153
sejoung.github.io.	3600	IN	A	185.199.110.153
sejoung.github.io.	3600	IN	A	185.199.111.153

```


# 참고

-----

* [사용자 지정 도메인 구성 정보](https://docs.github.com/ko/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
