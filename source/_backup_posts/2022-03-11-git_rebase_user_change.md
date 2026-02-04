---
layout: post
title: "git 커밋된 내용에서 커밋 사용자 바꾸기"
date: 2022-03-11 23:07 +0900
comments: true
tags : ["git","rebase"]
categories : ["git"]
sitemap :
changefreq : daily
priority : 1.0
--->
# git 커밋된 내용에서 커밋 사용자 바꾸기

```shell
git config --global user.name "sejoung kim"
git config user.email sejoung@gmail.com

git commit --amend --author="sejoung kim <sejoung@gmail.com>"
git rebase --continue
```

# 참고

------

