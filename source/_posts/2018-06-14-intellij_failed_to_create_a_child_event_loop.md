---
layout: post
title: "intellij_failed_to_create_a_child_event_loop"
date: 2018-06-14 19:00:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### intellij idea failed to create a child event loop

일단 회사 인턴분 PC에서 java 클래스를 하나 생성시켜서 main을 만들고 hello world를 찍을려고 하는데

```

Error: Failed to create a child event loop

```

위에 에러 메시지가 보임 해당 에러를 검색하니 아래의 쓰레드가 나옴

봤는데 바이러스 프로그램 문제인가 해서 에러가 왜 나는지 로그 파일을 확인해봄 

인텔리 제이 로그 파일 경로를 몰라서 제일 처음엔 인스톨한 폴더로 들어감 그담에 아래 파일을 확인

```

C:\Program Files\JetBrains\IntelliJ IDEA 2018.1.2\bin\idea.properties

-----------------------------------------


#---------------------------------------------------------------------
# Uncomment this option if you want to customize path to IDE system folder. Make sure you're using forward slashes.
#---------------------------------------------------------------------
# idea.system.path=${user.home}/.IntelliJIdea/system

#---------------------------------------------------------------------
# Uncomment this option if you want to customize path to user installed plugins folder. Make sure you're using forward slashes.
#---------------------------------------------------------------------
# idea.plugins.path=${idea.config.path}/plugins

#---------------------------------------------------------------------
# Uncomment this option if you want to customize path to IDE logs folder. Make sure you're using forward slashes.
#---------------------------------------------------------------------
# idea.log.path=${idea.system.path}/log

```

위에처럼 시스템 path 아래의 로그 폴더가 존재함 들어가서 로그 확인

```

2018-06-14 17:23:24,497 [  31074]   INFO - rains.ide.BuiltInServerManager - failed to create a child event loop 
java.lang.IllegalStateException: failed to create a child event loop
	at io.netty.util.concurrent.MultithreadEventExecutorGroup.<init>(MultithreadEventExecutorGroup.java:88)
	at io.netty.util.concurrent.MultithreadEventExecutorGroup.<init>(MultithreadEventExecutorGroup.java:58)
	at io.netty.util.concurrent.MultithreadEventExecutorGroup.<init>(MultithreadEventExecutorGroup.java:47)
	at io.netty.channel.MultithreadEventLoopGroup.<init>(MultithreadEventLoopGroup.java:59)
	at io.netty.channel.nio.NioEventLoopGroup.<init>(NioEventLoopGroup.java:77)
	at io.netty.channel.nio.NioEventLoopGroup.<init>(NioEventLoopGroup.java:72)
	at io.netty.channel.nio.NioEventLoopGroup.<init>(NioEventLoopGroup.java:59)
	at com.intellij.util.io.NettyKt.MultiThreadEventLoopGroup(netty.kt:311)
	at org.jetbrains.io.BuiltInServer.start(BuiltInServer.java:73)
	at org.jetbrains.ide.BuiltInServerManagerImpl.lambda$startServerInPooledThread$0(BuiltInServerManagerImpl.java:101)
	at com.intellij.openapi.application.impl.ApplicationImpl$1.run(ApplicationImpl.java:310)
	at java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)
	at java.util.concurrent.FutureTask.run(FutureTask.java:266)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
	at java.lang.Thread.run(Thread.java:745)
Caused by: io.netty.channel.ChannelException: failed to open a new selector
	at io.netty.channel.nio.NioEventLoop.openSelector(NioEventLoop.java:177)
	at io.netty.channel.nio.NioEventLoop.<init>(NioEventLoop.java:151)
	at io.netty.channel.nio.NioEventLoopGroup.newChild(NioEventLoopGroup.java:127)
	at io.netty.channel.nio.NioEventLoopGroup.newChild(NioEventLoopGroup.java:36)
	at io.netty.util.concurrent.MultithreadEventExecutorGroup.<init>(MultithreadEventExecutorGroup.java:84)
	... 15 more
Caused by: java.io.IOException: Unable to establish loopback connection
	at sun.nio.ch.PipeImpl$Initializer.run(PipeImpl.java:94)
	at sun.nio.ch.PipeImpl$Initializer.run(PipeImpl.java:61)
	at java.security.AccessController.doPrivileged(Native Method)
	at sun.nio.ch.PipeImpl.<init>(PipeImpl.java:171)
	at sun.nio.ch.SelectorProviderImpl.openPipe(SelectorProviderImpl.java:50)
	at java.nio.channels.Pipe.open(Pipe.java:155)
	at sun.nio.ch.WindowsSelectorImpl.<init>(WindowsSelectorImpl.java:127)
	at sun.nio.ch.WindowsSelectorProvider.openSelector(WindowsSelectorProvider.java:44)
	at io.netty.channel.nio.NioEventLoop.openSelector(NioEventLoop.java:175)
	... 19 more
Caused by: java.net.ConnectException: Connection refused: connect
	at sun.nio.ch.Net.$$YJP$$connect0(Native Method)
	at sun.nio.ch.Net.connect0(Net.java)
	at sun.nio.ch.Net.connect(Net.java:454)
	at sun.nio.ch.Net.connect(Net.java:446)
	at sun.nio.ch.SocketChannelImpl.connect(SocketChannelImpl.java:648)
	at java.nio.channels.SocketChannel.open(SocketChannel.java:189)
	at sun.nio.ch.PipeImpl$Initializer$LoopbackConnector.run(PipeImpl.java:127)
	at sun.nio.ch.PipeImpl$Initializer.run(PipeImpl.java:76)
	... 27 more

```

위에처럼 에러가 나고 있음 위에처럼 rains.ide.BuiltInServerManager를 어떤것이 사용하는지 정상 로그에서 확인

```

2018-06-14 16:50:25,889 [  10884]   INFO - rains.ide.BuiltInServerManager - built-in server started, port 63343 

```

정상일때 로그에서는 built-in server에서 사용한다고 함 해당 서버에 대한 설명은 아래 참조를 확인

그래서 소켓에러가 나길래 서버가 그럼 기동중인지도 확인함 

``` 
netstat -na 

```

실행중이지 않음 에러가 났으니 당연한건가 그래서 이상해서 전체 서비스가 꼬였는지 확인 인텔리 제이 파일을 전체 삭제후 재설치

에러남 그래서 백신을 확인 백신에서 방화벽이랑 셋팅이 안됨 그래서 백신을 업데이트 하고 다시 인텔리제이를 설치후 실행 정상적임

결론적으로는 백신이 문제였던것 같음 ㅡㅡ avast 잊지 않겠다. ㅋ


# 참조 
-----
* [stackoverflow](https://stackoverflow.com/questions/27506788/failed-to-create-a-child-event-loop?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa)
* [idea php-built-in-web-server](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)
