---
layout: post
title: "Poetry: debugging"
date: 2024-11-01 17:00 +0900
comments: true
tags: [ "Poetry","debugging","error"]
categories: [ "python" ]
sitemap:
changefreq: daily
priority: 1.0
---

# Poetry: debugging

poetry install 이 않되서 삼질 함

```
poetry --vvv install
```

```

poetry -vvv install

Loading configuration file /home/dev/.config/pypoetry/config.toml
Adding repository pytorch (https://download.pytorch.org/whl/cu124) and setting it as supplemental
Using virtualenv: /repositories/SimpleTuner/.venv
Installing dependencies from lock file

Finding the necessary packages for the current system

Package operations: 152 installs, 2 updates, 0 removals, 12 skipped

  - Installing nvidia-nvjitlink-cu12 (12.4.99): Pending...
Checking if keyring is available
[keyring:keyring.backend] Loading KWallet
[keyring:keyring.backend] Loading SecretService
[keyring:keyring.backend] Loading Windows
[keyring:keyring.backend] Loading chainer
[keyring:keyring.backend] Loading libsecret
[keyring:keyring.backend] Loading macOS
Using keyring backend 'SecretService Keyring'

```

```shell

poetry config keyring.enabled false

```

# 참조
-----

* [Poetry](https://github.com/python-poetry/poetry)
* [Regression: Poetry 1.7 hangs instead of asking to unlock keyring](https://github.com/python-poetry/poetry/issues/8623)
