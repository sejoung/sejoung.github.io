---
layout: post
title: "mssql like ["
date: 2020-05-07 10:49 +0900
comments: true
tags : ["mssql 대괄호","brackets","like"]
categories : ["sql"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## mssql like brackets([)

mssql 에서 like 검색을 하는데 키워드가 `[안녕]하하하`

위와같이 대괄호가 있다 해당 대괄호는 조회가 되지 않았다. 

찾아 보니 와일드 카드로 `%`, `_`, `[]`, `[^]` 4개가 존재하고 있었다. 

괄호 검색을 위해선 앞 괄호를 이런식으로 표현을 해야 된다.

`[[]` 위 키워드에 적용을 해보면 `[[]안녕]하하하` 이런식으로 처리를 해야 재대로 검색이 된다.


# 참조 
-----
* [like-transact-sql](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/like-transact-sql)



