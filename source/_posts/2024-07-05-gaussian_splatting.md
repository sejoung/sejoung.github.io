---
layout: post
title: "3D Gaussian Splatting"
date: 2024-07-05 15:39 +0900
comments: true
tags: [ "Gaussian Splatting"]
categories: [ "3d" ]
sitemap:
    changefreq: daily
    priority: 1.0
---

# 3D Gaussian Splatting

colmap을 사용해서 3D reconstruction을 하고 나서 3D Gaussian Splatting을 사용해서 rendering을 할 수 있다.

```
<location>
|---images
|   |---<image 0>
|   |---<image 1>
|   |---...
|---sparse
    |---0
        |---cameras.bin
        |---images.bin
        |---points3D.bin
```

위에 폴더 구조를 따라야 된다.

```
  File "/repositories/gaussian-splatting/scene/dataset_readers.py", line 95, in readColmapCameras
    assert False, "Colmap camera model not handled: only undistorted datasets (PINHOLE or SIMPLE_PINHOLE cameras) supported!"
AssertionError: Colmap camera model not handled: only undistorted datasets (PINHOLE or SIMPLE_PINHOLE cameras) supported!
```


# 참조
-----

* [3D Gaussian Splatting for Real-Time Radiance Field Rendering](https://github.com/graphdeco-inria/gaussian-splatting)
* [3D Gaussian splatting for Three.js](https://github.com/mkkellogg/GaussianSplats3D)
* [COLMAP – SfM and MVS](https://demuc.de/colmap/)
