---
layout: post
title: "SET NOCOUNT ON"
date: 2020-05-19 14:41 +0900
comments: true
tags : ["mssql SET NOCOUNT ON"]
categories : ["sql"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## SET NOCOUNT ON

```sql
DECLARE @NOCOUNT VARCHAR(3) = 'OFF';
IF ( (512 & @@OPTIONS) = 512 ) SET @NOCOUNT = 'ON';
SELECT @NOCOUNT AS NOCOUNT;
```

`SET NOCOUNT OFF` 가 기본설정이가 해당 설정이 되어 있으면 아래처럼 프로시저의 응답에서 응답된 행 count를 보여준다.

간단한 테스트 프로시저를 하나 만들어 보면

```sql

create table test(
    test_key  int identity (1, 1) primary key,
    name varchar(20)
)
```

```sql
CREATE PROCEDURE sp_test
@name varchar(20)
AS
BEGIN
    insert into test(name) values (@name);
    BEGIN
        PRINT '테스트 프로시저 입니다.';
        RETURN;
    END
end
```
위에 프로시저를 생성후 테스트를 하면 

```
test> SET NOCOUNT OFF;
      exec sp_test '메롱'
[2020-05-19 15:03:19] [S0001] 테스트 프로시저 입니다.
[2020-05-19 15:03:19] 1 row affected in 4 ms

```
영향 받은 행수를 반환하지만

`SET NOCOUNT ON` 설정을 하면 

```
test> SET NOCOUNT ON;
      exec sp_test '메롱'
[2020-05-19 15:04:23] [S0001] 테스트 프로시저 입니다.
[2020-05-19 15:04:23] completed in 3 ms
```

메시지가 completed으로 나오면서 더이상 영향받은 행수를 표시하지 않는다.


# 참조 
-----
* [SET NOCOUNT (Transact-SQL)](https://docs.microsoft.com/en-us/sql/t-sql/statements/set-nocount-transact-sql)



