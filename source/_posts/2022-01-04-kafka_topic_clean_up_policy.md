---
layout: post
title: "카프카 send 시 에러"
date: 2022-01-04 22:02 +0900
comments: true
tags : ["kafka","producer","clean up policy","InvalidRecordException","This record has failed the validation on broker and hence will be rejected."]
categories : ["kafka"]
sitemap :
changefreq : daily
priority : 1.0
--->
# 카프카 send 시 에러

`org.apache.kafka.common.InvalidRecordException: This record has failed the validation on broker and hence will be rejected.`

위에 에러메시지시가 발생하면서 send가 되지 않았다 확인해 보니 kafka topic에 clean up policy 값을 주지 않았더니 위에 오류가 났다
kafka 디폴트 정책은 delete 이다. msk에서는 이설정이 정상적으로 동작하지 않았다. 그래서 명시적으로 delete를 셋팅했더니 정상 동작했다

# 참고자료

-----
* [kafka producer cannot validate](https://stackoverflow.com/questions/61199665/kafka-producer-cannot-validate-record-wihout-pk-and-return-invalidrecordexceptio)
* [topic-configs](https://docs.confluent.io/platform/current/installation/configuration/topic-configs.html)
* [topic configs cleanup.policy](https://kafka.apache.org/documentation/#topicconfigs_cleanup.policy)
