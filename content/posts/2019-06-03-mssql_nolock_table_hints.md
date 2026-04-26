---
layout: post
title: "mssql nolock table hint"
date: 2019-06-03 14:03 +0900
comments: true
tags : ["mssql","nolock", "Transact-SQL"]
categories : ["sql"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## NOLOCK

READUNCOMMITTED와 같습니다. 자세한 내용은이 항목 뒷부분의 READUNCOMMITTED를 참조하십시오.

```
UPDATE 또는 DELETE 문 :이 기능은 유지 관리 모드에 있으며 이후 버전의 Microsoft SQL Server에서 제거 될 수 있습니다. 
새로운 개발 작업에서는이 기능을 사용하지 말고 현재이 기능을 사용하는 응용 프로그램을 수정하십시오.
```

### READUNCOMMITTED

더티 읽기가 허용되도록 지정합니다. 
다른 트랜잭션이 현재 트랜잭션에서 읽은 데이터를 수정하지 못하도록 공유 잠금이 발행되지 않으며 다른 트랜잭션이 설정 한 배타적 잠금은 현재 트랜잭션이 잠긴 데이터를 읽지 못하도록 차단하지 않습니다. 
더티 읽기를 허용하면 더 높은 동시성이 발생할 수 있지만 데이터 수정을 읽는 대신 다른 트랜잭션이 롤백합니다. 
이로 인해 트랜잭션에 오류가 발생하거나 커밋되지 않은 데이터가 사용자에게 표시되거나 사용자가 레코드를 두 번 (또는 전혀) 볼 수 없게 될 수 있습니다.

READUNCOMMITTED 및 NOLOCK 힌트는 데이터 잠금에만 적용됩니다. 
READUNCOMMITTED 및 NOLOCK 힌트가있는 쿼리를 포함하여 모든 쿼리는 컴파일 및 실행 중에 Sch-S (스키마 안정성) 잠금을 획득합니다. 
이 때문에 동시 트랜잭션이 테이블에서 Sch-M (스키마 수정) 잠금을 보유 할 때 쿼리가 차단됩니다. 
예를 들어, 데이터 정의 언어 (DDL) 연산은 테이블의 스키마 정보를 수정하기 전에 Sch-M 잠금을 획득합니다. 
READUNCOMMITTED 또는 NOLOCK 힌트로 실행되는 쿼리를 포함하여 동시 쿼리는 Sch-S 잠금을 획득하려고 시도 할 때 차단됩니다. 
반대로, Sch-S 잠금을 보유한 쿼리는 Sch-M 잠금을 획득하려고 시도하는 동시 트랜잭션을 차단합니다.

INSERT, UPDATE 또는 DELETE 작업으로 수정 된 테이블에는 READUNCOMMITTED 및 NOLOCK을 지정할 수 없습니다. 
SQL Server 쿼리 최적화 프로그램은 UPDATE 또는 DELETE 문의 대상 테이블에 적용되는 FROM 절의 READUNCOMMITTED 및 NOLOCK 힌트를 무시합니다.

```
UPDATE 또는 DELETE 문의 대상 테이블에 적용되는 FROM 절의 READUNCOMMITTED 및 NOLOCK 힌트 사용에 대한 지원은 이후 버전의 SQL Server에서 제거됩니다.
새 개발 작업에서 이러한 상황에서 이러한 힌트를 사용하지 말고 현재 사용중인 응용 프로그램을 수정하려고 계획하십시오.
```

잠금 경합을 최소화하면서 다음 중 하나를 사용하여 커밋되지 않은 데이터 수정에 대한 더티 읽기로부터 트랜잭션을 보호 할 수 있습니다.

* READ_COMMITTED_SNAPSHOT 데이터베이스 옵션을 사용하여 READ COMMITTED 격리 수준을 ON으로 설정합니다.
* SNAPSHOT 격리 수준.

격리 수준에 대한 자세한 내용은 SET TRANSACTION ISOLATION LEVEL (Transact-SQL)을 참조하십시오 .

```
READUNCOMMITTED가 지정된 경우 오류 메시지 601이 표시되면 교착 상태 오류 (1205)와 같이 해결하고 명령문을 다시 시도하십시오.
```


# 참조
-----
* [hints-transact-sql-table](https://docs.microsoft.com/en-us/sql/t-sql/queries/hints-transact-sql-table)



