---
layout: post
title: "c# 환경변수 설정"
date: 2021-02-15 15:30 +0900
comments: true
tags : ["c#","환경변수설정","환경변수","환경변수셋팅"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# c# 환경변수 설정

`launchSettings.json`에 설정된 환경 변수값을 받아서 처리를 하는데 테스트 코드 작성시 특정 환경 변수에서 동작하고 싶을때 아래처럼 `Environment.SetEnvironmentVariable` 메소드를 사용하면 환경 변수를 셋팅할수 있다.

```c#
	Environment.SetEnvironmentVariable("CONNECTION_STRING", "Data Source =.\\TEST; Initial Catalog = testdb; Integrated Security = True; ");
```

# 참조
-----
* [Environment.SetEnvironmentVariable 메서드](https://docs.microsoft.com/ko-kr/dotnet/api/system.environment.setenvironmentvariable?view=net-5.0)

