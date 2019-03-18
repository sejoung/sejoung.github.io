---
layout: post
title: "결합도_(control coupling)"
date: 2018-05-16 14:00:00 +0900
comments: true
tags : ["결합도"]
categories : ["study"]
sitemap :
  changefreq : daily
  priority : 1.0
---

### 결합도 (coupling)

#### 제어결합 (control coupling)
 
보통결합 - 편의상 사용시작

모듈의 내부 논리 (예 : 플래그 및 스위치)에 영향을주는 데이터가 전달 될 때 모듈간에 제어 결합이 발생합니다

계층 구조에 전달 된 제어 플래그는 호출 프로그램이 호출 된 프로그램의 내부에 대해 알도록 요구합니다
(호출 된 프로그램은 블랙 박스가 아닙니다). 

상위 계층으로 넘어온 제어 플래그는 하위 모듈이 상위 모듈의 제어 흐름에 영향을 미치도록합니다
(하위 모듈은 제어하지 않는 모듈에 영향을줍니다). 

```java

package com.github.sejoung.reactive.test;

public class Control {

    private String run1(){
        return "A";
    }


    private String run2(){
        return "B";
    }

    private String run3(){
        return "C";
    }

    public String process(int flag) throws Exception {
        switch (flag){
            case 1: return this.run1();
            case 2: return this.run2();
            case 3: return this.run2();
            default: throw new Exception("invalid param");
        }
    }
}

```

```java

package com.github.sejoung.reactive.test;

public class GoControl {

    private Control control;
    public GoControl(Control control){
        this.control = control;
    }

    public String gogo() throws Exception {
        return this.control.process(1);
    }

    public String gogosing() throws Exception {
        return this.control.process(2);
    }
}

```

```java

package com.github.sejoung.reactive.test;

public class ControlTest {
    public static void main(String[] args) throws Exception {
        GoControl go = new GoControl(new Control());
        System.out.println(go.gogo());
        System.out.println(go.gogosing());
    }
}

```

```java

package com.github.sejoung.reactive.test;

public class GoControl2 {
    private Control control;
    public GoControl2(Control control){
        this.control = control;
    }

    public String gogo(int i) throws Exception {
        if("A".equals(this.control.process(i))){
            return "A";
        }else if("B".equals(this.control.process(i))){
            return "B";
        }else if("C".equals(this.control.process(i))){
            return "C";
        }else{
            throw new Exception("에러닷");
        }
    }

}


```