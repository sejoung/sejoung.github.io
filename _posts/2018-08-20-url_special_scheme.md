---
layout: post
title: "url_special_scheme.md"
date: 2018-08-20 17:36 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### url special scheme

음 먼저 이것은 아래 코드에서 부터 찾게 되었다. url호출시에 //앞에 url special scheme를 기록하지 않아도 
기존 브라우져에서 로딩했던 스키마로 자동으로 된다고 하는것이 였다. 기존 브라우져가 http로 호출하면// 앞에 http가 붙는다는 식

```javascript

    $.ajax({
        type : "GET"
        , url : "//www.naver.com"
        , success : function(data) {
             console.log('성공',data)
        }
        , error : function (e) {
            console.log('에러',e)
        }
    });

```

위에 형태가 처음 보는 형태였다 그럼 이것이 정확한 url 표준인지 확인하는데 필요했다.

그럼 간단한 sample을 만들어서 브라우져 마다 테스트를 진행 하였다. 위에 코드는 에러가 나는데 
다른건 보지 않고 네트워크 탭에서 호출하는 프로토콜만 관찰 하였다.

[jsfiddle sample](http://jsfiddle.net/sanaes/zrad4sn0/)에 넣어서 테스트를 진행 했는데 

크롬에서는 http나 https를 호출을 해주고 있었고 edge는 아에 호출이 되지 않음

음 이게 표준이 아닌데 어떻게 쓰이고 있는지 확인 하기 위해 검색어를 찾아 봄 protocol-relative-url이라는 

검색어를 통해 여러가지 내용을 찾아 볼 수 있게 되었다.

일단 표준에 일환이라는 내용은 url 스펙을 찾아 보아도 아무 내용이 없고 //앞에는 scheme형태가 와야 된다 완벽한 url이라는 것은 이런 내용만 있다.

```

프로토콜 기준 URL 은 웹 페이지의 하이퍼 링크 에서만 의미 가 있습니다. 
일단 종이에 인쇄되면 더 이상 프로토콜에 기반하지 않습니다. 즉, 사람 //www.example.com/이 종이를 읽고 웹 브라우저에서 입력하면 브라우저는 모방 할 선행 프로토콜이 없습니다. 
인터넷 익스플로러 11 , 파이어 폭스 와 구글 크롬 윈도우에서, 브라우저는 항상 HTTP를 가정합니다.

```

위에 내용처럼에 이슈가 존재하고

사실 그런 경우는 힘들지만 아래 처럼 http만 서비스할때 선행 프로토콜이 https일때는 문제가 생기게 됩니다.

```
//americanbilliardclub.com/about/history/

http://americanbilliardclub.com/about/history/

```
그리고 굳이 스크립트에서 ajax로 통신을 할때 http와 https를 동시에 사용 가능하다면 보안을 위해 https를 사용하는것이 좋지 않을까요?

위에 내용 URL 표준에는 없지만 Uniform Resource Identifier (URI) 표준인 [rfc3986#section-4.2](https://tools.ietf.org/html/rfc3986#section-4.2)에서 명시하고 있습니다.

위에 내용은 잘 찾아 보지 못하고 작성한것 입니다.
 
그러나 URI를 명시적으로 쓸수 있는 곳은 HTML에서 img element에 SRC attribute 

그리고 a 나 link element에 href attribute

하지만 위에 내용처럼 여러가지 문제를 발생시킬수 있어서 명시하는것이 좋을 것 같습니다.


# 참조 
-----
* [special-scheme](https://url.spec.whatwg.org/#special-scheme)
* [Protocol-relative_URL](https://en.wikipedia.org/wiki/Wikipedia:Protocol-relative_URL)
* [jsfiddle sample](http://jsfiddle.net/sanaes/zrad4sn0/)
* [stop-using-the-protocol-relative-url](https://www.jeremywagner.me/blog/stop-using-the-protocol-relative-url/)
* [rfc3986#section-4.2](https://tools.ietf.org/html/rfc3986#section-4.2)
* [html5 urls](https://www.w3.org/TR/2011/WD-html5-20110405/urls.html#valid-non-empty-url-potentially-surrounded-by-spaces)