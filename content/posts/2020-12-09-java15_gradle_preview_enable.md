---
layout: post
title: "java 15 preview 기능 테스트를 위한 gradle 설정"
date: 2020-12-09 10:50 +0900
comments: true
tags : ["java15","preview","gradle","--enable-preview"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## java 15 preview 기능 테스트를 위한 gradle 설정

java preview 기능은 jep12로써 java12버전 부터 도입되었다. 
해당 preview 기능을 사용하려면 java, javac,javadoc, jshell, jlink 명령시에 `--enable-preview` 인자값을 주는것이다.

```

java Foo                            // Do not enable any preview features
java --enable-preview Foo           // Enable all preview features of Java SE 15
java --enable-preview -jar App.jar  // Enable all preview features of Java SE 15
java --enable-preview -m App        // Enable all preview features of Java SE 15

```

gradle에서 해당 기능을 할성화 시켜보려고 한다.

```
plugins {
    id 'java'
}

java {
    sourceCompatibility = JavaVersion.VERSION_15
    targetCompatibility = JavaVersion.VERSION_15
}

compileJava {
    options.compilerArgs.add("--enable-preview")
}

compileTestJava {
    options.compilerArgs.add("--enable-preview")
}

group 'io.github.sejoung'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.6.0'
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine'
}

test {
    useJUnitPlatform()
    jvmArgs("--enable-preview")
}

```

그럴때 위처럼 설정을 해볼수 있다. 

`compileJava, compileTestJava` 시점에 `--enable-preview` 추가 하고

test 에 `jvmArgs("--enable-preview")`를 추가하여 ide에서 테스트 실행시에 문제 없이 동작하게 할수있다.

# 참조
-----
* [java15 test source](https://github.com/sejoung/java15)
* [JEP 12: Preview Features](http://openjdk.java.net/jeps/12)
