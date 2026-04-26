---
layout: post
title: "인텔리제이 데이터 베이스 툴 사용하기"
date: 2019-10-04 14:17 +0900
comments: true
tags : ["intellij","database"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## 인텔리제이 데이터 베이스 툴 사용하기

jetbrains에 datagrid라는 DB 툴이 따로 존재 한다. 

하지만 인텔리제이 Ultimate edition 에 해당 기능을 사용할수 있게 제공해주고 있다.

하지만 프로젝트 마다 datasource를 공유가 되지 않아서 불편하다. 그래서 빈 프로젝트를 만들어서 해당 기능을 사용하는 것을 추천한다.

그리고 데이터 베이스에 연결이 되어 있는경우 테이블을 변경하면 해당 프로젝트에서 참조하고 있던 쿼리문이 자동으로 수정이 된다.


# 참조
----- 
* [idea Database tools and SQL](https://www.jetbrains.com/help/idea/relational-databases.html)
