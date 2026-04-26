---
layout: post
title: "mssql create-a-login"
date: 2019-05-29 11:01 +0900
comments: true
tags : ["mssql","create-a-login"]
categories : ["sql"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 로그인 만들기

이 항목에서는 SQL Server Management Studio 또는 Transact-SQL을 사용하여 SQL Server 2017 또는 SQL 데이터베이스에 로그인을 만드는 방법에 대해 설명합니다. 
로그인은 SQL Server 인스턴스에 연결하는 사람 또는 프로세스의 ID입니다.

### 배경

로그인은 보안 주체이거나 보안 시스템에서 인증 할 수있는 엔터티입니다. 
SQL Server에 연결하려면 로그인이 필요합니다. 
Windows 사용자 (예 : 도메인 사용자 또는 Windows 도메인 그룹)를 기반으로 로그인을 만들거나 Windows 사용자 (예 : SQL Server 로그인)를 기반으로하지 않는 로그인을 만들 수 있습니다.

```

참고 : SQL Server 인증을 사용하려면 데이터베이스 엔진이 혼합 모드 인증을 사용해야합니다. 자세한 내용은 인증 모드 선택을 참조 하십시오 .

```

보안 주체로서 사용 권한을 로그인에 부여 할 수 있습니다. 
로그인 범위는 전체 데이터베이스 엔진입니다. 
SQL Server 인스턴스의 특정 데이터베이스에 연결하려면 로그인을 데이터베이스 사용자에 매핑해야합니다. 
데이터베이스 내 권한은 로그인이 아니라 데이터베이스 사용자에게 부여되고 거부됩니다. 
SQL Server의 전체 인스턴스 범위 (예 : CREATE ENDPOINT 권한)가있는 사용 권한을 로그인에 부여 할 수 있습니다.

```

참고 : 로그인이 SQL Server에 연결되면 ID는 master 데이터베이스에서 유효성이 검사됩니다. 
포함 된 데이터베이스 사용자를 사용하여 데이터베이스 수준에서 SQL Server 및 SQL 데이터베이스 연결을 인증합니다. 
포함 된 데이터베이스 사용자를 사용할 때 로그인 할 필요가 없습니다. 
포함 된 데이터베이스는 다른 데이터베이스 및 데이터베이스를 호스팅하는 SQL Server / SQL 데이터베이스 (및 마스터 데이터베이스)의 인스턴스에서 격리 된 데이터베이스입니다. 
SQL Server는 Windows 및 SQL Server 인증을 위해 포함 된 데이터베이스 사용자를 지원합니다. 
SQL 데이터베이스를 사용할 때 포함 된 데이터베이스 사용자를 데이터베이스 수준의 방화벽 규칙과 결합합니다. 
자세한 내용은 포함 된 데이터베이스 사용자 - 데이터베이스를 휴대용으로 만들기를 참조하십시오.

```

### 보안

SQL Server를 사용하려면 서버에 대해 ALTER ANY LOGIN 또는 ALTER LOGIN 권한이 필요합니다.

SQL 데이터베이스에는 loginmanager 역할의 구성원 자격이 필요합니다.

### T-SQL을 사용하여 Windows 인증을 사용하여 로그인 만들기


```tsql

-- Create a login for SQL Server by specifying a server name and a Windows domain account name.  

CREATE LOGIN [<domainName>\<loginName>] FROM WINDOWS;  
GO  

```

### T-SQL을 사용하여 SQL Server 인증을 사용하여 로그인 만들기

```tsql

-- Creates the user "shcooper" for SQL Server using the security credential "RestrictedFaculty"   
-- The user login starts with the password "Baz1nga," but that password must be changed after the first login.  

CREATE LOGIN shcooper   
   WITH PASSWORD = 'Baz1nga' MUST_CHANGE,  
   CREDENTIAL = RestrictedFaculty;  
GO  

```

### 후속 조치 : 로그인을 만든 후 수행 할 단계

로그인을 생성 한 후 로그인은 SQL Server에 연결할 수 있지만 반드시 유용한 작업을 수행 할 수있는 충분한 권한이있는 것은 아닙니다. 
다음 목록은 일반적인 로그인 작업에 대한 링크를 제공합니다.

* 로그인이 역할에 가입하도록하려면 참조 역할을 가입 .

* 데이터베이스를 사용하도록 로그인 권한을 부여하려면 데이터베이스 사용자 만들기를 참조 하십시오 .

* 로그인 권한을 부여하려면 주체에 사용 권한 부여를 참조하십시오 .


# 참조
-----
* [create-a-login](https://docs.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-login)



