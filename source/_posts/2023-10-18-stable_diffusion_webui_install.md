---
layout: post
title: "stable-diffusion-webui 우분투에 설치"
date: 2023-10-18 13:19 +0900
comments: true
tags: [ "stable-diffusion-webui","stable diffusion"]
categories: [ "tool" ]
sitemap:
changefreq: daily
priority: 1.0
---

# stable-diffusion-webui 우분투에 설치

```shell

sudo apt install git python3.10-venv -y
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui && cd stable-diffusion-webui
python3.10 -m venv venv

```

## 시작 방법

```shell
./webui.sh
```

## 외부에서 접속가능하게 설정

```shell

./webui.sh --listen
```

## 팁

아래 처럼 모델 다운로드시에는 꼭 lfs로 해야 된다

```shell
git lfs install
git clone https://huggingface.co/lllyasviel/ControlNet-v1-1
```

플러그인 설치는 외부로 오픈된 상태에서는 설정이 되지 않는다

## 오류

아래 오류에서 저는 모델 이 잘못됨
```
2023-10-18 13:56:20,737 - ControlNet - INFO - Loading model: control_v11e_sd15_ip2p [e3b0c442]
*** Error running process: /repositories/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py
    Traceback (most recent call last):
      File "/repositories/stable-diffusion-webui/modules/scripts.py", line 619, in process
        script.process(p, *script_args)
      File "/repositories/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py", line 977, in process
        self.controlnet_hack(p)
      File "/repositories/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py", line 966, in controlnet_hack
        self.controlnet_main_entry(p)
      File "/repositories/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py", line 688, in controlnet_main_entry
        model_net = Script.load_control_model(p, unet, unit.model)
      File "/repositories/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py", line 321, in load_control_model
        model_net = Script.build_control_model(p, unet, model)
      File "/repositories/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py", line 349, in build_control_model
        state_dict = load_state_dict(model_path)
      File "/repositories/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/utils.py", line 20, in load_state_dict
        state_dict = unsafe_torch_load(ckpt_path, map_location=torch.device(location))
      File "/repositories/stable-diffusion-webui/venv/lib/python3.10/site-packages/torch/serialization.py", line 815, in load
        return _legacy_load(opened_file, map_location, pickle_module, **pickle_load_args)
      File "/repositories/stable-diffusion-webui/venv/lib/python3.10/site-packages/torch/serialization.py", line 1033, in _legacy_load
        magic_number = pickle_module.load(f, **pickle_load_args)
    _pickle.UnpicklingError: invalid load key, 'v'.
```

# 참조
-----

* [installation-and-running](https://github.com/AUTOMATIC1111/stable-diffusion-webui#installation-and-running)
* [Can this be made avalable network-wide, not just on localhost? #88](https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues/88)
* [Could not set ControlNet value: invalid literal for int() with base 10: 'initial'](https://github.com/Mikubill/sd-webui-controlnet/issues/1617)
