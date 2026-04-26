---
layout: post
title: "톰캣 DataSource user 정보 암호화 시키기"
date: 2018-07-17 10:55:00 +0900
comments: true
tags : ["tomcat","tomcat datasource"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 톰캣 DataSource user 정보 암호화 시키기

[encrypting-passwords-in-tomcat](http://www.jdev.it/encrypting-passwords-in-tomcat)을 참고로 톰캣 DataSource user 정보 암호화 시키는 소스를 만들어 보았다.

위에 나와 있는 방법은 tomcat jdbc가 포함된 7.0 이상 버전에서만 작동해서 
톰캣 API를 참조로 tomcat DBCP 수정해서 암호화 하도록 만들었다.

첨부한 jar파일을 톰캣 lib 밑에 넣어주고 사용하면 된다
톰캣 7.0.55 버전과 6.0.41버전으로 테스트를 해보았다.

Resource 설정 

톰캣 7.0 이상 
 
```xml

<Resource name="jdbc/TestDB"
          factory="com.github.sejoung.support.tomcat.jdbc.EncryptedDataSourceFactory"
          auth="Container"
          type="javax.sql.DataSource"
          maxActive="100"
          maxIdle="30"
          maxWait="10000"
          secretKey="key"
          username="808233982b9c435fb8a3331634a3c48b"
          password="3b8dcdcf348d8b466915f66c30003e95"
          driverClassName="org.mariadb.jdbc.Driver"
          url="jdbc:mariadb://localhost:3306/test"/> 
          
```

톰캣 7.0이하 
 
```xml

<Resource name="jdbc/TestDB"
          factory="com.github.sejoung.support.tomcat.jdbc.EncryptedDataSourceFactoryDbcp"
          auth="Container"
          type="javax.sql.DataSource"
          maxActive="100"
          maxIdle="30"
          maxWait="10000"
          secretKey="key"
          username="808233982b9c435fb8a3331634a3c48b"
          password="3b8dcdcf348d8b466915f66c30003e95"
          driverClassName="org.mariadb.jdbc.Driver"
          url="jdbc:mariadb://localhost:3306/test"/>

 ```

pom.xml에 추가후에 위에 처럼 사용가능

```xml

<dependency>
    <groupId>com.github.sejoung</groupId>
    <artifactId>tomcat-jdbc-encrypt</artifactId>
    <version>1.6</version>
</dependency>

```
[mvnrepository tomcat-jdbc-encrypt](https://mvnrepository.com/artifact/com.github.sejoung/tomcat-jdbc-encrypt) 링크의 최신 버전을 쓰시면 됩니다.

사용법

```
USAGE: java -jar tomcat-jdbc-encrypt-[version].jar [encrypt,decrypt] [secretKey] [string-to-encrypt,string-to-decrypt]

```

```
java -jar tomcat-jdbc-encrypt-1.6.jar encrypt key 1

java -jar tomcat-jdbc-encrypt-1.6.jar decrypt key eb77d942479a6b2e44841d653175e8a3

```

# 참조 
-----
* [encrypting-passwords-in-tomcat](http://www.jdev.it/encrypting-passwords-in-tomcat)
* [tomcat-jdbc-encrypt 소스](https://github.com/sejoung/tomcat-jdbc-encrypt)
* [mvnrepository tomcat-jdbc-encrypt](https://mvnrepository.com/artifact/com.github.sejoung/tomcat-jdbc-encrypt)
