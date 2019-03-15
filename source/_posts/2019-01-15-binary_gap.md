---
layout: post
title: "코딜러티 문제(binary gap)"
date: 2019-01-15 14:08 +0900
comments: false
sitemap :
  changefreq : daily
  priority : 1.0
---
## 코딜러티 문제(binary gap)

코딜러티 문제를 풀어 봤는데요 전 자바 버전으로 풀었습니다.

```java

package com.github.sejoung.codetest.test.binarygap;

import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

public class Solution {
    public int solution(int N) {
        // write your code in Java SE 8
        int result = 0;
        // 먼저 2진수로 변환
        String binary = Integer.toBinaryString(N);
        // 첫번째 1 위치
        int firstOneIdx = 0;
        // 다음 1 위치
        int nextOneIdx = 0;

        // 전체 loop는 2진수 길이가 최대
        for (int i = 0; i <= binary.length(); i++) {

            // 첫번째만 인덱스 체크
            if (i == 0) {
                firstOneIdx = binary.indexOf("1");
            }

            // 첫번째 인덱스 다음 1 찾기
            nextOneIdx = binary.indexOf("1", firstOneIdx + 1);

            // 다음 1이 없으면 loop 나옴
            if (nextOneIdx == -1) {
                break;
            }

            // 갭
            int temp = nextOneIdx - firstOneIdx - 1;

            // 현제 갭이 이전보다 크면 결과 담음
            if (temp > result) {
                result = temp;
            }

            // 첫번째 인덱스를 이동
            firstOneIdx = nextOneIdx;
        }

        return result;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();

        Random random = ThreadLocalRandom.current();

        for (int i = 0; i< 10000; i++){

            int input = random.nextInt(2147483647);
            int result = solution.solution(input);

            System.out.println("input = "+input+" result = "+result);
        }

    }
}


```

스텍오버플로우에서 다른사람 풀이도 보니 다르게 푸는것을 보는 재미가 있었습니다.

1과 1사이의 인덱스를 가지고 푼 예가 없어서 스텍오버플로에 답변으로 남겼습니다.

# 참조
-----
* [codility binary_gap](https://app.codility.com/programmers/lessons/1-iterations/binary_gap/)
* [stackoverflow binary_gap](https://stackoverflow.com/questions/35531747/solving-binary-gap-using-recursion)
