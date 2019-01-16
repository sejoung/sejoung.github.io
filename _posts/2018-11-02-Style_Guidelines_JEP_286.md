---
layout: post
title: "Style Guidelines for Local Variable Type Inference in Java"
date: 2018-11-02 11:46 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---

### Style Guidelines for Local Variable Type Inference in Java

#### Introduction(소개)

Java SE 10에서는 지역 변수에 대한 유형 유추가 도입되었습니다. 
이전에는 모든 로컬 변수 선언에 왼쪽에 명시적인 (매니페스트) 유형이 필요했습니다. 
형식 유추를 사용하면 명시 적 형식 var을 이니셜 라이저가있는 로컬 변수 선언 의 예약 된 형식 이름으로 바꿀 수 있습니다 . 
변수의 형식은 초기화 프로그램의 형식에서 유추됩니다.

이 기능에 대해서는 일정한 논란이 있습니다. 
어떤 사람들은 그것이 가능하게하는 간결함을 환영합니다. 
다른 사람들은 독자가 중요한 유형 정보를 박탈하고 가독성을 손상시킬 것을 두려워합니다. 
그리고 두 그룹 모두 옳습니다. 
중복 된 정보를 제거하여 코드를보다 읽기 쉽게 만들 수 있으며 유용한 정보를 누락시켜 코드를 쉽게 읽을 수 없게 만들 수도 있습니다. 
또 다른 그룹은 과도하게 사용되어 Java 코드 작성이 악화 될 것이라고 우려하고 있습니다. 
이것은 또한 사실이지만, 그것은 또한 더 초래할 가능성이 높습니다 좋은 자바 코드가 작성된다. 
모든 기능과 마찬가지로 판단과 함께 사용해야합니다. 
사용해야 할 때와 사용하지 말아야 할 때에 대한 담요 규칙이 없습니다.

로컬 변수 선언은 독립적으로 존재하지 않습니다. 
주변 코드는 사용에 따른 영향에 영향을 미치거나 압도 할 수 있습니다. 
이 문서의 목표는 주변 코드가 var선언 에 미치는 영향을 조사하고 , 일부 상충 관계를 설명하고, 효과적인 사용을위한 지침을 제공하는 것입니다.

#### Principles(원칙)

##### P1. 코드를 작성하는 것보다 코드를 읽는 것이 더 중요합니다.

코드는 작성된 것보다 훨씬 자주 읽 힙니다. 또한, 코드를 작성할 때, 우리는 일반적으로 우리의 머리 속에 모든 문맥을 가지고 있으며, 우리의 시간을 소비합니다. 
코드를 읽을 때, 우리는 문맥 전환을하는 경우가 많고, 더 많이 서둘러야 할 수도 있습니다. 
특정 언어 기능의 사용 여부 및 방법 은 원래 작성자가 아닌 향후 프로그램 독자에게 미치는 영향으로 결정되어야합니다 . 
짧은 프로그램은 긴 프로그램보다 바람직 할 수 있지만 프로그램을 너무 많이 줄이면 프로그램을 이해하는 데 유용한 정보가 생략 될 수 있습니다. 
여기에서 핵심적인 문제는 프로그램의 알맞은 크기를 찾아 이해력을 극대화하는 것입니다.

우리는 여기서 프로그램을 입력하거나 편집하는 데 필요한 키 보드의 양과 관련하여 특별히 신경 쓰지 않습니다. 
간결함은 저자에게 좋은 보너스가 될 수 있지만 초점을 맞추면 결과적으로 프로그램의 이해 가능성을 높이는 것이 주 목표입니다.

##### P2. 코드는 현지 추론에서 분명해야합니다.

독자는 var 선언 된 변수의 사용과 함께 선언 을보고 즉시 진행되는 것을 이해할 수 있어야합니다 . 
이상적으로, 코드는 미리보기 또는 패치의 컨텍스트만을 사용하여 쉽게 이해할 수 있어야합니다. 
var선언문을 이해할 때 독자가 코드 주변의 여러 위치를 볼 필요가 있다면 사용하기에 좋은 상황이 아닐 수도 있습니다. 
그런 다음 코드 자체에 문제가 있음을 나타낼 수 있습니다.

##### P3. 코드 가독성은 IDE에 의존해서는 안됩니다.

코드는 종종 IDE 내에서 쓰여지고 읽히므로 IDE의 코드 분석 기능에 크게 의존하고 싶습니다. 
타입 선언의 경우, 타입 var을 결정하기 위해 항상 변수를 가리킬 수 있기 때문에 모든 곳에서 사용하지 않는 이유 는 무엇입니까?

두 가지 이유가 있습니다. 첫 번째는 코드가 종종 IDE 외부에서 읽혀진다는 것입니다. 
코드는 문서 내의 스 니펫 (snippets), 인터넷상의 저장소 또는 패치 파일에서와 같이 IDE 기능을 사용할 수없는 많은 장소에 나타납니다. 
코드가하는 일을 이해하기 위해 코드를 IDE로 가져와야하는 것은 비생산적입니다.

두 번째 이유는 IDE 내에서 코드를 읽는 경우에도 변수에 대한 추가 정보를 IDE에 쿼리하기 위해 명시 적 작업이 필요한 경우가 많기 때문입니다. 
예를 들어, using을 사용하여 선언 된 변수의 유형을 쿼리하려면 변수 var위에 포인터를 올려 놓고 팝업을 기다려야합니다. 
이것은 단지 잠시 걸릴 수 있지만 읽기의 흐름을 방해합니다.

코드는 자명해야합니다. 도구를 통한 도움 없이도 얼굴을 이해할 수 있어야합니다.

##### P4. 명시 적 유형은 절충안입니다.

Java는 역사적으로 유형을 명시적으로 포함하기 위해 지역 변수 선언을 요구했습니다. 
명시적 유형은 매우 유용 할 수 있지만 때로는 매우 중요하지 않으며 때로는 방해가됩니다. 
명시 적 유형을 요구하면 유용한 정보가 쌓여 혼란이 생길 수 있습니다.

명시 적 유형을 생략하면 혼동을 줄일 수 있지만 누락이 이해력을 해치지 않는 경우에만 혼란을 줄일 수 있습니다. 
이 유형은 독자에게 정보를 전달하는 유일한 방법은 아닙니다. 다른 방법으로는 변수의 이름과 이니셜 라이저 표현식이 포함됩니다. 
이러한 채널 중 하나를 음소거해도되는지 여부를 결정할 때 사용 가능한 모든 채널을 고려해야합니다.

#### Guidelines(지침)

##### G1. 유용한 정보를 제공하는 변수 이름을 선택하십시오.

이것은 일반적으로 좋은 습관이지만, 맥락에서 훨씬 더 중요합니다 var. A의 var 선언, 의미와 변수의 사용에 대한 정보는 변수의 이름을 사용하여 전달 될 수있다. 
명시 적 유형을 var로 바꾸려면 변수 이름을 개선해야합니다. 
예 :

```java

// ORIGINAL
List<Customer> x = dbconn.executeQuery(query);

// GOOD
var custList = dbconn.executeQuery(query);

```
 
이 경우 쓸모없는 변수 이름이 변수의 유형을 나타내는 이름으로 바뀌 었습니다. 이제이 변수는 var선언에 함축되어 있습니다.

변수의 유형을 이름에 인코딩하면 논리적 인 결론이 도출되며 "헝가리 표기법"이됩니다. 
명시 적 유형과 마찬가지로이 방식이 도움이되기도하고 때로는 혼란스러운 경우도 있습니다. 
이 예제에서 이름 custList은 a List가 리턴 됨을 의미합니다 . 그것은 중요하지 않을 수 있습니다. 
정확한 유형 대신에 변수의 이름이 "고객"과 같은 변수의 역할이나 본질을 표현하는 것이 더 나은 경우가 있습니다.

```java

// ORIGINAL
try (Stream<Customer> result = dbconn.executeQuery(query)) {
    return result.map(...)
                 .filter(...)
                 .findAny();
}

// GOOD
try (var customers = dbconn.executeQuery(query)) {
    return customers.map(...)
                    .filter(...)
                    .findAny();
}

```

##### G2. 지역 변수의 범위를 최소화하십시오.

지역 변수의 범위를 제한하는 것은 일반적으로 좋은 습관입니다. 
이 연습은 Effective Java (제 3 판) , 항목 57 var에 설명되어 있습니다. 사용중인 경우 추가로 적용됩니다 .

다음 예제에서 add메서드는 마지막 항목 요소로 특수 항목을 명확하게 추가하므로 예상대로 마지막으로 처리됩니다.

```java

var items = new ArrayList<Item>(...);
items.add(MUST_BE_PROCESSED_LAST);
for (var item : items) ...

```

이제 중복 항목을 제거하기 위해 프로그래머가 다음 코드 HashSet 대신 a를 사용하도록이 코드를 수정했다고 가정 해보십시오 ArrayList.

```java

var items = new HashSet<Item>(...);
items.add(MUST_BE_PROCESSED_LAST);
for (var item : items) ...

```
세트에는 정의 된 반복 순서가 없으므로이 코드에는 버그가 있습니다. 그러나 프로그래머는  items변수 의 사용이 선언에 인접 하므로 즉시이 버그를 수정 해야합니다.

이제이 코드는 items 변수에 해당하는 큰 범위의 큰 메서드의 일부라고 가정 합니다.

```java

var items = new HashSet<Item>(...);

// ... 100 lines of code ...

items.add(MUST_BE_PROCESSED_LAST);
for (var item : items) ...

```
에서 a ArrayList로의 변경의 영향 HashSet은 더 이상 명백하지 않습니다. 왜냐하면  items선언에서 멀리 떨어져 있기 때문 입니다. 이 버그가 훨씬 오래 생존 할 가능성이 있습니다.

items명시 적으로 선언 된 경우 List<String>이니셜 라이저를 변경하면 유형을 변경해야합니다 Set<String>. 
이렇게하면 프로그래머는 나머지 메서드에서 해당 변경의 영향을받는 코드를 검사 할 수 있습니다. (다시 한번 말하지만 그렇지 않을 수도 있습니다.) 
var이 프롬프트를 사용하면이 같은 코드에서 버그가 발생할 위험이 증가 할 수 있습니다.

이것은 사용에 대한 논쟁처럼 보일지 모르지만 var실제로는 그렇지 않습니다. 처음 사용하는 예제 var 는 완벽합니다. 
변수의 범위가 큰 경우에만 문제가 발생합니다. var이 경우 단순히 피하는 대신 로컬 변수의 범위를 줄이기 위해 코드를 변경하고 선언해야합니다.

##### G3. var이니셜 라이저가 독자에게 충분한 정보를 제공 할 때 고려하십시오 .

지역 변수는 종종 생성자로 초기화됩니다. 생성되는 클래스의 이름은 종종 왼쪽의 명시적인 형식으로 반복됩니다. 
형식 이름이 길면 var정보의 손실없이 concision 을 제공합니다.

```java

// ORIGINAL
ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

// GOOD
var outputStream = new ByteArrayOutputStream();

```
그것은 사용하는 것도 합리적 var대신 생성자의, 이니셜 라이저는 정적 팩토리 메소드로, 메소드 호출 인 경우에, 그 이름은 충분한 유형 정보가 포함되어있는 경우 :

```java

// ORIGINAL
BufferedReader reader = Files.newBufferedReader(...);
List<String> stringList = List.of("a", "b", "c");

// GOOD
var reader = Files.newBufferedReader(...);
var stringList = List.of("a", "b", "c");

```
이 경우 메소드의 이름은 특정 리턴 유형을 강하게 암시하며,이 유형은 변수 유형을 추론하는 데 사용됩니다.

##### G4. var로컬 변수로 연결 식 또는 중첩 식을 구분할 때 사용 합니다.

문자열 모음을 취하여 가장 자주 발생하는 문자열을 찾는 코드를 고려하십시오. 이것은 다음과 같을 수 있습니다.

```java

return strings.stream()
              .collect(groupingBy(s -> s, counting()))
              .entrySet()
              .stream()
              .max(Map.Entry.comparingByValue())
              .map(Map.Entry::getKey);


```

이 코드는 정확하지만 단일 스트림 파이프 라인처럼 보이기 때문에 혼동을 줄 수 있습니다. 
사실 그것은 짧은 스트림이고 첫 번째 스트림의 Optional결과에 대한 두 번째 스트림 다음에 두 번째 스트림 의 결과 매핑이 뒤 따른다 . 
이 코드를 표현하는 데 가장 이해하기 쉬운 방법은 두 개 또는 세 개의 명령문이었습니다. 먼저지도 항목을 그룹화 한 다음 해당지도를 축소 한 다음 결과에서 키를 추출합니다 (있는 경우).

```java

Map<String, Long> freqMap = strings.stream()
                                   .collect(groupingBy(s -> s, counting()));
Optional<Map.Entry<String, Long>> maxEntryOpt = freqMap.entrySet()
                                                       .stream()
                                                       .max(Map.Entry.comparingByValue());
return maxEntryOpt.map(Map.Entry::getKey);

```

그러나 저자는 아마도 중간 변수의 유형을 작성하는 것이 너무 부담스러워 보였기 때문에 제어 흐름을 왜곡했기 때문에 이를 저지했을 것입니다. 
var를 사용 하면 명시 적으로 중간 변수 유형을 선언하는 높은 가격을 지불하지 않고도 코드를 더 자연스럽게 표현할 수 있습니다.

```java

var freqMap = strings.stream()
                     .collect(groupingBy(s -> s, counting()));
var maxEntryOpt = freqMap.entrySet()
                         .stream()
                         .max(Map.Entry.comparingByValue());
return maxEntryOpt.map(Map.Entry::getKey);

```

하나의 긴 메소드 호출 체인으로 첫 번째 스 니펫을 정당하게 선호 할 수 있습니다. 
그러나 어떤 경우에는 긴 메소드 체인을 분리하는 것이 좋습니다. 
이러한 경우에 사용 하는 것은 실행 가능한 접근 방식이지만 두 번째 스 니펫에서 중간 변수의 전체 선언을 사용하면 불리한 대안이됩니다. 
다른 많은 상황에서와 마찬가지로 올바른 사용 var에는 무언가를 꺼내고 (명시 적 유형) 다시 무언가를 추가하는 것이 포함됩니다 (더 나은 변수 이름, 더 나은 코드 구조화).

##### G5. 지역 변수로 "인터페이스 프로그래밍"에 대해 너무 걱정하지 마십시오.

Java 프로그래밍의 일반적인 관용구는 구체적인 유형의 인스턴스를 작성하는 것이지만 인터페이스 유형의 변수에 할당하는 것입니다. 
이렇게하면 코드가 구현 대신 추상화에 바인딩되므로 나중에 코드를 유지 관리 할 때 유연성이 유지됩니다. 

예 :

```java

// ORIGINAL
List<String> list = new ArrayList<>();

```

아래의 경우에 var사용하지만, 구체적인 유형 대신 인터페이스의 추론된다 :

```java

// Inferred type of list is ArrayList<String>.
var list = new ArrayList<String>();

```

로컬 변수 에만 사용할 var수있는 여기에서 반복해야합니다 . 
필드 유형, 메소드 매개 변수 유형 및 메소드 리턴 유형을 추론하는 데 사용할 수 없습니다. 
"인터페이스 프로그래밍"의 원칙은 그 맥락에서 그 어느 때보 다 중요합니다.

주된 문제는 변수를 사용하는 코드가 구체적인 구현에 의존성을 형성 할 수 있다는 것입니다. 
변수의 이니셜 라이저가 나중에 변경되면 유추 된 유형이 변경되어 해당 변수를 사용하는 후속 코드에서 오류 또는 버그가 발생할 수 있습니다.

가이드 라인 G2에서 권고 한 바와 같이 지역 변수의 범위가 작다면 후속 코드에 영향을 줄 수있는 구체적인 구현의 "누출"로 인한 위험이 제한적입니다. 
변수가 몇 줄 밖에없는 코드에서만 사용되는 경우에는 문제를 피하거나 발생하는 경우 변수를 완화하는 것이 쉬워야합니다.

이 특정한 경우에, ArrayList단지에없는 방법의 몇 가지 포함 List, 즉  ensureCapacity와 trimToSize. 
이러한 메서드는 목록의 내용에 영향을 미치지 않으므로 해당 메서드를 호출해도 프로그램의 정확성에는 영향을주지 않습니다. 
이것은 인터페이스가 아닌 구체적인 구현 인 유추 된 타입의 영향을 줄입니다.

##### G6. var 다이아몬드 또는 일반적인 방법으로 사용할 때는주의하십시오 .

둘 다 var및 "다이아몬드"기능을 사용하면 이미있는 정보에서 파생 될 수있는 명시 적 유형 정보를 생략 할 수 있습니다. 
같은 선언문에서 둘 다 사용할 수 있습니까?

다음을 고려하세요:

```java

PriorityQueue<Item> itemQueue = new PriorityQueue<Item>();

```

이것은 다이아몬드 또는을 사용하여 var형식 정보를 잃지 않고 다시 작성할 수 있습니다 .

```java

// OK: both declare variables of type PriorityQueue<Item>
PriorityQueue<Item> itemQueue = new PriorityQueue<>();
var itemQueue = new PriorityQueue<Item>();

```

var유추와 다이아몬드를 모두 사용하는 것은 합법 이지만 추론 된 유형이 변경됩니다.

```java

// DANGEROUS: infers as PriorityQueue<Object>
var itemQueue = new PriorityQueue<>();

```

추론을 위해 다이아몬드는 타겟 유형 (일반적으로 선언의 왼쪽) 또는 생성자 인수의 유형을 사용할 수 있습니다.
 둘 다 존재하지 않는다면 가장 널리 적용되는 유형(Object)으로 되돌아갑니다 . 이것은 보통 의도 한 바가 아닙니다.

일반 메서드는 형식 유추를 성공적으로 사용하여 프로그래머가 명시 적 형식 인수를 제공하는 것은 거의 없습니다. 
제네릭 메서드에 대한 추론은 충분한 형식 정보를 제공하는 실제 메서드 인수가없는 경우 대상 형식을 사용합니다. 
A의 var유사한 문제가 다이아몬드로 발생할 수 있도록 선언, 어떤 대상 유형이 없습니다. 예를 들어,

```java

// DANGEROUS: infers as List<Object>
var list = List.of();

```

다이아몬드와 제네릭 메서드 모두를 사용하면 생성자 또는 메서드에 대한 실제 인수로 추가 형식 정보를 제공 할 수 있으므로 의도 한 형식을 유추 할 수 있습니다. 그러므로,

```java

// OK: itemQueue infers as PriorityQueue<String>
Comparator<String> comp = ... ;
var itemQueue = new PriorityQueue<>(comp);

// OK: infers as List<BigInteger>
var list = List.of(BigInteger.ZERO);

```

var다이아몬드 또는 일반 메서드 를 사용하기로 결정한 경우 에는 추론 된 형식이 의도와 일치하도록 메서드 또는 생성자 인수가 충분한 형식 정보를 제공하는지 확인해야합니다. 
그렇지 않으면 var동일한 선언에서 다이아몬드 또는 제네릭 메서드를 함께 사용하지 마십시오 .

##### G7. var리터럴을 사용할 때는주의하십시오 .

프리미티브 리터럴은 var선언의 초기화 자로 사용할 수 있습니다 . 
그것은 사용 가능성의  var유형 이름은 일반적으로 짧은 이러한 경우에하는 것은 많은 이점을 제공 할 것입니다. 
그러나  var변수 이름을 정렬하는 경우와 같이 때로는 유용합니다.

부울, 문자, long문자열 리터럴 에는 문제가 없습니다 . 이러한 리터럴에서 유추 된 유형은 정확하므로 의미 var가 명확합니다.

```java

// ORIGINAL
boolean ready = true;
char ch = '\ufffd';
long sum = 0L;
String label = "wombat";

// GOOD
var ready = true;
var ch    = '\ufffd';
var sum   = 0L;
var label = "wombat";

```

이니셜 라이저가 숫자 값, 특히 정수 리터럴 인 경우 특히주의해야합니다. 
왼쪽에 명시적인 형식을 사용하면 숫자 값이 조용히 넓혀 지거나 좁혀 질 수 있습니다 int. 와 함께  var,이 값은  int의도하지 않은 것으로 추정 될 것입니다.

```java

// ORIGINAL
byte flags = 0;
short mask = 0x7fff;
long base = 17;

// DANGEROUS: all infer as int
var flags = 0;
var mask = 0x7fff;
var base = 17;

```

부동 소수점 리터럴은 대부분 모호하지 않습니다.

```java

// ORIGINAL
float f = 1.0f;
double d = 2.0;

// GOOD
var f = 1.0f;
var d = 2.0;

```

참고 float리터럴에 자동으로 확대 될 수있다  double. 
예를 들어 double명시 적 float리터럴을 사용하여 변수 를 초기화하는 것은 다소 무모  3.0f 하지만 double변수가 float필드 에서 초기화 되는 경우가 발생할 수 있습니다. 
주의 사항 var은 여기에 나와 있습니다.

```java

// ORIGINAL
static final float INITIAL = 3.0f;
...
double temp = INITIAL;

// DANGEROUS: now infers as float
var temp = INITIAL;

```

(이 예제는 가이드 라인 G3을 위반합니다. 왜냐하면 이터레이터에 추측 된 유형을보기에 충분한 정보가 없기 때문입니다.)

#### Examples

이 섹션에는 var 가장 큰 이익을 얻는 데 사용할 수있는 몇 가지 예가 포함되어 있습니다 .

다음 코드는 maxMap에서 일치하는 항목을 대부분 제거합니다 . 
와일드 카드 형 경계는 메서드의 유연성을 향상시키는 데 사용되므로 상당한 자세한 정보가 표시됩니다. 
불행하게도, 이것은 Iterator의 타입이 중첩 된 와일드 카드가되도록 요구하며, 선언을보다 장황하게 만듭니다. 
이 선언은 너무 길어서 for 루프의 헤더가 더 이상 한 줄에 들어 가지 않으므로 코드를 읽기가 더 어렵게 만듭니다.

```java

// ORIGINAL
void removeMatches(Map<? extends String, ? extends Number> map, int max) {
    for (Iterator<? extends Map.Entry<? extends String, ? extends Number>> iterator =
             map.entrySet().iterator(); iterator.hasNext();) {
        Map.Entry<? extends String, ? extends Number> entry = iterator.next();
        if (max > 0 && matches(entry)) {
            iterator.remove();
            max--;
        }
    }
}

```

var여기를 사용 하면 로컬 변수에 대한 잡음이 많은 형식 선언이 제거됩니다. 
이러한 종류의 루프에서 Iterator 및 Map.Entry 지역에 대한 명시적인 유형을 갖는 것은 대개 불필요합니다. 
또한 for 루프 제어를 단일 행에 적용하여 가독성을 향상시킬 수 있습니다.

```java

// GOOD
void removeMatches(Map<? extends String, ? extends Number> map, int max) {
    for (var iterator = map.entrySet().iterator(); iterator.hasNext();) {
        var entry = iterator.next();
        if (max > 0 && matches(entry)) {
            iterator.remove();
            max--;
        }
    }
}

```

try-with-resources 문을 사용하여 소켓에서 한 줄의 텍스트를 읽는 코드를 고려하십시오. 
네트워킹 W I / O API는 오브젝트 랩핑 관용구를 사용합니다. 
후속 랩퍼를 여는 중에 오류가 발생하면 각 중간 오브젝트를 자원 변수로 선언해야 제대로 닫힙니다. 
이것에 대한 전통적인 코드는 변수 선언의 왼쪽과 오른쪽에 클래스 이름을 반복해야하기 때문에 많은 혼란을 낳습니다.

```java

// ORIGINAL
try (InputStream is = socket.getInputStream();
     InputStreamReader isr = new InputStreamReader(is, charsetName);
     BufferedReader buf = new BufferedReader(isr)) {
    return buf.readLine();
}

```

사용 var하면 노이즈가 상당히 줄어 듭니다.

```java

// GOOD
try (var inputStream = socket.getInputStream();
     var reader = new InputStreamReader(inputStream, charsetName);
     var bufReader = new BufferedReader(reader)) {
    return bufReader.readLine();
}

```

#### Conclusion

var선언문을 사용하면 혼란을 줄임으로써 코드를 향상시킬 수 있으므로 더 중요한 정보가 눈에 띄게됩니다. 
반면에, var무차별 적으로 적용 하면 상황이 악화 될 수 있습니다. 
제대로 사용  var하면 좋은 코드를 개선하여 이해하기 쉽도록 짧고 명확하게 만들 수 있습니다.

# 참조 
-----
* [JEP_286](https://openjdk.java.net/jeps/286)
* [Style Guidelines for Local Variable Type Inference in Java](https://openjdk.java.net/projects/amber/LVTIstyle.html)