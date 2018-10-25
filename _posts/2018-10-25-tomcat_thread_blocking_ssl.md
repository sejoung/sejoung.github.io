---
layout: post
title: "tomcat_thread_blocking_ssl"
date: 2018-10-25 17:44 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### tomcat_thread_blocking_ssl
톰켓에서 thread 않죽음 thread 덤프를 보면 아레의 클래스 들임

```

java.net.SocketOutputStream.socketWrite0(Native Method)
java.net.SocketOutputStream.socketWrite(SocketOutputStream.java:109)
java.net.SocketOutputStream.write(SocketOutputStream.java:153)
sun.security.ssl.OutputRecord.writeBuffer(OutputRecord.java:431)
sun.security.ssl.OutputRecord.write(OutputRecord.java:417)
sun.security.ssl.SSLSocketImpl.writeRecordInternal(SSLSocketImpl.java:876)
sun.security.ssl.SSLSocketImpl.writeRecord(SSLSocketImpl.java:847)
sun.security.ssl.AppOutputStream.write(AppOutputStream.java:123)
org.apache.coyote.http11.InternalOutputBuffer.realWriteBytes(InternalOutputBuffer.java:215)
org.apache.tomcat.util.buf.ByteChunk.flushBuffer(ByteChunk.java:480)
org.apache.tomcat.util.buf.ByteChunk.append(ByteChunk.java:366)
org.apache.coyote.http11.InternalOutputBuffer$OutputStreamOutputBuffer.doWrite(InternalOutputBuffer.java:240)
org.apache.coyote.http11.filters.ChunkedOutputFilter.doWrite(ChunkedOutputFilter.java:119)
org.apache.coyote.http11.AbstractOutputBuffer.doWrite(AbstractOutputBuffer.java:192)
org.apache.coyote.Response.doWrite(Response.java:499)
org.apache.catalina.connector.OutputBuffer.realWriteBytes(OutputBuffer.java:402)
org.apache.tomcat.util.buf.ByteChunk.flushBuffer(ByteChunk.java:480)
org.apache.catalina.connector.OutputBuffer.realWriteChars(OutputBuffer.java:485)
org.apache.tomcat.util.buf.CharChunk.flushBuffer(CharChunk.java:464)
org.apache.tomcat.util.buf.CharChunk.append(CharChunk.java:384)
org.apache.catalina.connector.OutputBuffer.write(OutputBuffer.java:548)
org.apache.catalina.connector.CoyoteWriter.write(CoyoteWriter.java:174)
org.apache.catalina.connector.CoyoteWriter.write(CoyoteWriter.java:184)
org.apache.catalina.connector.CoyoteWriter.print(CoyoteWriter.java:248)
com.adgather.servlet.AdBanner.doGet(AdBanner.java:847)
javax.servlet.http.HttpServlet.service(HttpServlet.java:624)
javax.servlet.http.HttpServlet.service(HttpServlet.java:731)
org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:303)
org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)
org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
com.adgather.filter.XssFilter.doFilter(XssFilter.java:89)
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
org.apache.tomcat.util.net.JIoEndpoint$SocketProcessor.run(JIoEndpoint.java:316)
java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
java.lang.Thread.run(Thread.java:745)

```

지금까지는 생기는 빈도가 작아서 신경을 안썼는데 http에서는 잘 생기지 않고 https에서 자주 생김
https 매체가 늘어나서 자주 생김 

일단 네트워크에 비정상적인 상황같은데 이문제는 처리를 할때 늦어져서라고 판단이 되어서 기존에 쓰던 org.apache.coyote.http11.Http11Protocol
를 org.apache.coyote.http11.Http11NioProtocol으로 변경하여 서비스를 테스트 해보았다. 

잘된다 좀더 모니터링 해봐야겠지만 Http11NioProtocol가는것이 좋은것 같다.

Java Non Blocking Connector는 SSL Handshake을 Non blocking 지원해서 잘되는것 같다.


# 참조 
-----
* [understanding-tomcat-nio](https://dzone.com/articles/understanding-tomcat-nio)
* [apache bugzilla](https://bz.apache.org/bugzilla/show_bug.cgi?id=45516)
* [is-an-outputstream-in-java-blocking-sockets](https://stackoverflow.com/questions/10574596/is-an-outputstream-in-java-blocking-sockets)
* [tomcat http](https://tomcat.apache.org/tomcat-7.0-doc/config/http.html)
