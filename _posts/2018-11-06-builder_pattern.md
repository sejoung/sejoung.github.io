---
layout: post
title: "builder_pattern"
date: 2018-11-06 09:40 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### 생성자에 매개 변수가 많다면 빌더를 고려하자

정적 팩토리 메소드 패턴과 생성자와는 공통점이 있는데 선택적인 매개변수가 많을때 처리하기 곤란하다는것 이다.

#### 점층적 생성자 패턴(telescoping constuctor pattern)

```java

package com.github.sejoung.codetest.builder;

import java.math.BigDecimal;

//통계 정보
public class AudienceStats {
    // 날짜 yyyymmdd
    private String statsDttm;
    // 구좌노출
    private int totEprsCnt;
    //매체 기준 노출
    private int parEprsCnt;
    // 클릭
    private int clickCnt;
    // 광고 단가
    private BigDecimal advrtesAmt;

    public AudienceStats(String statsDttm, int clickCnt, BigDecimal advrtesAmt) {
        this.statsDttm = statsDttm;
        this.clickCnt = clickCnt;
        this.advrtesAmt = advrtesAmt;
    }

    public AudienceStats(String statsDttm, int totEprsCnt, int parEprsCnt) {
        this.statsDttm = statsDttm;
        this.totEprsCnt = totEprsCnt;
        this.parEprsCnt = parEprsCnt;
    }

    public AudienceStats(String statsDttm, int totEprsCnt, int parEprsCnt, BigDecimal advrtesAmt) {
        this.statsDttm = statsDttm;
        this.totEprsCnt = totEprsCnt;
        this.parEprsCnt = parEprsCnt;
        this.advrtesAmt = advrtesAmt;
    }

}


```

위와 같은 클래스가 있다. 이것은 광고 노출과 클릭에 대한 통계를 받는 객체 인데
노출과 클릭에 따라서 생성자를 3개 만들었다.

1. CPC 단가를 계산하기 위해 노출시에 받는 정보는 날짜와 구좌노출수, 매체 기준 노출수를 받을수 있다.
2. CPM 단가를 계산하기 위해 노출시에 받는 정보는 날짜와 구좌노출수, 매체 기준 노출수, 광고 금액을 받을수 있다.
3. CPC 단가를 계산하기 위해 클릭시에 받는 정보는 클릭수, 광고단가를 받을수 있다.

위에 기준에 따라서 점층적 생성자 패턴(telescoping constuctor pattern) 3가지 생성자를 만들었다.

그래서 위에 객체를 인스턴스화 시킬때는 위에 기준에 따라서 선택하면 된다.

```java

package com.github.sejoung.codetest.builder;

public class Test {

    public static void main(String[] args) {
        AudienceStats as = new AudienceStats("20181106",2,1);
    }

}

```

위에 코드를 보면 doc를 확인해 가면서 저기에 들어가는 값에 대한 의미를 파악 할 수 있다.
매개변수가 3자리라서 파악하기 쉬워보이지만 매개변수가 늘어나면서 더욱더 의미를 파악하기 힘들다.
매개변수를 잘못 넘기면 컴파일 시점에서는 알아차리기 힘들고 런타임시에 엉뚱한 동작을 하게 된다.

요즘엔 IDE가 좋아져서 아래 처럼 해당 정보를 보여주기도 한다.

![인텔리제이](https://sejoung.github.io/images/2018_11_06_01.jpg){: width="100%"}{: .center}

#### 자바빈즈 패턴(javaBeans pattern)

선택 매개 변수가 많을때 활용할수 있는 두번째 대안인 자바빈즈 패턴을 보겠다. 

매개변수가 없는 생성자를 만들고 setter 메소드를 호출해 원하는 값을 설정하는 방식이다.

```java

package com.github.sejoung.codetest.builder;

import java.math.BigDecimal;

//통계 정보
public class AudienceStats {
    // 날짜 yyyymmdd
    private String statsDttm;
    // 구좌노출
    private int totEprsCnt;
    //매체 기준 노출
    private int parEprsCnt;
    // 클릭
    private int clickCnt;
    // 광고 단가
    private BigDecimal advrtesAmt;

    public void setStatsDttm(String statsDttm) {
        this.statsDttm = statsDttm;
    }

    public void setTotEprsCnt(int totEprsCnt) {
        this.totEprsCnt = totEprsCnt;
    }

    public void setParEprsCnt(int parEprsCnt) {
        this.parEprsCnt = parEprsCnt;
    }

    public void setClickCnt(int clickCnt) {
        this.clickCnt = clickCnt;
    }

    public void setAdvrtesAmt(BigDecimal advrtesAmt) {
        this.advrtesAmt = advrtesAmt;
    }
}


```

위에 코드에선 점층적 생성자 패턴에 단점들이 보이지 않는다. 코드는 길어졌지만 인스턴스를 만들기 편하고
더 읽기 좋은 코드가 되었다.

```java

package com.github.sejoung.codetest.builder;

public class Test {

    public static void main(String[] args) {
        AudienceStats as = new AudienceStats();
        as.setStatsDttm("20181106");
        as.setParEprsCnt(1);
        as.setTotEprsCnt(2);
    }

}

```

하지만 불행히도 자바빈즈는 자신만에 심각한 단점이 있다.
자바 빈즈 패턴에서 객체를 하나 만들려면 매서드 여러개를 호출해야 하고
객체가 완전히 생성되기 전까지는 일관성이 무너진 상태에 놓이게 된다.
불변상태로도 두지를 못한다.(setter를 사용할수 있어서)

여기서 freeze에 관한 이야기가 나오는데 java에서는 Object에 freeze 메소드가 존재 하지 않는다.

그럼 freeze를 구현할수 있는 방안은 아래에 링크를 통해서 확인했는데 아래 코드를 보면 이해가 쉽다.

```java

public class Foo {
 
  private int a;
  private int b;
 
  private boolean frozen;
 
  public synchronized int getA() { return a; }
  public synchronized int getB() { return b; }
 
  public synchronized void setA(int a) {
    checkNotFrozen();
    this.a = a;
  }
 
  public synchronized void setB(int b) {
    checkNotFrozen();
    this.b = b;
  }
 
  public boolean isFrozen() { return frozen; }
  public synchronized void freeze() { frozen = true; }
 
  private void checkNotFrozen() { if (frozen) throw new RuntimeException(); }
}

```
위에서 단순한 컨셉은 setter 메소드를 실행할때 freeze flag를 두어서 검사를 하는 케이스다.


#### 빌더 패턴(Builder pattern)

점층적 생성자 패턴의 안전성과 자바빈즈 패턴의 가독성을 겸비한 빌더 패턴(builder pattern)이다.
클라이언트는 필요한 객체를 직접만드는 대신, 필수 매개변수만으로 생성자를 호출해 빌더 객체를 얻는다.
그런 다음 빌더 객체가 제공하는 일종의 셋터 메소드를 호출해 우리에게 필요한 객체을 얻는다.

```java

package com.github.sejoung.codetest.builder;

import java.math.BigDecimal;

//통계 정보
public class AudienceStats {
    // 날짜 yyyymmdd
    private String statsDttm;
    // 구좌노출
    private int totEprsCnt;
    //매체 기준 노출
    private int parEprsCnt;
    // 클릭
    private int clickCnt;
    // 광고 단가
    private BigDecimal advrtesAmt;

    public static class Builder {
        // 날짜 yyyymmdd
        private String statsDttm;
        // 구좌노출
        private int totEprsCnt;
        //매체 기준 노출
        private int parEprsCnt;
        // 클릭
        private int clickCnt;
        // 광고 단가
        private BigDecimal advrtesAmt;

        public Builder(String statsDttm) {
            this.statsDttm = statsDttm;
        }

        public Builder totEprsCnt(int totEprsCnt) {
            this.totEprsCnt = totEprsCnt;
            return this;
        }

        public Builder parEprsCnt(int parEprsCnt) {
            this.parEprsCnt = parEprsCnt;
            return this;
        }

        public Builder clickCnt(int clickCnt) {
            this.clickCnt = clickCnt;
            return this;
        }

        public Builder advrtesAmt(BigDecimal advrtesAmt) {
            this.advrtesAmt = advrtesAmt;
            return this;
        }

        public AudienceStats build(){
            return new AudienceStats(this);
        }

    }

    private AudienceStats(Builder builder){
        this.statsDttm = builder.statsDttm;
        this.totEprsCnt = builder.totEprsCnt;
        this.parEprsCnt = builder.parEprsCnt;
        this.clickCnt = builder.clickCnt;
        this.advrtesAmt = builder.advrtesAmt;
    }

}


```
AudienceStats 클래스는 불변이며, 모든 매개변수의 기본값을 한군데 모아두었다.
빌더의 setter들은 빌더를 반환하기 때문에 메서드 연쇄(method chaining)이나 플루언트 API(fluent API)라고 한다

```java

package com.github.sejoung.codetest.builder;


public class Test {

    public static void main(String[] args) {

        AudienceStats as = new AudienceStats.Builder("20181106").totEprsCnt(2).parEprsCnt(1).build();

    }

}


```
위는 빌더를 사용하는 클라이언트에 모습이다. 읽기도 쉽고 쓰기도 쉽게 구성되어 있다.

빌더 패턴은(파이썬 과 스칼라에 있는) 명명된 선택적 매개변수(named optional parameter)를 흉내낸것이다.

#### 롬복을 사용한 빌더 패턴

```java

package com.github.sejoung.codetest.builder;

import lombok.Builder;

import java.math.BigDecimal;

//통계 정보
public class AudienceStats {
    // 날짜 yyyymmdd
    private String statsDttm;
    // 구좌노출
    private int totEprsCnt;
    //매체 기준 노출
    private int parEprsCnt;
    // 클릭
    private int clickCnt;
    // 광고 단가
    private BigDecimal advrtesAmt;

    @Builder
    public AudienceStats(String statsDttm, int totEprsCnt, int parEprsCnt, int clickCnt, BigDecimal advrtesAmt) {
        this.statsDttm = statsDttm;
        this.totEprsCnt = totEprsCnt;
        this.parEprsCnt = parEprsCnt;
        this.clickCnt = clickCnt;
        this.advrtesAmt = advrtesAmt;
    }


}


```

롬복에 생성자도 생성해주는 어너테이션이 있지만 코드로 가시적으로 보이지 않아 전체 매개변수를 받는 생성자를 만든후에
@Builder를 사용함

```java

package com.github.sejoung.codetest.builder;


public class Test {

    public static void main(String[] args) {

        AudienceStats as = AudienceStats.builder().statsDttm("20181106").totEprsCnt(2).parEprsCnt(1).build();

    }

}


```

위에는 빌더를 사용하는 클라이언트 코드이다.

# 참조
-----
* [freeze-object-constructing-object-JavaBeans](https://coderanch.com/t/618625/java/freeze-object-constructing-object-JavaBeans)
* [Object 2. 보다 안전한 객체](https://www.bsidesoft.com/?p=1878)
* [[이팩티브 자바] #2 생성자 매개변수가 너무 많아? 빌더 패턴을 써 봐](https://www.youtube.com/watch?v=OwkXMxCqWHM)