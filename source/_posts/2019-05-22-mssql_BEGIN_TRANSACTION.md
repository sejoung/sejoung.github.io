---
layout: post
title: "mssql 명시적 트랜잭션 사용"
date: 2019-05-22 10:21 +0900
comments: true
tags : ["mssql","BEGIN TRANSACTION","Transact-SQL"]
categories : ["sql"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## mssql 명시적 트랜잭션 사용

### BEGIN TRANSACTION (Transact-SQL)

명시적인 로컬 트랜잭션의 시작점을 표시합니다. 
명시 적 트랜잭션은 BEGIN TRANSACTION 문으로 시작하고 COMMIT 또는 ROLLBACK 문으로 끝납니다.

```tsql

--Applies to SQL Server and Azure SQL Database
 
BEGIN { TRAN | TRANSACTION }   
    [ { transaction_name | @tran_name_variable }  
      [ WITH MARK [ 'description' ] ]  
    ]  
[ ; ]  

--Applies to Azure SQL Data Warehouse and Parallel Data Warehouse
 
BEGIN { TRAN | TRANSACTION }   
[ ; ]  

```

#### Arguments

##### transaction_name 해당 
본 문서의 정보는 다음의 제품에 적용됩니다. SQL Server (2008 년 시작), Azure SQL Database

트랜잭션에 할당 된 이름입니다. transaction_name 은 식별자에 대한 규칙을 따라야하지만 32 자보다 긴 식별자는 허용되지 않습니다. 
중첩 된 BEGIN ... COMMIT 또는 BEGIN ... ROLLBACK 문 중 가장 바깥 쪽 쌍에만 트랜잭션 이름을 사용하십시오. 
transaction_name 은 SQL Server 인스턴스가 대 / 소문자를 구분하지 않아도 항상 대 / 소문자를 구분합니다.

##### @tran_name_variable 
본 문서의 정보는 다음의 제품에 적용됩니다. SQL Server (2008 년 시작), Azure SQL Database

유효한 트랜잭션 이름을 포함하는 사용자 정의 변수의 이름입니다. 변수는 char , varchar , nchar 또는 nvarchar 데이터 형식 으로 선언해야합니다. 
변수에 32 자 이상이 전달되면 처음 32 자만 사용됩니다. 나머지 문자는 잘립니다.

##### WITH MARK [ ' description '] 
본 문서의 정보는 다음의 제품에 적용됩니다. SQL Server 2008 (2008 년), Azure SQL Database

트랜잭션이 로그에 표시되도록 지정합니다. description 은 마크를 설명하는 문자열입니다. 
설명을 128 자 이상은 후에 msdb.dbo.logmarkhistory 테이블에 저장됩니다 128 자 잘립니다.

WITH MARK가 사용되면 트랜잭션 이름을 지정해야합니다. WITH MARK를 사용하면 트랜잭션 로그를 명명 된 표시로 복원 할 수 있습니다.

#### General Remarks

BEGIN TRANSACTION은 @@ TRANCOUNT를 1 씩 증가시킵니다.

BEGIN TRANSACTION은 연결에서 참조하는 데이터가 논리적 및 물리적으로 일관성이있는 지점을 나타냅니다. 
오류가 발생하면 BEGIN TRANSACTION 이후에 수행 된 모든 데이터 수정을 롤백하여 데이터를이 알려진 상태로 되돌릴 수 있습니다. 
각 트랜잭션은 오류없이 완료되고 COMMIT TRANSACTION이 실행되어 수정 사항을 데이터베이스의 영구 부분으로 만들거나 오류가 발생하고 모든 수정 사항이 ROLLBACK TRANSACTION 문으로 지워질 때까지 지속됩니다.

BEGIN TRANSACTION은 명령문을 실행하는 연결에 대한 로컬 트랜잭션을 시작합니다. 
현재 트랜잭션 격리 수준 설정에 따라 연결에서 발급 한 Transact-SQL 문을 지원하기 위해 얻은 많은 리소스가 COMMIT TRANSACTION 또는 ROLLBACK TRANSACTION 문으로 완료 될 때까지 트랜잭션에 의해 잠겨집니다. 
장기간 동안 미해결 된 트랜잭션은 다른 사용자가 이러한 잠긴 리소스에 액세스하는 것을 방지 할 수 있으며 로그 잘림을 방지 할 수도 있습니다.


BEGIN TRANSACTION은 로컬 트랜잭션을 시작하지만 응용 프로그램이 이후에 INSERT, UPDATE 또는 DELETE 문 실행과 같이 로그에 기록해야하는 작업을 수행 할 때까지 트랜잭션 로그에 기록되지 않습니다. 
응용 프로그램은 잠금 획득과 같은 조치를 수행하여 SELECT 문의 트랜잭션 분리 레벨을 보호 할 수 있지만 응용 프로그램이 수정 조치를 수행 할 때까지 로그에 기록되는 것은 없습니다.


트랜잭션 이름으로 일련의 중첩 된 트랜잭션에서 여러 트랜잭션의 이름을 지정하면 트랜잭션에 거의 영향을 미치지 않습니다. 
첫 번째 (가장 바깥 쪽) 트랜잭션 이름 만 시스템에 등록됩니다. 
다른 세이브 포인트 이름 이외의 다른 이름으로 롤백하면 오류가 발생합니다. 
롤백 전에 실행 된 명령문은 실제로이 오류가 발생할 때 롤백되지 않습니다. 
외부 트랜잭션이 롤백 될 때만 명령문이 롤백됩니다.

명령문이 커밋되거나 롤백되기 전에 다음 작업이 수행되면 BEGIN TRANSACTION 문에 의해 시작된 로컬 트랜잭션이 분산 트랜잭션으로 에스컬레이션됩니다.

* 연결된 서버에서 원격 테이블을 참조하는 INSERT, DELETE 또는 UPDATE 문이 실행됩니다. 
연결된 서버에 액세스하는 데 사용되는 OLE DB 공급자가 ITransactionJoin 인터페이스를 지원하지 않으면 INSERT, UPDATE 또는 DELETE 문이 실패합니다.

* REMOTE_PROC_TRANSACTIONS 옵션을 ON으로 설정하면 원격 저장 프로 시저로 호출됩니다.
  
SQL Server의 로컬 복사본은 트랜잭션 컨트롤러가되며 Microsoft DTC (Distributed Transaction Coordinator)를 사용하여 분산 트랜잭션을 관리합니다.

트랜잭션은 BEGIN DISTRIBUTED TRANSACTION을 사용하여 명시 적으로 분산 트랜잭션으로 실행될 수 있습니다. 
자세한 내용은 BEGIN DISTRIBUTED TRANSACTION (Transact-SQL)을 참조하십시오 .

SET IMPLICIT_TRANSACTIONS가 ON으로 설정되면 BEGIN TRANSACTION 문은 두 개의 중첩 된 트랜잭션을 만듭니다. 
자세한 내용은 SET IMPLICIT_TRANSACTIONS (Transact-SQL)를 참조하십시오.

#### Marked Transactions

WITH MARK 옵션을 사용하면 트랜잭션 이름이 트랜잭션 로그에 저장됩니다. 
데이터베이스를 이전 상태로 복원 할 때 표시된 트랜잭션을 날짜 및 시간 대신 사용할 수 있습니다. 
자세한 내용은 표시된 트랜잭션을 사용하여 관련 데이터베이스를 일관되게 복구 (전체 복구 모델) 및 RESTORE (Transact-SQL)를 참조하십시오 .

또한 관련 데이터베이스 집합을 논리적으로 일관된 상태로 복구해야하는 경우 트랜잭션 로그 표시가 필요합니다. 
표시는 분산 트랜잭션을 통해 관련 데이터베이스의 트랜잭션 로그에 배치 될 수 있습니다. 
관련 데이터베이스 집합을 이러한 표시로 복구하면 트랜잭션이 일관된 데이터베이스 집합이됩니다. 
관련 데이터베이스에 자국을 배치하려면 특별한 절차가 필요합니다.

표시된 트랜잭션에 의해 데이터베이스가 갱신 된 경우에만 표시가 트랜잭션 로그에 위치합니다. 
데이터를 수정하지 않는 트랜잭션은 표시되지 않습니다.

BEGIN TRAN new_name WITH MARK는 표시되지 않은 이미 존재하는 트랜잭션 내에 중첩 될 수 있습니다. 
이렇게하면 new_name 은 트랜잭션이 이미 주어진 이름 일지라도 트랜잭션의 표시 이름이됩니다. 
다음 예 M2는 마크의 이름입니다.

```tsql

BEGIN TRAN T1;  
UPDATE table1 ...;  
BEGIN TRAN M2 WITH MARK;  
UPDATE table2 ...;  
SELECT * from table1;  
COMMIT TRAN M2;  
UPDATE table3 ...;  
COMMIT TRAN T1;  

```
트랜잭션을 중첩 할 때 이미 표시된 트랜잭션을 표시하려고하면 경고가 아닌 오류 메시지가 나타납니다.

"BEGIN TRAN T1 WITH MARK ...;"

"UPDATE table1 ...;"

"BEGIN TRAN M2 WITH MARK ...;"

"Server: Msg 3920, Level 16, State 1, Line 3"

"WITH MARK option only applies to the first BEGIN TRAN WITH MARK."

"The option is ignored."

#### Permissions

public 역할의 멤버십이 필요합니다.

#### Examples

##### A. 명시 적 트랜잭션 사용

본 문서의 정보는 다음의 제품에 적용됩니다. SQL Server 2008 (2008 년), Azure SQL Database, Azure SQL Data Warehouse, Parallel Data Warehouse

이 예에서는 AdventureWorks를 사용합니다.

```tsql

BEGIN TRANSACTION;  
DELETE FROM HumanResources.JobCandidate  
    WHERE JobCandidateID = 13;  
COMMIT;  

```
##### B. 롤백 트랜잭션 사용

본 문서의 정보는 다음의 제품에 적용됩니다. SQL Server 2008 (2008 년), Azure SQL Database, Azure SQL Data Warehouse, Parallel Data Warehouse

다음 예는 트랜잭션 롤 i의 영향을 보여줍니다. 이 예에서 ROLLBACK 문은 INSERT 문을 롤백하지만 작성된 테이블은 여전히 존재합니다.

```tsql

CREATE TABLE ValueTable (id int);  
BEGIN TRANSACTION;  
       INSERT INTO ValueTable VALUES(1);  
       INSERT INTO ValueTable VALUES(2);  
ROLLBACK;  

```

##### C. 트랜잭션 이름 지정

본 문서의 정보는 다음의 제품에 적용됩니다. SQL Server 2008 (2008 년), Azure SQL Database

다음 예제에서는 트랜잭션의 이름을 지정하는 방법을 보여줍니다.


```tsql

DECLARE @TranName VARCHAR(20);  
SELECT @TranName = 'MyTransaction';  
  
BEGIN TRANSACTION @TranName;  
USE AdventureWorks2012;  
DELETE FROM AdventureWorks2012.HumanResources.JobCandidate  
    WHERE JobCandidateID = 13;  
  
COMMIT TRANSACTION @TranName;  
GO  

```

##### D. 마킹된 트랜잭션 

본 문서의 정보는 다음의 제품에 적용됩니다. SQL Server 2008 (2008 년), Azure SQL Database

다음 예는 트랜잭션을 어떻게 마킹하는지 을 보여줍니다. 트랜잭션 CandidateDelete이 표시됩니다.

```tsql

BEGIN TRANSACTION CandidateDelete  
    WITH MARK N'Deleting a Job Candidate';  
GO  
USE AdventureWorks2012;  
GO  
DELETE FROM AdventureWorks2012.HumanResources.JobCandidate  
    WHERE JobCandidateID = 13;  
GO  
COMMIT TRANSACTION CandidateDelete;  
GO  

```

# 참조
-----
* [begin-transaction-transact-sql](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/begin-transaction-transact-sql?view=sql-server-2017)


