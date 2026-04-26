---
layout: post
title: "mssql 사용자 계정에 특정 오브젝트 권한만 부여"
date: 2019-07-19 10:08 +0900
comments: true
tags : ["mssql","GRANT", "Transact-SQL"]
categories : ["sql"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## mssql 사용자 계정에 특정 오브젝트 권한만 부여

먼저 로그인 사용자를 만듬

![SSMS UI1](https://sejoung.github.io/images/2019_07_19_01.png)

사용자 역활은 public만 줌

![SSMS UI2](https://sejoung.github.io/images/2019_07_19_02.png)

데이터 베이서를 맵핑 시킴

![SSMS UI3](https://sejoung.github.io/images/2019_07_19_03.png)

그다음 데이터 베이스의 보안탭을 보면 만든 사용자가 있음 더블 클릭하면

![SSMS UI4](https://sejoung.github.io/images/2019_07_19_04.png)

사용자가 소유한 스키마가 나오는데 없음

![SSMS UI5](https://sejoung.github.io/images/2019_07_19_05.png)

맴버 자격 없음

![SSMS UI6](https://sejoung.github.io/images/2019_07_19_06.png)

보안개체에서 검색버튼을 클릭 여기서 특정 개체를 선택후 클릭

![SSMS UI7](https://sejoung.github.io/images/2019_07_19_07.png)

개체 유형을 클릭하면 유형이 나옴 유형을 선택함

![SSMS UI8](https://sejoung.github.io/images/2019_07_19_08.png)

그다음에 찾아보기 버튼을 누르면 개체리스트가 나옴 선택

![SSMS UI9](https://sejoung.github.io/images/2019_07_19_09.png)


개체의 권한을 맵핑 시킴 조회만 할려면 select 권한을 주면 된다 한글로 선택이라고 나옴 ㅡㅡ

![SSMS UI10](https://sejoung.github.io/images/2019_07_19_10.png)



# 참조
-----
* [모듈 서명(데이터베이스 엔진)](https://docs.microsoft.com/ko-kr/previous-versions/sql/sql-server-2008/ms345102%28v%3dsql.100%29)
* [GRANT(Transact-SQL)](https://docs.microsoft.com/ko-kr/previous-versions/sql/sql-server-2008/ms187965(v=sql.100))