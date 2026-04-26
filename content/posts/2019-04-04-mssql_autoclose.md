---
layout: post
title: "mssql 자동닫기 설정 확인"
date: 2019-04-04 18:27 +0900
comments: true
tags : ["mssql"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## mssql 자동닫기 설정 확인 

```
select DATABASEPROPERTYEX ( database , property ) 

1: TRUE

0: FALSE

```

`SELECT DATABASEPROPERTY ( 'TEST', 'IsAutoClose')` 이런식으로 하면 확인이 가능하다.


위 내용으로 접속이 없으면 데이터 베이스 리소스를 내렸다가 올리는데 이런 상황에서는 성능저하가 된다.



# 참조
-----
* [databasepropertyex](https://docs.microsoft.com/en-us/sql/t-sql/functions/databasepropertyex-transact-sql?view=sql-server-2017)
* [database-properties-options](https://docs.microsoft.com/ko-kr/sql/relational-databases/databases/database-properties-options-page?view=sql-server-2017)

