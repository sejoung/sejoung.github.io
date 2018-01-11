---
layout: post
title: "_termvectors"
date: 2018-01-11 14:00:00 +0900
comments: false
---

### inverted index

elasticsearch를 사용해 키워드 검색을 활용해서 서비스를 만들려고 할때
은전한닢(오픈소스 한국어 형태소 분석기)을 통해 인덱스를 만들어서 검색을 활용하고 있는데
만들어진 인덱스에 term(token)을 검색해야 될일이 생겨서 검색하는 찾았다.

```
GET /twitter/tweet/1/_termvectors

GET /twitter/tweet/1/_termvectors?fields=message

```

위에 형태되로 하면 되었다 logstash DB에 있는 값을 넣었는데 id를 직접 지정하지 않았다.
그래서 해당 id를 검색하려고 아래의 쿼리를 실행시켜서 요청을 했다.


```
# 인덱스 조회

GET _cat/indices?v&pretty

GET /인덱스명/_search
{
  "query": {
    "match": {"pnm":"바지"}
  }
}

GET 인덱스명/타입명/_id/_termvectors?fields=필드명

```

한번에 모든 term값을 가지고 오고 싶었는데 아래 discuss.elastic링크에서 보면
해당 값을 가지고 올수있는 api 제공되지 않는다고 한다.


# 참조 
-----

* [검색엔진이 데이터를 다루는 법 김종민](https://www.slideshare.net/kjmorc/ss-80803233)
* [은전한닢 프로젝트](http://eunjeon.blogspot.kr/)
* [discuss.elastic](https://discuss.elastic.co/t/term-vector-of-all-documents/60128/4)
* [elasticsearch_termvectors](https://www.elastic.co/guide/en/elasticsearch/reference/6.1/docs-termvectors.html)
