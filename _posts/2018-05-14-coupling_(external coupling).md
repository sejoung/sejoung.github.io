---
layout: post
title: "coupling_(external coupling)"
date: 2018-05-14 11:00:00 +0900
comments: false
---

### 결합도 (coupling)

#### 외부결합 (external coupling) 

강결합 

외부 커플 링은 하나 이상의 모듈이 인터페이스 또는 통신 프로토콜을 공유 할 때 발생합니다. 

이는 일반적으로 모듈이 인프라 계층 (예 : OS 기능)과 직접 통신 할 때 발생합니다

음 기본적으로 여기서 말하는 결합도를 낮춰야 되는데 요즘 의존성 삽임 프로그램에서 클라이언트에 의존성이 

외부결합에 의해서 대조 되고 단일책임원칙을 위배하고 

음... IOC 컨테이너들은 느슨하게 커플링하기 위한 몇가지 방법들이 존재한다. 이 부분은 토론이 필요할듯


```java

public AService {
    
   private Adao adao;

   public void AService(Adao adao){
      this.adao = adao;
      
   }
   
   public String getData(){
       return adao.getdata();
   }
}


public BService {
    
   private Adao adao;
   
   public void BService(Adao adao){
      this.adao = adao;
   }
   
   public String getData(){
       return adao.getdata();
   }
}

AService aService = new AService(new Adao());
BService bService = new BService(new Adao());

aService.getData();
bService.getData();


```
