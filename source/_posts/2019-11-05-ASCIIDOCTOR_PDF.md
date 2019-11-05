---
layout: post
title: "ASCIIDOCTOR-PDF 변환 한글"
date: 2019-11-05 14:49 +0900
comments: true
tags : ["spring-rest-docs","ASCIIDOCTOR","PDF 한글"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---

## ASCIIDOCTOR-PDF 변환 한글

`spring-rest-docs`를 가지고 PDF로 변환하는데 한글이 깨진다. 이부분은 원래 부터 문제가 있었나보다. 

`asciidoctor-maven-plugin`가지고 삽질중 플러그인 지식이 없으니 안됨 ㅜㅜ 

그래서 아래링크 내용으로 작업을 진행

모두 인스톨후에 실행

```

sudo asciidoctor-pdf -r asciidoctor-pdf-cjk-kai_gen_gothic -a pdf-style=KaiGenGothicKR ccmindex.adoc

```

변환 잘 되어서 나온다.

# 참조
-----
* [asciidoctor-pdf-cjk-kai_gen_gothic](https://github.com/chloerei/asciidoctor-pdf-cjk-kai_gen_gothic)

