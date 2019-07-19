---
layout: post
title: "mssql 사용자 계정에 특정 오브젝트 권한만 부여"
date: 2019-07-19 10:08 +0900
comments: true
tags : ["GRANT"]
categories : ["mssql"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## mssql 사용자 계정에 특정 오브젝트 권한만 부여

먼저 로그인 사용자를 만듬

![SSMS UI1](https://sejoung.github.io/images/2019_07_19_01.png)

로그인 사용자의 설정들
![SSMS UI2](https://sejoung.github.io/images/2019_07_19_02.png)

![SSMS UI3](https://sejoung.github.io/images/2019_07_19_03.png)

![SSMS UI4](https://sejoung.github.io/images/2019_07_19_04.png)

![SSMS UI5](https://sejoung.github.io/images/2019_07_19_05.png)

![SSMS UI6](https://sejoung.github.io/images/2019_07_19_06.png)

![SSMS UI7](https://sejoung.github.io/images/2019_07_19_07.png)

![SSMS UI8](https://sejoung.github.io/images/2019_07_19_08.png)

![SSMS UI9](https://sejoung.github.io/images/2019_07_19_09.png)

테이블에 select 권한을 주면 된다 한글로 선택이라고 나옴 ㅡㅡㅋ

![SSMS UI10](https://sejoung.github.io/images/2019_07_19_10.png)



# 참조
-----
* [모듈 서명(데이터베이스 엔진)](https://docs.microsoft.com/ko-kr/previous-versions/sql/sql-server-2008/ms345102%28v%3dsql.100%29)
* [GRANT(Transact-SQL)](https://docs.microsoft.com/ko-kr/previous-versions/sql/sql-server-2008/ms187965(v=sql.100))