---
layout: post
title: "mssql create sequence"
date: 2019-08-12 10:00 +0900
comments: true
tags : ["mssql","create","sequence"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## mssql create sequence

시퀀스 객체를 만들고 해당 속성을 지정합니다. 시퀀스는 시퀀스가 생성 된 사양에 따라 숫자 값 시퀀스를 생성하는 사용자 정의 스키마 바운드 객체입니다. 
일련의 숫자 값은 정의 된 간격으로 오름차순 또는 내림차순으로 생성되며 소진되면 다시 시작 (사이클)하도록 구성 할 수 있습니다. 
식별 컬럼과 달리 시퀀스는 특정 테이블과 연관되지 않습니다. 
응용 프로그램은 시퀀스 객체를 참조하여 다음 값을 검색합니다. 시퀀스와 테이블 간의 관계는 응용 프로그램에 의해 제어됩니다. 
사용자 응용 프로그램은 시퀀스 객체를 참조하고 여러 행과 테이블에서 값을 조정할 수 있습니다.

행을 삽입 할 때 생성되는 ID 열 값과 달리 응용 프로그램은 NEXT VALUE FOR 함수를 호출하여 행을 삽입하지 않고 다음 시퀀스 번호를 얻을 수 있습니다. 
sp_sequence_get_range 를 사용 하여 한 번에 여러 시퀀스 번호를 가져옵니다.

CREATE SEQUENCE 및 NEXT VALUE FOR 함수를 모두 사용하는 정보 및 시나리오는 시퀀스 번호를 참조하십시오 .

### Syntax

```sql

CREATE SEQUENCE [schema_name . ] sequence_name  
    [ AS [ built_in_integer_type | user-defined_integer_type ] ]  
    [ START WITH <constant> ]  
    [ INCREMENT BY <constant> ]  
    [ { MINVALUE [ <constant> ] } | { NO MINVALUE } ]  
    [ { MAXVALUE [ <constant> ] } | { NO MAXVALUE } ]  
    [ CYCLE | { NO CYCLE } ]  
    [ { CACHE [ <constant> ] } | { NO CACHE } ]  
    [ ; ]  

```

### Arguments
#### sequence_name
데이터베이스에서 시퀀스가 알려진 고유 이름을 지정합니다. 유형은 sysname입니다 .

#### [ built_in_integer_type | user-defined_integer_type
A sequence can be defined as any integer type. The following types are allowed.

* tinyint - Range 0 to 255
* smallint - Range -32,768 to 32,767
* int - Range -2,147,483,648 to 2,147,483,647
* bigint - Range -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
* 소수 자릿수 와 숫자 는 0입니다.
* 허용 된 유형 중 하나를 기반으로하는 모든 사용자 정의 데이터 유형 (별칭 유형)

데이터 유형이 제공되지 않으면 bigint 데이터 유형이 기본값으로 사용됩니다.

#### START WITH <constant>
시퀀스 객체가 반환 한 첫 번째 값. START의 값이 값보다 작거나 같고, 최대 이상의 시퀀스 오브젝트의 최소 값과 동일해야한다. 
새 시퀀스 객체의 기본 시작 값은 오름차순 시퀀스 객체의 최소값과 내림차순 시퀀스 객체의 최대 값입니다.


#### INCREMENT BY <constant>
호출 할 때마다 시퀀스 객체의 값을 증가 (또는 음수이면 감소)하는 데 사용되는 값 . 증분이 음수이면 시퀀스 객체는 내림차순입니다. 
그렇지 않으면 오름차순입니다. 증분은 0 일 수 없습니다. 새 시퀀스 객체의 기본 증분은 1입니다.

#### [ MINVALUE <constant> | NO MINVALUE ]
시퀀스 오브젝트의 경계를 지정합니다. 새 시퀀스 객체의 기본 최소값은 시퀀스 객체 데이터 유형의 최소값입니다. 
tinyint 데이터 형식의 경우 0이고 다른 모든 데이터 형식의 경우 음수입니다.

#### [ MAXVALUE <constant> | NO MAXVALUE
시퀀스 오브젝트의 경계를 지정합니다. 새 시퀀스 객체의 기본 최대 값은 시퀀스 객체의 데이터 유형의 최대 값입니다.

#### [ CYCLE | NO CYCLE ]
시퀀스 오브젝트가 최소값 (또는 내림차순 시퀀스 오브젝트의 최대 값)에서 다시 시작해야하는지 또는 최소값 또는 최대 값이 초과 될 때 예외를 처리해야하는지 여부를 지정하는 특성입니다. 
새 시퀀스 객체의 기본주기 옵션은 NO CYCLE입니다.

```
SEQUENCE를 순환하면 시작 값이 아닌 최소값 또는 최대 값에서 다시 시작됩니다.

```

#### [ CACHE [<constant> ] | NO CACHE ]
시퀀스 번호를 생성하는 데 필요한 디스크 IO 수를 최소화하여 시퀀스 오브젝트를 사용하는 응용 프로그램의 성능을 향상시킵니다. 기본값은 CACHE입니다.

예를 들어 캐시 크기 50을 선택하면 SQL Server는 50 개의 개별 값을 캐시하지 않습니다. 
현재 값과 캐시에 남아있는 값의 수만 캐시합니다. 이는 캐시를 저장하는 데 필요한 메모리 양이 항상 시퀀스 객체의 데이터 유형의 두 인스턴스임을 의미합니다.

```
캐시 크기를 지정하지 않고 캐시 옵션을 사용하면 데이터베이스 엔진이 크기를 선택합니다. 
그러나 사용자는 선택의 일관성에 의존해서는 안됩니다. Microsoft는 통지없이 캐시 크기를 계산하는 방법을 변경할 수 있습니다.

```
CACHE 옵션을 사용하여 생성하면 정전과 같은 예기치 않은 종료로 인해 캐시에 남아있는 시퀀스 번호가 손실 될 수 있습니다.

### General Remarks

시퀀스 번호는 현재 트랜잭션 범위 밖에서 생성됩니다. 
시퀀스 번호를 사용하는 트랜잭션이 커밋되거나 롤백되는지에 관계없이 사용됩니다. 
중복 유효성 검사는 레코드가 완전히 채워진 후에 만 발생합니다. 
이로 인해 작성 중에 둘 이상의 레코드에 동일한 번호가 사용되지만 중복으로 식별되는 경우가 있습니다. 
이 문제가 발생하고 다른 자동 번호 값이 후속 레코드에 적용된 경우 자동 번호 값 사이에 간격이 생길 수 있으며 동작이 예상됩니다.


# 참조
-----
* [create-sequence-transact-sql](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-sequence-transact-sql)

