---
layout: post
title: "LockSupport.park()"
date: 2018-02-23 20:00:00 +0900
comments: true
tags : ["LockSupport.park","Connection Pool"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### LockSupport.park()

운영중인 시스템에서 아래처럼 에러 코드들이 발생하면서 장애상황이 발생되기 시작했다.

```
sun.misc.Unsafe.park(Native Method)
java.util.concurrent.locks.LockSupport.park(LockSupport.java:175)
java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(AbstractQueuedSynchronizer.java:2039)
org.apache.commons.pool2.impl.LinkedBlockingDeque.takeFirst(LinkedBlockingDeque.java:524)
org.apache.commons.pool2.impl.GenericObjectPool.borrowObject(GenericObjectPool.java:438)
org.apache.commons.pool2.impl.GenericObjectPool.borrowObject(GenericObjectPool.java:361)
redis.clients.util.Pool.getResource(Pool.java:49)
redis.clients.jedis.JedisPool.getResource(JedisPool.java:99)
com.mobon.dao.redis.RedisSingleFactory.getConnection(RedisSingleFactory.java:133)
com.mobon.dao.redis.RedisConnFactory.getLogConnection(RedisConnFactory.java:79)
xxx.util.RedisUtilSub.setErrorLog(RedisUtilSub.java:66)
xxx.util.ErrorLog.getStack(ErrorLog.java:160)
xxx.util.ErrorLog.getStack(ErrorLog.java:79)
xxx.servlet.Drc.doGet(Drc.java:221)
javax.servlet.http.HttpServlet.service(HttpServlet.java:624)
javax.servlet.http.HttpServlet.service(HttpServlet.java:731)
org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:303)
org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)
org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
xxx.filter.XssFilter.doFilter(XssFilter.java:87)
org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:220)
org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:122)
org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:505)
org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:170)
org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:103)
org.apache.catalina.valves.AccessLogValve.invoke(AccessLogValve.java:956)
org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:116)
org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:423)
org.apache.coyote.http11.AbstractHttp11Processor.process(AbstractHttp11Processor.java:1079)
org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:625)
org.apache.tomcat.util.net.AprEndpoint$SocketWithOptionsProcessor.run(AprEndpoint.java:2459)
java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
java.lang.Thread.run(Thread.java:745)

```
위에 코드를 보면서 일단을 pool이 문제라고 생각했다.
찾아서 코드를 보니 pool 설정이 디폴트 설정으로 되어 있었다.

```

JedisPoolConfig poolConfig=new JedisPoolConfig();
this.pool = new JedisPool(poolConfig,hostIp, port, 1000, pwd);

```

그래서 해당 풀이 문제인지 찾아 볼려고 첫번째 덤프에서 나왔던 콜스텍을 기준으로
org.apache.commons.pool2.impl.GenericObjectPool.borrowObject의 코드를 찾아보았다.

```java

 while (p == null) {
            create = false;
            if (blockWhenExhausted) {
                p = idleObjects.pollFirst();
                if (p == null) {
                    create = true;
                    p = create();
                }
                if (p == null) {
                    if (borrowMaxWaitMillis < 0) {
                        p = idleObjects.takeFirst();
                    } else {
                        waitTime = System.currentTimeMillis();
                        p = idleObjects.pollFirst(borrowMaxWaitMillis,
                                TimeUnit.MILLISECONDS);
                        waitTime = System.currentTimeMillis() - waitTime;
                    }
                }

```

쓰레드 상태를 WAINTING 걸고 park 메소드를 호출하는 로직에 콜스텍은 dleObjects.takeFirst(); 호출하는 순간 발생이 된다.
해당 상태는 borrowMaxWaitMillis에 의해서 결정이 되는데 해당 값은 유효한 커넥션 풀이 없을때 얼마나 대기할지 결정을 하므로써 그렇게 된다.
그래서 위에서 보았듯이 커넥션 풀이 디폴트로 설정이 되어 있기때문에 최대 8개만 생성이되고 더이상 되지 않아서
커넥션풀이 여유가 남았을때 사용이 가능하게 되는 경우이다.

그래서 설정을 커넥션 풀 갯수를 늘리고 체크하는 설정을 추가하였다.

```java

    JedisPoolConfig poolConfig=new JedisPoolConfig();
    poolConfig.setTimeBetweenEvictionRunsMillis(60000);
    poolConfig.setMinEvictableIdleTimeMillis(1800000);
    poolConfig.setNumTestsPerEvictionRun(5);
    poolConfig.setMaxTotal(220);
    poolConfig.setMaxIdle(220);
    poolConfig.setTestWhileIdle(true);
    poolConfig.setTestOnBorrow(true);

```
 쓰레드 상태
 
| 상태  | 코드 | 
| --- |  --- | 
| 객체생성 | NEW |  
| 실행대기 | RUNNABLE | 
| 일시정지 | WAITING | 
| 일시정지 | TIMED_WAITING | 
| 일시정지 | BLOCKED | 
| 종료 | TERMINATED |

 
# 참조 
-----
* [LockSupport](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/locks/LockSupport.html)
* [Difference Between BLOCKED, WAITING, And TIMED_WAITING? - explained through real-life examples](https://dzone.com/articles/difference-between-blocked-waiting-timed-waiting-e)

