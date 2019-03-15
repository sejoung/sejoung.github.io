---
layout: post
title: "아이템 20. 추상 클래스 보다는 인터페이스를 우선하라"
date: 2018-12-12 12:01 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 20. 추상 클래스 보다는 인터페이스를 우선하라

자바는 단일상속만 되니 추상클래스는 단 하나만 구현할수 있다. 
인터페이스는 어떠한 상속을 했던간에 인터페이스가 선언한 메소드를 구현하고 있으면 같은 타입으로 인식한다.

그래서 기존 클래스에도 손쉽게 새로운 인터페이스를 구현해 넣을수 있다.

인터페이스의 장점

* 믹스인(mixin)정의에 안성맞춤이다.(Comparable)
* 인터페이스로는 계층구조가 없는 타입 프레임워크를 만들수있다.

```java

package com.github.sejoung.codetest.interfaces;

public class Song {
    private String composer;
    private String lyrics;
    private String arrangement;
}


```
```java

package com.github.sejoung.codetest.interfaces;

import java.applet.AudioClip;

public interface Singer {
    AudioClip sing(Song song);

}


```

```java

package com.github.sejoung.codetest.interfaces;

public interface SongWiter {
    Song compose(int chartPosition);
}


```

```java

package com.github.sejoung.codetest.interfaces;

import java.applet.AudioClip;

public interface SingerSongWiter extends Singer, SongWiter {
    AudioClip strum();
    void actSensitive();
}


```

이런식으로 정의 할수 있는데 계층 구조로 만들려면 아래처럼 만들어야 중복되는 메소드를 만들어야 된다.

```java
package com.github.sejoung.codetest.abstracts;

import com.github.sejoung.codetest.interfaces.Song;

import java.applet.AudioClip;

public abstract class Singer {
   abstract AudioClip sing(Song song);

}



```

```java

package com.github.sejoung.codetest.abstracts;

import com.github.sejoung.codetest.interfaces.Song;

public abstract class SongWiter {
    abstract Song compose(int chartPosition);
}


```

```java

package com.github.sejoung.codetest.abstracts;

import com.github.sejoung.codetest.interfaces.Singer;
import com.github.sejoung.codetest.interfaces.Song;
import com.github.sejoung.codetest.interfaces.SongWiter;

import java.applet.AudioClip;

public abstract class SingerSongWiter {
    abstract AudioClip sing(Song song);
    abstract Song compose(int chartPosition);
    abstract AudioClip strum();
    abstract void actSensitive();
}


```

위처럼 되는데 조합폭발이라고 말하는 클래스가 만들어 지면 매서드가 폭발된다.

* 래퍼 클래스 관용구와 함께 사용하면 인터페이스는 기능을 항상시키는 안전하고 강력한 수단이 된다.

인터페이스에도 디폴드 메서드가 제공되니 개발자의 노고를 덜어줄수있다.

Collection 인터페이스에서 제공하는 removeIf 메소드이다.

```java

    /**
     * Removes all of the elements of this collection that satisfy the given
     * predicate.  Errors or runtime exceptions thrown during iteration or by
     * the predicate are relayed to the caller.
     *
     * @implSpec
     * The default implementation traverses all elements of the collection using
     * its {@link #iterator}.  Each matching element is removed using
     * {@link Iterator#remove()}.  If the collection's iterator does not
     * support removal then an {@code UnsupportedOperationException} will be
     * thrown on the first matching element.
     *
     * @param filter a predicate which returns {@code true} for elements to be
     *        removed
     * @return {@code true} if any elements were removed
     * @throws NullPointerException if the specified filter is null
     * @throws UnsupportedOperationException if elements cannot be removed
     *         from this collection.  Implementations may throw this exception if a
     *         matching element cannot be removed or if, in general, removal is not
     *         supported.
     * @since 1.8
     */
    default boolean removeIf(Predicate<? super E> filter) {
        Objects.requireNonNull(filter);
        boolean removed = false;
        final Iterator<E> each = iterator();
        while (each.hasNext()) {
            if (filter.test(each.next())) {
                each.remove();
                removed = true;
            }
        }
        return removed;
    }


```

디폴트 메소드로는 boolean equals(Object o), int hashCode(); 는 제공하면 안된다.

인터페이스와 추상골격 구현 클래스의 장점을 함께 제공하는 식으로 인터페이스와 추상 클래스의 장점을 모두 취하는 방법도 있다.(템플릿 메서드 패턴)

관례상 인터페이스 이름이 Interface면 그 골격 구현클래스의 이름은 AbstractInterface라고 명명한다.(이부분은 Abstract 클래스인데 음 모르겠다.) 템플릿 메소트 패턴을 설명하는듯


```java

package com.github.sejoung.codetest.interfaces;

import java.util.AbstractList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

// 코드 20-1 골격 구현을 사용해 완성한 구체 클래스 (133쪽)
public class IntArrays {
    static List<Integer> intArrayAsList(int[] a) {
        Objects.requireNonNull(a);

        // 다이아몬드 연산자를 이렇게 사용하는 건 자바 9부터 가능하다.
        // 더 낮은 버전을 사용한다면 <Integer>로 수정하자.
        return new AbstractList<Integer>() {
            @Override
            public Integer get(int i) {
                return a[i];  // 오토박싱(아이템 6)
            }

            @Override
            public Integer set(int i, Integer val) {
                int oldVal = a[i];
                a[i] = val;     // 오토언박싱
                return oldVal;  // 오토박싱
            }

            @Override
            public int size() {
                return a.length;
            }
        };
    }

    public static void main(String[] args) {
        int[] a = new int[10];
        for (int i = 0; i < a.length; i++)
            a[i] = i;

        List<Integer> list = intArrayAsList(a);
        Collections.shuffle(list);
        System.out.println(list);
    }
}


```

위에서는 AbstractList를 구현하므로써 내가 필요한 로직을 구현한것을 볼수 있다 

```java

package com.github.sejoung.codetest.interfaces;

import java.util.Map;
import java.util.Objects;

// 코드 20-2 골격 구현 클래스 (134-135쪽)
public abstract class AbstractMapEntry<K, V>
        implements Map.Entry<K, V> {
    // 변경 가능한 엔트리는 이 메서드를 반드시 재정의해야 한다.
    @Override
    public V setValue(V value) {
        throw new UnsupportedOperationException();
    }

    // Map.Entry.equals의 일반 규약을 구현한다.
    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Map.Entry))
            return false;
        Map.Entry<?, ?> e = (Map.Entry) o;
        return Objects.equals(e.getKey(), getKey())
                && Objects.equals(e.getValue(), getValue());
    }

    // Map.Entry.hashCode의 일반 규약을 구현한다.
    @Override
    public int hashCode() {
        return Objects.hashCode(getKey())
                ^ Objects.hashCode(getValue());
    }

    @Override
    public String toString() {
        return getKey() + "=" + getValue();
    }
}


```

위처럼 인터페이스의 메소드 모두가 기반메서드가 된다면 equals, hashCode, toString을 구현해도 된다.

위처럼 골격구현은 상속해서 사용하는것을 전제하므로 꼭 상속에대한 문서를 적어 놓아야 된다.

```java

  // Implementation Note: SimpleEntry and SimpleImmutableEntry
    // are distinct unrelated classes, even though they share
    // some code. Since you can't add or subtract final-ness
    // of a field in a subclass, they can't share representations,
    // and the amount of duplicated code is too small to warrant
    // exposing a common abstract class.


    /**
     * An Entry maintaining a key and a value.  The value may be
     * changed using the <tt>setValue</tt> method.  This class
     * facilitates the process of building custom map
     * implementations. For example, it may be convenient to return
     * arrays of <tt>SimpleEntry</tt> instances in method
     * <tt>Map.entrySet().toArray</tt>.
     *
     * @since 1.6
     */
    public static class SimpleEntry<K,V>
        implements Entry<K,V>, java.io.Serializable
    {
        private static final long serialVersionUID = -8499721149061103585L;

        private final K key;
        private V value;

        /**
         * Creates an entry representing a mapping from the specified
         * key to the specified value.
         *
         * @param key the key represented by this entry
         * @param value the value represented by this entry
         */
        public SimpleEntry(K key, V value) {
            this.key   = key;
            this.value = value;
        }

        /**
         * Creates an entry representing the same mapping as the
         * specified entry.
         *
         * @param entry the entry to copy
         */
        public SimpleEntry(Entry<? extends K, ? extends V> entry) {
            this.key   = entry.getKey();
            this.value = entry.getValue();
        }

        /**
         * Returns the key corresponding to this entry.
         *
         * @return the key corresponding to this entry
         */
        public K getKey() {
            return key;
        }

        /**
         * Returns the value corresponding to this entry.
         *
         * @return the value corresponding to this entry
         */
        public V getValue() {
            return value;
        }

        /**
         * Replaces the value corresponding to this entry with the specified
         * value.
         *
         * @param value new value to be stored in this entry
         * @return the old value corresponding to the entry
         */
        public V setValue(V value) {
            V oldValue = this.value;
            this.value = value;
            return oldValue;
        }

        /**
         * Compares the specified object with this entry for equality.
         * Returns {@code true} if the given object is also a map entry and
         * the two entries represent the same mapping.  More formally, two
         * entries {@code e1} and {@code e2} represent the same mapping
         * if<pre>
         *   (e1.getKey()==null ?
         *    e2.getKey()==null :
         *    e1.getKey().equals(e2.getKey()))
         *   &amp;&amp;
         *   (e1.getValue()==null ?
         *    e2.getValue()==null :
         *    e1.getValue().equals(e2.getValue()))</pre>
         * This ensures that the {@code equals} method works properly across
         * different implementations of the {@code Map.Entry} interface.
         *
         * @param o object to be compared for equality with this map entry
         * @return {@code true} if the specified object is equal to this map
         *         entry
         * @see    #hashCode
         */
        public boolean equals(Object o) {
            if (!(o instanceof Map.Entry))
                return false;
            Map.Entry<?,?> e = (Map.Entry<?,?>)o;
            return eq(key, e.getKey()) && eq(value, e.getValue());
        }

        /**
         * Returns the hash code value for this map entry.  The hash code
         * of a map entry {@code e} is defined to be: <pre>
         *   (e.getKey()==null   ? 0 : e.getKey().hashCode()) ^
         *   (e.getValue()==null ? 0 : e.getValue().hashCode())</pre>
         * This ensures that {@code e1.equals(e2)} implies that
         * {@code e1.hashCode()==e2.hashCode()} for any two Entries
         * {@code e1} and {@code e2}, as required by the general
         * contract of {@link Object#hashCode}.
         *
         * @return the hash code value for this map entry
         * @see    #equals
         */
        public int hashCode() {
            return (key   == null ? 0 :   key.hashCode()) ^
                   (value == null ? 0 : value.hashCode());
        }

        /**
         * Returns a String representation of this map entry.  This
         * implementation returns the string representation of this
         * entry's key followed by the equals character ("<tt>=</tt>")
         * followed by the string representation of this entry's value.
         *
         * @return a String representation of this map entry
         */
        public String toString() {
            return key + "=" + value;
        }

    }

```

단순구현은 골격 구현의 작은 변종으로 위의 AbstractMap.SimpleEntry가 좋은 예이다.
단순 구현은 쉽게 말해 동작하는 가장 단순한 구현이다. 단순구현은 그래로 써도 되고 필요에 맞게 확장해도 된다.


# 참조
-----