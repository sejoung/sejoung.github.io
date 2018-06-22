---
layout: post
title: "mariadb_alter_table"
date: 2018-03-28 09:00:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

## ALTER TABLE ADD PARTITION 시에 장애 

운영중인 시스템에서 mariadb를 사용 파티션 ADD 시에 ADD 프로세스가 
문제가 생겨 테이블 락이 걸려서 해당 테이블을 사용하는 서비스에서 쓰레드가 밀리고 있었다.
 
여기서 궁금증이 나왔다. 파티션 add/drop 시에 테이블 락이 걸려야 되냐?

* 실제 파티셔닝을 하는이유가 time series를 하기 위해서 사용한다고 use cases에도 나와 있다. 
이것은 미래에 들어올 데이터를 위해 신규 파티션을 만들고 더이상 쓰지 않는 파티션에 대해 삭제 하는작업을 하기 위해서 이다.
그렇다면 파티션을 추가 하거나 삭제 할때는 락을 걸필요가 없는것이 아닌가라는 생각이 들었다.

그럼 mariadb에서 alter table할때 테이블 락은 어떻게 걸리는지 확인해 보았다.

기본적으로 LOCK 절을 사용하면 락을 전략적으로 사용할수 있는데. 
alter table에서 누락된 lock절은 기본전략이 DEFAULT이다

* DEFAULT: 허용되는 최대 동시성 레벨이 사용됩니다.
* NONE: 잠금이 획득되지 않거나 오류가 발행됩니다.
* SHARED: 읽기 잠금이 확보되거나 오류가 발행됩니다.
* EXCLUSIVE: 쓰기 잠금이 획득됩니다.

lock 없음을 사용할때는  ALTER ONLINE TABLE 이라는 명령어로 할수 있는데 이것은 LOCK=NONE가 같다.

# 참조
-----
* [mysql Partitioning and Locking](https://dev.mysql.com/doc/refman/5.7/en/partitioning-limitations-locking.html)
* [mariadb partition-maintenance](https://mariadb.com/kb/en/library/partition-maintenance)
* [mariadb alter-table](https://mariadb.com/kb/en/library/alter-table)

