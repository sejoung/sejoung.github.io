---
layout: post
title: "JDK ArrayList는 왜 List를 implement를 하고 있나요?"
date: 2019-01-17 14:40 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## JDK ArrayList는 왜 List를 implement를 하고 있나요?

Arrays 클래스

```java

    public static <T> List<T> asList(T... a) {
        return new ArrayList<>(a);
    }


```

```java

private static class ArrayList<E> extends AbstractList<E>
        implements RandomAccess, java.io.Serializable
    {
        private static final long serialVersionUID = -2764017481108945198L;
        private final E[] a;

        ArrayList(E[] array) {
            a = Objects.requireNonNull(array);
        }

        @Override
        public int size() {
            return a.length;
        }

        @Override
        public Object[] toArray() {
            return Arrays.copyOf(a, a.length, Object[].class);
        }

        @Override
        @SuppressWarnings("unchecked")
        public <T> T[] toArray(T[] a) {
            int size = size();
            if (a.length < size)
                return Arrays.copyOf(this.a, size,
                                     (Class<? extends T[]>) a.getClass());
            System.arraycopy(this.a, 0, a, 0, size);
            if (a.length > size)
                a[size] = null;
            return a;
        }

        @Override
        public E get(int index) {
            return a[index];
        }

        @Override
        public E set(int index, E element) {
            E oldValue = a[index];
            a[index] = element;
            return oldValue;
        }

        @Override
        public int indexOf(Object o) {
            E[] a = this.a;
            if (o == null) {
                for (int i = 0; i < a.length; i++)
                    if (a[i] == null)
                        return i;
            } else {
                for (int i = 0; i < a.length; i++)
                    if (o.equals(a[i]))
                        return i;
            }
            return -1;
        }

        @Override
        public boolean contains(Object o) {
            return indexOf(o) >= 0;
        }

        @Override
        public Spliterator<E> spliterator() {
            return Spliterators.spliterator(a, Spliterator.ORDERED);
        }

        @Override
        public void forEach(Consumer<? super E> action) {
            Objects.requireNonNull(action);
            for (E e : a) {
                action.accept(e);
            }
        }

        @Override
        public void replaceAll(UnaryOperator<E> operator) {
            Objects.requireNonNull(operator);
            E[] a = this.a;
            for (int i = 0; i < a.length; i++) {
                a[i] = operator.apply(a[i]);
            }
        }

        @Override
        public void sort(Comparator<? super E> c) {
            Arrays.sort(a, c);
        }

        @Override
        public Iterator<E> iterator() {
            return new ArrayItr<>(a);
        }
    }

```

```java

public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable{
   ....
}

```

위에서 보면 ArrayList는 List를 implements하지 않고 아래의 ArrayList는 하고 있다.

AbstractList가 이미 그 구현을 선언했다면 List 인터페이스의 구현을 다시 선언 할 필요가 없습니다.

이 질문은 이펙티브 자바를 보다가 질문을 하였는데 저도 궁금 해서 찾아 보았습니다.

위에 부분은 왜 그런지에 대한 논란이 있는 만큼 잘 못 선언한거 같습니다.

# 참조
-----
* [아이템 20. 추상 클래스 보다는 인터페이스를 우선하라](https://sejoung.github.io/2018/12/Prefer_interfaces_to_abstract_classes)
* [stackoverflow why-does-arraylist-class-implement-list-as-well-as-extend-abstractlist](https://stackoverflow.com/questions/18558536/why-does-arraylist-class-implement-list-as-well-as-extend-abstractlist)


