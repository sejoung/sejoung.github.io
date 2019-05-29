---
layout: post
title: "CREATE LOGIN (Transact-SQL)"
date: 2019-05-29 15:00 +0900
comments: true
tags : ["mssql","CREATE LOGIN","Transact-SQL"]
categories : ["sql"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## CREATE LOGIN (Transact-SQL)

SQL Server, SQL 데이터베이스, SQL 데이터웨어 하우스 또는 Analytics Platform 시스템 데이터베이스에 대한 로그인을 만듭니다. 
특정 버전의 구문, 인수, 설명, 사용 권한 및 예제를 보려면 다음 탭 중 하나를 클릭하십시오.

CREATE LOGIN은 트랜잭션에 참여합니다. 
CREATE LOGIN이 트랜잭션 내에서 실행되고 트랜잭션이 롤백되면 로그인 생성이 롤백됩니다. 
트랜잭션 내에서 실행되면 트랜잭션이 커밋 될 때까지 생성 된 로그인을 사용할 수 없습니다.

구문 규칙에 대한 자세한 내용은 Transact-SQL 구문 표기 규칙을 참조하십시오 .

### Syntax

```tsql

-- Syntax for SQL Server
CREATE LOGIN login_name { WITH <option_list1> | FROM <sources> }

<option_list1> ::=
    PASSWORD = { 'password' | hashed_password HASHED } [ MUST_CHANGE ]
    [ , <option_list2> [ ,... ] ]

<option_list2> ::=
    SID = sid
    | DEFAULT_DATABASE = database
    | DEFAULT_LANGUAGE = language
    | CHECK_EXPIRATION = { ON | OFF}
    | CHECK_POLICY = { ON | OFF}
    | CREDENTIAL = credential_name

<sources> ::=
    WINDOWS [ WITH <windows_options>[ ,... ] ]
    | CERTIFICATE certname
    | ASYMMETRIC KEY asym_key_name

<windows_options> ::=
    DEFAULT_DATABASE = database
    | DEFAULT_LANGUAGE = language

```

### Arguments

login_name 작성된 로그인의 이름을 지정합니다. 
SQL Server 로그인, Windows 로그인, 인증서 매핑 된 로그인 및 비대칭 키 매핑 된 로그인의 네 가지 유형의 로그인이 있습니다. 
Windows 도메인 계정에서 매핑 된 로그인을 만들 때는 [<도메인 이름> \ <로그인 이름>] 형식으로 Windows 2000 이전 사용자 로그온 이름을 사용해야합니다. 
login_name @ DomainName 형식으로 UPN을 사용할 수 없습니다. 
예를 보려면이 기사 뒷부분의 예제 D를 참조하십시오. 인증 로그인은 sysname 유형 이며 식별자 에 대한 규칙을 준수해야 하며 ' \ '를 포함 할 수 없습니다. 
Windows 로그인은 ' \ '를 포함 할 수 있습니다 . Active Directory 사용자를 기반으로하는 로그인은 21 자 미만의 이름으로 제한됩니다.

PASSWORD = ' password'SQL Server 로그인에만 적용됩니다. 
작성중인 로그인의 암호를 지정합니다. 
강력한 암호를 사용하십시오. 
자세한 내용은 강력한 암호 및 암호 정책을 참조하십시오. 
SQL Server 2012 (11.x)부터 저장된 암호 정보는 소금에 절인 암호의 SHA-512를 사용하여 계산됩니다.

암호는 대소 문자를 구분합니다. 
암호는 항상 8 자 이상이어야하며 128자를 초과 할 수 없습니다. 
암호에는 az, AZ, 0-9 및 대부분 영숫자가 아닌 문자가 포함될 수 있습니다. 
암호에는 작은 따옴표 또는 login_name을 사용할 수 없습니다 .

PASSWORD = hashed_password 해시 키워드에만 적용됩니다. 
작성중인 로그인에 대한 암호의 해시 값을 지정합니다.

해시 SQL Server 로그인에만 적용됩니다. 
PASSWORD 인수가 이미 해시 된 후에 입력 한 암호를 지정합니다. 
이 옵션을 선택하지 않으면 데이터베이스에 저장되기 전에 암호로 입력 된 문자열이 해시됩니다. 
이 옵션은 한 서버에서 다른 서버로 데이터베이스를 마이그레이션하는 경우에만 사용해야합니다. 
HASHED 옵션을 사용하여 새 로그인을 생성하지 마십시오. 
HASHED 옵션은 SQL 7 이하에서 작성된 해시와 함께 사용할 수 없습니다.

MUST_CHANGE SQL Server 로그인에만 적용됩니다. 
이 옵션이 포함되면 SQL Server는 처음 새 로그인을 사용할 때 새 암호를 입력하라는 메시지를 표시합니다.

CREDENTIAL = credential_name 새 SQL Server 로그인에 맵핑 할 신임 의 이름. 자격 증명은 이미 서버에 존재해야합니다. 
현재이 옵션은 신임 정보 만 로그인에 연결합니다. 
자격 증명을 시스템 관리자 (sa) 로그인에 매핑 할 수 없습니다.

SID = sid 로그인을 다시 작성하는 데 사용됩니다. 
Windows 인증 로그인이 아닌 SQL Server 인증 로그인에만 적용됩니다. 
새 SQL Server 인증 로그인의 SID를 지정합니다. 이 옵션을 사용하지 않으면 SQL Server가 자동으로 SID를 할당합니다. 
SID 구조는 SQL Server 버전에 따라 다릅니다. SQL Server 로그인 SID : GUID를 기반으로 한 16 바이트 ( 이진수 (16) ) 리터럴 값입니다. 
예를 들어, SID = 0x14585E90117152449347750164BA00A7.

DEFAULT_DATABASE = database 로그인에 지정할 기본 데이터베이스를 지정합니다. 
이 옵션이 포함되어 있지 않으면 기본 데이터베이스가 master로 설정됩니다.

DEFAULT_LANGUAGE = language 로그인에 할당 할 기본 언어를 지정합니다. 
이 옵션이 포함되어 있지 않으면 기본 언어가 서버의 현재 기본 언어로 설정됩니다. 
나중에 서버의 기본 언어가 변경되면 로그인의 기본 언어는 변경되지 않습니다.

CHECK_EXPIRATION = {ON | OFF } SQL Server 로그인에만 적용됩니다. 
이 로그인시 암호 만료 정책을 적용할지 여부를 지정합니다. 
기본값은 OFF입니다.

CHECK_POLICY = { ON | OFF} SQL Server 로그인에만 적용됩니다.
이 로그인시 SQL Server가 실행되는 컴퓨터의 Windows 암호 정책을 적용하도록 지정합니다. 
기본값은 ON입니다.

Windows 정책에 강력한 암호가 필요한 경우 암호에는 다음 네 가지 특성 중 적어도 세 가지가 포함되어야합니다.

* 대문자 (AZ).
* 소문자 (az)
* 숫자 (0-9).
* _, @, *, ^, %,!, $, # 또는 &와 같은 영숫자가 아닌 문자 중 하나입니다.

WINDOWS 로그인이 Windows 로그인에 맵핑되도록 지정합니다.

CERTIFICATE certname 이 로그인과 연관 될 인증서의 이름을 지정합니다. 
이 인증서는 이미 master 데이터베이스에 있어야합니다.

ASYMMETRIC KEY asym_key_name 이 로그인과 연관 될 비대칭 키의 이름을 지정합니다. 
이 키는 이미 master 데이터베이스에서 발생해야합니다.


### Remarks

* 암호는 대소 문자를 구분합니다.
* 암호 사전 해싱은 SQL Server 로그인을 만들 때만 지원됩니다.
* MUST_CHANGE가 지정되면 CHECK_EXPIRATION 및 CHECK_POLICY가 ON으로 설정되어야합니다. 그렇지 않으면 명령.이 실패합니다.
* CHECK_POLICY = OFF 및 CHECK_EXPIRATION = ON의 조합은 지원되지 않습니다.
* CHECK_POLICY가 OFF로 설정되면 lockout_time 은 재설정되고 CHECK_EXPIRATION은 OFF로 설정됩니다.

```
CHECK_EXPIRATION 및 CHECK_POLICY는 Windows Server 2003 이상에서만 적용됩니다. 자세한 내용은 암호 정책을 참조하십시오 .
```

* 인증서 또는 비대칭 키에서 생성 된 로그인은 코드 서명에만 사용됩니다. SQL Server에 연결하는 데 사용할 수 없습니다. 
인증서 또는 비대칭 키가 master에 이미있는 경우에만 인증서 또는 비대칭 키로 로그인을 만들 수 있습니다.

* 스크립트에서 로그인 을 전송하려면 SQL Server 2005와 SQL Server 2008 인스턴스간에 로그인 및 암호를 전송하는 방법을 참조하십시오 .
* 로그인을 작성하면 자동으로 새 로그인이 사용 가능하게되고 서버 레벨 CONNECT SQL 권한에 로그인이 부여됩니다.
* 액세스를 허용하려면 서버의 인증 모드 가 로그인 유형과 일치해야합니다.
* 사용 권한 시스템 디자인에 대한 자세한 내용은 데이터베이스 엔진 사용 권한 시작을 참조하십시오 .

### Permissions
서버에 대한 ALTER ANY LOGIN 권한을 가진 사용자 또는 securityadmin 고정 서버 역할 의 구성원 만 로그인을 만들 수 있습니다. 
자세한 내용은 서버 수준 역할 및 ALTER SERVER ROLE을 참조하십시오 .
경우 CREDENTIAL 옵션을 사용, 또한 필요 ANY CREDENTIAL의 ALTER 서버의 권한을.

### 로그인을 만든후
로그인을 만든 후 로그인은 SQL Server에 연결할 수 있지만 공용 역할에 부여 된 권한 만 있습니다. 
다음 활동 중 일부를 수행하는 것을 고려하십시오.

* 데이터베이스에 연결하려면 로그인 할 데이터베이스 사용자를 만드십시오. 
자세한 내용은 CREATE USER를 참조하십시오 .
* CREATE SERVER ROLE 을 사용하여 사용자 정의 서버 역할을 만듭니다 . 
사용 ALTER 서버 역할을 ... 구성원을 추가 사용자 정의 서버 역할에 새 로그인을 추가 할 수 있습니다. 
자세한 내용은 CREATE SERVER ROLE 및 ALTER SERVER ROLE을 참조하십시오 .
* sp_addsrvrolemember 를 사용 하여 로그인을 고정 된 서버 역할에 추가하십시오. 
자세한 내용은 서버 수준 역할 및 sp_addsrvrolemember를 참조하십시오 .
* GRANT 문을 사용하여 새 로그인 또는 로그인이 포함 된 역할에 서버 수준 권한을 부여하십시오. 
자세한 내용은 GRANT를 참조하십시오 .


### Examples

#### A. 암호로 로그인 만들기

다음 예는 특정 사용자에 대한 로그인을 작성하고 암호를 지정합니다.

```tsql
CREATE LOGIN <login_name> WITH PASSWORD = '<enterStrongPasswordHere>';
GO
```

#### B. 암호를 변경해야하는 로그인 만들기

다음 예는 특정 사용자에 대한 로그인을 작성하고 암호를 지정합니다. 
이 MUST_CHANGE옵션을 사용하면 사용자가 처음 서버에 연결할 때이 암호를 변경해야합니다.

```tsql

CREATE LOGIN <login_name> WITH PASSWORD = '<enterStrongPasswordHere>'
    MUST_CHANGE, CHECK_EXPIRATION = ON;
GO

```

`CHECK_EXPIRATION이 OFF 일 때 MUST_CHANGE 옵션을 사용할 수 없습니다.`

#### C. credential 맵핑 된 로그인 작성

다음 예는 사용자를 사용하여 특정 사용자에 대한 로그인을 만듭니다. 이 로그인은 credential에 맵핑됩니다.

적용 대상 : SQL Server 2008에서 SQL Server 2017까지.

```tsql

CREATE LOGIN <login_name> WITH PASSWORD = '<enterStrongPasswordHere>',
    CREDENTIAL = <credentialName>;
GO

```

#### D. 인증서에서 로그인 만들기

다음 예는 master의 인증서에서 특정 사용자에 대한 로그인을 만듭니다.

적용 대상 : SQL Server 2008에서 SQL Server 2017까지.

```tsql

USE MASTER;
CREATE CERTIFICATE <certificateName>
    WITH SUBJECT = '<login_name> certificate in master database',
    EXPIRY_DATE = '12/05/2025';
GO
CREATE LOGIN <login_name> FROM CERTIFICATE <certificateName>;
GO

```

#### E. Windows 도메인 계정에서 로그인 만들기

다음 예는 Windows 도메인 계정에서 로그인을 만듭니다.

적용 대상 : SQL Server 2008에서 SQL Server 2017까지.

```tsql

CREATE LOGIN [<domainName>\<login_name>] FROM WINDOWS;
GO

```

#### F. SID에서 로그인 만들기

다음 예에서는 먼저 SQL Server 인증 로그인을 만들고 로그인의 SID를 결정합니다.

```tsql

CREATE LOGIN TestLogin WITH PASSWORD = 'SuperSecret52&&';
SELECT name, sid FROM sys.sql_logins WHERE name = 'TestLogin';
GO

```

내 쿼리는 SID로 0x241C11948AEEB749B0D22646DB1A19F2를 반환합니다. 검색어가 다른 값을 반환합니다. 
다음 명령문은 로그인을 삭제 한 다음 로그인을 다시 작성합니다. 
이전 쿼리의 SID를 사용하십시오.

```tsql

DROP LOGIN TestLogin;
GO

CREATE LOGIN TestLogin
WITH PASSWORD = 'SuperSecret52&&', SID = 0x241C11948AEEB749B0D22646DB1A19F2;

SELECT * FROM sys.sql_logins WHERE name = 'TestLogin';
GO

```



# 참조
-----
* [create-login-transact-sql](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-login-transact-sql)




