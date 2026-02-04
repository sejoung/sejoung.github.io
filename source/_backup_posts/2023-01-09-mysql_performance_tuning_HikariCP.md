---
layout: post
title: "mysql (mariaDB) HikariCP 성능 튜닝"
date: 2023-01-09 18:11 +0900
comments: true
tags : ["mysql","mariaDB","performance tuning","성능","HikariCP","Aurora MySQL"]
categories : ["DB"]
sitemap :
  changefreq : daily
  priority : 1.0
---

# mysql (mariaDB) HikariCP 성능 튜닝
## HikariCP 설정

```yaml

spring:
    datasource:
      hikari:
        data-source-properties:
            cachePrepStmts: true
            prepStmtCacheSize: 250
            prepStmtCacheSqlLimit: 2048
            useServerPrepStmts: true
            useLocalSessionState: true
            rewriteBatchedStatements: true
            cacheResultSetMetadata: true
            cacheServerConfiguration: true
            elideSetAutoCommits: true
            maintainTimeStats: false

```

# 참조

-----

* [HikariCP MySQL-Configuration](https://github.com/brettwooldridge/HikariCP/wiki/MySQL-Configuration)
* [Connector/J Performance Gems slide](https://cdn.oreillystatic.com/en/assets/1/event/21/Connector_J%20Performance%20Gems%20Presentation.pdf)
