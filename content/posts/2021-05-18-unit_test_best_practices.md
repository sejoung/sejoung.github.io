---
layout: post
title: "단위 테스트 모범사례"
date: 2021-05-18 11:01 +0900
comments: true
tags : ["단위테스트","unit test","단위 테스트 가이드","java"]
categories : ["testing"]
sitemap :
changefreq : daily
priority : 1.0
--->
# 단위 테스트 모범사례
[.NET Core 및.NET 표준을 사용하는 단위 테스트 모범 사례](https://docs.microsoft.com/ko-kr/dotnet/core/testing/unit-testing-best-practices)

위 내용을 보고 조금 정리 해 보았다.

## 단위 테스트 이유

* 기능 테스트 수행 시간 단축 : 사소한 변경에 몇 초가 걸리거나 큰 변경에는 몇분이 걸릴 수도 있습니다. 하지만 단위테스트는 몇 밀리세컨드 밖에 걸리지 않고 확인도 test runner의 몫입니다.
* 회귀에 대한 보호 : 회귀 오류는 애플리게이션이 변경될 때 나오는 결합입니다. 이전에 구현된 기능이 예상대로 작동하는지 확인할수 있습니다.
* 실행 가능한 설명서 : 지정된 입력에 대해 예상하는 출력을 설명할수 있고 실제 작동하는지도 확인 가능하다.
* 느슨한 결합 코드 : 코드가 결합도가 높으면 테스트 작성이 어려우니 자연스럽게 분리가 된다.

## Code coverage
코드 커버리지가 높으면 코드 품질이 높아지는 경우가 많습니다. 하지만 측정 자체로 코드 품질이 결정되지는 않는다.
코드 커버리지를 지나치게 욕심을 부려 높게 설정하면 역효과가 날수 있다.

높은 코드 커버리지는 성공의 지표도 아니고 높은 코드 품질을 의지 하지 않는다. 그냥 단위테스트에서 검사되는 코드양을 나타낼뿐이다.

## 같은 용어를 사용하기

mock 이라는 용어는 불행히도 테스트에 대해 이야기할 때 종종 잘못 사용 된다.

* Fake - fake는 stub 또는 mock을 설명하는 데 사용할 수 있는 일반적인 용어 이다. stub 또는 mock 인지 여부는 사용되는 컨텍스트에 따라 달라진다. 즉, fake는 stub 또는 mock이 될 수 있다.
* Stub - stub은 시스템의 기존 종속성(또는 협력자)을 제어할 수 있는 대체품이다. stub을 사용하여 종속성을 직접 처리하지 않고 코드를 테스트할 수 있다.

다음 코드를 보면 

```java

class PurchaseTest {

    @DisplayName("stub이 mock이라고 잘못 불리는 예")
    @Test
    void orderStubTest() {
        var mockOrder = new MockOrder();
        var purchase = new Purchase(mockOrder);
        purchase.validateOrders();
        Assertions.assertThat(purchase.isCanBeShipped()).isTrue();
    }

}

```

이는 stub이 mock이라고 불리는 예를 나타낸다.
Purchase(테스트 중인 시스템)를 인스턴스화할 수 있는 수단으로 Order를 전달합니다.
MockOrder 이름도 잘못된 것입니다. 다시 말해서, order가 mock이 아니기 때문입니다.

```java

class PurchaseTest {
	
    @Test
    void orderFakeTest() {
        var fakeOrder= new FakeOrder();
        var purchase = new Purchase(fakeOrder);
        purchase.validateOrders();
        Assertions.assertThat(purchase.isCanBeShipped()).isTrue();
    }

}

```
클래스 이름을 FakeOrder로 바꾸면 클래스를 훨씬 더 일반화되게 만들므로 클래스를 mock 또는 stub으로 사용할 수 있습니다.
위의 예에서는 FakeOrder가 stub으로 사용됩니다.
assert 중에 FakeOrder를 사용하지 않기 때문이다.

Mock으로 사용하려면 다음과 같이 수행하면 됩니다.

```java

class PurchaseTest {
    @Test
    void orderMockTest() {
        var mockOrder = new MockOrder();
        var purchase = new Purchase(mockOrder);
        purchase.validateOrders();
        Assertions.assertThat(mockOrder.isValidated()).isTrue();
    }
}

```
이 경우 Fake(해당 항목에 대한 어설션)의 속성을 확인 중이므로 위의 코드 조각에서 mockOrder는 Mock입니다.

mocks와 stubs에 대해 기억해야 할 주요 사항은 mocks는 stubs와 같지만, 
mock 대해 어설션하는 반면 stub에 대해서는 어설션하지 않습니다.

## 최선의 구현방법

단위 테스트를 작성하는 경우 인프라에 대한 종속성을 도입하지 않습니다.


## 테스트 이름 지정

* 테스트할 메서드의 이름입니다.
* 테스트 중인 시나리오입니다.
* 시나리오에서 호출될 때 예상되는 동작입니다.

이유는 이름 지정 표준은 테스트의 의도를 명시적으로 표현하기 때문에 중요합니다.

테스트는 단순히 코드가 작동하는지 확인하는 것 이상이며, 문서도 제공합니다. 
단위 테스트 도구 모음을 살펴봄으로써 코드 자체를 조회하지 않고도 코드의 동작을 유추할 수 있습니다. 
또한 테스트가 실패하는 경우 기대치를 충족하지 못하는 시나리오를 정확히 확인할 수 있습니다.

### Bad
```java


class StringCalculatorTest {
	
    @DisplayName("Bad")
    @Test
    void testSingle() {
      var stringCalculator = new StringCalculator();
      var actual = stringCalculator.add("0");
      assertThat(actual).isZero();
    }
}

```
### Better
```java


class StringCalculatorTest {

    @DisplayName("Better")
    @Test
    void addSingleNumberReturnsSameNumber() {
      var stringCalculator = new StringCalculator();
      var actual = stringCalculator.add("0");
      assertThat(actual).isZero();
    }
}

```


## 테스트 정렬

Arrange, Act, Assert은 일반적인 단위테스트 패턴입니다.

* 개체를 정렬 하고 필요에 따라 만들고 설정합니다.
* 개체의 동작 입니다.
* 특정 항목이 예상대로라고 assert 합니다.

이유 테스트할 항목을 정렬 및 assert 단계에서 명확하게 구분합니다., 어설션과 "Act" 코드를 혼합할 기회가 적습니다.

### Bad
```java
class StringCalculatorTest {
    @Test
    void addEmptyStringReturnsZero() {
        // Arrange
        var stringCalculator = new StringCalculator();
        // Assert
        assertThat(stringCalculator.add("")).isZero();
    }
}
```

### Better
```java
class StringCalculatorTest {
  @Test
  void addEmptyStringReturnsZero() {
    // Arrange
    var stringCalculator = new StringCalculator();
    //Act
    var actual = stringCalculator.add("");
    // Assert
    assertThat(actual).isZero();
  }
}
```

## 최소한의 테스트 통과 작성

단위 테스트에 사용할 입력은 현재 테스트 중인 동작을 확인하기 위해 가능한 한 가장 간단해야 합니다.

이유 
* 테스트는 코드베이스의 향후 변화에 대한 복원력이 향상됩니다.
* 구현에 대한 테스트 동작에 근접합니다. 

테스트를 통과하는 데 필요한 것보다 많은 정보를 포함하는 테스트는 테스트에 오류가 발생할 가능성이 높으며 테스트의 의도를 덜 명확하게 할 수 있습니다. 
테스트를 작성할 때 동작에 집중하려고 합니다. 
모델의 추가 속성을 설정하거나 필요하지 않을 때 0이 아닌 값을 사용하면 증명하려고 시도한 것만 손상됩니다.

### Bad
```java
class StringCalculatorTest {
    @Test
    void addSingleNumberReturnsSameNumber() {
        var stringCalculator = new StringCalculator();
        var actual = stringCalculator.add("42");
        assertThat(actual).isEqualTo(42);
    }
}
```

### Better
```java
class StringCalculatorTest {
    @Test
    void addSingleNumberReturnsSameNumber() {
        var stringCalculator = new StringCalculator();
        var actual = stringCalculator.add("0");
        assertThat(actual).isZero();
    }
}
```

## 매직 문자열 방지
단위 테스트의 이름 지정 변수는(프로덕션 코드의 이름 지정 변수보다 더 중요하지는 않지만) 중요합니다. 
단위 테스트에는 매직 문자열이 없어야 합니다.


### Bad
```java
class StringCalculatorTest {
    @Test
    void addBigNumberThrowsException() {
        var stringCalculator = new StringCalculator();
        var actual = catchThrowable(() -> stringCalculator.add("1001"));
        assertThat(actual).isInstanceOf(OverflowException.class);
    }
}
```

### Better
```java
class StringCalculatorTest {
    @Test
    void addMaximumSumResultThrowsOverflowException() {
        var stringCalculator = new StringCalculator();
        String MAXIMUM_RESULT = "1001";
        var actual = catchThrowable(() -> stringCalculator.add(MAXIMUM_RESULT));
        assertThat(actual).isInstanceOf(OverflowException.class);
    }
}
```

## 테스트에서 로직 사용 금지

단위 테스트를 작성할 때 수동 문자열 연결 및 if, while, for, switch 등의 논리 조건을 사용하지 않습니다.

이유
* 테스트 중에 버그가 발생할 가능성이 줄어듭니다.
* 구현 세부 정보보다는 최종 결과에 집중합니다.
* 테스트의 논리가 불가피한 경우 테스트를 두 개 이상의 다른 테스트로 분할하는 것이 좋습니다.

### Bad
```java
class StringCalculatorTest {
    @Test
    void addMultipleNumbersReturnsCorrectResults() {
        var stringCalculator = new StringCalculator();
        var expected = 0;
        var testCases = new String[] {"0,0,0", "0,1,2", "1,2,3"};

        for (String test : testCases) {
            var actual = stringCalculator.add(test);
            assertThat(actual).isEqualTo(expected);
            expected += 3;
        }
    }
}
```

### Better
```java
class StringCalculatorTest {
    @ParameterizedTest(name = "{displayName} {arguments} [{index}]")
    @CsvSource(
        value = {"0,0,0:0", "0,1,2:3", "1,2,3:6"},
        delimiterString = ":")
    void addMultipleNumbersReturnsSumOfNumbers(String input, int expected) {
        var stringCalculator = new StringCalculator();
        var actual = stringCalculator.add(input);
        assertThat(actual).isEqualTo(expected);
    }
}
```

## 설정 및 해제할 도우미 방법 선호

테스트에 비슷한 개체나 상태가 필요한 경우 Setup 및 Teardown 특성(있는 경우)을 활용하는 것보다 도우미 메서드가 선호됩니다.

이유
* 모든 코드가 각 테스트 내에서 볼 수 있기 때문에 테스트를 읽을 때 혼동이 적습니다.
* 지정된 테스트에 대해 너무 많거나 너무 적게 설정될 가능성이 줄어듭니다.
* 테스트 간 상태 공유로 테스트 간에 원치 않는 종속성이 생길 가능성이 줄어듭니다.

단위 테스트 프레임워크에서 Setup은 단위 테스트 도구 모음 내의 각각의 모든 단위 테스트 전에 호출됩니다. 
일부는 이를 유용한 도구로 볼 수 있지만, 일반적으로 테스트를 읽기에는 비대해지고 어렵워집니다. 
각 테스트는 일반적으로 테스트를 시작하고 실행하기 위한 요구 사항이 다릅니다. 
아쉽게도 Setup에서는 각 테스트에 대해 정확히 동일한 요구 사항을 사용해야 합니다.

### Bad
```java
class Bad {
    private final StringCalculator stringCalculator;

    public Bad() {
        this.stringCalculator = new StringCalculator();
    }
    @Test
    void addTwoNumbersReturnsSumOfNumbers() {
        var actual = stringCalculator.add("0,1");
        assertThat(actual).isOne();
    }
}
```

### Better
```java
class Better {
    @Test
    void addTwoNumbersReturnsSumOfNumbers() {
        var stringCalculator = createDefaultStringCalculator();
        var actual = stringCalculator.add("0,1");
        assertThat(actual).isOne();
    }

    private StringCalculator createDefaultStringCalculator() {
        return new StringCalculator();
    }
}
```

## 다중 어설션 방지
테스트를 작성할 때 테스트당 하나의 Assert만 포함하려고 합니다. 하나의 어설션만 사용하는 일반적인 방법은 다음과 같습니다.
* 각 어설션에 대한 별도의 테스트를 만듭니다.
* 매개 변수화된 테스트를 사용합니다.

이유
* 하나의 Assert가 실패하면 후속 Assert는 평가되지 않습니다.
* 테스트에 여러 사례를 어설션하지 않도록 합니다.
* 테스트가 실패한 이유에 대한 전체 그림을 제공합니다.

테스트 사례에 다중 어설션을 도입할 때 모든 어설션이 실행된다는 보장은 없습니다. 
대부분의 단위 테스트 프레임워크에서 단위 테스트에 어설션이 실패하면 절차 테스트는 자동으로 실패한 것으로 간주됩니다. 
실제로 작동하는 기능이 실패한 것으로 표시되므로 혼란스러울 수 있습니다.

예외

이 규칙에 대한 일반적인 예외는 개체에 대해 어설션할 때 발생합니다. 
이 경우 일반적으로 각 속성에 대해 다중 어설션을 허용하여 개체가 예상되는 상태에 있는지 확인하는 것이 좋습니다.


### Bad
```java
class StringCalculatorTest {
    @Test
    void addEdgeCasesThrowsNumberFormatExceptions() {
        var stringCalculator = new StringCalculator();
        assertThatThrownBy(() -> stringCalculator.add(null))
            .isInstanceOf(NumberFormatException.class);
        assertThatThrownBy(() -> stringCalculator.add("a")).isInstanceOf(NumberFormatException.class);
    }
}
```

### Better
```java
class StringCalculatorTest {
    @ParameterizedTest(name = "{displayName} {arguments} [{index}]")
    @NullSource
    @ValueSource(strings = "a")
    void addInputNullOrAlphabeticThrowsNumberFormatException(String input) {
        var stringCalculator = new StringCalculator();
        assertThatThrownBy(() -> stringCalculator.add(input))
            .isInstanceOf(NumberFormatException.class);
    }
}
```

## public 메소드를 테스트 하여 private 메서드 유효성 검사

대부분의 경우 전용 메서드를 테스트할 필요는 없습니다. 전용 메서드는 구현 세부 정보입니다. 
전용 메서드는 절대 분리되어 존재하지 않는다고 생각할 수 있습니다. 
특정 시점에서는 구현의 일부로 전용 메서드를 호출하는 공용 연결 메서드가 있을 것입니다. 
주의해야 할 것은 사적인 것을 호출하는 공용 메서드의 최종 결과입니다.

```java

public class Parser {
  public String parseLogLine(String input) {
  	var sanitizedInput = trimInput(input);
    return sanitizedInput;
  }

  private String trimInput(String input) {
    return input.trim();
  }
}

```
첫 번째 반응은 메서드가 예상대로 작동하는지 확인하려고 하기 때문에 trimInput에 대한 테스트를 작성하는 것일 수 있습니다.
그러나 parseLogLine에서 예상하지 못한 방식으로 sanitizedInput을 조작하여 쓸모없는 trimInput에 대한 테스트를 렌더링하는 것은 전적으로 가능합니다.

실제 테스트는 공용 연결 메서드 ParseLogLine에 대해 수행되어야 합니다. 이는 최종적으로 주의를 기울여야 하는 것이기 때문이다.

```java
class ParserTest {

  @DisplayName("private 메소드 테스트는 public 메소드 테스트로 충분하다.")
  @Test
  void parseLogLineStartsAndEndsWithSpaceReturnsTrimmedResult() {
    var parser = new Parser();
    var actual = parser.parseLogLine(" a ");
    assertThat(actual).isEqualTo("a");
  }
}
```

## Stub 정적 참조
단위 테스트의 원칙 중 하나는 테스트 중인 시스템을 완전히 제어해야 한다는 것입니다. 
프로덕션 코드에 정적 참조(예: DateTime.now())에 대한 호출을 포함하는 경우 문제가 될 수 있습니다. 

다음 코드 참조

```java
package io.github.sejoung.best;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

public class PriceCalculator {

  public int getDiscountedPrice(int price) {
    if (LocalDateTime.now().getDayOfWeek() == DayOfWeek.TUESDAY) {
      return price / 2;
    } else {
      return price;
    }
  }
}


```

```java

package io.github.sejoung.best;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PriceCalculatorTest {

  @DisplayName("화요일이 아닌 날은 정상가격이다.")
  @Test
  void getDiscountedPriceNotTuesdayReturnsFullPrice() {
    var priceCalculator = new PriceCalculator();
    var actual = priceCalculator.getDiscountedPrice(2);
    assertThat(actual).isEqualTo(2);
  }

  @DisplayName("화요일은 반값이다.")
  @Test
  void getDiscountedPriceOnTuesdayReturnsHalfPrice() {
    var priceCalculator = new PriceCalculator();
    var actual = priceCalculator.getDiscountedPrice(2);
    assertThat(actual).isEqualTo(1);
  }
}


```
아쉽게도 테스트에 몇 가지 문제점이 있습니다.

* 테스트 도구 모음을 화요일에 실행하면 두 번째 테스트는 통과하지만 첫 번째 테스트는 실패합니다.
* 테스트 도구 모음을 다른 날에 실행하면 첫 번째 테스트는 통과하지만 두 번째 테스트는 실패합니다.

이러한 문제를 해결하려면 프로덕션 코드에 이음새(seam)를 도입해야 합니다. 
한 가지 방법은 인터페이스에서 제어해야 하는 코드를 래핑하여 프로덕션 코드가 해당 인터페이스에 종속되도록 하는 것입니다.

아래 처럼 간단하게 코드 리팩토링을 하면

```java
package io.github.sejoung.best;

import java.time.DayOfWeek;

public interface IDateTimeProvider {
  DayOfWeek DayOfWeek();
}

```

```java

package io.github.sejoung.best;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

public class PriceCalculator {

  public int getDiscountedPrice(int price, IDateTimeProvider dateTimeProvider) {
    if (dateTimeProvider.DayOfWeek() == DayOfWeek.TUESDAY) {
      return price / 2;
    } else {
      return price;
    }
  }

}


```

테스트를 위해 Stub 객체를 생성한다.

```java

package io.github.sejoung.best;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

public class DateTimeProviderStub implements IDateTimeProvider {

  private final LocalDateTime dateTime;

  public DateTimeProviderStub(LocalDateTime dateTime) {
    this.dateTime = dateTime;
  }

  @Override
  public DayOfWeek DayOfWeek() {
    return dateTime.getDayOfWeek();
  }
}


```

```java
class PriceCalculatorTest {
    @DisplayName("화요일이 아닌 날은 정상가격이다.")
    @Test
    void getDiscountedPriceNotTuesdayReturnsFullPrice() {
        var priceCalculator = new PriceCalculator();
        var dateTime = LocalDateTime.of(2021, 5, 19, 11, 10);
        var dateTimeProviderStub = new DateTimeProviderStub(dateTime);
        var actual = priceCalculator.getDiscountedPrice(2, dateTimeProviderStub);
        assertThat(actual).isEqualTo(2);
    }

    @DisplayName("화요일은 반값이다.")
    @Test
    void getDiscountedPriceOnTuesdayReturnsHalfPrice() {
        var priceCalculator = new PriceCalculator();
        var dateTime = LocalDateTime.of(2021, 5, 18, 11, 10);
        var dateTimeProviderStub = new DateTimeProviderStub(dateTime);
        var actual = priceCalculator.getDiscountedPrice(2, dateTimeProviderStub);
        assertThat(actual).isEqualTo(1);
    }
}


```
이제 테스트 도구 모음은 DateTime.Now에 대한 완전한 제어권을 가지며 메서드를 호출할 때 모든 값을 스텁할 수 있습니다.


# 참고자료
* [.NET Core 및.NET 표준을 사용하는 단위 테스트 모범 사례](https://docs.microsoft.com/ko-kr/dotnet/core/testing/unit-testing-best-practices)

