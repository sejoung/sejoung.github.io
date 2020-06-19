---
layout: post
title: "SQL Server Management Studio isolation level 바꾸기"
date: 2020-06-18 18:10 +0900
comments: true
tags : ["isolation level","ssms","isolation level 바꾸기","SQL Server Management Studio"]
categories : ["mssql"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## SQL Server Management Studio isolation level 바꾸기

![SQL Server Management Studio isolation level 바꾸기1](https://sejoung.github.io/images/2020_06_18_01.png)

위에 메뉴에서 옵션을 클릭후

![SQL Server Management Studio isolation level 바꾸기2](https://sejoung.github.io/images/2020_06_18_02.png)

SQL Server -> 고급

메뉴에 보면 수정할수 있습니다

한가지 기본이 READ COMMITTED 인데 아래에 옵션에 보면 SET LOCK TIMEOUT 옵션이 -1이라서 해당 정보를 select 하더라도 대기 하고 있다.
해당 기능은 TOOL의 버그인것 같은데 해당기능을 짧게 가지고 가서 보는것이 좋을것 같다.

# 참조 
-----
* [how-to-change-your-default-isolation-level-in-ssms](http://blog.sqlgrease.com/how-to-change-your-default-isolation-level-in-ssms/)
* [set-transaction-isolation-level-transact-sql](https://docs.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql)

