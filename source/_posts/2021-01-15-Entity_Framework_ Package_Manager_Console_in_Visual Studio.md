---
layout: post
title: "닷넷(dotnet) 엔티티 프레임워크(Entity Framework)에서 패키지 관리자 콘솔 명령어 정리"
date: 2021-01-15 11:07 +0900
comments: true
tags : ["c#","Entity Framework","dotnet"," Package Manager Console","엔티티 프레임워크","Visual Studio","PM","Migration"]
categories : ["c#"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# 닷넷(dotnet) 엔티티 프레임워크(Entity Framework)에서 패키지 관리자 콘솔 명령어 정리

## 인스톨 명령
```PowerShell

Install-Package Microsoft.EntityFrameworkCore.Tools

```

## 업데이트 명령
```PowerShell

Update-Package Microsoft.EntityFrameworkCore.Tools

```

## 사용법 및 정상동작하는지 확인하기 위한 명령
```PowerShell
Get-Help about_EntityFrameworkCore
```

## 마이그레이션 파일 생성(Add-Migration)

엔티티 프레임워크 모델을 생성후에 마이그레이션 파일을 생성 하는 커멘드이다.

```PowerShell

Add-Migration InitialCreate

```
위처럼 `Add-Migration` 명령어를 사용하면 되는데 뒤에 인자를 준 이름으로 마이그레이션 파일이 생성된다.

* -Name <String> : 마이그레이션 이름으로 필수 값입니다.
* -OutputDir <String> : 파일을 출력하는 디렉토리입니다. 경로는 대상프로젝트를 기준으로 합니다. 기본값은 migration 입니다.
* -Namespace <String> : 생성 된 클래스에 사용할 네임 스페이스입니다. 출력디렉토리가 생성되는것이 기본값입니다. EF Core 5.0에서 추가

## 데이터 베이스 삭제(Drop-Database)

```PowerShell

Drop-Database

```
* -WhatIf

## DbContext 정보를 조회(Get-DbContext)


```PowerShell

Get-DbContext

```

## 사용가능한 마이그레이션 확인(Get-Migration)

```PowerShell

Get-Migration

```



## 마이그레이션 제거(Remove-Migration)

```PowerShell
Remove-Migration
```
* -Force : 마이그레이션을 되돌립니다 (데이터베이스에 적용 된 변경 내용 롤백).

## Scaffold-DbContext

DbContext데이터베이스에 대 한 및 엔터티 형식에 대 한 코드를 생성 합니다. 에서 Scaffold-DbContext 엔터티 형식을 생성 하려면 데이터베이스 테이블에 기본 키가 있어야 합니다.


* -Connection <String> : 데이터베이스에 대한 연결 문자열입니다. ASP.NET Core 2.x 프로젝트의 경우 값은 name = <name of connection string> 일 수 있습니다. 이 경우 프로젝트에 대해 설정 된 구성 소스에서 이름이 제공 됩니다. 이 매개 변수는 위치 매개 변수 이며 필수입니다.
* -Provider <String> : 사용할 공급자입니다. 일반적으로 NuGet 패키지의 이름입니다 (예:) Microsoft.EntityFrameworkCore.SqlServer. 이 매개 변수는 위치 매개 변수 이며 필수 입니다.
* -OutputDir <String> : 파일을 저장할 디렉터리입니다. 경로는 프로젝트 디렉터리에 상대적입니다.
* -ContextDir <String> : 파일을 저장할 디렉터리 DbContext 입니다. 경로는 프로젝트 디렉터리에 상대적입니다.
* -Namespace <String> : 생성 된 모든 클래스에 사용할 네임 스페이스입니다. 기본값은 루트 네임 스페이스와 출력 디렉터리에서 생성 됩니다. EF Core 5.0에서 추가 되었습니다.
* -ContextNamespace <String> : 생성 된 클래스에 사용할 네임 스페이스 DbContext 입니다. 참고: -Namespace 를 재정의 합니다. EF Core 5.0에서 추가 되었습니다.
* -Context <String> : 생성할 클래스의 이름 DbContext 입니다.
* -Schemas <String[]> : 엔터티 형식을 생성할 테이블의 스키마입니다. 이 매개 변수를 생략 하면 모든 스키마가 포함 됩니다.
* -Tables <String[]> : 엔터티 형식을 생성할 테이블입니다. 이 매개 변수를 생략 하면 모든 테이블이 포함 됩니다.
* -DataAnnotations : 특성을 사용 하 여 모델을 구성 합니다 (가능한 경우). 이 매개 변수를 생략 하면 흐름 API만 사용 됩니다.
* -UseDatabaseNames : 테이블 및 열 이름은 데이터베이스에 표시 된 대로 정확 하 게 사용 합니다. 이 매개 변수를 생략 하는 경우에는 데이터베이스 이름이 c # 이름 스타일 규칙을 더욱 잘 준수 하도록 변경 됩니다.
* -Force : 기존 파일을 덮어씁니다.
* -NoOnConfiguring : 생성 하지 않습니다 DbContext.OnConfiguring . EF Core 5.0에서 추가 되었습니다.
* -NoPluralize : Pluralizer를 사용 하지 마세요. EF Core 5.0에서 추가 되었습니다.

```PowerShell
Scaffold-DbContext "Server=(localdb)\mssqllocaldb;Database=Blogging;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models
```

예를 들어 선택한 테이블만 스캐폴드 지정된 이름 및 네임 스페이스를 사용 하 여 별도의 폴더에 컨텍스트를 만듭니다.

```PowerShell

Scaffold-DbContext "Server=(localdb)\mssqllocaldb;Database=Blogging;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Tables "Blog","Post" -ContextDir Context -Context BlogContext -ContextNamespace New.Namespace

```

```PowerShell

Scaffold-DbContext "Name=ConnectionStrings.Blogging" Microsoft.EntityFrameworkCore.SqlServer

```


## DbContext에서 SQL 스크립트를 생성(Script-DbContext)

* 모든 마이그레이션을 무시
* EF Core 3.0에서 추가

```PowerShell

Script-DbContext

```
* -Output <String> : 

## SQL 스크립트 생성(Script-Migration)

선택한 마이그레이션의 모든 변경 내용을 선택한 다른 마이그레이션에 적용 하는 SQL 스크립트를 생성 합니다.

* -From <String> : 마이그레이션을 시작 하는 중입니다. 마이그레이션은 이름 또는 ID로 식별할 수 있습니다. 숫자 0은 첫 번째 마이그레이션 이전 을 의미 하는 특수 한 경우입니다. 기본값은 0입니다.
* -To <String> : 종료 마이그레이션입니다. 마지막 마이그레이션에 대 한 기본값입니다.
* -Idempotent : 마이그레이션할 때 데이터베이스에서 사용할 수 있는 스크립트를 생성 합니다.
* -NoTransactions : SQL 트랜잭션 문을 생성 하지 않습니다. EF Core 5.0에서 추가 되었습니다.
* -Output <String> : 결과를 쓸 파일입니다. 이 매개 변수를 생략 하면 응용 프로그램의 런타임 파일이 생성 되는 폴더와 동일한 폴더에 생성 된 이름으로 파일이 생성 됩니다 (예: /obj/Debug/netcoreapp2.1/ghbkztfz.sql/ ).

다음 예에서는 마이그레이션 이름을 사용 하 여 InitialCreate migration (마이그레이션이 없는 데이터베이스에서)에 대 한 스크립트를 만듭니다.

```PowerShell

Script-Migration 0 InitialCreate

```

다음 예에서는 마이그레이션 ID를 사용 하 여 InitialCreate migration 이후의 모든 마이그레이션에 대한 스크립트를 만듭니다

```PowerShell
Script-Migration 20180904195021_InitialCreate

```

## 데이터베이스 업데이트(Update-Database)
데이터베이스를 마지막 마이그레이션 또는 지정 된 마이그레이션으로 업데이트 합니다.


* -Migration <String> : 대상 마이그레이션입니다. 마이그레이션은 이름 또는 ID로 식별할 수 있습니다. 숫자 0은 첫 번째 마이그레이션 이전 을 의미 하는 특별 한 경우로, 모든 마이그레이션이 되돌려집니다. 마이그레이션이 지정 되지 않은 경우이 명령은 기본적으로 마지막 마이그레이션을 설정 합니다.
* -Connection <String> : 데이터베이스에 대한 연결 문자열입니다. 는 또는에 지정 된 것으로 기본 설정 AddDbContext OnConfiguring 됩니다. EF Core 5.0에서 추가 되었습니다.

다음 예에서는 모든 마이그레이션을 되돌립니다.

```PowerShell
Update-Database 0

```

다음 예에서는 데이터베이스를 지정 된 마이그레이션으로 업데이트 합니다. 첫 번째는 마이그레이션 이름을 사용 하 고 두 번째는 마이그레이션 ID 및 지정 된 연결을 사용 합니다.
```PowerShell
Update-Database InitialCreate
Update-Database 20180904195021_InitialCreate -Connection your_connection_string

```


# 참조
-----
* [dotnet Package Manager Console in Visual Studio](https://docs.microsoft.com/ko-kr/ef/core/cli/powershell)


