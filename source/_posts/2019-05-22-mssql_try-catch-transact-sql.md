---
layout: post
title: "mssql TRY...CATCH"
date: 2019-05-22 14:10 +0900
comments: true
tags : ["mssql","TRY...CATCH","Transact-SQL"]
categories : ["sql"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## mssql TRY...CATCH

### TRY...CATCH (Transact-SQL)

본 문서의 정보는 다음의 제품에 적용됩니다. SQL Server (starting with 2008), Azure SQL Database, Azure SQL Data Warehouse, Parallel Data Warehouse

Microsoft Visual C # 및 Microsoft Visual C ++ 언어의 예외 처리와 유사한 Transact-SQL에 대한 오류 처리를 구현합니다. 
Transact-SQL 문의 그룹은 TRY 블록으로 묶을 수 있습니다. 
TRY 블록에서 오류가 발생하면 제어가 CATCH 블록에 포함 된 다른 명령문 그룹으로 전달됩니다.

#### Syntax

```tsql

BEGIN TRY  
     { sql_statement | statement_block }  
END TRY  
BEGIN CATCH  
     [ { sql_statement | statement_block } ]  
END CATCH  
[ ; ]  

```

#### Arguments

##### sql_statement
Transact-SQL 문입니다.

##### statement_block
일괄 처리되거나 BEGIN ... END 블록으로 묶인 Transact-SQL 문의 그룹입니다.

#### Remarks

TRY ... CATCH 구조는 데이터베이스 연결을 닫지 않는 심각도가 10 이상인 모든 실행 오류를 캐치합니다.

TRY 블록 바로 다음에 연관된 CATCH 블록이 와야합니다. 
END TRY와 BEGIN CATCH 문 사이에 다른 명령문을 포함하면 구문 오류가 생성됩니다.

TRY ... CATCH 구조는 여러 배치에 걸쳐있을 수 없습니다. TRY ... CATCH 구문은 Transact-SQL 문의 여러 블록으로 확장 될 수 없습니다. 
예를 들어, TRY ... CATCH 구문은 Transact-SQL 문의 두 개의 BEGIN ... END 블록으로 확장 할 수 없으며 IF ... ELSE 구문을 확장 할 수 없습니다.

TRY 블록에 포함 된 코드에 오류가 없으면 TRY 블록의 마지막 명령문 실행이 끝나면 제어는 연결된 END CATCH 명령문 바로 다음의 명령문으로 넘어갑니다. 
TRY 블록으로 묶인 코드에 오류가 있으면 제어가 연관된 CATCH 블록의 첫 번째 명령문으로 넘어갑니다. 
END CATCH 문이 저장 프로 시저 또는 트리거의 마지막 문인 경우 저장 프로 시저를 호출하거나 트리거를 트리거 한 문으로 제어가 다시 전달됩니다.

CATCH 블록의 코드가 끝나면 제어는 END CATCH 문의 바로 다음 문으로 넘어갑니다. 
CATCH 블록에 의해 트랩 된 오류는 호출 응용 프로그램으로 리턴되지 않습니다. 
오류 정보의 일부를 응용 프로그램에 반환해야하는 경우 CATCH 블록의 코드는 SELECT 결과 집합이나 RAISERROR 및 PRINT 문과 같은 메커니즘을 사용하여 수행해야합니다.

TRY ... CATCH 구조체는 중첩 될 수 있습니다. 
TRY 블록이나 CATCH 블록에는 중첩 된 TRY ... CATCH 구문이 포함될 수 있습니다. 
예를 들어, CATCH 블록은 CATCH 코드에서 발생한 오류를 처리하기 위해 내장 된 TRY ... CATCH 구문을 포함 할 수 있습니다.

CATCH 블록에서 발생한 오류는 다른 곳에서 생성 된 오류처럼 취급됩니다. 
CATCH 블록에 중첩 된 TRY ... CATCH 구문이 포함되어 있으면 중첩 된 TRY 블록의 모든 오류가 중첩 된 CATCH 블록에 제어를 전달합니다. 
중첩 된 TRY ... CATCH 구문이 없으면 오류가 호출자에게 다시 전달됩니다.

TRY ... CATCH 생성자는 TRY 블록의 코드에서 실행되는 저장 프로 시저 또는 트리거에서 처리되지 않은 오류를 catch합니다. 
또는 저장 프로 시저 또는 트리거는 해당 코드에서 생성 된 오류를 처리하기 위해 고유 한 TRY ... CATCH 구문을 포함 할 수 있습니다. 
예를 들어 TRY 블록이 저장 프로 시저를 실행하고 저장 프로 시저에서 오류가 발생하면 다음과 같은 방법으로 오류를 처리 할 수 있습니다.

저장 프로 시저에 자체 TRY ... CATCH 구문이 없으면 EXECUTE 문이 포함 된 TRY 블록과 관련된 CATCH 블록으로 제어가 반환됩니다.

저장 프로 시저에 TRY ... CATCH 구문이 포함되어 있으면이 오류로 인해 저장 프로 시저의 CATCH 블록에 제어가 전달됩니다. 
CATCH 블록 코드가 완료되면 저장 프로시 듀어를 호출 한 EXECUTE. 바로 뒤의 명령문으로 제어가 전달됩니다.

GOTO 문은 TRY 또는 CATCH 블록을 입력하는 데 사용할 수 없습니다. 
GOTO 문은 동일한 TRY 또는 CATCH 블록 안의 레이블로 건너 뛰거나 TRY 또는 CATCH 블록을 종료하는 데 사용할 수 있습니다.

TRY ... CATCH 구문은 사용자 정의 함수에서 사용할 수 없습니다.

#### 오류 정보 검색

CATCH 블록의 범위에서 다음 시스템 기능을 사용하여 CATCH 블록을 실행시킨 오류에 대한 정보를 얻을 수 있습니다.

* ERROR_NUMBER() 는 오류 번호를 반환합니다.

* ERROR_SEVERITY() 는 심각도를 반환합니다.

* ERROR_STATE() 는 오류 상태 번호를 반환합니다.

* ERROR_PROCEDURE() 는 오류가 발생한 저장 프로 시저 또는 트리거의 이름을 반환합니다.

* ERROR_LINE() 은 오류를 일으킨 루틴 내부의 행 번호를 리턴합니다.

* ERROR_MESSAGE() 는 오류 메시지의 전체 텍스트를 반환합니다. 
텍스트에는 길이, 오브젝트 이름 또는 시간과 같은 대체 가능한 매개 변수에 제공된 값이 들어 있습니다.


이러한 함수는 CATCH 블록의 범위 외부에서 호출되면 NULL을 반환합니다. 
오류 정보는 CATCH 블록의 범위 내에서 어디에서나 이러한 기능을 사용하여 검색 할 수 있습니다. 
예를 들어, 다음 스크립트는 오류 처리 함수가 들어있는 저장 프로 시저를 보여줍니다. 
TRY...CATCH구조 에서는 CATCH(A)의 블록, 저장 프로 시저가 호출되고, 에러에 대한 정보를 반환한다.

```tsql

-- Verify that the stored procedure does not already exist.  
IF OBJECT_ID ( 'usp_GetErrorInfo', 'P' ) IS NOT NULL   
    DROP PROCEDURE usp_GetErrorInfo;  
GO  
  
-- Create procedure to retrieve error information.  
CREATE PROCEDURE usp_GetErrorInfo  
AS  
SELECT  
    ERROR_NUMBER() AS ErrorNumber  
    ,ERROR_SEVERITY() AS ErrorSeverity  
    ,ERROR_STATE() AS ErrorState  
    ,ERROR_PROCEDURE() AS ErrorProcedure  
    ,ERROR_LINE() AS ErrorLine  
    ,ERROR_MESSAGE() AS ErrorMessage;  
GO  
  
BEGIN TRY  
    -- Generate divide-by-zero error.  
    SELECT 1/0;  
END TRY  
BEGIN CATCH  
    -- Execute error retrieval routine.  
    EXECUTE usp_GetErrorInfo;  
END CATCH;   

```

ERROR_ * 함수는 네이티브 컴파일 된 저장 프로 시저CATCH 내부의 블록 에서도 작동 합니다 .

#### TRY ... CATCH 생성자의 영향을받지 않는 오류

TRY ... CATCH 구문은 다음 조건을 함정에 넣지 않습니다.

* 심각도가 10 이하인 경고 또는 정보 메시지
* 심각도가 20 이상이며 세션에 대한 SQL Server 데이터베이스 엔진 작업 처리를 중지시키는 오류입니다. 
심각도가 20 이상이고 데이터베이스 연결이 중단되지 않은 오류가 발생하면 TRY ... CATCH가 오류를 처리합니다.
* 클라이언트 인터럽트 요청 또는 깨진 클라이언트 연결과 같은주의.
* KILL 문을 사용하여 시스템 관리자가 세션을 종료 한 경우.

다음 유형의 오류는 CATCH 블록이 TRY ... CATCH 구문과 동일한 실행 수준에서 발생할 때 CATCH 블록에 의해 처리되지 않습니다.

* 일괄 처리를 실행하지 못하게하는 구문 오류와 같은 오류를 컴파일합니다.
* 지연된 이름 확인으로 인해 컴파일 후 발생하는 개체 이름 확인 오류와 같은 문 수준 재 컴파일 중에 발생하는 오류입니다.
* 개체 이름 확인 오류

이러한 오류는 일 처리, 저장 프로 시저 또는 트리거를 실행 한 레벨로 리턴됩니다.

TRY 블록 내에서 낮은 실행 수준 (예 : sp_executesql 또는 사용자 정의 저장 프로 시저 실행시)에서 컴파일 또는 문 수준 재 컴파일 중에 오류가 발생하면 TRY ... CATCH보다 낮은 수준에서 오류가 발생합니다 생성되고 연관된 CATCH 블록에 의해 처리됩니다.

다음 예는 SELECT 명령문에 의해 생성 된 오브젝트 이름 해석 오류가 구문에 의해 포착되지 TRY...CATCH 않지만 저장 프로 시저 내 CATCH 에서 동일한 SELECT 명령문이 실행될 때 블록에 의해 포착되는 방법을 보여줍니다.

```tsql

BEGIN TRY  
    -- Table does not exist; object name resolution  
    -- error not caught.  
    SELECT * FROM NonexistentTable;  
END TRY  
BEGIN CATCH  
    SELECT   
        ERROR_NUMBER() AS ErrorNumber  
       ,ERROR_MESSAGE() AS ErrorMessage;  
END CATCH  

```

오류는 포착되지 않고 컨트롤이 TRY...CATCH다음 상위 수준으로 구성을 전달 합니다.

SELECT저장 프로 시저 내 에서 명령문을 실행하면 TRY블록 보다 낮은 레벨에서 오류가 발생합니다. 
오류는 TRY...CATCH구문에 의해 처리됩니다 .


```tsql

-- Verify that the stored procedure does not exist.  
IF OBJECT_ID ( N'usp_ExampleProc', N'P' ) IS NOT NULL   
    DROP PROCEDURE usp_ExampleProc;  
GO  
  
-- Create a stored procedure that will cause an   
-- object resolution error.  
CREATE PROCEDURE usp_ExampleProc  
AS  
    SELECT * FROM NonexistentTable;  
GO  
  
BEGIN TRY  
    EXECUTE usp_ExampleProc;  
END TRY  
BEGIN CATCH  
    SELECT   
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_MESSAGE() AS ErrorMessage;  
END CATCH;  

```

#### 커밋 할 수없는 트랜잭션 및 XACT_STATE

TRY 블록에서 생성 된 오류로 인해 현재 트랜잭션의 상태가 무효화되면 트랜잭션은 커밋 할 수없는 트랜잭션으로 분류됩니다. 
일반적으로 TRY 블록 외부에서 트랜잭션을 종료하는 오류는 TRY 블록 내에서 오류가 발생하면 트랜잭션이 커밋 불가능 상태가됩니다. 
커밋 할 수없는 트랜잭션은 읽기 작업 또는 ROLLBACK TRANSACTION 만 수행 할 수 있습니다. 
트랜잭션은 쓰기 작업 또는 COMMIT TRANSACTION을 생성하는 Transact-SQL 문을 실행할 수 없습니다. 
XACT_STATE 함수는 트랜잭션이 커밋 할 수없는 트랜잭션으로 분류 된 경우 -1 값을 반환합니다. 
일괄 처리가 완료되면 데이터베이스 엔진은 커밋되지 않은 활성 트랜잭션을 롤백합니다. 
트랜잭션이 커밋 할 수없는 상태가되었을 때 오류 메시지가 보내지지 않으면 배치가 완료되고, 오류 메시지가 클라이언트 응용 프로그램에 전송됩니다. 
이는 커밋 할 수없는 트랜잭션이 감지되어 롤백되었음을 나타냅니다.

커밋 할 수없는 트랜잭션 및 XACT_STATE 함수에 대한 자세한 내용은 XACT_STATE (Transact-SQL)를 참조하십시오 .

#### Examples

##### A. TRY ... CATCH 사용

다음 예제에서는 SELECT0으로 나누기 오류를 생성 하는 명령문을 보여줍니다. 
이 오류로 인해 실행이 연관된 CATCH블록 으로 점프합니다.

```tsql

BEGIN TRY  
    -- Generate a divide-by-zero error.  
    SELECT 1/0;  
END TRY  
BEGIN CATCH  
    SELECT  
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_SEVERITY() AS ErrorSeverity  
        ,ERROR_STATE() AS ErrorState  
        ,ERROR_PROCEDURE() AS ErrorProcedure  
        ,ERROR_LINE() AS ErrorLine  
        ,ERROR_MESSAGE() AS ErrorMessage;  
END CATCH;  
GO

```

##### B. 트랜잭션에서 TRY ... CATCH 사용

다음 예는 TRY...CATCH트랜잭션 내에서 블록이 작동 하는 방법을 보여줍니다. 
TRY블록 내의 명령문 은 제한 조건 위반 오류를 생성합니다.


```tsql

BEGIN TRANSACTION;  
  
BEGIN TRY  
    -- Generate a constraint violation error.  
    DELETE FROM Production.Product  
    WHERE ProductID = 980;  
END TRY  
BEGIN CATCH  
    SELECT   
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_SEVERITY() AS ErrorSeverity  
        ,ERROR_STATE() AS ErrorState  
        ,ERROR_PROCEDURE() AS ErrorProcedure  
        ,ERROR_LINE() AS ErrorLine  
        ,ERROR_MESSAGE() AS ErrorMessage;  
  
    IF @@TRANCOUNT > 0  
        ROLLBACK TRANSACTION;  
END CATCH;  
  
IF @@TRANCOUNT > 0  
    COMMIT TRANSACTION;  
GO

```
##### C. XACT_STATE와 함께 TRY ... CATCH 사용

다음 예제는 TRY...CATCH구조 를 사용하여 트랜잭션 내부에서 발생하는 오류를 처리 하는 방법을 보여줍니다. 
이 XACT_STATE함수는 트랜잭션을 커밋할지 또는 롤백 할지를 결정합니다. 
이 예에서는 SET XACT_ABORT입니다 ON. 
이렇게하면 제약 조건 위반 오류가 발생할 때 트랜잭션을 커밋 할 수 없게됩니다.

```tsql

-- Check to see whether this stored procedure exists.  
IF OBJECT_ID (N'usp_GetErrorInfo', N'P') IS NOT NULL  
    DROP PROCEDURE usp_GetErrorInfo;  
GO  
  
-- Create procedure to retrieve error information.  
CREATE PROCEDURE usp_GetErrorInfo  
AS  
    SELECT   
         ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_SEVERITY() AS ErrorSeverity  
        ,ERROR_STATE() AS ErrorState  
        ,ERROR_LINE () AS ErrorLine  
        ,ERROR_PROCEDURE() AS ErrorProcedure  
        ,ERROR_MESSAGE() AS ErrorMessage;  
GO  
  
-- SET XACT_ABORT ON will cause the transaction to be uncommittable  
-- when the constraint violation occurs.   
SET XACT_ABORT ON;  
  
BEGIN TRY  
    BEGIN TRANSACTION;  
        -- A FOREIGN KEY constraint exists on this table. This   
        -- statement will generate a constraint violation error.  
        DELETE FROM Production.Product  
            WHERE ProductID = 980;  
  
    -- If the DELETE statement succeeds, commit the transaction.  
    COMMIT TRANSACTION;  
END TRY  
BEGIN CATCH  
    -- Execute error retrieval routine.  
    EXECUTE usp_GetErrorInfo;  
  
    -- Test XACT_STATE:  
        -- If 1, the transaction is committable.  
        -- If -1, the transaction is uncommittable and should   
        --     be rolled back.  
        -- XACT_STATE = 0 means that there is no transaction and  
        --     a commit or rollback operation would generate an error.  
  
    -- Test whether the transaction is uncommittable.  
    IF (XACT_STATE()) = -1  
    BEGIN  
        PRINT  
            N'The transaction is in an uncommittable state.' +  
            'Rolling back transaction.'  
        ROLLBACK TRANSACTION;  
    END;  
  
    -- Test whether the transaction is committable.  
    IF (XACT_STATE()) = 1  
    BEGIN  
        PRINT  
            N'The transaction is committable.' +  
            'Committing transaction.'  
        COMMIT TRANSACTION;     
    END;  
END CATCH;  
GO  

```


#####

# 참조
-----
* [try-catch-transact-sql](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/try-catch-transact-sql?view=sql-server-2017)




