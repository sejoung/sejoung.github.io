---
layout: post
title: "access log 분석"
date: 2018-02-20 11:07:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### access log 분석

갑자기 DB에서 처리량이 밀리면서 리플리케이션이 밀리기 시작했다.
WAS쪽 모니터링을 scourt를 통해서 하고 있는데 was 쪽에서는 특별한 장애 상황이 감지 되지 않았다.
scouter agent에서 2초마서 서버로 전송하니 초단위에 부하량은 볼수가 없다고 판단(?) 
초단위에 정보를 보고 싶어하는 니즈가 생김 그래서 access log 카운트를 할려고 한다.

시간대별 파일이 생기니 아래처럼 분단위에 파일을 하나 만들어서 하고 싶은 범위를 지정했다.

```
grep "08/Feb/2018:15:01" access.log-20180208-15 >> was01.txt 

```

그리고 아래처럼 초단위로 카운트를 찍어서 확인을 해보았다

```

grep "08/Feb/2018:15:01" was01.txt  | cut -d[ -f2 | cut -d] -f1 | awk -F: '{print $2":"$3":"$4}' | sort -nk1 -nk2 -nk3 | uniq -c | awk '{ if ($2 > 10) print $0}'

```



# 참조 
-----

* [view-level-of-traffic-with-apache-access-log](https://www.inmotionhosting.com/support/website/server-usage/view-level-of-traffic-with-apache-access-log)