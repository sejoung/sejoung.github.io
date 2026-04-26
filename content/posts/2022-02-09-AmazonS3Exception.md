---
layout: post
title: "AmazonS3Exception 처리"
date: 2022-02-09 17:50 +0900
comments: true
tags : ["java-aws-sdk","AmazonS3Exception","spring","config","server"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# AmazonS3Exception 처리

spring-boot-starter-actuator 에서 /actuator/health 호출시에 config server의 경우 아래 처럼 repositories에 대한 설정을 하거나

```yaml
spring:
  cloud:
    config:
      server:
        health:
          repositories:
            myservice:
              label: mylabel
            myservice-dev:
              name: myservice
              profiles: development
```
`spring.cloud.config.server.health.enabled=false` 설정을 통해서 처리 않하도록 할수 있다.

org.springframework.cloud.config.server.config.ConfigServerHealthIndicator 참고

```java
 @PostConstruct
    public void init() {
        if (this.repositories.isEmpty()) {
            this.repositories.put("app", new ConfigServerHealthIndicator.Repository());
        }
    }
```

여러번 찾는 경우는 org.springframework.cloud.config.server.environment.AwsS3EnvironmentRepository 에서 찾을수 있는데
s3에서 파일을 찾을때 properties, yml, json 순으로 찾도록 되어 있어서 properties가 아니면 여러번 찾는다.

```java
    private S3ConfigFile getS3ConfigFile(S3ObjectIdBuilder s3ObjectIdBuilder, String keyPrefix) {
        try {
            S3Object properties = this.s3Client.getObject(new GetObjectRequest(s3ObjectIdBuilder.withKey(keyPrefix + ".properties").build()));
            return new PropertyS3ConfigFile(properties.getObjectMetadata().getVersionId(), properties.getObjectContent());
        } catch (Exception var8) {
            try {
                S3Object yaml = this.s3Client.getObject(new GetObjectRequest(s3ObjectIdBuilder.withKey(keyPrefix + ".yml").build()));
                return new YamlS3ConfigFile(yaml.getObjectMetadata().getVersionId(), yaml.getObjectContent());
            } catch (Exception var7) {
                try {
                    S3Object json = this.s3Client.getObject(new GetObjectRequest(s3ObjectIdBuilder.withKey(keyPrefix + ".json").build()));
                    return new JsonS3ConfigFile(json.getObjectMetadata().getVersionId(), json.getObjectContent());
                } catch (Exception var6) {
                    return null;
                }
            }
        }
    }

```

# 참고

------

* [spring-cloud-config health_indicator](https://cloud.spring.io/spring-cloud-config/reference/html/#_health_indicator)
