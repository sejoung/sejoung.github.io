---
layout: post
title: "mssql CREATE PROCEDURE"
date: 2019-05-31 10:55 +0900
comments: true
tags : ["mssql","CREATE PROCEDURE", "Transact-SQL"]
categories : ["sql"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## CREATE PROCEDURE

SQL Server, Azure SQL 데이터베이스, Azure SQL 데이터웨어 하우스 및 병렬 데이터웨어 하우스에 Transact-SQL 또는 CLR (공용 언어 런타임) 저장 프로 시저를 만듭니다. 
저장 프로시 저는 다음과 같은 점에서 다른 프로그래밍 언어의 프로 시저와 유사합니다.

입력 매개 변수를 수락하고 출력 매개 변수 형태로 여러 값을 호출 프로 시저 또는 일괄 처리로 반환합니다.

다른 프로 시저 호출을 포함하여 데이터베이스에서 작업을 수행하는 프로그래밍 문을 포함합니다.

상태 값을 호출 프로 시저 또는 일괄 처리에 반환하여 성공 또는 실패 (및 실패 이유)를 나타냅니다.

이 문을 사용하여 현재 데이터베이스에서 영구 프로 시저를 만들거나 tempdb 데이터베이스 에서 임시 프로 시저를 만듭니다 .

### Syntax

```tsql

-- Transact-SQL Syntax for Stored Procedures in SQL Server and Azure SQL Database  
  
CREATE [ OR ALTER ] { PROC | PROCEDURE } 
    [schema_name.] procedure_name [ ; number ]   
    [ { @parameter [ type_schema_name. ] data_type }  
        [ VARYING ] [ = default ] [ OUT | OUTPUT | [READONLY]  
    ] [ ,...n ]   
[ WITH <procedure_option> [ ,...n ] ]  
[ FOR REPLICATION ]   
AS { [ BEGIN ] sql_statement [;] [ ...n ] [ END ] }  
[;]  
  
<procedure_option> ::=   
    [ ENCRYPTION ]  
    [ RECOMPILE ]  
    [ EXECUTE AS Clause ]  

```

```tsql

-- Transact-SQL Syntax for CLR Stored Procedures  
  
CREATE [ OR ALTER ] { PROC | PROCEDURE } 
    [schema_name.] procedure_name [ ; number ]   
    [ { @parameter [ type_schema_name. ] data_type }   
        [ = default ] [ OUT | OUTPUT ] [READONLY]  
    ] [ ,...n ]   
[ WITH EXECUTE AS Clause ]  
AS { EXTERNAL NAME assembly_name.class_name.method_name }  
[;]  

```

```tsql

-- Transact-SQL Syntax for Natively Compiled Stored Procedures  
  
CREATE [ OR ALTER ] { PROC | PROCEDURE } [schema_name.] procedure_name  
    [ { @parameter data_type } [ NULL | NOT NULL ] [ = default ] 
        [ OUT | OUTPUT ] [READONLY] 
    ] [ ,... n ]  
  WITH NATIVE_COMPILATION, SCHEMABINDING [ , EXECUTE AS clause ]  
AS  
{  
  BEGIN ATOMIC WITH (set_option [ ,... n ] )  
sql_statement [;] [ ... n ]  
 [ END ]  
}  
 [;]  
  
<set_option> ::=  
    LANGUAGE =  [ N ] 'language'  
  | TRANSACTION ISOLATION LEVEL =  { SNAPSHOT | REPEATABLE READ | SERIALIZABLE }  
  | [ DATEFIRST = number ]  
  | [ DATEFORMAT = format ]  
  | [ DELAYED_DURABILITY = { OFF | ON } ]  

```

```tsql

-- Transact-SQL Syntax for Stored Procedures in Azure SQL Data Warehouse
-- and Parallel Data Warehouse  
  
-- Create a stored procedure   
CREATE { PROC | PROCEDURE } [ schema_name.] procedure_name  
    [ { @parameterdata_type } [ OUT | OUTPUT ] ] [ ,...n ]  
AS { [ BEGIN ] sql_statement [;][ ,...n ] [ END ] }  
[;]  

```

### Arguments

#### OR ALTER 

적용 대상 : Azure SQL 데이터베이스, SQL Server (SQL Server 2016 (13.x) SP1부터).

이미 존재하는 경우 프로 시저를 변경합니다.

#### schema_name

프로시저가 속하는 스키마의 이름. 프로 시저는 스키마 바운드입니다. 
프로시저를 작성할 때 스키마 이름을 지정하지 않으면 프로 시저를 작성중인 사용자의 기본 스키마가 자동으로 지정됩니다.

#### procedure_name

프로 시저 의 이름. 프로 시저 이름은 식별자에 대한 규칙을 따라야 하며 스키마 내에서 고유해야합니다.

프로 시저를 명명 할 때 sp_ 접두어를 사용하지 마십시오. 
이 접두사는 SQL Server에서 시스템 프로 시저를 지정하는 데 사용됩니다. 
접두사를 사용하면 같은 이름의 시스템 프로 시저가있는 경우 응용 프로그램 코드가 손상 될 수 있습니다.

로컬 임시 프로 시저의 경우 procedure_name ( #procedure_name ) 앞에 하나의 숫자 기호 (#)를 사용 하고 전역 임시 프로 시저 ( ## procedure_name )의 경우 두 개의 숫자 기호를 사용하여 로컬 또는 전역 임시 프로 시저를 만들 수 있습니다. 
로컬 임시 프로시 저는 작성한 연결에만 표시되며 해당 연결이 닫히면 삭제됩니다. 
전역 임시 프로시 저는 모든 연결에서 사용할 수 있으며 프로 시저를 사용하여 마지막 세션이 끝날 때 삭제됩니다. 
임시 이름은 CLR 프로 시저에 지정할 수 없습니다.

'##'을 포함한 프로 시저 또는 전역 임시 프로 시저의 전체 이름은 128자를 초과 할 수 없습니다. 
'#'을 포함한 로컬 임시 프로 시저의 전체 이름은 116자를 초과 할 수 없습니다.

#### number

동일한 이름의 프로 시저를 그룹화하는 데 사용되는 선택적 정수. 
이러한 그룹화 된 프로 시저는 하나의 DROP PROCEDURE 문을 사용하여 함께 삭제할 수 있습니다.

번호가 매겨진 프로 시저는 xml 또는 CLR 사용자 정의 형식을 사용할 수 없으며 계획 지침에서 사용할 수 없습니다.

#### @ parameter

프로 시저에서 선언 된 매개 변수입니다. 
@ 기호를 첫 번째 문자로 사용하여 매개 변수 이름을 지정하십시오. 
매개 변수 이름은 식별자에 대한 규칙을 준수해야합니다. 
매개 변수는 프로 시저에 대해 로컬입니다. 
동일한 매개 변수 이름을 다른 프로 시저에서 사용할 수 있습니다.

하나 이상의 매개 변수를 선언 할 수 있습니다. 
최대 값은 2,100입니다. 
매개 변수의 기본값이 정의되거나 값이 다른 매개 변수와 같지 않으면 프로 시저가 호출 될 때 각 선언 된 매개 변수의 값을 사용자가 제공해야합니다. 
프로 시저에 테이블 반환 매개 변수 가 포함되어 있고 매개 변수가 호출에서 누락 된 경우 빈 테이블이 전달됩니다. 
매개 변수는 상수 식만 사용할 수 있습니다. 
테이블 이름, 컬럼 이름 또는 다른 데이터베이스 오브젝트의 이름 대신 사용될 수 없습니다. 
자세한 내용은 EXECUTE (Transact-SQL)를 참조하십시오 .

FOR REPLICATION이 지정되면 매개 변수를 선언 할 수 없습니다.

##### [ type_schema_name . ] data_type

데이터 유형이 속하는 매개 변수 및 스키마의 데이터 유형.

##### Transact-SQL 프로 시저에 대한 지침 
     
* 모든 Transact-SQL 데이터 형식은 매개 변수로 사용할 수 있습니다.

* 사용자 정의 테이블 형식을 사용하여 테이블 반환 매개 변수를 만들 수 있습니다. 
테이블 반환 매개 변수는 INPUT 매개 변수 일 수 있으며 READONLY 키워드가 있어야합니다. 
자세한 내용은 테이블 반환 매개 변수 사용 (데이터베이스 엔진)을 참조 하십시오.

* cursor data types은 OUTPUT 매개 변수 일 수 있으며 VARYING 키워드가 수반되어야합니다.

##### CLR 절차 지침 

* 관리 코드에 해당하는 모든 원시 SQL Server 데이터 형식을 매개 변수로 사용할 수 있습니다. 
CLR 형식과 SQL Server 시스템 데이터 형식 간의 통신에 대한 자세한 내용은 CLR 매개 변수 데이터 매핑을 참조하십시오. 
SQL Server 시스템 데이터 형식 및 구문에 대한 자세한 내용은 데이터 형식 (Transact-SQL)을 참조하십시오.

* 테이블 값 또는 커서 데이터 형식은 매개 변수로 사용할 수 없습니다.
  
* 매개 변수의 데이터 형식이 CLR 사용자 정의 형식 인 경우 형식에 대한 EXECUTE 권한이 있어야합니다.

#### VARYING 

출력 매개 변수로서 지원되는 결과 세트를 지정합니다. 
이 매개 변수는 프로 시저에 의해 동적으로 구성되며 내용은 다를 수 있습니다. 
커서 매개 변수 에만 적용됩니다. 
이 옵션은 CLR 프로 시저에 유효하지 않습니다.

#### default

매개 변수의 기본값입니다. 
매개 변수에 기본값이 정의되어 있으면 해당 매개 변수의 값을 지정하지 않고 프로 시저를 실행할 수 있습니다. 
기본값은 상수이거나 NULL 일 수 있습니다. 
상수 값은 와일드 카드 형식 일 수 있으므로 매개 변수를 프로 시저에 전달할 때 LIKE 키워드를 사용할 수 있습니다.

기본값은 CLR 프로 시저에 대해서만 sys.parameters.default 열에 기록됩니다. 
이 열은 Transact-SQL 프로 시저 매개 변수의 경우 NULL입니다.

#### OUT | OUTPUT 

매개 변수가 출력 매개 변수임을 나타냅니다. 
OUTPUT 매개 변수를 사용하여 프로 시저의 호출자에게 값을 반환하십시오. 
text , ntext 및 image 매개 변수는 프로 시저가 CLR 프로 시저가 아니면 OUTPUT 매개 변수로 사용할 수 없습니다. 
프로 시저가 CLR 프로 시저가 아닌 경우 출력 매개 변수는 커서 자리 표시 자일 수 있습니다. 
테이블 값 데이터 유형은 프로 시저의 OUTPUT 매개 변수로 지정할 수 없습니다.

#### READONLY

매개 변수가 프로 시저 본문 내에서 갱신되거나 수정 될 수 없음을 나타냅니다. 
매개 변수 유형이 테이블 값 유형이면 READONLY를 지정해야합니다.

#### RECOMPILE

데이터베이스 엔진이이 프로 시저에 대한 쿼리 계획을 캐시하지 않으며 실행될 때마다 컴파일되도록합니다. 
재 컴파일을 강제하는 이유에 대한 자세한 내용 은 저장 프로 시저 재 컴파일을 참조하십시오. 
FOR REPLICATION이 지정되거나 CLR 프로시 듀어에 대해이 옵션을 사용할 수 없습니다.

프로 시저 내의 개별 쿼리에 대한 쿼리 계획을 무시하도록 데이터베이스 엔진에 지시하려면 쿼리 정의에 RECOMPILE 쿼리 힌트를 사용합니다. 
자세한 내용은 쿼리 힌트 (Transact-SQL)를 참조하십시오 .

#### ENCRYPTION

적용 대상 : SQL Server (SQL Server 2008에서 SQL Server 2017), Azure SQL 데이터베이스.

SQL Server가 CREATE PROCEDURE 문의 원래 텍스트를 난독 화 된 형식으로 변환 함을 나타냅니다. 
난독 처리 결과는 SQL Server의 카탈로그 뷰에서 직접 볼 수 없습니다. 
시스템 테이블 또는 데이터베이스 파일에 대한 액세스 권한이없는 사용자는 난독 화 된 텍스트를 검색 할 수 없습니다. 
그러나 텍스트는 DAC 포트를 통해 시스템 테이블에 액세스하거나 데이터베이스 파일에 직접 액세스 할 수있는 권한있는 사용자가 사용할 수 있습니다. 
또한 서버 프로세스에 디버거를 연결할 수있는 사용자는 런타임에 메모리에서 해독 된 프로 시저를 검색 할 수 있습니다. 
시스템 메타 데이터에 액세스하는 방법에 대한 자세한 내용은 메타 데이터 표시 구성을 참조하십시오 .

이 옵션은 CLR 프로 시저에 유효하지 않습니다.

이 옵션으로 만든 프로시 저는 SQL Server 복제의 일부로 게시 할 수 없습니다.

#### EXECUTE AS clause

프로 시저를 실행할 보안 컨텍스트를 지정합니다.

네이티브 컴파일 된 저장 프로 시저의 경우 SQL Server 2016 (13.x) 및 Azure SQL 데이터베이스를 시작하면 EXECUTE AS 절에 대한 제한이 없습니다. 
SQL Server 2014 (12.x)에서는 SELF, OWNER 및 'user_name' 절이 기본적으로 컴파일 된 저장 프로 시저에서 지원됩니다.

자세한 내용은 EXECUTE AS 절 (Transact-SQL)을 참조하십시오 .


#### FOR REPLICATION

적용 대상 : SQL Server (SQL Server 2008에서 SQL Server 2017), Azure SQL 데이터베이스.

프로 시저가 복제를 위해 작성되도록 지정합니다. 
따라서 구독자에서 실행할 수 없습니다. 
FOR REPLICATION 옵션으로 작성된 프로시 저는 프로 시저 필터로 사용되며 복제 중에 만 실행됩니다. 
FOR REPLICATION이 지정되면 매개 변수를 선언 할 수 없습니다. 
FOR REPLICATION은 CLR 프로 시저에 지정할 수 없습니다. 
RECOLPILE 옵션은 FOR REPLICATION으로 작성된 프로 시저에 대해서는 무시됩니다.

FOR REPLICATION절차 개체 유형 갖는 RF 에서 는 sys.objects 및 sys.procedures를 .


#### {[BEGIN] sql_statement [;] [... n ] [END]} 

프로 시저 본문을 구성하는 하나 이상의 Transact-SQL 문입니다. 
선택적 BEGIN 및 END 키워드를 사용하여 명령문을 묶을 수 있습니다. 
자세한 내용은 모범 사례, 일반 설명 및 제한 및 제한 섹션을 참조하십시오.

외부 이름 assembly_name . class_name . method_name 
적용 대상 : SQL Server 2008을 통해 SQL Server 2017, SQL 데이터베이스.

참조 할 CLR 프로 시저에 대한 .NET Framework 어셈블리의 메서드를 지정합니다. 
class_name 은 유효한 SQL Server 식별자 여야하며 어셈블리의 클래스로 존재해야합니다. 
클래스에 네임 스페이스 부분을 구분하기 위해 마침표 ( . )를 사용하는 네임 스페이스 한정 이름이 있으면 클래스 이름은 대괄호 ( [] ) 또는 따옴표 ( "" ) 를 사용하여 구분해야합니다. 
지정된 메소드는 클래스의 정적 메소드 여야합니다.

기본적으로 SQL Server는 CLR 코드를 실행할 수 없습니다. 
공용 언어 런타임 모듈을 참조하는 데이터베이스 개체를 작성, 수정 및 삭제할 수 있습니다. 
그러나 clr enabled 옵션 을 활성화 할 때까지 SQL Server에서 이러한 참조를 실행할 수 없습니다. 
이 옵션을 사용하려면 sp_configure 를 사용하십시오.

#### ATOMIC WITH 

적용 대상 : SQL Server 2014 (12.x)에서 SQL Server 2017 및 Azure SQL 데이터베이스.

원자 적 저장 프로 시저 실행을 나타냅니다. 
변경 사항은 커밋되거나 예외를 throw하여 롤백 된 모든 변경 사항이 롤백됩니다. 
ATOMIC WITH 블록은 네이티브 컴파일 스토어드 프로 시저에 필요합니다.

프로 시저가 RETURN (명시 적으로 RETURN 문을 통하거나 암시 적으로 실행 완료)되면 프로 시저가 수행 한 작업이 커밋됩니다. 
프로 시저가 쓰루면 프로 시저가 수행 한 작업이 롤백됩니다.

XACT_ABORT는 기본적으로 원자 블록 내부에서 켜져 있으며 변경할 수 없습니다. 
XACT_ABORT는 Transact-SQL 문이 런타임 오류를 발생시킬 때 SQL Server가 자동으로 현재 트랜잭션을 롤백할지 여부를 지정합니다.

다음 SET 옵션은 ATOMIC 블록에서 항상 ON입니다. 옵션을 변경할 수 없습니다.

* CONCAT_NULL_YIELDS_NULL
* QUOTED_IDENTIFIER, ARITHABORT
* NOCOUNT
* ANSI_NULLS
* ANSI_WARNINGS

SET 옵션은 ATOMIC 블록 내에서 변경할 수 없습니다. 
사용자 세션의 SET 옵션은 기본적으로 컴파일 된 저장 프로 시저의 범위에서 사용되지 않습니다. 
이 옵션은 컴파일시 고정됩니다.

BEGIN, ROLLBACK 및 COMMIT 조작은 원자 블록 내에서 사용할 수 없습니다.

프로 시저의 외부 범위에서 원시 컴파일 된 저장 프로 시저 당 하나의 ATOMIC 블록이 있습니다. 
블록은 중첩 될 수 없습니다. 
원자 블록에 대한 자세한 내용은 원시 컴파일 된 저장 프로 시저를 참조하십시오.

#### NULL | NOT NULL 

매개 변수에 널값이 허용되는지 여부를 판별합니다. NULL이 기본값입니다.


#### NATIVE_COMPILATION 

적용 대상 : SQL Server 2014 (12.x)에서 SQL Server 2017 및 Azure SQL 데이터베이스.

프로 시저가 기본적으로 컴파일됨을 나타냅니다. 
NATIVE_COMPILATION, SCHEMABINDING 및 EXECUTE AS는 임의의 순서로 지정할 수 있습니다. 
자세한 내용은 원시 컴파일 된 저장 프로 시저를 참조하십시오 .

#### SCHEMABINDING

적용 대상 : SQL Server 2014 (12.x)에서 SQL Server 2017 및 Azure SQL 데이터베이스.

프로 시저에서 참조하는 테이블을 삭제하거나 변경할 수 없도록합니다. 
SCHEMABINDING은 기본적으로 컴파일 된 저장 프로 시저에 필요합니다. 
자세한 내용은 기본적으로 컴파일 된 저장 프로 시저를 참조하십시오. 
SCHEMABINDING 제약 조건은 사용자 정의 함수와 동일합니다. 
자세한 내용은 CREATE FUNCTION (Transact-SQL) 의 SCHEMABINDING 섹션을 참조하십시오 .

#### LANGUAGE = [N] 'language' 

적용 대상 : SQL Server 2017 및 Azure SQL 데이터베이스를 통한 SQL Server 2014 (12.x).

상응하는 언어 설정 (Transact-SQL)를 참조하십시오 세션 옵션을 선택합니다. LANGUAGE = [N] '언어'가 필요합니다.

#### TRANSACTION ISOLATION LEVEL 

적용 대상 : SQL Server 2014 (12.x)에서 SQL Server 2017 및 Azure SQL 데이터베이스.

네이티브 컴파일 된 저장 프로 시저에 필요합니다. 저장 프로 시저에 대한 트랜잭션 격리 수준을 지정합니다. 
옵션은 다음과 같습니다.

이러한 옵션에 대한 자세한 내용은 SET TRANSACTION ISOLATION LEVEL (Transact-SQL)을 참조하십시오 .

#### REPEATABLE READ 

다른 트랜잭션에 의해 수정되었지만 아직 커밋되지 않은 데이터를 명령문이 읽을 수 없도록 지정합니다. 
다른 트랜잭션이 현재 트랜잭션이 읽은 데이터를 수정하면 현재 트랜잭션이 실패합니다.

#### SERIALIZABLE

다음을 지정합니다.

* 문은 수정되었지만 다른 트랜잭션에 의해 아직 커밋되지 않은 데이터는 읽을 수 없습니다.

* 다른 트랜잭션이 현재 트랜잭션이 읽은 데이터를 수정하면 현재 트랜잭션이 실패합니다.

* 다른 트랜잭션이 현재 트랜잭션의 명령문에서 읽은 키 범위에 속하는 키 값을 가진 새로운 행을 삽입하면 현재 트랜잭션이 실패합니다.

#### SNAPSHOT

트랜잭션의 모든 명령문에서 읽은 데이터가 트랜잭션 시작시 존재하던 데이터의 트랜잭션 일관성 버전임을 지정합니다.

#### DATEFIRST = number 

적용 대상 : SQL Server 2014 (12.x)에서 SQL Server 2017 및 Azure SQL 데이터베이스.

주의 첫 번째 요일을 1에서 7 사이의 숫자로 지정합니다. 
DATEFIRST는 선택 사항입니다.
지정하지 않으면 설정이 지정된 언어에서 유추됩니다.

자세한 내용은 SET DATEFIRST (Transact-SQL)를 참조하십시오.

#### DATEFORMAT = format 

적용 대상 : SQL Server 2014 (12.x)에서 SQL Server 2017 및 Azure SQL 데이터베이스.

date, smalldatetime, datetime, datetime2 및 datetimeoffset 문자열을 해석하기위한 월, 일 및 년 날짜 부분의 순서를 지정합니다. 
DATEFORMAT은 선택 사항입니다. 
지정하지 않으면 설정이 지정된 언어에서 유추됩니다.

자세한 내용은 SET DATEFORMAT (Transact-SQL)를 참조하십시오 .

#### DELAYED_DURABILITY = {OFF | ON} 

적용 대상 : SQL Server 2014 (12.x)에서 SQL Server 2017 및 Azure SQL 데이터베이스.

SQL Server 트랜잭션 커밋은 완전히 내구성, 기본값 또는 지연된 내구성 중 하나 일 수 있습니다.

자세한 내용은 트랜잭션 내구성 제어를 참조하십시오 .

### Simple Examples

시작하는 데 도움이되는 다음 두 가지 간단한 예제가 
`SELECT DB_NAME() AS ThisDB;` 있습니다. 현재 데이터베이스의 이름을 반환합니다. 
다음과 같은 저장 프로 시저에서이 문을 래핑 할 수 있습니다.

```tsql

CREATE PROC What_DB_is_this     
AS   
SELECT DB_NAME() AS ThisDB; 

```

문을 사용하여 저장 프로 시저를 호출하십시오. `EXEC What_DB_is_this;`

약간 더 복잡한 것은 입력 매개 변수를 제공하여 프로 시저의 유연성을 높이는 것입니다. 예 :


```tsql

CREATE PROC What_DB_is_that @ID int   
AS    
SELECT DB_NAME(@ID) AS ThatDB;

```

프로 시저를 호출 할 때 데이터베이스 ID 번호를 제공하십시오. 
예를 들어, `EXEC What_DB_is_that 2;` tempdb 반환합니다.

더 많은 예제를 보려면이 주제 끝에있는 예제 를 참조하십시오 .

### Best Practices

이것이 베스트 프랙티스의 철저한 목록은 아니지만, 이러한 제안은 프로 시저 성능을 향상시킬 수 있습니다.

* SET NOCOUNT ON 문을 프로 시저 본문의 첫 번째 문으로 사용하십시오. 
즉, AS 키워드 바로 뒤에 배치하십시오. 
이렇게하면 SELECT, INSERT, UPDATE, MERGE 및 DELETE 문이 실행 된 후 SQL Server에서 클라이언트로 다시 보내는 메시지가 해제됩니다. 
데이터베이스 및 애플리케이션의 전반적인 성능은 이러한 불필요한 네트워크 오버 헤드를 제거함으로써 향상됩니다. 
자세한 내용은 SET NOCOUNT (Transact-SQL)를 참조하십시오 .

* 프로 시저에서 데이터베이스 오브젝트를 작성하거나 참조 할 때 스키마 이름을 사용하십시오. 
여러 스키마를 검색 할 필요가 없으면 데이터베이스 엔진에서 개체 이름을 확인하는 데 필요한 처리 시간이 줄어 듭니다. 
또한 스키마를 지정하지 않고 오브젝트를 작성할 때 사용자의 기본 스키마가 지정되어 권한 및 액세스 문제점을 방지합니다.

* WHERE 및 JOIN 절에 지정된 열을 중심으로 함수를 래핑하지 마십시오. 
이렇게하면 열이 비 결정적이되어 쿼리 프로세서가 인덱스를 사용할 수 없게됩니다.
  
* 많은 행의 데이터를 리턴하는 SELECT.에서 scalar functions 을 사용하지 마십시오. 
scalar functions 는 모든 행에 적용되어야하기 때문에 결과 행 기반 처리와 같으며 성능이 저하됩니다.

* SELECT * 의 사용을 피하십시오. 
대신 필수 열 이름을 지정하십시오. 
이로 인해 프로 시저 실행을 중지시키는 일부 데이터베이스 엔진 오류를 방지 할 수 있습니다. 
예를 들어, SELECT *12 열 테이블에서 데이터를 반환 한 다음 해당 데이터를 12 열 임시 테이블에 삽입 하는 문은 두 테이블의 열 번호 또는 순서가 변경 될 때까지 성공합니다.

* 너무 많은 데이터를 처리하거나 반환하지 마십시오. 
프로 시저 코드에서 가능한 한 조기에 결과를 좁히므로 프로 시저가 수행하는 모든 후속 작업이 가능한 가장 작은 데이터 세트를 사용하여 수행됩니다. 
필수 데이터 만 클라이언트 응용 프로그램에 보냅니다. 
네트워크를 통해 추가 데이터를 보내고 불필요하게 큰 결과 세트를 통해 클라이언트 응용 프로그램을 강제 실행하는 것보다 효율적입니다.

* BEGIN / COMMIT TRANSACTION을 사용하여 명시 적 트랜잭션을 사용하고 가능한 한 트랜잭션을 짧게 유지하십시오. 
트랜잭션이 길어질수록 레코드 잠금 시간이 길어지고 교착 상태가 발생할 가능성이 커집니다.

* 프로 시저 내부의 오류 처리에는 Transact-SQL TRY ... CATCH 기능을 사용하십시오. 
TRY ... CATCH는 Transact-SQL 문의 전체 블록을 캡슐화 할 수 있습니다. 
이렇게하면 성능 오버 헤드가 줄어들뿐만 아니라 프로그래밍이 크게 줄어들어 오류보고가 더욱 정확 해집니다.

* 프로 시저 본문의 CREATE TABLE 또는 ALTER TABLE Transact-SQL 문에서 참조하는 모든 테이블 열에 DEFAULT 키워드를 사용하십시오. 
이렇게하면 NULL 값을 허용하지 않는 열에 NULL을 전달할 수 없습니다.
  
* 임시 테이블의 각 열에 NULL 또는 NOT NULL을 사용하십시오. 
ANSI_DFLT_ON 및 ANSI_DFLT_OFF 옵션은 이러한 특성이 CREATE TABLE 또는 ALTER TABLE 문에 지정되지 않은 경우 데이터베이스 엔진이 NULL 또는 NOT NULL 특성을 열에 할당하는 방식을 제어합니다. 
연결에서 프로 시저를 작성한 연결과 다른 옵션을 사용하여 프로 시저를 실행하는 경우 두 번째 연결에 대해 작성된 테이블의 열은 다른 널 (NULL) 입력 가능성을 가지며 다른 작동을 나타낼 수 있습니다. 
NULL 또는 NOT NULL이 각 열에 명시 적으로 지정되면, 임시 테이블은 프로 시저를 실행하는 모든 연결에 동일한 널 (null) 가능성을 사용하여 작성됩니다.

* 널을 변환하는 수정 명령문을 사용하고 조회에서 널 값을 가진 행을 제거하는 논리를 포함하십시오. 
Transact-SQL에서 NULL은 비어 있거나 "nothing"값이 아닙니다. 
알 수없는 값에 대한 자리 표시 자이며 특히 결과 집합을 쿼리하거나 전체 함수를 사용할 때 예기치 않은 동작이 발생할 수 있습니다.
  
* UNION 또는 OR 연산자 대신 UNION ALL 연산자를 사용하십시오 (별개의 값에 대한 특정 필요가없는 경우). 
UNION ALL 연산자는 결과 집합에서 중복이 필터링되지 않으므로 처리 오버 헤드가 적습니다.

### General Remarks

프로 시저의 미리 정의 된 최대 크기는 없습니다.

프로 시저에 지정된 변수는 @@ SPID와 같은 사용자 정의 또는 시스템 변수 일 수 있습니다.

프로시 듀어가 처음 실행될 때, 프로시저가 컴파일되어 데이터를 검색하기위한 최적의 액세스 플랜을 결정합니다. 
이후의 프로 시저 실행은 데이터베이스 엔진의 계획 캐시에 여전히 남아있는 경우 이미 생성 된 계획을 다시 사용할 수 있습니다.

SQL Server가 시작될 때 하나 이상의 프로 시저가 자동으로 실행될 수 있습니다. 
프로 시저는 master 데이터베이스 의 시스템 관리자가 만들고 sysadmin 고정 서버 역할에서 백그라운드 프로세스로 실행해야합니다. 
프로시저는 입력 또는 출력 매개 변수를 가질 수 없습니다. 
자세한 내용 은 저장 프로 시저 실행을 참조하십시오 .

프로 시저가 다른 프로 시저를 호출하거나 CLR 루틴, 형식 또는 집계를 참조하여 관리되는 코드를 실행할 때 프로 시저가 중첩됩니다. 
프로 시저 및 관리 코드 참조는 최대 32 개의 수준으로 중첩 될 수 있습니다. 
호출 된 프로 시저 또는 관리되는 코드 참조가 실행을 시작하면 중첩 수준이 1 씩 증가하고 호출 된 프로 시저 또는 관리되는 코드 참조가 실행을 완료하면 중첩 수준이 1 씩 감소합니다. 
관리 코드 내에서 호출 된 메서드는 중첩 수준 제한에 포함되지 않습니다. 
그러나 CLR 저장 프로 시저가 SQL Server 관리 공급자를 통해 데이터 액세스 작업을 수행하면 관리 코드에서 SQL로 전환 할 때 추가 중첩 수준이 추가됩니다.

최대 중첩 수준을 초과하면 전체 호출 체인이 실패합니다. @@ NESTLEVEL 함수를 사용하여 현재 저장 프로 시저 실행의 중첩 수준을 반환 할 수 있습니다.

### Interoperability

데이터베이스 엔진은 Transact-SQL 프로 시저를 만들거나 수정할 때 SET QUOTED_IDENTIFIER 및 SET ANSI_NULLS 설정을 저장합니다. 
이러한 원래 설정은 프로 시저가 실행될 때 사용됩니다. 
따라서 프로 시저가 실행 중일 때 SET QUOTED_IDENTIFIER 및 SET ANSI_NULLS에 대한 클라이언트 세션 설정은 무시됩니다.

프로 시저를 만들거나 수정할 때 SET ARITHABORT, SET ANSI_WARNINGS 또는 SET ANSI_PADDINGS와 같은 다른 SET 옵션은 저장되지 않습니다. 
프로 시저의 논리가 특정 설정에 따라 다르면 적절한 설정을 보장하기 위해 프로 시저 시작시 SET 문을 포함하십시오. 
프로 시저에서 SET 문을 실행하면 프로 시저가 실행을 마칠 때까지 설정이 적용됩니다. 
그런 다음 설정은 호출 될 때 프로 시저의 값으로 복원됩니다. 
이렇게하면 개별 클라이언트가 프로 시저의 논리에 영향을주지 않고 원하는 옵션을 설정할 수 있습니다.

```
SET ANSI_WARNINGS는 프로 시저, 사용자 정의 함수 또는 일괄 처리 문에서 변수를 선언하고 설정할 때 매개 변수를 전달할 때 적용되지 않습니다. 
예를 들어, 변수가 char (3) 으로 정의 된 다음 세 문자보다 큰 값으로 설정된 경우 데이터는 정의 된 크기로 잘리고 INSERT 또는 UPDATE 문은 성공합니다.

```

### 한계사항과 제한사항

CREATE PROCEDURE 문은 단일 일괄 처리의 다른 Transact-SQL 문과 결합 될 수 없습니다.

다음 문은 저장 프로 시저의 본문 어디에서나 사용할 수 없습니다.

```
CREATE AGGREGATE	CREATE SCHEMA	SET SHOWPLAN_TEXT
CREATE DEFAULT	CREATE or ALTER TRIGGER	SET SHOWPLAN_XML
CREATE or ALTER FUNCTION	CREATE or ALTER VIEW	USE database_name
CREATE or ALTER PROCEDURE	SET PARSEONLY	
CREATE RULE	SET SHOWPLAN_ALL

```
프로시 저는 아직 존재하지 않는 테이블을 참조 할 수 있습니다. 
작성시 구문 확인 만 수행됩니다. 
프로 시저가 처음 실행될 때까지 컴파일되지 않습니다.
컴파일 중에 만 프로 시저에서 참조 된 모든 객체가 해석됩니다. 
따라서 존재하지 않는 테이블을 참조하는 구문 적으로 올바른 프로 시저를 성공적으로 작성할 수 있습니다. 
그러나 참조 된 테이블이 존재하지 않으면 프로 시저가 실행 시간에 실패합니다.

함수 이름을 매개 변수 기본값으로 지정하거나 프로 시저를 실행할 때 매개 변수에 전달 된 값으로 지정할 수 없습니다. 
그러나 다음 예제와 같이 함수를 변수로 전달할 수 있습니다.

```tsql

-- Passing the function value as a variable.  
DECLARE @CheckDate datetime = GETDATE();  
EXEC dbo.uspGetWhereUsedProductID 819, @CheckDate;   
GO  

```
SQL Server의 원격 인스턴스에서 프로 시저가 변경되면 변경 내용을 롤백 할 수 없습니다. 원격 프로 시저는 트랜잭션에 참여하지 않습니다.

데이터베이스 엔진이 .NET Framework에서 오버로드 될 때 올바른 메서드를 참조하려면 EXTERNAL NAME 절에 지정된 메서드의 특성이 다음과 같아야합니다.

* 정적 메소드로 선언하십시오.

* 프로 시저의 매개 변수 수와 동일한 수의 매개 변수를받습니다.

* SQL Server 프로 시저의 해당 매개 변수의 데이터 형식과 호환되는 매개 변수 형식을 사용하십시오. 
SQL Server 데이터 형식을 .NET Framework 데이터 형식과 일치시키는 방법에 대한 자세한 내용은 CLR 매개 변수 데이터 매핑을 참조하십시오 .

### Metadata

다음은 저장 프로 시저에 대한 정보를 반환하는 데 사용할 수있는 카탈로그 뷰 및 동적 관리 뷰를 나열합니다.

#### sys.sql_modules

Transact-SQL 프로 시저의 정의를 반환합니다. 
ENCRYPTION 옵션으로 작성된 프로 시저의 텍스트는 sys.sql_modules 카탈로그 뷰를 사용하여 볼 수 없습니다 .

#### sys.assembly_modules

CLR 프로 시저에 대한 정보를 반환합니다.

#### sys.parameters

프로 시저에 정의 된 매개 변수에 대한 정보를 반환합니다.

#### sys.sql_expression_dependencies, sys.dm_sql_referenced_entities, sys.dm_sql_referencing_entities

프로 시저에서 참조하는 객체를 반환합니다.

컴파일 된 프로 시저의 크기를 예측하려면 다음 성능 모니터 카운터를 사용하십시오.

* SQLServer: Plan Cache Object	
* Cache Hit Ratio
* Cache Pages
* Cache Object Counts*

*이 카운터는 Ad Hoc Transact-SQL, 준비된 Transact-SQL, 프로 시저, 트리거 등을 비롯한 다양한 캐시 개체 범주에 사용할 수 있습니다. 
자세한 내용은 SQL Server, 캐시 개체 계획을 참조하십시오 .

### Security

#### Permissions

필요 절차의 CREATE 데이터베이스에 권한 및 ALTER 프로 시저가 생성, 또는 회원 자격 요구되고있는 스키마에 대한 권한이 있는 db_ddladmin 고정 데이터베이스 역할을.

CLR 저장 프로 시저의 경우 EXTERNAL NAME 절에서 참조 된 어셈블리의 소유권 또는 해당 어셈블리에 대한 REFERENCES 권한이 필요합니다.

### CREATE PROCEDURE and Memory-Optimized Tables

메모리 최적화 테이블은 기존 및 원시 컴파일 된 저장 프로 시저를 통해 액세스 할 수 있습니다. 
기본 프로 시저가 대부분의 경우보다 효율적인 방법입니다. 
자세한 내용은 원시 컴파일 된 저장 프로 시저를 참조하십시오 .

다음 예제는 메모리 최적화 테이블에 액세스하는 네이티브 컴파일 된 저장 프로 시저를 만드는 방법을 보여줍니다 dbo.Departments.

```tsql

CREATE PROCEDURE dbo.usp_add_kitchen @dept_id int, @kitchen_count int NOT NULL  
WITH EXECUTE AS OWNER, SCHEMABINDING, NATIVE_COMPILATION  
AS  
BEGIN ATOMIC WITH (TRANSACTION ISOLATION LEVEL = SNAPSHOT, LANGUAGE = N'us_english')  
  
  UPDATE dbo.Departments  
  SET kitchen_count = ISNULL(kitchen_count, 0) + @kitchen_count  
  WHERE id = @dept_id  
END;  
GO  

```
NATIVE_COMPILATION없이 작성된 프로시 저는 원시 컴파일 된 스토어드 프로 시저로 변경 될 수 없습니다.

기본적으로 컴파일 된 저장 프로 시저, 지원되는 쿼리 표면 영역 및 연산자에 대한 프로그래밍 기능에 대한 설명은 원시 컴파일 된 T-SQL 모듈에 지원되는 기능을 참조하십시오 .

### Examples

#### Basic Syntax

이 절의 예는 최소한의 필수 구문을 사용하는 CREATE PROCEDURE.의 기본 기능을 보여줍니다.

##### A. 간단한 Transact-SQL 프로 시저 만들기

다음 예에서는 AdventureWorks2012 데이터베이스의보기에서 모든 직원 (제공 한 성과 성), 직책 및 부서 이름을 반환하는 저장 프로 시저를 만듭니다. 
이 절차는 매개 변수를 사용하지 않습니다. 
그런 다음 예제에서는 프로 시저를 실행하는 세 가지 방법을 보여줍니다.

```tsql

CREATE PROCEDURE HumanResources.uspGetAllEmployees  
AS  
    SET NOCOUNT ON;  
    SELECT LastName, FirstName, JobTitle, Department  
    FROM HumanResources.vEmployeeDepartment;  
GO  
  
SELECT * FROM HumanResources.vEmployeeDepartment;

```

uspGetEmployees절차는 다음과 같은 방법으로 실행할 수 있습니다 :

```tsql

EXECUTE HumanResources.uspGetAllEmployees;  
GO  
-- Or  
EXEC HumanResources.uspGetAllEmployees;  
GO  
-- Or, if this procedure is the first statement within a batch:  
HumanResources.uspGetAllEmployees;  

```

##### B. 둘 이상의 결과 집합 반환

다음 프로시 저는 두 개의 결과 세트를 리턴합니다.

```tsql

CREATE PROCEDURE dbo.uspMultipleResults   
AS  
SELECT TOP(10) BusinessEntityID, Lastname, FirstName FROM Person.Person;  
SELECT TOP(10) CustomerID, AccountNumber FROM Sales.Customer;  
GO  

```

##### C. CLR 저장 프로 시저 만들기

다음 예제에서는 어셈블리 에서 클래스 GetPhotoFromDB의 GetPhotoFromDB메서드 를 참조 하는 프로 시저를 만듭니다 . 
프로 시저를 만들기 전에 어셈블리가 로컬 데이터베이스에 등록됩니다.LargeObjectBinaryHandlingLOBUsingCLRHandlingLOBUsingCLR

적용 대상 : SQL Server 2008에서 SQL Server 2017, SQL 데이터베이스 (assembly_bits에서 생성 된 어셈블리를 사용하는 경우)

```tsql

CREATE ASSEMBLY HandlingLOBUsingCLR  
FROM '\\MachineName\HandlingLOBUsingCLR\bin\Debug\HandlingLOBUsingCLR.dll';  
GO  
CREATE PROCEDURE dbo.GetPhotoFromDB  
(  
    @ProductPhotoID int,  
    @CurrentDirectory nvarchar(1024),  
    @FileName nvarchar(1024)  
)  
AS EXTERNAL NAME HandlingLOBUsingCLR.LargeObjectBinary.GetPhotoFromDB;  
GO  

```

#### 전달 매개 변수

이 절의 예제는 입력 및 출력 매개 변수를 사용하여 저장 프로 시저간에 값을 전달하는 방법을 보여줍니다.

##### D. 입력 매개 변수로 프로 시저 만들기

다음 예제에서는 직원의 이름과성에 대한 값을 전달하여 특정 직원에 대한 정보를 반환하는 저장 프로 시저를 만듭니다. 
이 프로시저는 전달 된 매개 변수와 정확히 일치하는 항목 만 허용합니다.

```tsql

IF OBJECT_ID ( 'HumanResources.uspGetEmployees', 'P' ) IS NOT NULL   
    DROP PROCEDURE HumanResources.uspGetEmployees;  
GO  
CREATE PROCEDURE HumanResources.uspGetEmployees   
    @LastName nvarchar(50),   
    @FirstName nvarchar(50)   
AS   
  
    SET NOCOUNT ON;  
    SELECT FirstName, LastName, JobTitle, Department  
    FROM HumanResources.vEmployeeDepartment  
    WHERE FirstName = @FirstName AND LastName = @LastName;  
GO  

```
uspGetEmployees절차는 다음과 같은 방법으로 실행할 수 있습니다 :

```tsql

EXECUTE HumanResources.uspGetEmployees N'Ackerman', N'Pilar';  
-- Or  
EXEC HumanResources.uspGetEmployees @LastName = N'Ackerman', @FirstName = N'Pilar';  
GO  
-- Or  
EXECUTE HumanResources.uspGetEmployees @FirstName = N'Pilar', @LastName = N'Ackerman';  
GO  
-- Or, if this procedure is the first statement within a batch:  
HumanResources.uspGetEmployees N'Ackerman', N'Pilar';  

```

##### E. 와일드 카드 매개 변수가 있는 프로 시저 사용

다음 예제에서는 직원의 이름과성에 대한 전체 또는 부분 값을 전달하여 직원에 대한 정보를 반환하는 저장 프로 시저를 만듭니다. 
이 프로 시저 패턴은 전달 된 매개 변수와 일치하거나 제공되지 않을 경우 미리 설정된 기본값 (문자로 시작하는 성 D)을 사용합니다.

```tsql

IF OBJECT_ID ( 'HumanResources.uspGetEmployees2', 'P' ) IS NOT NULL   
    DROP PROCEDURE HumanResources.uspGetEmployees2;  
GO  
CREATE PROCEDURE HumanResources.uspGetEmployees2   
    @LastName nvarchar(50) = N'D%',   
    @FirstName nvarchar(50) = N'%'  
AS   
    SET NOCOUNT ON;  
    SELECT FirstName, LastName, JobTitle, Department  
    FROM HumanResources.vEmployeeDepartment  
    WHERE FirstName LIKE @FirstName AND LastName LIKE @LastName;  

```

uspGetEmployees2절차는 여러 조합으로 실행할 수 있습니다. 가능한 조합은 여기에 나와 있습니다.

```tsql

EXECUTE HumanResources.uspGetEmployees2;  
-- Or  
EXECUTE HumanResources.uspGetEmployees2 N'Wi%';  
-- Or  
EXECUTE HumanResources.uspGetEmployees2 @FirstName = N'%';  
-- Or  
EXECUTE HumanResources.uspGetEmployees2 N'[CK]ars[OE]n';  
-- Or  
EXECUTE HumanResources.uspGetEmployees2 N'Hesse', N'Stefen';  
-- Or  
EXECUTE HumanResources.uspGetEmployees2 N'H%', N'S%';

```

##### F. OUTPUT 매개 변수 사용하기

다음 예제에서는 uspGetList프로 시저 를 만듭니다 . 
이 절차는 지정된 금액을 초과하지 않는 가격을 가진 제품 목록을 반환합니다. 
이 예에서는 여러 SELECT문 및 여러 OUTPUT매개 변수를 사용하는 방법을 보여줍니다 . 
OUTPUT 매개 변수를 사용하면 외부 프로 시저, 일괄 처리 또는 둘 이상의 Transact-SQL 문을 사용하여 프로 시저를 실행하는 동안 설정된 값에 액세스 할 수 있습니다.

```tsql

IF OBJECT_ID ( 'Production.uspGetList', 'P' ) IS NOT NULL   
    DROP PROCEDURE Production.uspGetList;  
GO  
CREATE PROCEDURE Production.uspGetList @Product varchar(40)   
    , @MaxPrice money   
    , @ComparePrice money OUTPUT  
    , @ListPrice money OUT  
AS  
    SET NOCOUNT ON;  
    SELECT p.[Name] AS Product, p.ListPrice AS 'List Price'  
    FROM Production.Product AS p  
    JOIN Production.ProductSubcategory AS s   
      ON p.ProductSubcategoryID = s.ProductSubcategoryID  
    WHERE s.[Name] LIKE @Product AND p.ListPrice < @MaxPrice;  
-- Populate the output variable @ListPprice.  
SET @ListPrice = (SELECT MAX(p.ListPrice)  
        FROM Production.Product AS p  
        JOIN  Production.ProductSubcategory AS s   
          ON p.ProductSubcategoryID = s.ProductSubcategoryID  
        WHERE s.[Name] LIKE @Product AND p.ListPrice < @MaxPrice);  
-- Populate the output variable @compareprice.  
SET @ComparePrice = @MaxPrice;  
GO  

```

uspGetList비용보다 적은 Adventure Works 제품 (자전거) 목록을 반환 하려면 실행하십시오 $700. 
OUTPUT매개 변수 @Cost및 @ComparePrices에 메시지를 반환하는 흐름 제어 언어와 함께 사용되는 메시지 창.

```
OUTPUT 변수는 프로 시저가 생성 될 때 및 변수가 사용될 때 정의되어야합니다. 
매개 변수 이름과 변수 이름이 일치 할 필요는 없습니다. 
데이터 유형 및 파라미터 위치가 일치해야 @ListPrice= 변수가 사용된다.

```
```tsql
DECLARE @ComparePrice money, @Cost money ;  
EXECUTE Production.uspGetList '%Bikes%', 700,   
    @ComparePrice OUT,   
    @Cost OUTPUT  
IF @Cost <= @ComparePrice   
BEGIN  
    PRINT 'These products can be purchased for less than   
    $'+RTRIM(CAST(@ComparePrice AS varchar(20)))+'.'  
END  
ELSE  
    PRINT 'The prices for all products in this category exceed   
    $'+ RTRIM(CAST(@ComparePrice AS varchar(20)))+'.';  

```
다음은 부분 결과 집합입니다.

```
Product                     List Price  
--------------------------  ----------  
Road-750 Black, 58          539.99  
Mountain-500 Silver, 40     564.99  
Mountain-500 Silver, 42     564.99  
...  
Road-750 Black, 48          539.99  
Road-750 Black, 52          539.99  
  
(14 row(s) affected)   
 
These items can be purchased for less than $700.00.
```

##### G. 테이블 반환 매개 변수 사용

다음 예제에서는 테이블 반환 매개 변수 형식을 사용하여 여러 행을 테이블에 삽입합니다. 
이 예제에서는 매개 변수 유형을 만들고, 테이블 변수를 참조하도록 선언하고, 매개 변수 목록을 채운 다음 값을 저장 프로 시저에 전달합니다. 
저장 프로시 저는 값을 사용하여 테이블에 여러 행을 삽입합니다.

```tsql

/* Create a table type. */  
CREATE TYPE LocationTableType AS TABLE   
( LocationName VARCHAR(50)  
, CostRate INT );  
GO  
  
/* Create a procedure to receive data for the table-valued parameter. */  
CREATE PROCEDURE usp_InsertProductionLocation  
    @TVP LocationTableType READONLY  
    AS   
    SET NOCOUNT ON  
    INSERT INTO [AdventureWorks2012].[Production].[Location]  
           ([Name]  
           ,[CostRate]  
           ,[Availability]  
           ,[ModifiedDate])  
        SELECT *, 0, GETDATE()  
        FROM  @TVP;  
GO  
  
/* Declare a variable that references the type. */  
DECLARE @LocationTVP   
AS LocationTableType;  
  
/* Add data to the table variable. */  
INSERT INTO @LocationTVP (LocationName, CostRate)  
    SELECT [Name], 0.00  
    FROM   
    [AdventureWorks2012].[Person].[StateProvince];  
  
/* Pass the table variable data to a stored procedure. */  
EXEC usp_InsertProductionLocation @LocationTVP;  
GO  

```

##### H. OUTPUT 커서 매개 변수 사용하기

다음 예제에서는 OUTPUT cursor 매개 변수를 사용하여 프로 시저에 로컬 인 커서를 호출하는 일괄 처리, 프로 시저 또는 트리거에 다시 전달합니다.

먼저, Currency테이블에 커서를 선언하고 여는 프로 시저를 작성하십시오 .

```tsql

CREATE PROCEDURE dbo.uspCurrencyCursor   
    @CurrencyCursor CURSOR VARYING OUTPUT  
AS  
    SET NOCOUNT ON;  
    SET @CurrencyCursor = CURSOR  
    FORWARD_ONLY STATIC FOR  
      SELECT CurrencyCode, Name  
      FROM Sales.Currency;  
    OPEN @CurrencyCursor;  
GO  

```

그런 다음 로컬 커서 변수를 선언하는 일괄 처리를 실행하고 프로 시저를 실행하여 커서를 로컬 변수에 할당 한 다음 커서에서 행을 가져옵니다.

```tsql

DECLARE @MyCursor CURSOR;  
EXEC dbo.uspCurrencyCursor @CurrencyCursor = @MyCursor OUTPUT;  
WHILE (@@FETCH_STATUS = 0)  
BEGIN;  
     FETCH NEXT FROM @MyCursor;  
END;  
CLOSE @MyCursor;  
DEALLOCATE @MyCursor;  
GO  

```

#### 저장 프로 시저를 사용하여 데이터 수정

이 섹션의 예제는 프로 시저 정의에 DML (Data Manipulation Language) 문을 포함하여 테이블이나 뷰에 데이터를 삽입하거나 수정하는 방법을 보여줍니다.

##### I. 저장 프로 시저에서 UPDATE 사용

다음 예제에서는 저장 프로 시저에서 UPDATE 문을 사용합니다. 
이 절차는 하나의 입력 매개 변수 @NewHours와 하나의 출력 매개 변수를 취 @RowCount합니다. 
@NewHours매개 변수 값은 열을 업데이트 할 UPDATE 문에서 사용되는 VacationHours테이블을 HumanResources.Employee. 
@RowCount출력 매개 변수는 로컬 변수 해당 행의 수를 리턴하는 데 사용된다. 
CASE 식은 SET 절에서 조건부로 설정된 값을 결정하는 데 사용됩니다 VacationHours. 
직원이 매시간 ( SalariedFlag= 0) 지불 VacationHours되면 현재 시간 수에 지정된 값을 더한 시간으로 설정됩니다 @NewHours. 
그렇지 않으면, VacationHours에 지정된 값으로 설정됩니다 @NewHours.

```tsql

CREATE PROCEDURE HumanResources.Update_VacationHours  
@NewHours smallint  
AS   
SET NOCOUNT ON;  
UPDATE HumanResources.Employee  
SET VacationHours =   
    ( CASE  
         WHEN SalariedFlag = 0 THEN VacationHours + @NewHours  
         ELSE @NewHours  
       END  
    )  
WHERE CurrentFlag = 1;  
GO  
  
EXEC HumanResources.Update_VacationHours 40;  

```

#### 오류 처리

이 절의 예제는 저장 프로 시저가 실행될 때 발생할 수있는 오류를 처리하는 방법을 보여줍니다.

##### J. TRY ... CATCH 사용하기

다음 예제에서는 TRY ... CATCH 구문을 사용하여 저장 프로 시저 실행 중에 catch 된 오류 정보를 반환합니다.

```tsql

CREATE PROCEDURE Production.uspDeleteWorkOrder ( @WorkOrderID int )  
AS  
SET NOCOUNT ON;  
BEGIN TRY  
   BEGIN TRANSACTION   
   -- Delete rows from the child table, WorkOrderRouting, for the specified work order.  
   DELETE FROM Production.WorkOrderRouting  
   WHERE WorkOrderID = @WorkOrderID;  
  
   -- Delete the rows from the parent table, WorkOrder, for the specified work order.  
   DELETE FROM Production.WorkOrder  
   WHERE WorkOrderID = @WorkOrderID;  
  
   COMMIT  
  
END TRY  
BEGIN CATCH  
  -- Determine if an error occurred.  
  IF @@TRANCOUNT > 0  
     ROLLBACK  
  
  -- Return the error information.  
  DECLARE @ErrorMessage nvarchar(4000),  @ErrorSeverity int;  
  SELECT @ErrorMessage = ERROR_MESSAGE(),@ErrorSeverity = ERROR_SEVERITY();  
  RAISERROR(@ErrorMessage, @ErrorSeverity, 1);  
END CATCH;  
  
GO  
EXEC Production.uspDeleteWorkOrder 13;  
  
/* Intentionally generate an error by reversing the order in which rows 
   are deleted from the parent and child tables. This change does not 
   cause an error when the procedure definition is altered, but produces 
   an error when the procedure is executed.  
*/  
ALTER PROCEDURE Production.uspDeleteWorkOrder ( @WorkOrderID int )  
AS  
  
BEGIN TRY  
   BEGIN TRANSACTION   
      -- Delete the rows from the parent table, WorkOrder, for the specified work order.  
   DELETE FROM Production.WorkOrder  
   WHERE WorkOrderID = @WorkOrderID;  
  
   -- Delete rows from the child table, WorkOrderRouting, for the specified work order.  
   DELETE FROM Production.WorkOrderRouting  
   WHERE WorkOrderID = @WorkOrderID;  
  
   COMMIT TRANSACTION  
  
END TRY  
BEGIN CATCH  
  -- Determine if an error occurred.  
  IF @@TRANCOUNT > 0  
     ROLLBACK TRANSACTION  
  
  -- Return the error information.  
  DECLARE @ErrorMessage nvarchar(4000),  @ErrorSeverity int;  
  SELECT @ErrorMessage = ERROR_MESSAGE(),@ErrorSeverity = ERROR_SEVERITY();  
  RAISERROR(@ErrorMessage, @ErrorSeverity, 1);  
END CATCH;  
GO  
-- Execute the altered procedure.  
EXEC Production.uspDeleteWorkOrder 15;  
  
DROP PROCEDURE Production.uspDeleteWorkOrder;  

```

#### 프로 시저 정의 난독 화

이 섹션의 예제는 저장 프로 시저의 정의를 난독 화하는 방법을 보여줍니다.

##### K. WITH ENCRYPTION 옵션 사용

다음 예제에서는 HumanResources.uspEncryptThis프로 시저 를 만듭니다.

적용 대상 : SQL Server 2008을 통해 SQL Server 2017, SQL 데이터베이스.

```tsql

CREATE PROCEDURE HumanResources.uspEncryptThis  
WITH ENCRYPTION  
AS  
    SET NOCOUNT ON;  
    SELECT BusinessEntityID, JobTitle, NationalIDNumber, 
        VacationHours, SickLeaveHours   
    FROM HumanResources.Employee;  
GO  

```

이 WITH ENCRYPTION옵션은 다음 예제와 같이 시스템 카탈로그를 쿼리하거나 메타 데이터 함수를 사용할 때 프로 시저 정의를 난독 화합니다.

실행 sp_helptext:

```tsql

EXEC sp_helptext 'HumanResources.uspEncryptThis';  

```
다음은 결과 집합입니다.

The text for object 'HumanResources.uspEncryptThis' is encrypted.

sys.sql_modules카탈로그 뷰를 직접 쿼리하십시오 .


```tsql

SELECT definition FROM sys.sql_modules  
WHERE object_id = OBJECT_ID('HumanResources.uspEncryptThis');

```
다음은 결과 집합입니다.

```tsql

definition  
--------------------------------  
NULL  

```

#### 강제로 프로 시저 재 컴파일

이 절의 예제에서는 WITH RECOMPILE 절을 사용하여 프로 시저가 실행될 때마다 다시 컴파일하도록합니다.

##### L. WITH RECOMPILE 옵션 사용

이 WITH RECOMPILE절은 프로 시저에 제공되는 매개 변수가 일반이 아니거나 새 실행 계획을 캐시에 저장하거나 메모리에 저장하지 않아야하는 경우에 유용합니다.

```tsql

IF OBJECT_ID ( 'dbo.uspProductByVendor', 'P' ) IS NOT NULL   
    DROP PROCEDURE dbo.uspProductByVendor;  
GO  
CREATE PROCEDURE dbo.uspProductByVendor @Name varchar(30) = '%'  
WITH RECOMPILE  
AS  
    SET NOCOUNT ON;  
    SELECT v.Name AS 'Vendor name', p.Name AS 'Product name'  
    FROM Purchasing.Vendor AS v   
    JOIN Purchasing.ProductVendor AS pv   
      ON v.BusinessEntityID = pv.BusinessEntityID   
    JOIN Production.Product AS p   
      ON pv.ProductID = p.ProductID  
    WHERE v.Name LIKE @Name;  

```

#### 보안 컨텍스트 설정

이 섹션의 예제에서는 EXECUTE AS 절을 사용하여 저장 프로 시저가 실행되는 보안 컨텍스트를 설정합니다.

##### EXECUTE AS 절 사용

다음 예제에서는 EXECUTE AS 절을 사용하여 프로 시저를 실행할 수있는 보안 컨텍스트를 지정하는 방법을 보여줍니다. 
이 예제에서이 옵션 CALLER은 프로 시저를 호출하는 사용자의 컨텍스트에서 프로 시저를 실행할 수 있도록 지정합니다.

```tsql

CREATE PROCEDURE Purchasing.uspVendorAllInfo  
WITH EXECUTE AS CALLER  
AS  
    SET NOCOUNT ON;  
    SELECT v.Name AS Vendor, p.Name AS 'Product name',   
      v.CreditRating AS 'Rating',   
      v.ActiveFlag AS Availability  
    FROM Purchasing.Vendor v   
    INNER JOIN Purchasing.ProductVendor pv  
      ON v.BusinessEntityID = pv.BusinessEntityID   
    INNER JOIN Production.Product p  
      ON pv.ProductID = p.ProductID   
    ORDER BY v.Name ASC;  
GO  

```

##### N. 사용자 지정 권한 집합 만들기

다음 예는 EXECUTE AS를 사용하여 데이터베이스 조작에 대한 사용자 정의 권한을 작성합니다. 
TRUNCATE TABLE과 같은 일부 작업에는 권한 부여 권한이 없습니다. 
저장 프로 시저 내에 TRUNCATE TABLE 문을 통합하고 해당 프로 시저가 테이블을 수정할 수있는 권한을 가진 사용자로 실행되도록 지정하면 프로 시저에 대한 EXECUTE 권한을 부여한 사용자에게 테이블을 자르도록 사용 권한을 확장 할 수 있습니다.

```tsql

CREATE PROCEDURE dbo.TruncateMyTable  
WITH EXECUTE AS SELF  
AS TRUNCATE TABLE MyDB..MyTable;  

```



# 참조
-----
* [create-procedure-transact-sql](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-procedure-transact-sql)



