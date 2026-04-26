---
layout: post
title: "com.amazonaws.SdkClientException: Failed to connect to service endpoint: 에러"
date: 2021-08-03 19:19 +0900
comments: true
tags : ["EC2 metadata","EC2MetadataUtils","warn","Fail to retrieve token","com.amazonaws.SdkClientException: Failed to connect to service endpoint"]
categories : ["java"]
sitemap :
changefreq : daily
priority : 1.0
--->
# com.amazonaws.SdkClientException: Failed to connect to service endpoint: 에러

```
2020-05-22 17:41:09.647  WARN 47453 --- [           main] i.InstanceMetadataServiceResourceFetcher : Fail to retrieve token 

com.amazonaws.SdkClientException: Failed to connect to service endpoint: 
	at com.amazonaws.internal.EC2ResourceFetcher.doReadResource(EC2ResourceFetcher.java:100) ~[aws-java-sdk-core-1.11.787.jar:na]
	at com.amazonaws.internal.InstanceMetadataServiceResourceFetcher.getToken(InstanceMetadataServiceResourceFetcher.java:91) ~[aws-java-sdk-core-1.11.787.jar:na]
	at com.amazonaws.internal.InstanceMetadataServiceResourceFetcher.readResource(InstanceMetadataServiceResourceFetcher.java:69) ~[aws-java-sdk-core-1.11.787.jar:na]
	at com.amazonaws.internal.EC2ResourceFetcher.readResource(EC2ResourceFetcher.java:66) ~[aws-java-sdk-core-1.11.787.jar:na]
	at com.amazonaws.util.EC2MetadataUtils.getItems(EC2MetadataUtils.java:402) ~[aws-java-sdk-core-1.11.787.jar:na]
	at com.amazonaws.util.EC2MetadataUtils.getData(EC2MetadataUtils.java:371) ~[aws-java-sdk-core-1.11.787.jar:na]
	at org.springframework.cloud.aws.context.support.env.AwsCloudEnvironmentCheckUtils.isRunningOnCloudEnvironment(AwsCloudEnvironmentCheckUtils.java:38) ~[spring-cloud-aws-context-2.2.1.RELEASE.jar:2.2.1.RELEASE]
	at org.springframework.cloud.aws.context.annotation.OnAwsCloudEnvironmentCondition.matches(OnAwsCloudEnvironmentCondition.java:37) ~[spring-cloud-aws-context-2.2.1.RELEASE.jar:2.2.1.RELEASE]
	at org.springframework.context.annotation.ConditionEvaluator.shouldSkip(ConditionEvaluator.java:108) ~[spring-context-5.2.6.RELEASE.jar:5.2.6.RELEASE]
	at org.springframework.context.annotation.ConfigurationClassParser.processConfigurationClass(ConfigurationClassParser.java:225) ~[spring-context-5.2.6.RELEASE.jar:5.2.6.RELEASE]
	at org.springframework.context.annotation.ConfigurationClassParser.processImports(ConfigurationClassParser.java:599) ~[spring-context-5.2.6.RELEASE.jar:5.2.6.RELEASE]
	at org.springframework.context.annotation.ConfigurationClassParser.access$800(ConfigurationClassParser.java:110) ~[spring-context-5.2.6.RELEASE.jar:5.2.6.RELEASE]
	at org.springframework.context.annotation.ConfigurationClassParser$DeferredImportSelectorGroupingHandler.lambda$processGroupImports$1(ConfigurationClassParser.java:811) ~[spring-context-5.2.6.RELEASE.jar:5.2.6.RELEASE]
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1540) ~[na:na]

```

EC2 메타데이터 서비스는 애플리케이션이 AWS 환경에서 실행 중인지 여부를 식별하는 데 권장되는 방법입니다. 

2.3.0 버전에서 cloud.aws.instance.data.enabled 를 도입했습니다.

결론은 아래처럼 로그레벨을 ERROR로 바꾸는 것입니다.

logging.level.com.amazonaws.util.EC2MetadataUtils=ERROR 


# 참고자료
-----
* [EC2 metadata resolution related exception thrown when running application locally](https://github.com/spring-cloud/spring-cloud-aws/issues/556)
