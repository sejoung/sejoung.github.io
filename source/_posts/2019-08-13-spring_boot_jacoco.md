---
layout: post
title: "sonarqube에 코드 커버리지 나타내기"
date: 2019-08-13 16:24 +0900
comments: true
tags : ["springboot","jacoco","sonarqube"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
 
## sonarqube에 코드 커버리지 나타내기

특별히 해줄것은 없고 maven 프로젝트에 jacoco 플러그인만 등록해주면 잘나온다.

```xml 

    <plugin>
        <groupId>org.jacoco</groupId>
        <artifactId>jacoco-maven-plugin</artifactId>
        <version>0.8.4</version>
        <executions>
            <execution>
                <id>default-prepare-agent</id>
                <goals>
                    <goal>prepare-agent</goal>
                </goals>
            </execution>
            <execution>
                <id>default-report</id>
                <phase>prepare-package</phase>
                <goals>
                    <goal>report</goal>
                </goals>
            </execution>
        </executions>
    </plugin>

```
위에 플러그인만 잘 등록하자

# 참조
-----





