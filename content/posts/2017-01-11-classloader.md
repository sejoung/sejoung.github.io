---
layout: post
title: "Tomcat의 Class Loader HOW-TO"
date: 2017-01-11 10:20:00 +0900
comments: true
tags : ["classloader","tomcat","java"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

톰캣이 시작할때 아래 같이 부모 자식 관계로 구성되는 클래스로더 집합을 생성합니다. 


           Bootstrap
              |
            System
              |
           Common
	       /     \
      Webapp1   Webapp2 ...

	  
	  
각각의 클래스로더에 대해서 설명을 하면 

1. Bootstrap - JVM에서 제공되는 클래스들과 $JAVA_HOME/jre/lib/ext 에 존재 하는 JAR 파일 및 클래스가 포함되어 있습니다.

2. System - CLASSPATH 환경변수로 $CATALINA_HOME/bin/catalina.sh or %CATALINA_HOME%\bin\catalina.bat 에서 설정 할 수 있다.

3. Common - 톰켓에 전역으로 로딩되는 클래스로더 $CATALINA_BASE/conf/catalina.properties 에서 선언하고 있거나 아래의 폴더에 JAR파일이나 압축이 풀린 클래스와 리소스들이다.
 * $CATALINA_BASE/lib
 * $CATALINA_HOME/lib

4. WebappX - 해당 클래스로더는 웹앱 하나당 하나씩 생성이 됩니다. 
 * /WEB-INF/classes
 * /WEB-INF/lib

 
* Bootclass는 java 에 의해 로딩되면 JVM이 초기화되면서 필요한 클래스들로 이루어져 있다.System.getProperty("sun.boot.class.path") 와 System.getProperty("java.ext.dirs")에서 확인할 수 있다.

* JVM초기화 과정이 끝나면 java는 java.lang.ClassLoader를 통해서 어플리케이션 클래스들을 로딩한다. System.getProperty("java.class.path")에서 값을 확인할 수 있다.

# 참조 
-----

* [tomcat 8.5 class-loader-howto](http://tomcat.apache.org/tomcat-8.5-doc/class-loader-howto.html)
 
* [문제발생시 어떤 클래스가 로드되는지 알아내기](http://greatkim91.tistory.com/43)


