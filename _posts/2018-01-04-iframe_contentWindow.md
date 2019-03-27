---
layout: post
title: "IFrame contentWindow Property"
date: 2018-01-04 19:54:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

## IFrame contentWindow Property

오늘 iframe에서 접근 제어를 보다가 contentWindow라는 Property를 확인하게 되었다.
iframe 밖에서 안쪽의 스크립트를 컨트롤 할려고 할때 사용했었다.
예제 코드는 아래에 있다


```html

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>첫번째</title>
    <script type="text/javascript">
        function atest() {
            var x = document.getElementById("test");
            var y = (x.contentWindow || x.contentDocument);
            y.a();
        }
    </script>
</head>
<body>
<button type="button" onclick="atest();" >test</button>
<iframe name="test" id="test" src="test2.html">
</iframe>
</body>
</html>

```
```html

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>두번째</title>
    <script type="text/javascript">

        function a() {
            alert('call me~~~!!!');
        }
    </script>
</head>
<body>
난 아이 프레임 안
</body>
</html>

```

# 참조 
-----
* [html5 specifications iframe](https://www.w3.org/TR/2011/WD-html5-20110113/the-iframe-element.html#the-iframe-element)
