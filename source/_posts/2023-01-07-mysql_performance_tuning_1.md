---
layout: post
title: "mysql (mariaDB) 성능 튜닝 (performance tuning) 1"
date: 2023-01-07 11:35 +0900
comments: true
tags : ["mysql","mariaDB","performance tuning","성능","database parameters","HikariCP","Aurora MySQL"]
categories : ["DB"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# mysql (mariaDB) 성능 튜닝 (performance tuning) 
## DB server 성능 튜닝

* max_connections : 데이터베이스 서버에 대한 최대 동시 연결 수를 제어합니다. 
이 값을 너무 낮게 설정하면 연결 오류가 발생할 수 있고 너무 높게 설정하면 너무 많은 메모리를 사용하여 전체 성능이 저하될 수 있습니다.

* key_buffer_size : 인덱스 블록에 사용되는 버퍼의 크기를 제어합니다. 
이 값을 너무 낮게 설정하면 더 많은 디스크 읽기가 발생하고 성능이 느려질 수 있으며, 너무 높게 설정하면 너무 많은 메모리를 사용할 수 있습니다.

* query_cache_size : SELECT 쿼리 결과를 저장하는 데 사용되는 캐시 크기를 제어합니다. 
이 값을 너무 낮게 설정하면 캐시 미스가 더 자주 발생하고 성능이 느려질 수 있으며, 너무 높게 설정하면 너무 많은 메모리를 사용할 수 있습니다.

* innodb_buffer_pool_size : InnoDB 스토리지 엔진에서 사용하는 버퍼 풀의 크기를 제어합니다. 
이 값을 너무 낮게 설정하면 디스크 읽기 빈도가 높아지고 성능이 저하될 수 있으며, 너무 높게 설정하면 메모리를 너무 많이 사용할 수 있습니다.

* join_buffer_size : 적절한 인덱스가 없는 조인에 사용되는 버퍼의 크기를 제어합니다. 
이 값을 너무 낮게 설정하면 이러한 조인 유형의 성능이 느려질 수 있고 너무 높게 설정하면 너무 많은 메모리를 사용할 수 있습니다.

* innodb_flush_log_at_trx_commit : 기본값인 1로 설정하면 각 트랜잭션 커밋에서 로그 버퍼가 플러시됩니다. 
이 설정은 데이터베이스 ACID 를 유지하는 데 도움이 됩니다.준수합니다. 기본 설정인 1을 유지하는 것이 좋습니다. 
기본값이 아닌 값(0 또는 2)으로 변경하면 innodb_flush_log_at_trx_commitDML(데이터 조작 언어) 대기 시간을 줄이는 데 도움이 되지만 로그 레코드의 내구성이 저하됩니다. 
이러한 내구성 부족으로 인해 데이터베이스 ACID는 비준수 상태가 됩니다.

* connect_timeout : mysqld 서버가 접속실패로 응답하기 전에 연결 패킷을 기다리는 시간(초). 기본값은 10 초입니다. 
connect_timeout값을 늘리면 클라이언트에서 Lost Connection 오류가 자주 발생하는 경우 도움이 될 수 있습니다. 
`Lost connection to MySQL server at 'XXX', system error: errno.`

* lock_wait_timeout : 메타 데이터 잠금 획득 시도에 대한 제한 시간 (초)을 지정합니다. 허용되는 값의 범위는 1-31536000 (1 년)입니다. 기본값은 31536000입니다.

* net_read_timeout : 네트워크 접속을 통해서 클라이언트가 서버에서 데이터를 받을 때 abort(중지)될때까지 기다리는 시간입니다. 여기에서 네트워크 접속이란 TCP/IP 접속을 얘기합니다. 
Unix socket file(로컬 서버에서의 접속), named pipe, 공유된 메모리를 통해 접속된 연결은 아닙니다. 기본값은 30초 입니다. 서버가 클라이언트로부터 읽혀질때 net_read_timeout값은 abort(중지)를 제어합니다.

* net_write_timeout : 네트워크 접속을 통해서 클라이언트가 서버에 데이터 쓸 때 abort(중지)될때까지 기다리는 시간입니다. 여기에서 네트워크 접속이란 TCP/IP 접속을 얘기합니다. 
Unix socket file(로컬 서버에서의 접속), named pipe, 공유된 메모리를 통해 접속된 연결은 아닙니다. 기본값은 60초 입니다.

* wait_timeout : 비 대화식(non interactive) 연결에서 서버가 활동을 닫기 전에 서버가 대기하는 시간 (초)입니다.
스레드 시작시 wait_timeout 값은 클라이언트 유형에 따라 전역 wait_timeout 값 또는 전역 interactive_timeout 값에서 초기화됩니다(CLIENT_INTERACTIVE 연결 옵션으로 mysql_real_connect()에 정의 됨).
interactive_timeout도 참조합니다. 기본값은 28800초 입니다. 클라이언트의 최대 연결시간  최대 연결시간

* interactive_timeout : 서버가 대화식 연결을 닫기 전에 활동을 기다리는 시간 (초)입니다. 
대화 형 클라이언트는 mysql_real_connect ()에 CLIENT_INTERACTIVE 옵션을 사용하는 클라이언트로 정의됩니다. wait_timeout도 참조하십시오. 기본값은 28800초 입니다.

* table_lock_wait_timeout : 테이블 락을 중단하기까지 대기하는 시간

* thread_pool_idle_timeout : 마리아DB파라미터 입니다. 기본값은 60초입니다. idle 상태인 쓰레드를 정리하기 전에 대기하는 시간(초)입니다.




### Aurora MySQL 버전 3 에서 설정 할수 없는 파라미터
* innodb_flush_log_at_trx_commit : 무조건 1로 셋팅 되어 있다.



# 참조

-----

* [Managing performance and scaling for Amazon Aurora MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Performance.html)
* [AuroraMySQL BestPractices](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.BestPractices.html#AuroraMySQL.BestPractices.Avoiding)
* [MySQL Timeout 종류](https://myinfrabox.tistory.com/192)
* [MySQL 서버의 time out 설정](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=bomyzzang&logNo=221550485417)
