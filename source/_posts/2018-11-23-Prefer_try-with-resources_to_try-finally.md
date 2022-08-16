---
layout: post
title: "아이템 9. try-finally 보다 try-with-resources 블럭을 사용하세요 "
date: 2018-11-23 16:18 +0900
comments: true
tags : ["이팩티브자바"]
categories : ["books"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## 이펙티브 자바

### 아이템 9. try-finally 보다 try-with-resources 블럭을 사용하세요 


```java

package com.github.sejoung.codetest.tryfinally;


import java.io.*;

public class Copy {
    private static final int BUFFER_SIZE = 8 * 1024;

    // 코드 9-2 자원이 둘 이상이면 try-finally 방식은 너무 지저분하다! (47쪽)
    static void copy(String src, String dst) throws IOException {
        InputStream in = new FileInputStream(src);
        try {
            OutputStream out = new FileOutputStream(dst);
            try {
                byte[] buf = new byte[BUFFER_SIZE];
                int n;
                while ((n = in.read(buf)) >= 0)
                    out.write(buf, 0, n);
            } finally {
                out.close();
            }
        } finally {
            in.close();
        }
    }

    public static void main(String[] args) throws IOException {
        String src = "D://HelloWorld.java";
        String dst = "D://test.txt";
        copy(src, dst);
    }
}


```

일단 단점은 코드가 너무 지저분해진다.

두번째는 위에 코드에서 기기에서 문제가 생기면 in.read에서도 문제가 생길수 있고 close 할때도 문제가 생길수 있다.

위에 코드를 변경시키면 

```java

package com.github.sejoung.codetest.tryfinally;


import java.io.*;

public class Copy {
    private static final int BUFFER_SIZE = 8 * 1024;

    // 코드 9-4 복수의 자원을 처리하는 try-with-resources - 짧고 매혹적이다! (49쪽)
    static void copy(String src, String dst) throws IOException {
        try (InputStream   in = new FileInputStream(src);
             OutputStream out = new FileOutputStream(dst)) {
            byte[] buf = new byte[BUFFER_SIZE];
            int n;
            while ((n = in.read(buf)) >= 0)
                out.write(buf, 0, n);
        }
    }

    public static void main(String[] args) throws IOException {
        String src = "D://HelloWorld.java";
        String dst = "D://test.txt";
        copy(src, dst);
    }
}


```

Try-with-Resource를 사용하기 위해 서는 AutoCloseable를 상속 받아서 close를 구현해줘야 된다.


```java

package com.github.sejoung.codetest.tryfinally;

public class MyResource implements AutoCloseable {

    public void doSomething() throws FirstException{
        throw new FirstException();
    }

    @Override
    public void close() {
        System.out.printf("정상 close");
        throw new SecondException();
    }
}


```

위에 리소스를 호출하거나 close를 할때 에러처리는 아래처럼 장황하게 된다.

```java

package com.github.sejoung.codetest.tryfinally;

public class tryTest {
    public static void main(String[] args) {
        MyResource myResource = null;
        try {
            myResource = new MyResource();
            myResource.doSomething();
        } finally {
            if (myResource != null) {
                try {
                    myResource.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}



```

하지만 Try-with-Resource를 사용하면 코드도 간결해지고

```java

package com.github.sejoung.codetest.tryfinally;

public class tryTest {
    public static void main(String[] args) {
        try (MyResource myResource = new MyResource(); MyResource myResource2 = new MyResource()) {
            myResource2.doSomething();
            myResource.doSomething();
        }
    }
}


```

위에처럼 리소스를 2개 호출 해도 정확하게 close가 호출 되고 익셉션에 대한 처리 고민도 줄여준다.

# 참조
-----
* [[이팩티브 자바] #9 Try-with-Resource](https://www.youtube.com/watch?v=zqjZBSqHs0s)
* [자바 예외 처리](https://www.scaler.com/topics/java/exception-handling-in-java/)
