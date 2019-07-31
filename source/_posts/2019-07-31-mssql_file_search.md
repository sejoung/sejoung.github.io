---
layout: post
title: "mssql을 이용해서 특정 위치에 파일을 찾는 쿼리"
date: 2019-07-31 13:52 +0900
comments: true
tags : ["pem to ppk","putty"]
categories : ["mssql"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## mssql을 이용해서 특정 위치에 파일을 찾는 쿼리

```sql

begin
DECLARE @isExists INT
exec master.dbo.xp_fileexist 'C:\test.txt', @isExists OUTPUT
select * from (SELECT @isExists as cnt ) a where a.cnt > 0;
End


```


# 참조
-----


