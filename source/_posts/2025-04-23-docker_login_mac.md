---
layout: post
title: "Docker login 시 mac keychain 에러"
date: 2025-04-23 11:43 +0900
comments: true
tags: [ "docker login", "macos", "error storing credentials ", "docker", "keychain unlock" ]
categories: [ "docker" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# Docker login 시 mac keychain 에러

## 로그인

```
echo 키정보 | docker login -u 사용자 --password-stdin

```

### 예시 
```
echo dckr_pat_ewhqgTvF1234GFjYM4ziAEWNctrw | docker login -u zolla --password-stdin
```

### 에러 

```
Error saving credentials: error storing credentials - err: exit status 1, out: `error getting credentials - err: exit status 1, out: `keychain cannot be accessed because the current session does not allow user interaction. The keychain may be locked; unlock it by running "security -v unlock-keychain ~/Library/Keychains/login.keychain-db" and try again``
```


## 해결 방법

Keychain 잠금 해제

```
security unlock-keychain -p '비밀번호' ~/Library/Keychains/login.keychain-db
```

```
security unlock-keychain -p '1234' ~/Library/Keychains/login.keychain-db
```

# 참고

-----
