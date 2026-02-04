---
layout: post
title: "원도우 특정 폴더에 파일 삭제하기"
date: 2020-05-20 11:08 +0900
comments: true
tags : ["원도우 특정 폴더에 파일 삭제하기"]
categories : ["windows","bat","windows shell"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## 원도우 특정 폴더에 파일 삭제하기
```

C:\Windows\system32\FORFILES.exe /p "C:\test" /s /m test-*.war  /c "cmd /c del @file"

```

위에 명령으로 bat 파일을 만들어서 해당 파일을 삭제 처리 할수 있다.

# 참조 
-----



