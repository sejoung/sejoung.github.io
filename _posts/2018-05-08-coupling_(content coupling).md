---
layout: post
title: "coupling_(content coupling)"
date: 2018-05-08 18:25:00 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 결합도 (coupling)

#### 내용결합 (content coupling) 

제일 높은 결합도 모델 

컨텐츠 결합은 한 모듈이 다른 모듈의 코드를 사용할 때 발생한다고 말합니다. 

이는 정보 숨기기를 위반하는 것으로, 기본 설계 개념입니다.

아래의 코드를 보시면 Builder class에 userAbInfoList를 AbCampaignSelector 에서 직접 참조 하고 있습니다.

내용 결합은 캡슐화에 따라 제거 할 수 있습니다.


 ```java
 

public class AbCampaignSelector {
	private List<Map<String, String>> userAbInfoList;
	
	public AbCampaignSelector(Builder builder) throws EmptyException {
		// 쿠키로 조회
		if(CollectionUtils.isEmpty(builder.userAbInfoList) ) {
			throw new EmptyException("ab Empty Exception!!");
		}
		userAbInfoList = builder.userAbInfoList;
	}

	public static class Builder{
		private List<Map<String, String>> userAbInfoList;
		public Builder(List<Map<String, String>> userAbInfoList) {
			this.userAbInfoList = userAbInfoList;
		}

		public AbCampaignSelector build() throws EmptyException {
			return new AbCampaignSelector(this);
		}

	}
}

```
