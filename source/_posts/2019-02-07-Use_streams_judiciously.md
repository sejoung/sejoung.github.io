---
layout: post
title: "아이템 45. 스트림은 주의해서 사용해라"
date: 2019-02-07 13:37 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 45. 스트림은 주의해서 사용해라

자바8에 추가된 스트림 API 핵심은 두가지 이다. 

* 스트림은 데이터 원소의 유한 혹은 무한 시퀀스를 뜻한다.
* 스트림 파이프 라인은 이 원소들이 수행하는 원소 단계를 뜻한다.

스트림 파이프라인은 소스 스트림으로 시작되 종단 연산으로 끝나며, 그 사이에 하나 이상의 중간 연산이 있을 수 있다.

스트림 파이프 라인은 지연 평가 된다. 종단 연산이 없으면 아무일도 수행되지 않는다.

아래 코드를 보면 이해가 갈것이다.

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class DifferentKindOfStreams {
    public static void main(String[] args) {
    
        Stream.of("d2", "a2", "b1", "b3", "c")
                .map(s -> {
                    System.out.println("map: " + s);
                    return s.toUpperCase();
                })
                .filter(s -> {
                    System.out.println("filter: " + s);
                    return s.startsWith("A");
                });

    }
}


```
실행결과
```

Process finished with exit code 0
```

위에 스트림 코드를 보면 종단 연산 없이 중간연산만 실행되는 코드이다.

위에 코드에서 아무런 수행이 되지 않는다 여기서 종단연산을 넣으면 

```java

package com.github.sejoung.codetest.stream;

import java.util.stream.Stream;

public class DifferentKindOfStreams {
    public static void main(String[] args) {
    
        Stream.of("d2", "a2", "b1", "b3", "c")
                .map(s -> {
                    System.out.println("map: " + s);
                    return s.toUpperCase();
                })
                .filter(s -> {
                    System.out.println("filter: " + s);
                    return s.startsWith("A");
                }).forEach(System.out::println);

    }
}


``` 
실행결과
```

map: d2
filter: D2
map: a2
filter: A2
A2
map: b1
filter: B1
map: b3
filter: B3
map: c
filter: C

Process finished with exit code 0
```

위에 처럼 실행 되는것을 확인 할수 있다.

스트림은 다재다능하여 사실상 어떤 계산이라도 가능하다 하지만 할수 있다는 뜻이지 해야 된다는 뜻은 아니다.


다음에 아나그램 코드가 있다. 

```java

package com.github.sejoung.codetest.stream.anagrams;

import java.io.File;
import java.io.IOException;
import java.util.*;

// 코드 45-1 사전 하나를 훑어 원소 수가 많은 아나그램 그룹들을 출력한다. (269-270쪽)
public class IterativeAnagrams {
    public static void main(String[] args) throws IOException {
        File dictionary = new File("src/main/resources/anagrams.txt");
        int minGroupSize = 4;

        Map<String, Set<String>> groups = new HashMap<>();
        try (Scanner s = new Scanner(dictionary)) {
            while (s.hasNext()) {
                String word = s.next();
                groups.computeIfAbsent(alphabetize(word),
                        (unused) -> new TreeSet<>()).add(word);
            }
        }

        for (Set<String> group : groups.values())
            if (group.size() >= minGroupSize)
                System.out.println(group.size() + ": " + group);
    }

    private static String alphabetize(String s) {
        char[] a = s.toCharArray();
        Arrays.sort(a);
        return new String(a);
    }
}

```
실행결과
```
4: [evil, live, veil, vile]
4: [emit, item, mite, time]
4: [leap, pale, peal, plea]
4: [mate, meat, tame, team]
4: [post, spot, stop, tops]
4: [reins, resin, risen, siren]
4: [lament, mantel, mantle, mental]
4: [enlist, listen, silent, tinsel]
5: [least, slate, stale, steal, tales]

Process finished with exit code 0

```
위에 코드를 스트림으로 바꾸면

```java

package com.github.sejoung.codetest.stream.anagrams;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import static java.util.stream.Collectors.groupingBy;

// 코드 45-2 스트림을 과하게 사용했다. - 따라 하지 말 것! (270-271쪽)
public class StreamAnagrams {
    public static void main(String[] args) throws IOException, URISyntaxException {
        Path dictionary = Paths.get("src","main","resources","anagrams.txt");
        int minGroupSize = 4;

        try (Stream<String> words = Files.lines(dictionary)) {
            words.collect(
                    groupingBy(word -> word.chars().sorted()
                            .collect(StringBuilder::new,
                                    (sb, c) -> sb.append((char) c),
                                    StringBuilder::append).toString()))
                    .values().stream()
                    .filter(group -> group.size() >= minGroupSize)
                    .map(group -> group.size() + ": " + group)
                    .forEach(System.out::println);
        }
    }
}

```
실행결과
```
4: [evil, live, veil, vile]
4: [emit, item, mite, time]
4: [leap, pale, peal, plea]
4: [mate, meat, tame, team]
4: [post, spot, stop, tops]
4: [reins, resin, risen, siren]
4: [lament, mantel, mantle, mental]
4: [enlist, listen, silent, tinsel]
5: [least, slate, stale, steal, tales]

Process finished with exit code 0

```
하지만 너무 과하게 사용하였다.

위에 코드가 읽기 편한가? 아니다 이렇게 스트림을 과용하면 프로그램이 읽거나 유지보수하기 어려워진다.

적적히 사용한 코드

```java

package com.github.sejoung.codetest.stream.anagrams;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.stream.Stream;

import static java.util.stream.Collectors.groupingBy;

// 코드 45-3 스트림을 적절히 활용하면 깔끔하고 명료해진다. (271쪽)
public class HybridAnagrams {
    public static void main(String[] args) throws IOException {
        Path dictionary = Paths.get("src","main","resources","anagrams.txt");
        int minGroupSize = 4;

        try (Stream<String> words = Files.lines(dictionary)) {
            words.collect(groupingBy(word -> alphabetize(word)))
                    .values().stream()
                    .filter(group -> group.size() >= minGroupSize)
                    .forEach(g -> System.out.println(g.size() + ": " + g));
        }
    }

    private static String alphabetize(String s) {
        char[] a = s.toCharArray();
        Arrays.sort(a);
        return new String(a);
    }
}

```
실행결과
```
4: [evil, live, veil, vile]
4: [emit, item, mite, time]
4: [leap, pale, peal, plea]
4: [mate, meat, tame, team]
4: [post, spot, stop, tops]
4: [reins, resin, risen, siren]
4: [lament, mantel, mantle, mental]
4: [enlist, listen, silent, tinsel]
5: [least, slate, stale, steal, tales]

Process finished with exit code 0

```

또 char 데이터를 처리할 때는 스트림 사용을 자제하자. 

```java

package com.github.sejoung.codetest.stream;

// char 데이터를 처리할 때는 스트림 사용을 자제하자. (272쪽)
public class CharStream {
    public static void main(String[] args) {
        // 예상한 결과와 다르다.
        "Hello world!".chars().forEach(System.out::print);
    }
}


```
실행결과
```
721011081081113211911111410810033


Process finished with exit code 0

```

위에 코드를 보면 chars()에서 스트림을 사용해 보았다. 하지만 예상한 결과와 틀리다

명시적으로 형변환을 해야된다.

```java

package com.github.sejoung.codetest.stream;

// char 데이터를 처리할 때는 스트림 사용을 자제하자. (272쪽)
public class CharStream {
    public static void main(String[] args) {
        // 문제를 고치려면 형변환을 명시적으로 해줘야 한다.
        "Hello world!".chars().forEach(x -> System.out.print((char) x));
        System.out.println();
    }
}

```
실행결과
```
Hello world!

Process finished with exit code 0

```

그래서 기존코드는 리팩토링하되 새코드가 더 나아 보일때만 반영해야 한다.

스트림에 안성 맞춤인일

* 원소들의 시퀀스를 일관되게 변환한다.
* 원소들의 시퀀스를 필터링 한다.
* 원소들의 시퀀스를 하나의 연산을 사용해 결합한다.(더하기, 연결하기, 최소값 구하기등)
* 원소들의 시퀀스를 컬렉션에 모은다.
* 원소들의 시퀀스에서 특정 조건을 만족하는 원소를 찾는다.

메르센 소수를 구한는 코드를 작성해보자.

```java

package com.github.sejoung.codetest.stream;

import java.math.BigInteger;
import java.util.stream.Stream;

import static java.math.BigInteger.ONE;
import static java.math.BigInteger.TWO;


// 스트림을 사용해 처음 20개의 메르센 소수를 생성한다. (274쪽)
public class MersennePrimes {
    static Stream<BigInteger> primes() {
        return Stream.iterate(TWO, BigInteger::nextProbablePrime);
    }

    public static void main(String[] args) {
        primes().map(p -> TWO.pow(p.intValueExact()).subtract(ONE))
                .filter(mersenne -> mersenne.isProbablePrime(50))
                .limit(20)
                .forEach(System.out::println);
    }
}

```
실행결과
```
3
7
31
127
8191
131071
524287
2147483647
2305843009213693951
618970019642690137449562111
162259276829213363391578010288127
170141183460469231731687303715884105727
6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057151
531137992816767098689588206552468627329593117727031923199444138200403559860852242739162502265229285668889329486246501015346579337652707239409519978766587351943831270835393219031728127
10407932194664399081925240327364085538615262247266704805319112350403608059673360298012239441732324184842421613954281007791383566248323464908139906605677320762924129509389220345773183349661583550472959420547689811211693677147548478866962501384438260291732348885311160828538416585028255604666224831890918801847068222203140521026698435488732958028878050869736186900714720710555703168729087
1475979915214180235084898622737381736312066145333169775147771216478570297878078949377407337049389289382748507531496480477281264838760259191814463365330269540496961201113430156902396093989090226259326935025281409614983499388222831448598601834318536230923772641390209490231836446899608210795482963763094236630945410832793769905399982457186322944729636418890623372171723742105636440368218459649632948538696905872650486914434637457507280441823676813517852099348660847172579408422316678097670224011990280170474894487426924742108823536808485072502240519452587542875349976558572670229633962575212637477897785501552646522609988869914013540483809865681250419497686697771007
446087557183758429571151706402101809886208632412859901111991219963404685792820473369112545269003989026153245931124316702395758705693679364790903497461147071065254193353938124978226307947312410798874869040070279328428810311754844108094878252494866760969586998128982645877596028979171536962503068429617331702184750324583009171832104916050157628886606372145501702225925125224076829605427173573964812995250569412480720738476855293681666712844831190877620606786663862190240118570736831901886479225810414714078935386562497968178729127629594924411960961386713946279899275006954917139758796061223803393537381034666494402951052059047968693255388647930440925104186817009640171764133172418132836351
259117086013202627776246767922441530941818887553125427303974923161874019266586362086201209516800483406550695241733194177441689509238807017410377709597512042313066624082916353517952311186154862265604547691127595848775610568757931191017711408826252153849035830401185072116424747461823031471398340229288074545677907941037288235820705892351068433882986888616658650280927692080339605869308790500409503709875902119018371991620994002568935113136548829739112656797303241986517250116412703509705427773477972349821676443446668383119322540099648994051790241624056519054483690809616061625743042361721863339415852426431208737266591962061753535748892894599629195183082621860853400937932839420261866586142503251450773096274235376822938649407127700846077124211823080804139298087057504713825264571448379371125032081826126566649084251699453951887789613650248405739378594599444335231188280123660406262468609212150349937584782292237144339628858485938215738821232393687046160677362909315071
190797007524439073807468042969529173669356994749940177394741882673528979787005053706368049835514900244303495954950709725762186311224148828811920216904542206960744666169364221195289538436845390250168663932838805192055137154390912666527533007309292687539092257043362517857366624699975402375462954490293259233303137330643531556539739921926201438606439020075174723029056838272505051571967594608350063404495977660656269020823960825567012344189908927956646011998057988548630107637380993519826582389781888135705408653045219655801758081251164080554609057468028203308718724654081055323215860189611391296030471108443146745671967766308925858547271507311563765171008318248647110097614890313562856541784154881743146033909602737947385055355960331855614540900081456378659068370317267696980001187750995491090350108417050917991562167972281070161305972518044872048331306383715094854938415738549894606070722584737978176686422134354526989443028353644037187375385397838259511833166416134323695660367676897722287918773420968982326089026150031515424165462111337527431154890666327374921446276833564519776797633875503548665093914556482031482248883127023777039667707976559857333357013727342079099064400455741830654320379350833236245819348824064783585692924881021978332974949906122664421376034687815350484991
285542542228279613901563566102164008326164238644702889199247456602284400390600653875954571505539843239754513915896150297878399377056071435169747221107988791198200988477531339214282772016059009904586686254989084815735422480409022344297588352526004383890632616124076317387416881148592486188361873904175783145696016919574390765598280188599035578448591077683677175520434074287726578006266759615970759521327828555662781678385691581844436444812511562428136742490459363212810180276096088111401003377570363545725120924073646921576797146199387619296560302680261790118132925012323046444438622308877924609373773012481681672424493674474488537770155783006880852648161513067144814790288366664062257274665275787127374649231096375001170901890786263324619578795731425693805073056119677580338084333381987500902968831935913095269821311141322393356490178488728982288156282600813831296143663845945431144043753821542871277745606447858564159213328443580206422714694913091762716447041689678070096773590429808909616750452927258000843500344831628297089902728649981994387647234574276263729694848304750917174186181130688518792748622612293341368928056634384466646326572476167275660839105650528975713899320211121495795311427946254553305387067821067601768750977866100460014602138408448021225053689054793742003095722096732954750721718115531871310231057902608580607

Process finished with exit code 0
```

위에 처럼 작성할수 있다. 이제 지수를 출력하길 원한다면 이 작업은 초기 스트림에만 나타나므로 결과를 출력하는 종단 연산에서는 접근할수 없다.

하지만 이경우는 중단 연산에 구행한것을 거꾸로 수행하면 되서 아래 처럼 할수 있다.

```java

package com.github.sejoung.codetest.stream;

import java.math.BigInteger;
import java.util.stream.Stream;

import static java.math.BigInteger.ONE;
import static java.math.BigInteger.TWO;


// 스트림을 사용해 처음 20개의 메르센 소수를 생성한다. (274쪽)
public class MersennePrimes {
    static Stream<BigInteger> primes() {
        return Stream.iterate(TWO, BigInteger::nextProbablePrime);
    }

    public static void main(String[] args) {
        primes().map(p -> TWO.pow(p.intValueExact()).subtract(ONE))
                .filter(mersenne -> mersenne.isProbablePrime(50))
                .limit(20)
                .forEach(mp -> System.out.println(mp.bitLength() + ": " + mp));
    }
}

``` 
실행결과
```

2: 3
3: 7
5: 31
7: 127
13: 8191
17: 131071
19: 524287
31: 2147483647
61: 2305843009213693951
89: 618970019642690137449562111
107: 162259276829213363391578010288127
127: 170141183460469231731687303715884105727
521: 6864797660130609714981900799081393217269435300143305409394463459185543183397656052122559640661454554977296311391480858037121987999716643812574028291115057151
607: 531137992816767098689588206552468627329593117727031923199444138200403559860852242739162502265229285668889329486246501015346579337652707239409519978766587351943831270835393219031728127
1279: 10407932194664399081925240327364085538615262247266704805319112350403608059673360298012239441732324184842421613954281007791383566248323464908139906605677320762924129509389220345773183349661583550472959420547689811211693677147548478866962501384438260291732348885311160828538416585028255604666224831890918801847068222203140521026698435488732958028878050869736186900714720710555703168729087
2203: 1475979915214180235084898622737381736312066145333169775147771216478570297878078949377407337049389289382748507531496480477281264838760259191814463365330269540496961201113430156902396093989090226259326935025281409614983499388222831448598601834318536230923772641390209490231836446899608210795482963763094236630945410832793769905399982457186322944729636418890623372171723742105636440368218459649632948538696905872650486914434637457507280441823676813517852099348660847172579408422316678097670224011990280170474894487426924742108823536808485072502240519452587542875349976558572670229633962575212637477897785501552646522609988869914013540483809865681250419497686697771007
2281: 446087557183758429571151706402101809886208632412859901111991219963404685792820473369112545269003989026153245931124316702395758705693679364790903497461147071065254193353938124978226307947312410798874869040070279328428810311754844108094878252494866760969586998128982645877596028979171536962503068429617331702184750324583009171832104916050157628886606372145501702225925125224076829605427173573964812995250569412480720738476855293681666712844831190877620606786663862190240118570736831901886479225810414714078935386562497968178729127629594924411960961386713946279899275006954917139758796061223803393537381034666494402951052059047968693255388647930440925104186817009640171764133172418132836351
3217: 259117086013202627776246767922441530941818887553125427303974923161874019266586362086201209516800483406550695241733194177441689509238807017410377709597512042313066624082916353517952311186154862265604547691127595848775610568757931191017711408826252153849035830401185072116424747461823031471398340229288074545677907941037288235820705892351068433882986888616658650280927692080339605869308790500409503709875902119018371991620994002568935113136548829739112656797303241986517250116412703509705427773477972349821676443446668383119322540099648994051790241624056519054483690809616061625743042361721863339415852426431208737266591962061753535748892894599629195183082621860853400937932839420261866586142503251450773096274235376822938649407127700846077124211823080804139298087057504713825264571448379371125032081826126566649084251699453951887789613650248405739378594599444335231188280123660406262468609212150349937584782292237144339628858485938215738821232393687046160677362909315071
4253: 190797007524439073807468042969529173669356994749940177394741882673528979787005053706368049835514900244303495954950709725762186311224148828811920216904542206960744666169364221195289538436845390250168663932838805192055137154390912666527533007309292687539092257043362517857366624699975402375462954490293259233303137330643531556539739921926201438606439020075174723029056838272505051571967594608350063404495977660656269020823960825567012344189908927956646011998057988548630107637380993519826582389781888135705408653045219655801758081251164080554609057468028203308718724654081055323215860189611391296030471108443146745671967766308925858547271507311563765171008318248647110097614890313562856541784154881743146033909602737947385055355960331855614540900081456378659068370317267696980001187750995491090350108417050917991562167972281070161305972518044872048331306383715094854938415738549894606070722584737978176686422134354526989443028353644037187375385397838259511833166416134323695660367676897722287918773420968982326089026150031515424165462111337527431154890666327374921446276833564519776797633875503548665093914556482031482248883127023777039667707976559857333357013727342079099064400455741830654320379350833236245819348824064783585692924881021978332974949906122664421376034687815350484991
4423: 285542542228279613901563566102164008326164238644702889199247456602284400390600653875954571505539843239754513915896150297878399377056071435169747221107988791198200988477531339214282772016059009904586686254989084815735422480409022344297588352526004383890632616124076317387416881148592486188361873904175783145696016919574390765598280188599035578448591077683677175520434074287726578006266759615970759521327828555662781678385691581844436444812511562428136742490459363212810180276096088111401003377570363545725120924073646921576797146199387619296560302680261790118132925012323046444438622308877924609373773012481681672424493674474488537770155783006880852648161513067144814790288366664062257274665275787127374649231096375001170901890786263324619578795731425693805073056119677580338084333381987500902968831935913095269821311141322393356490178488728982288156282600813831296143663845945431144043753821542871277745606447858564159213328443580206422714694913091762716447041689678070096773590429808909616750452927258000843500344831628297089902728649981994387647234574276263729694848304750917174186181130688518792748622612293341368928056634384466646326572476167275660839105650528975713899320211121495795311427946254553305387067821067601768750977866100460014602138408448021225053689054793742003095722096732954750721718115531871310231057902608580607

Process finished with exit code 0
```

또 루프를 써야 되는지 스트림을 써야 되는지 모호한 경우도 있다.

아래 처럼 데카르트 곱을 반복 방식으로 구현하는 방법이다.

```java

package com.github.sejoung.codetest.stream;

import java.util.ArrayList;
import java.util.List;

// 반복 방식과 스트림 방식으로 두 리스트의 데카르트 곱을 생성한다. (275-276쪽)
public class Card {
    public enum Suit {SPADE, HEART, DIAMOND, CLUB}

    public enum Rank {
        ACE, DEUCE, THREE, FOUR, FIVE, SIX, SEVEN,
        EIGHT, NINE, TEN, JACK, QUEEN, KING
    }

    private final Suit suit;
    private final Rank rank;

    @Override
    public String toString() {
        return rank + " of " + suit + "S";
    }

    public Card(Suit suit, Rank rank) {
        this.suit = suit;
        this.rank = rank;

    }

    private static final List<Card> NEW_DECK = newDeck();

    // 코드 45-4 데카르트 곱 계산을 반복 방식으로 구현 (275쪽)
    private static List<Card> newDeck() {
        List<Card> result = new ArrayList<>();
        for (Suit suit : Suit.values())
            for (Rank rank : Rank.values())
                result.add(new Card(suit, rank));
        return result;
    }

    public static void main(String[] args) {
        System.out.println(NEW_DECK);
    }
}


```
실행결과
```
[ACE of SPADES, DEUCE of SPADES, THREE of SPADES, FOUR of SPADES, FIVE of SPADES, SIX of SPADES, SEVEN of SPADES, EIGHT of SPADES, NINE of SPADES, TEN of SPADES, JACK of SPADES, QUEEN of SPADES, KING of SPADES, ACE of HEARTS, DEUCE of HEARTS, THREE of HEARTS, FOUR of HEARTS, FIVE of HEARTS, SIX of HEARTS, SEVEN of HEARTS, EIGHT of HEARTS, NINE of HEARTS, TEN of HEARTS, JACK of HEARTS, QUEEN of HEARTS, KING of HEARTS, ACE of DIAMONDS, DEUCE of DIAMONDS, THREE of DIAMONDS, FOUR of DIAMONDS, FIVE of DIAMONDS, SIX of DIAMONDS, SEVEN of DIAMONDS, EIGHT of DIAMONDS, NINE of DIAMONDS, TEN of DIAMONDS, JACK of DIAMONDS, QUEEN of DIAMONDS, KING of DIAMONDS, ACE of CLUBS, DEUCE of CLUBS, THREE of CLUBS, FOUR of CLUBS, FIVE of CLUBS, SIX of CLUBS, SEVEN of CLUBS, EIGHT of CLUBS, NINE of CLUBS, TEN of CLUBS, JACK of CLUBS, QUEEN of CLUBS, KING of CLUBS]

Process finished with exit code 0
```

위에 코드를 스트림으로 바꾸면 

```java

package com.github.sejoung.codetest.stream;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

// 반복 방식과 스트림 방식으로 두 리스트의 데카르트 곱을 생성한다. (275-276쪽)
public class Card {
    public enum Suit {SPADE, HEART, DIAMOND, CLUB}

    public enum Rank {
        ACE, DEUCE, THREE, FOUR, FIVE, SIX, SEVEN,
        EIGHT, NINE, TEN, JACK, QUEEN, KING
    }

    private final Suit suit;
    private final Rank rank;

    @Override
    public String toString() {
        return rank + " of " + suit + "S";
    }

    public Card(Suit suit, Rank rank) {
        this.suit = suit;
        this.rank = rank;

    }

    private static final List<Card> NEW_DECK = newDeck();

    // 코드 45-5 데카르트 곱 계산을 스트림 방식으로 구현 (276쪽)
    private static List<Card> newDeck() {
        return Stream.of(Suit.values())
                .flatMap(suit ->
                        Stream.of(Rank.values())
                                .map(rank -> new Card(suit, rank)))
                .collect(toList());
    }

    public static void main(String[] args) {
        System.out.println(NEW_DECK);
    }
}


```
실행결과
```
[ACE of SPADES, DEUCE of SPADES, THREE of SPADES, FOUR of SPADES, FIVE of SPADES, SIX of SPADES, SEVEN of SPADES, EIGHT of SPADES, NINE of SPADES, TEN of SPADES, JACK of SPADES, QUEEN of SPADES, KING of SPADES, ACE of HEARTS, DEUCE of HEARTS, THREE of HEARTS, FOUR of HEARTS, FIVE of HEARTS, SIX of HEARTS, SEVEN of HEARTS, EIGHT of HEARTS, NINE of HEARTS, TEN of HEARTS, JACK of HEARTS, QUEEN of HEARTS, KING of HEARTS, ACE of DIAMONDS, DEUCE of DIAMONDS, THREE of DIAMONDS, FOUR of DIAMONDS, FIVE of DIAMONDS, SIX of DIAMONDS, SEVEN of DIAMONDS, EIGHT of DIAMONDS, NINE of DIAMONDS, TEN of DIAMONDS, JACK of DIAMONDS, QUEEN of DIAMONDS, KING of DIAMONDS, ACE of CLUBS, DEUCE of CLUBS, THREE of CLUBS, FOUR of CLUBS, FIVE of CLUBS, SIX of CLUBS, SEVEN of CLUBS, EIGHT of CLUBS, NINE of CLUBS, TEN of CLUBS, JACK of CLUBS, QUEEN of CLUBS, KING of CLUBS]

Process finished with exit code 0
```

어떤 방식이 더 나아 보이는가? 결국에 취향과 환경 문제다 


# 참조
-----
* [Vocabulary 13000.TXT](https://hellkorea.com/more/484506)

