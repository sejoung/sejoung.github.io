---
layout: post
title: "elasticsearch_kibana_sample"
date: 2018-04-26 14:00:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### elasticsearch_kibana_sample

이번 데이터 및 실습용 스트립트는 메가존에서 진행한 megazone elastic day(2018/04/25)에서 공유된 내용을 바탕으로 작성하였습니다.

아래의 repository에가서 보면 스크립트와 order-list json 데이터가 존재한다.

```
{
	"is_successful_order": true,
	"user_email": "btumulty6@pbs.org",
	"user_firstname": "Bealle",
	"payment_sum": 504800,
	"user_lastname": "Tumulty",
	"order_datetime": "2017-11-28T08:54:44.551Z",
	"user_age": 30,
	"user_gender": "M",
	"payment_card_no": "30012847700233",
	"items_count": 12,
	"user_id": "7",
	"payment_card_type": "diners-club-carte-blanche",
	"order_id": "1",
	"items": [{
		"item_id": "365",
		"item_type": "Climbing Accessories",
		"item_price": 23600,
		"item_name": "Granite Chalk Bag",
		"is_applied_coupon": true,
		"item_category": "Mountaineering Equipment"
	}, {
		"item_id": "644",
		"item_type": "Eyewear",
		"item_price": 5300,
		"item_name": "Polar Wave",
		"is_applied_coupon": false,
		"item_category": "Personal Accessories"
	}, {
		"item_id": "522",
		"item_type": "Lanterns",
		"item_price": 21600,
		"item_name": "EverGlow Double",
		"is_applied_coupon": false,
		"item_category": "Camping Equipment"
	}, {
		"item_id": "91",
		"item_type": "Sleeping Bags",
		"item_price": 152900,
		"item_name": "Hibernator Camp Cot",
		"is_applied_coupon": false,
		"item_category": "Camping Equipment"
	}, {
		"item_id": "392",
		"item_type": "Watches",
		"item_price": 51300,
		"item_name": "TX",
		"is_applied_coupon": true,
		"item_category": "Personal Accessories"
	}, {
		"item_id": "236",
		"item_type": "Binoculars",
		"item_price": 5600,
		"item_name": "Opera Vision",
		"is_applied_coupon": true,
		"item_category": "Personal Accessories"
	}, {
		"item_id": "435",
		"item_type": "Lanterns",
		"item_price": 62100,
		"item_name": "Firefly Lite",
		"is_applied_coupon": true,
		"item_category": "Camping Equipment"
	}, {
		"item_id": "81",
		"item_type": "Cooking Gear",
		"item_price": 60900,
		"item_name": "TrailChef Utensils",
		"is_applied_coupon": false,
		"item_category": "Camping Equipment"
	}, {
		"item_id": "265",
		"item_type": "Packs",
		"item_price": 8900,
		"item_name": "Canyon Mule Climber Backpack",
		"is_applied_coupon": false,
		"item_category": "Camping Equipment"
	}, {
		"item_id": "621",
		"item_type": "Navigation",
		"item_price": 42700,
		"item_name": "Trail Star",
		"is_applied_coupon": true,
		"item_category": "Personal Accessories"
	}, {
		"item_id": "857",
		"item_type": "Safety",
		"item_price": 12100,
		"item_name": "Granite Signal Mirror",
		"is_applied_coupon": false,
		"item_category": "Mountaineering Equipment"
	}, {
		"item_id": "731",
		"item_type": "Knives",
		"item_price": 57800,
		"item_name": "Edge Extreme",
		"is_applied_coupon": false,
		"item_category": "Personal Accessories"
	}],
	"payment_method": "CREDIT_CARD"
}

```

아래 처럼 형태인데 items를 보면 배열 형태이다 이것을 elasticsearch에 올릴려고 할때 배열형태를 받을수 있게 인덱스를 변경 시켜야 된다.

그래서 먼저 키바나에서 아래 스크립트를 실행시키면 인덱스를 구성한다. 

```
PUT /s3-order-list
{
  "mappings": {
    "doc": {
      "properties": {
        "items": {
          "type": "nested"
        }
      }
    }
  }
}

```

실행 후에 아래의 데이터가 보일것이다.

```
{
  "acknowledged": true,
  "shards_acknowledged": true
}

```
키바나에서 인덱스 생성확인

```

GET _cat/indices

```
또다시 확인할것 elasticsearch에 endpoint http port를 확인 크롬에 주소를 입력하면 아래의 값을 확인할수 있음

```

{
  "name" : "node-2",
  "cluster_name" : "test-ELK",
  "cluster_uuid" : "jhdQdvsoS26iz0wkpS6a3w",
  "version" : {
    "number" : "5.4.1",
    "build_hash" : "2cfe0df",
    "build_date" : "2017-05-29T16:05:51.443Z",
    "build_snapshot" : false,
    "lucene_version" : "6.5.1"
  },
  "tagline" : "You Know, for Search"
}

```

다음에 할것은 logstash를 실행 시켜서 아래의 데이터를 입력할려고 한다.

메가존 교육에서는 s3에 있는것을 가지고 오는것을 실습 하였지만 없어서 input데이터를 log 파일형태로 저장하여 가지고 오는 방법으로 실습할 예정이다.

모든것은 logstash home을 압축 푼 폴더 기준으로 설명할 예정이다.

예) /data/logstash-6.2.4 

logstash plugin 설치 

file에서 값을 가지고 오기 때문에 file input 플러그인을 설치 예정임 설치는 간단하다.

```
bin/logstash-plugin install logstash-input-file

bin/logstash-plugin install logstash-codec-json_lines
 
```
x-pack을 설치해서 사용자 패스워드를 입력함

6점대에서 아래 처럼 해보고 싶음 

```
input {
    file {
        codec => "json_lines"
        path => "/data/order-list/*.json"
    }
}
filter {
}
output {
    elasticsearch {
        hosts => [ "<Elasticsearch EndPoint>" ]
        user => "elastic"
        password => "<password>"
        index => "s3-order-list"
        manage_template => false
    }
}

```

5점대 버전이라서 안되는지 이렇게 실행시킴 위에 인덱스는 삭제함 자동 맵핑사용

```
input {
    file {
        path => "/home/app/install/source/order-list/*.json"
        start_position => "beginning"
        sincedb_path => "/dev/null"
        codec => json
    }
}
filter {
}
output {
    elasticsearch {
         hosts => [ "<Elasticsearch EndPoint>" ]
        user => "elastic"
        password => "<password>"
        index => "s3-order-list"
    }
    stdout { codec => rubydebug }
}

```

아래 처럼 실행

```

bin/logstash -f logstash.conf
 
```


discover 메뉴에 데이터가 나오지 않는데 이런것은 management 메뉴에 Kibana 에 Index Patterns을 등록해주면 된다 여기서 시간 필드를 지정할수 있는데 @timestamp는 insert 시점에 시간이 자동으로 들어간다

이렇게 해주면 discover 메뉴 데이터가 나온다 만약 나오지 않으면 검색 시간 설정을 바꿔주면 된다 이것은 우측 상단에 존재 한다.

Saved Search는 discover 메뉴에서 검색 필드를 통해서 검색을 한후 save 버튼을 눌러서 저장할수 있다.

Scripted Field는 management 메뉴에 Kibana 에 Index Patterns을 보면 왼쪽에 인덱스들이 있다. 거기에 인덱스를 선택하고 scripted fields 탭이 존재한다 거기서 Add Scripted Field 버튼을 눌러주면 된다.

Timelion은 저장할때 보면 Save current expression as Kibana dashboard panel이것으로 선택하고 저장해야 dashboard에서 사용할수 있다.


# 참조 
-----
* [sejoung github](https://github.com/sejoung/elasticsearch_kibana_sample)
* [플러그인 설치](https://yunseul-light.blogspot.kr/2017/08/logstash-logstash-logstash-plugin.html)
* [input-plugins](https://www.elastic.co/guide/en/logstash/current/input-plugins.html)
* [filter-plugins](https://www.elastic.co/guide/en/logstash/current/filter-plugins.html)
* [output-plugins](https://www.elastic.co/guide/en/logstash/current/output-plugins.html)

