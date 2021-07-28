---
layout: post
title: "Active Record"
date: 2021-07-28 21:33 +0900
comments: true
tags : ["Active Record","Patterns of Enterprise Application Architecture"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# Active Record

데이터베이스 테이블 또는 뷰의 행을 래핑하고 데이터베이스 액세스를 캡슐화하고 해당 데이터에 도메인 논리를 추가하는 개체입니다.

개체는 데이터와 동작을 모두 전달합니다. 
이 데이터의 대부분은 영구적이며 데이터베이스에 저장해야 합니다. 
Active Record는 가장 확실한 접근 방식을 사용하여 데이터 액세스 논리를 도메인 개체에 넣습니다. 
이렇게 하면 모든 사람들이 데이터베이스에서 데이터를 읽고 쓰는 방법을 알 수 있습니다.

# 참고자료
-----
* [activeRecord](https://martinfowler.com/eaaCatalog/activeRecord.html)

