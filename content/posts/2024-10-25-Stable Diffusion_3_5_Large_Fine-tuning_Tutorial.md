---
layout: post
title: "Stable Diffusion 3.5 Large Fine-tuning Tutorial"
date: 2024-10-25 15:30 +0900
comments: true
tags: [ "LORA","Lora", "훈련", "학습" ,"SD 3.5", "Large", "Fine-tuning", "Tutorial","stable diffusion"]
categories: [ "Machine Learning" ]
sitemap:
    changefreq: daily
    priority: 1.0
---
# Stable Diffusion 3.5 Large Fine-tuning Tutorial

이글은 [Stable Diffusion 3.5 Large Fine-tuning Tutorial](https://stabilityai.notion.site/Stable-Diffusion-3-5-Large-Fine-tuning-Tutorial-11a61cdcd1968027a15bdbd7c40be8c6)
글을 번역한 글입니다 이미지는 따로 첨부 하지 않으며 필요하다고 생각하는 부분만 번역합니다

# 대상 : 미세 조정에 대한 최소한의 기본 지식을 갖춘 엔지니어 또는 기술 인력

목적: SD1.5/SDXL과 Stable Diffusion 3 Medium/Large(SD3.5M/L) 미세 조정 간의 차이점을 이해하고 더 많은 사용자가 두 모델을 미세 조정할 수 있도록 합니다.

## Tools

[SimpleTuner](https://github.com/bghira/SimpleTuner) toolkit

## Environment Setup

환경 설정은 여전히 이전과 비슷하지만, 이전 게시물 이후 SimpleTuner의 구성에는 **많은** 변경이 있었습니다. 
가능한 한 이 작업을 간소화하려고 노력하겠지만 이전 `config.env` 파일과 새로운 `config.env` 및 `config.json`을 모두 사용하여 실험했습니다.
[여기](https://github.com/bghira/SimpleTuner/blob/main)에 지정된 [configure.py](https://github.com/bghira/SimpleTuner/blob/main/configure.py) 방법을 사용했습니다. /documentation/quickstart/SD3.md)를 참조하여 결과 파일이 무엇을 제공하는지 확인하세요.

[**⚠️](https://emojipedia.org/warning)** Just a note of warning, if you’d like to use your [old](https://www.notion.so/17f90df74bce4c62a295849f0dc8fb7e?pvs=21) `config.env` files, you’ll have to do some slight tweaking. I’ll cover it later in this [section](https://www.notion.so/Stable-Diffusion-3-5-Large-Fine-tuning-Tutorial-11a61cdcd1968027a15bdbd7c40be8c6?pvs=21).

If you want to see the full list of options available, you can check the [OPTIONS.MD](https://github.com/bghira/SimpleTuner/blob/main/OPTIONS.md#environment-configuration-variables) file.

- Sample `.json` generated with `configure.py` (used as a reference)

```json
    {
        "--resume_from_checkpoint": "latest",
        "--data_backend_config": "config/multidatabackend.json",
        "--aspect_bucket_rounding": 2,
        "--seed": 42,
        "--minimum_image_size": 0,
        "--disable_benchmark": false,
        "--output_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/",
        "--lora_type": "standard",
        "--lora_rank": 256,
        "--max_train_steps": 24000,
        "--num_train_epochs": 0,
        "--checkpointing_steps": 400,
        "--checkpoints_total_limit": 60,
        "--tracker_project_name": "sd35-training",
        "--tracker_run_name": "simpletuner-sd35-large-fantasy-art-01",
        "--report_to": "wandb",
        "--model_type": "lora",
        "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3.5-large",
        "--model_family": "sd3",
        "--train_batch_size": 6,
        "--gradient_checkpointing": "true",
        "--caption_dropout_probability": 0.0,
        "--resolution_type": "pixel_area",
        "--resolution": "1024",
        "--validation_seed": "42",
        "--validation_steps": "35",
        "--validation_resolution": "1024x1024",
        "--validation_guidance": "7.5",
        "--validation_guidance_rescale": "0.0",
        "--validation_num_inference_steps": "35",
        "--validation_prompt": "k4s4, a waist up view of a beautiful blonde woman, green eyes",
        "--mixed_precision": "bf16",
        "--optimizer": "adamw_bf16",
        "--learning_rate": "1.05e-3",
        "--lr_scheduler": "polynomial",
        "--lr_warmup_steps": "2400",
        "--validation_torch_compile": "false"
    }

```



또한, [릴리스 브랜치](https://github.com/bghira/SimpleTuner/tree/release) 대신 `SimpleTuner`의 최신 메인 브랜치 중 하나를 사용하고 있습니다. 가능한 한 현재까지. 커밋 해시(2024년 10월 15일)는 다음과 같습니다.
```
694784083c70bf81086bb3ceba86262b7b22757d
```

### Python Dependencies

종속성을 설치하려면 저장소 페이지에서 SD3용 [빠른 시작 가이드](https://github.com/bghira/SimpleTuner/blob/main/documentation/quickstart/SD3.md)를 따르세요. 여기에서도 살펴보고 대체 설치 방법도 추가하겠습니다. `SimpleTuner`(`12.4+`)와 일치하는 `CUDA` 버전이 있는 경우 종속성 설치가 매우 간단할 수 있지만 `CUDA`의 이전 버전을 사용하는 경우 조금 더 복잡해질 수 있습니다.

우선 저장소를 `git clone`합니다.

```
git clone https://github.com/bghira/SimpleTuner.git
```

```
cd SimpleTuner
```


마지막으로 위에서 언급한 커밋 해시를 확인하세요. 디버깅을 하고 싶다면 계속해서 분기를 생성해 보겠습니다('base_branch'라는 이름, 자유롭게 이름을 바꾸세요).

```
git checkout -b base_branch 694784083c70bf81086bb3ceba86262b7b22757d
```


```
git branch
```

새 지점에 있으면 Python 가상 환경을 만들 차례입니다. 종속성을 설치할 때 `python 3.11`을 사용하는 것이 좋습니다.

각각 다음 명령을 사용하여 `OS` 및 `CUDA` 환경을 확인할 수 있습니다.

```bash
uname -a
```

```bash
nvcc --version
```

```bash
python --version
```


`SimpleTuner` 디렉터리의 루트에 이 명령을 사용하여 `virtualenv`를 만듭니다.

```
python -m venv .venv
```

Activate it with:

```
source .venv/bin/activate
```

완료되면 `poetry`(`pip` 또는 `uv`와 유사한 종속성 관리자)를 설치합니다.

```
pip install -U poetry pip
```

`bghira`는 안전을 위해 이 명령을 실행할 것을 권장합니다:

```
poetry config virtualenvs.create false
```

저는 `Linux`를 사용하고 있으므로 다음 단계는 다음 명령을 사용하여 모든 종속성을 설치하는 것입니다.

```jsx
poetry install
```


그러나 SD3.5 Large는 `diffusers`의 특정 커밋에 따라 달라집니다(아마도 최신 버전도 작동할 것입니다). 이 [커밋](https://github.com/huggingface/diffusers/commit/e2d037bbf1388fdc172458bed7a8a58b34fc6f84) 이상이 포함된 버전을 사용하고 있는지 확인하세요.

```markdown
e2d037bbf1388fdc172458bed7a8a58b34fc6f84
```


이는 'bghira'로 변경될 수 있으며 그의 팀은 SimpleTuner 저장소를 매우 빠르게 업데이트합니다. 올바른 버전의 `diffusers`를 사용하고 있는지 확인하려면 `SimpleTuner` 디렉터리의 `pyproject.toml` 파일을 변경하여 올바른 커밋을 사용하세요.


```toml
    [tool.poetry]
    name = "simpletuner"
    version = "1.1.0"
    description = "Stable Diffusion 2.x and XL tuner."
    authors = ["bghira"]
    license = "AGPLv3"
    readme = "README.md"
    package-mode = false
    
    [tool.poetry.dependencies]
    python = ">=3.10,<3.12"
    torch = { version = "2.4.1+cu124", source = "pytorch" }
    torchvision = { version = ">0.19", source = "pytorch" }
    diffusers = {git = "https://github.com/huggingface/diffusers", rev = "e2d037b"}
    transformers = "^4.45.1"
    datasets = "^3.0.1"
    bitsandbytes = "^0.44.1"
    wandb = "^0.18.2"
    requests = "^2.32.3"
    pillow = "^10.4.0"
    opencv-python = "^4.10.0.84"
    deepspeed = "^0.15.1"
    accelerate = "^0.34.2"
    safetensors = "^0.4.5"
    compel = "^2.0.1"
    clip-interrogator = "^0.6.0"
    open-clip-torch = "^2.26.1"
    iterutils = "^0.1.6"
    scipy = "^1.11.1"
    boto3 = "^1.35.24"
    pandas = "^2.2.3"
    botocore = "^1.35.24"
    urllib3 = "<1.27"
    torchaudio = "^2.4.1"
    triton-library = "^1.0.0rc4"
    torchsde = "^0.2.5"
    torchmetrics = "^1.1.1"
    colorama = "^0.4.6"
    numpy = "1.26"
    peft = "^0.12.0"
    tensorboard = "^2.17.1"
    triton = {version = "^3.0.0", source = "pytorch"}
    sentencepiece = "^0.2.0"
    optimum-quanto = {git = "https://github.com/huggingface/optimum-quanto"}
    lycoris-lora = {git = "https://github.com/kohakublueleaf/lycoris", rev = "dev"}
    torch-optimi = "^0.2.1"
    toml = "^0.10.2"
    fastapi = {extras = ["standard"], version = "^0.115.0"}
    torchao = {version = "^0.5.0+cu124", source = "pytorch"}
    lm-eval = "^0.4.4"
    nvidia-cudnn-cu12 = "*"
    nvidia-nccl-cu12 = "*"
    
    [build-system]
    requires = ["poetry-core", "setuptools", "wheel", "torch"]
    build-backend = "poetry.core.masonry.api"
    
    [[tool.poetry.source]]
    priority = "supplemental"
    name = "pytorch"
    url = "https://download.pytorch.org/whl/cu124"
    
```



변경 사항은 다음과 같습니다.

Old

```toml
diffusers = {git = "https://github.com/huggingface/diffusers", rev = "quantization-config"}
```

New

```toml
diffusers = {git = "https://github.com/huggingface/diffusers", rev = "e2d037b"}
```

이제 필요한 `SimpleTuner` 종속성이 모두 설치되어 있어야 합니다.
- 
- [**🚨](https://emojipedia.org/police-car-light)** 컴퓨터 환경에서 'CUDA 12.4' 이상이 아닌 경우 'SimpleTuner'가 'CUDA 12.4' 이상이라는 가정하에 작동하므로 CUDA 종속성 문제가 발생할 수 있습니다. 앞서 알아차리셨다면 저는 `CUDA 12.2`를 사용 중이었고 `poetry install` 문제가 발생했습니다.
    - 이 단락을 펼치고 **대체** 설치 지침을 보려면 ▷를 클릭하세요.

      대신, 제가 한 일은 기본 `torch` 종속성을 먼저 설치한 다음 `pyproject.toml`의 나머지 종속성을 포함하는 `requirements.txt` 파일을 만드는 것이었습니다. 그런 다음 해당 텍스트 파일에 `pip install`을 실행했습니다.

      `poetry install`을 먼저 시도하고 문제가 발생했다면 기존 `virtualenv`를 제거하고 다시 설치하는 것이 좋습니다.
        ```bash
        rm -rf .venv
        ```

        ```bash
        python -m venv .venv
        ```

        ```bash
        source .venv/bin/activate
        ```

        이제 'CUDA' 버전에 따라 먼저 토치 종속성을 설치하세요. CUDA 12.1은 내 환경인 'CUDA 12.2'에 비해 낮은 버전이므로 나에게 적합합니다.

        ```bash
        pip install torch==2.4.1+cu121 torchvision==0.19.1+cu121 torchaudio==2.4.1+cu121 --index-url https://download.pytorch.org/whl/cu121
        ```

      'cu121'이 추가된 것을 볼 수 있습니다. 이는 'CUDA' 버전을 지정합니다. `CUDA` 버전에 맞게 변경하세요.
      그런 다음 `torchao`를 설치합니다.

        ```bash
        pip install torchao --extra-index-url https://download.pytorch.org/whl/cu121
        ```

      이제 `SimpleTuner` 디렉터리 루트에 `requirements.txt` 파일을 만듭니다.

        - `requirements.txt`

            ```text
            diffusers @ git+https://github.com/huggingface/diffusers.git@e2d037b
            transformers==4.45.1
            datasets==3.0.1
            bitsandbytes==0.44.1
            wandb==0.18.2
            requests==2.32.3
            pillow==10.4.0
            opencv-python==4.10.0.84
            deepspeed==0.15.1
            accelerate==0.34.2
            safetensors==0.4.5
            compel==2.0.1
            clip-interrogator==0.6.0
            open-clip-torch==2.26.1
            iterutils==0.1.6
            scipy==1.11.1
            boto3==1.35.24
            pandas==2.2.3
            botocore==1.35.24
            urllib3<1.27
            triton-library==1.0.0rc2
            torchsde==0.2.5
            torchmetrics==1.1.1
            colorama==0.4.6
            numpy==1.26
            peft==0.12.0
            tensorboard==2.17.1
            triton==3.0.0
            sentencepiece==0.2.0
            optimum-quanto @ git+https://github.com/huggingface/optimum-quanto.git
            lycoris-lora @ git+https://github.com/kohakublueleaf/lycoris.git@dev
            torch-optimi==0.2.1
            toml==0.10.2
            fastapi[standard]==0.115.0
            lm-eval==0.4.4
            ```

        완료되면 종속성을 설치하십시오.
        
        ```bash
        pip install -r requirements.txt
        ```

       이제 필요한 모든 종속성이 설치되어 있어야 합니다.


### Model Dependencies


이번에는 기본 체크포인트와 디퓨저가 `stabilityai/stable-diffusion-'이라는 Hugging Face [저장소](https://huggingface.co/stabilityai/stable-diffusion-3.5-large)에 모두 잘 패키지되어 있습니다. 



`MODEL_NAME`(`config.env`를 사용하는 경우) 또는 `--pretrained_model_name_or_path`(`config.json`을 사용하는 경우)를 `stabilityai/stable-diffusion-3.5-large`로 설정하세요. `SimpleTuner`는 Hugging Face에서 모델을 가져와 홈 디렉토리의 `.cache` 디렉토리에 저장합니다.

```bash
~/.cache/huggingface/hub 
```

모델 파일은 `~/.cache/huggingface/hub/models--stabilityai--stable-diffusion-3.5-large/snapshots/hash` 내에 다음과 같이 표시됩니다.

### Configuration setup (high-level)

이전 버전의 'SimpleTuner'에서 오시는 경우 상위 수준 구성 파일 설정이 크게 변경되었습니다. 그러나 내부 [OPTIONS.MD](https://github.com/bghira/SimpleTuner/blob/main/OPTIONS.md#environment-configuration-variables)는 여전히 동일하게 유지됩니다.

[**⚠️](https://emojipedia.org/warning) 특히**, [SD3 빠른 시작](https://github.com/bghira/SimpleTuner/blob/main/documentation/quickstart/)만 따르면 됩니다. SD3.md) 구성 파일을 정확히 어떻게 설정해야 하는지 전체 그림을 얻지 못할 수도 있습니다. `SimpleTuner`의 [INSTALL.MD](https://github.com/bghira/SimpleTuner/blob/main/INSTALL.md) 파일은 구성 파일 시스템이 정확히 어떻게 작동하는지에 대한 전체 그림을 제공합니다.

더 진행하기 전에 실제로 훈련이 어떻게 시작되는지 알아보고 싶습니다. 빠른 시작에서는 다음을 사용하여 실행한다고 나와 있습니다.

```bash
bash train.sh
```

- 기본 [train.sh](http://train.sh)가 여기에 제공됩니다.

    ```bash
    #!/usr/bin/env bash
    
    # Pull config from config.env
    [ -f "config/config.env" ] && source config/config.env
    
    # If the user has not provided VENV_PATH, we will assume $(pwd)/.venv
    if [ -z "${VENV_PATH}" ]; then
        # what if we have VIRTUAL_ENV? use that instead
        if [ -n "${VIRTUAL_ENV}" ]; then
            export VENV_PATH="${VIRTUAL_ENV}"
        else
            export VENV_PATH="$(pwd)/.venv"
        fi
    fi
    if [ -z "${DISABLE_LD_OVERRIDE}" ]; then
        export NVJITLINK_PATH="$(find "${VENV_PATH}" -name nvjitlink -type d)/lib"
        # if it's not empty, we will add it to LD_LIBRARY_PATH at the front:
        if [ -n "${NVJITLINK_PATH}" ]; then
            export LD_LIBRARY_PATH="${NVJITLINK_PATH}:${LD_LIBRARY_PATH}"
        fi
    fi
    
    export TOKENIZERS_PARALLELISM=false
    export PLATFORM
    PLATFORM=$(uname -s)
    if [[ "$PLATFORM" == "Darwin" ]]; then
        export MIXED_PRECISION="no"
    fi
    
    if [ -z "${ACCELERATE_EXTRA_ARGS}" ]; then
        ACCELERATE_EXTRA_ARGS=""
    fi
    
    if [ -z "${TRAINING_NUM_PROCESSES}" ]; then
        echo "Set custom env vars permanently in config/config.env:"
        printf "TRAINING_NUM_PROCESSES not set, defaulting to 1.\n"
        TRAINING_NUM_PROCESSES=1
    fi
    
    if [ -z "${TRAINING_NUM_MACHINES}" ]; then
        printf "TRAINING_NUM_MACHINES not set, defaulting to 1.\n"
        TRAINING_NUM_MACHINES=1
    fi
    
    if [ -z "${MIXED_PRECISION}" ]; then
        printf "MIXED_PRECISION not set, defaulting to bf16.\n"
        MIXED_PRECISION=bf16
    fi
    
    if [ -z "${TRAINING_DYNAMO_BACKEND}" ]; then
        printf "TRAINING_DYNAMO_BACKEND not set, defaulting to no.\n"
        TRAINING_DYNAMO_BACKEND="no"
    fi
    
    if [ -z "${ENV}" ]; then
        printf "ENV not set, defaulting to default.\n"
        export ENV="default"
    fi
    export ENV_PATH=""
    if [[ "$ENV" != "default" ]]; then
        export ENV_PATH="${ENV}/"
    fi
    
    if [ -z "${CONFIG_BACKEND}" ]; then
        if [ -n "${CONFIG_TYPE}" ]; then
            export CONFIG_BACKEND="${CONFIG_TYPE}"
        fi
    fi
    
    if [ -z "${CONFIG_BACKEND}" ]; then
        export CONFIG_BACKEND="env"
        export CONFIG_PATH="config/${ENV_PATH}config"
        if [ -f "${CONFIG_PATH}.json" ]; then
            export CONFIG_BACKEND="json"
        elif [ -f "${CONFIG_PATH}.toml" ]; then
            export CONFIG_BACKEND="toml"
        elif [ -f "${CONFIG_PATH}.env" ]; then
            export CONFIG_BACKEND="env"
        fi
        echo "Using ${CONFIG_BACKEND} backend: ${CONFIG_PATH}.${CONFIG_BACKEND}"
    fi
    
    # Update dependencies
    if [ -z "${DISABLE_UPDATES}" ]; then
        echo 'Updating dependencies. Set DISABLE_UPDATES to prevent this.'
        if [ -f "pyproject.toml" ] && [ -f "poetry.lock" ]; then
            nvidia-smi 2> /dev/null && poetry install
            uname -s | grep -q Darwin && poetry install -C install/apple
            rocm-smi 2> /dev/null && poetry install -C install/rocm
        fi
    fi
    # Run the training script.
    if [[ -z "${ACCELERATE_CONFIG_PATH}" ]]; then
        ACCELERATE_CONFIG_PATH="${HOME}/.cache/huggingface/accelerate/default_config.yaml"
    fi
    if [ -f "${ACCELERATE_CONFIG_PATH}" ]; then
        echo "Using Accelerate config file: ${ACCELERATE_CONFIG_PATH}"
        accelerate launch --config_file="${ACCELERATE_CONFIG_PATH}" train.py
    else
        echo "Accelerate config file not found: ${ACCELERATE_CONFIG_PATH}. Using values from config.env."
        accelerate launch ${ACCELERATE_EXTRA_ARGS} --mixed_precision="${MIXED_PRECISION}" --num_processes="${TRAINING_NUM_PROCESSES}" --num_machines="${TRAINING_NUM_MACHINES}" --dynamo_backend="${TRAINING_DYNAMO_BACKEND}" train.py
    
    fi
    
    exit 0
    ```


이것이 일반적인 흐름입니다.

처음에는 `SimpleTuner/config` 디렉토리에서 `config.env`를 소스로 사용합니다. 이는 `gpus` 수와 같은 중요한 설정이 포함된 상위 수준 `config.env`가 있고 보다 세부적인 설정이 포함된 `config.json` 또는 `config.env`와 같은 하위 수준 구성이 있기 때문에 혼란스럽습니다. 설정(예: `model_family`, `learning_rate` 등).

그러나 저장소를 `git clone`하면 `config.env` 파일이 표시되지 않습니다.

내 테스트에서는 실제로 [INSTALL.MD](https://github.com/bghira/SimpleTuner/blob/main/INSTALL.md)에 따라 상위 수준 `config.env`를 생성할 필요가 없습니다. , 하지만 `config` 폴더 내에서 폴더를 동적으로 전환하는 데 도움이 되므로 그렇게 하는 것이 좋습니다.

`config` 디렉터리에 `config.env` 파일을 만듭니다.

```bash
vim SimpleTuner/config/config.env
```

- High-level `config.env`

    ```bash
    TRAINING_NUM_PROCESSES=1
    TRAINING_NUM_MACHINES=1
    TRAINING_DYNAMO_BACKEND='no'
    MIXED_PRECISION='bf16'
    export CONFIG_BACKEND="json"
    export ENV="default"
    ```


```bash
bash train.sh
```


`SimpleTuner`는 `ENV` 디렉토리 내에서 `config` 디렉토리인 `config.json`을 검색합니다. 그 이유는 마스터 `config.env` 파일에서 `ENV`가 `default`로 설정되어 있기 때문입니다. 이는 `SimpleTuner/config`를 의미합니다.

'config.json'을 찾는 이유가 무엇인지 물어볼 수도 있습니다. 음, [`train.sh`](http://train.sh) 파일에서 이 코드 블록을 보면, `CONFIG_BACKEND`로 지정한 내용에 따라 이 파일을 찾는다는 것을 알 수 있습니다. 마스터 `config.env` 파일:

```bash
if [ -z "${CONFIG_BACKEND}" ]; then
    export CONFIG_BACKEND="env"
    export CONFIG_PATH="config/${ENV_PATH}config"
    if [ -f "${CONFIG_PATH}.json" ]; then
        export CONFIG_BACKEND="json"
    elif [ -f "${CONFIG_PATH}.toml" ]; then
        export CONFIG_BACKEND="toml"
    elif [ -f "${CONFIG_PATH}.env" ]; then
        export CONFIG_BACKEND="env"
    fi
    echo "Using ${CONFIG_BACKEND} backend: ${CONFIG_PATH}.${CONFIG_BACKEND}"
fi
```


`config.*`의 이름을 변경할 수 있는지 궁금하실 수도 있습니다. `config_fantasy_art_lora_01.*`를 사용할 수 있나요? `config_fantasy_art_full_01.*`은 어떻습니까?

안타깝게도 그럴 수 없는 것 같습니다. `train.sh` 파일에서 `config.*`의 이름을 변경하더라도 [loader.py](https://github.com/bghira/SimpleTuner/blob/main/helpers/configuration/loader) .py#L17) 구성 도우미의 코드는 기본적으로 다음 값으로 설정됩니다.

```bash
default_config_paths = {
    "json": "config.json",
    "toml": "config.toml",
    "env": "config.env",
}
```

따라서 세부 훈련 매개변수 설정으로 하위 수준 `config.*` 파일을 구별하고 [loader.py](https://github.com/bghira/SimpleTuner/blob)를 수정하고 싶지 않은 경우 /main/helpers/configuration/loader.py#L17) 코드를 사용하는 경우 훈련에 해당하는 `SimpleTuner/config` 디렉토리 내에 폴더를 생성하는 것이 좋습니다. 나도 똑같이 할 것이다.

`SimpleTuner/config` 안에 첫 번째 훈련을 위한 디렉토리를 생성해 보겠습니다.

```bash
mkdir SimpleTuner/config/sd35_fantasy_art_lora
```

이제 `SimpleTuner/config/config.env`에서 상위 수준 `config.env`를 다음과 같이 수정하겠습니다.

- High-level `config.env`

    ```bash
    TRAINING_NUM_PROCESSES=1
    TRAINING_NUM_MACHINES=1
    TRAINING_DYNAMO_BACKEND='no'
    MIXED_PRECISION='bf16'
    export CONFIG_BACKEND="json"
    export ENV="sd35_fantasy_art_lora"
    ```

훈련이 시작되면 먼저 `SimpleTuner/config/config.env`에서 마스터 `config.env`를 소싱한 다음 `SimpleTuner/config/sd35_fantasy_art_lora`에서 해당 `config.${CONFIG_BACKEND}` 파일을 찾습니다. 이 경우 `config.json` 입니다.

이를 이해하면 다양한 모델에 대한 다양한 'config' 학습 매개변수를 관리하는 것이 매우 쉬워지므로 학습 흐름이 명확해지기를 바랍니다.

이제 하위 수준 `config.*` 파일로 이동하겠습니다.

### Configuration setup (low-level)

`SimpleTuner/config/` 디렉토리에는 `bghira`에서 제공하는 기본 `config.json.example`이 있습니다.

자세한 내용을 알고 싶지 않다면 내 맞춤 `config.json` 사용으로 건너뛰세요.

- 맞춤형 SD3.5 대형 `LoRA` `config.json`

    ```json
    {
      "--model_type": "lora",
      "--model_family": "sd3",
      "--resume_from_checkpoint": "latest",
      "--checkpointing_steps": 400,
      "--checkpoints_total_limit": 60,
      "--learning_rate": 1.05e-3,
      "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3.5-large",
      "--report_to": "wandb",
      "--tracker_project_name": "sd35-training",
      "--tracker_run_name": "simpletuner-fantasy-art-lora-01",
      "--max_train_steps": 24000,
      "--num_train_epochs": 0,
      "--data_backend_config": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/multidatabackend.json",
      "--output_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models",
      "--push_to_hub": false,
      "--push_checkpoints_to_hub": true,
      "--hub_model_id": "sd35-training",
      "--resolution": 1024,
      "--resolution_type": "pixel",
      "--minimum_image_size": 1024,
      "--instance_prompt": "k4s4 ",
      "--validation_prompt": "k4s4, a waist up view of a beautiful female blonde woman, green eyes",
      "--validation_guidance": 7.5,
      "--validation_guidance_rescale": 0.0,
      "--validation_steps": 200,
      "--validation_num_inference_steps": 30,
      "--validation_negative_prompt": "blurry, cropped, ugly",
      "--validation_seed": 42,
      "--validation_resolution": 1024,
      "--train_batch_size": 6,
      "--gradient_accumulation_steps": 1,
      "--lr_scheduler": "cosine",
      "--lr_warmup_steps": 2400,
      "--caption_dropout_probability": 0,
      "--metadata_update_interval": 65,
      "--vae_batch_size": 12,
      "--delete_unwanted_images": false,
      "--delete_problematic_images": false,
      "--training_scheduler_timestep_spacing": "trailing",
      "--inference_scheduler_timestep_spacing": "trailing",
      "--snr_gamma": 5,
      "--enable_xformers_memory_efficient_attention": true,
      "--gradient_checkpointing": true,
      "--allow_tf32": true,
      "--optimizer": "adamw_bf16",
      "--use_ema": false,
      "--ema_decay": 0.999,
      "--seed": 42,
      "--mixed_precision": "bf16",
      "--lora_rank": 768,
      "--lora_alpha": 768,
      "--lora_type": "standard"
    }
    ```

자세한 내용을 알고 싶다면 계속 읽어보세요.

`SimpleTuner` 루트에 있는 `config` 파일을 `ENV` 디렉터리에 복사하여 시작할 수 있습니다. 이것이 내 명령이다.

```jsx
cp config/config.json.example config/sd35_fantasy_art_lora/config.json
```

일단 열면 `json` 파일은 다음과 같습니다:

- `config.json.example`

    ```json
    {
        "--resume_from_checkpoint": "latest",
        "--data_backend_config": "config/multidatabackend.json",
        "--aspect_bucket_rounding": 2,
        "--seed": 42,
        "--minimum_image_size": 0,
        "--output_dir": "output/models",
        "--lora_type": "lycoris",
        "--lycoris_config": "config/lycoris_config.json",
        "--max_train_steps": 10000,
        "--num_train_epochs": 0,
        "--checkpointing_steps": 500,
        "--checkpoints_total_limit": 5,
        "--hub_model_id": "simpletuner-lora",
        "--push_to_hub": "true",
        "--push_checkpoints_to_hub": "true",
        "--tracker_project_name": "lora-training",
        "--tracker_run_name": "simpletuner-lora",
        "--report_to": "wandb",
        "--model_type": "lora",
        "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3.5-large",
        "--model_family": "sd3",
        "--train_batch_size": 1,
        "--gradient_checkpointing": "true",
        "--caption_dropout_probability": 0.1,
        "--resolution_type": "pixel_area",
        "--resolution": 1024,
        "--validation_seed": 42,
        "--validation_steps": 500,
        "--validation_resolution": "1024x1024",
        "--validation_guidance": 3.0,
        "--validation_guidance_rescale": "0.0",
        "--validation_num_inference_steps": "20",
        "--validation_prompt": "A photo-realistic image of a cat",
        "--mixed_precision": "bf16",
        "--optimizer": "adamw_bf16",
        "--learning_rate": "1e-4",
        "--lr_scheduler": "polynomial",
        "--lr_warmup_steps": 100,
        "--validation_torch_compile": "false",
        "--disable_benchmark": "false"
    }
    ```

원하신다면 이 제품을 즉시 사용하실 수 있습니다. 그러나 제공된 `json`에는 [OPTIONS.MD](https://github.com/bghira/SimpleTuner/blob/main/OPTIONS.md#environment-configuration-variables)의 다른 매개변수가 많이 부족합니다. [configure.py](https://github.com/bghira/SimpleTuner/blob/main/configure.py)를 사용하더라도 결국 다음과 같은 `config.json` 파일이 생성됩니다.

- `configure.py`로 생성된 샘플 `.json`(참조로 사용됨)

    ```json
    {
        "--resume_from_checkpoint": "latest",
        "--data_backend_config": "config/multidatabackend.json",
        "--aspect_bucket_rounding": 2,
        "--seed": 42,
        "--minimum_image_size": 0,
        "--disable_benchmark": false,
        "--output_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/",
        "--lora_type": "standard",
        "--lora_rank": 256,
        "--max_train_steps": 24000,
        "--num_train_epochs": 0,
        "--checkpointing_steps": 400,
        "--checkpoints_total_limit": 60,
        "--tracker_project_name": "sd35-training",
        "--tracker_run_name": "simpletuner-sd35-large-fantasy-art-01",
        "--report_to": "wandb",
        "--model_type": "lora",
        "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3-medium-diffusers",
        "--model_family": "sd3",
        "--train_batch_size": 6,
        "--gradient_checkpointing": "true",
        "--caption_dropout_probability": 0.0,
        "--resolution_type": "pixel_area",
        "--resolution": "1024",
        "--validation_seed": "42",
        "--validation_steps": "200",
        "--validation_resolution": "1024x1024",
        "--validation_guidance": "7.5",
        "--validation_guidance_rescale": "0.0",
        "--validation_num_inference_steps": "35",
        "--validation_prompt": "k4s4, a waist up view of a beautiful female blonde woman, green eyes",
        "--mixed_precision": "bf16",
        "--optimizer": "adamw_bf16",
        "--learning_rate": "1.05e-3",
        "--lr_scheduler": "polynomial",
        "--lr_warmup_steps": "2400",
        "--validation_torch_compile": "false"
    }
    ```

[configure.py](https://github.com/bghira/SimpleTuner/blob/main/configure.py)는 `lora_rank`와 같은 일부 매개변수를 제한할 뿐만 아니라 유효성 검사 중에 부정적인 프롬프트(`validation_negative_prompt)를 생략합니다. `) 무엇보다도 먼저 아래 `config.json`을 복사하여 시작하는 것이 좋습니다.

- Custom SD3.5 Large `LoRA` `config.json`

    ```json
    {
      "--model_type": "lora",
      "--model_family": "sd3",
      "--resume_from_checkpoint": "latest",
      "--checkpointing_steps": 400,
      "--checkpoints_total_limit": 60,
      "--learning_rate": 1.05e-3,
      "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3.5-large",
      "--report_to": "wandb",
      "--tracker_project_name": "sd35-training",
      "--tracker_run_name": "simpletuner-fantasy-art-lora-01",
      "--max_train_steps": 24000,
      "--num_train_epochs": 0,
      "--data_backend_config": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/multidatabackend.json",
      "--output_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models",
      "--push_to_hub": false,
      "--push_checkpoints_to_hub": true,
      "--hub_model_id": "sd35-training",
      "--resolution": 1024,
      "--resolution_type": "pixel",
      "--minimum_image_size": 1024,
      "--instance_prompt": "k4s4 ",
      "--validation_prompt": "k4s4, a waist up view of a beautiful female blonde woman, green eyes",
      "--validation_guidance": 7.5,
      "--validation_guidance_rescale": 0.0,
      "--validation_steps": 200,
      "--validation_num_inference_steps": 30,
      "--validation_negative_prompt": "blurry, cropped, ugly",
      "--validation_seed": 42,
      "--validation_resolution": 1024,
      "--train_batch_size": 6,
      "--gradient_accumulation_steps": 1,
      "--lr_scheduler": "cosine",
      "--lr_warmup_steps": 2400,
      "--caption_dropout_probability": 0,
      "--metadata_update_interval": 65,
      "--vae_batch_size": 12,
      "--delete_unwanted_images": false,
      "--delete_problematic_images": false,
      "--training_scheduler_timestep_spacing": "trailing",
      "--inference_scheduler_timestep_spacing": "trailing",
      "--snr_gamma": 5,
      "--enable_xformers_memory_efficient_attention": true,
      "--gradient_checkpointing": true,
      "--allow_tf32": true,
      "--optimizer": "adamw_bf16",
      "--use_ema": false,
      "--ema_decay": 0.999,
      "--seed": 42,
      "--mixed_precision": "bf16",
      "--lora_rank": 768,
      "--lora_alpha": 768,
      "--lora_type": "standard"
    }
    ```

뭔가 눈치채셨을 수도 있지만, 우리는 **더 이상** 이전 하위 수준 `config.env`의 이 매개변수를 사용하지 않습니다.

```bash

export STABLE_DIFFUSION_3=true

```

대신 `"--model_family"` 매개변수로 대체되었습니다. 이것을 `sd3`으로 설정합니다:

```
"--model_family": "sd3"
```


실제로, 낮은 수준 `config.env`는 `SimpleTuner`에 의해 더 이상 사용되지 않을 수 있습니다. 하지만 원하시면 그래도 사용하는 방법은 이 [섹션](https://www.notion.so/Stable-Diffusion-3-5-Large-Fine-tuning-Tutorial-11a61cdcd1968027a15bdbd7c40be8c6?pvs)에서 보여드리겠습니다. =21).


또한 이 매개변수가 제대로 설정되었는지 확인하세요. 그렇지 않으면 `HuggingFace`에서 모델을 가져올 수 없습니다.

```
 "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3.5-large"
```

이것이 작동하는지 확인하려면 'HuggingFace' 계정에 여기 모델 카드 페이지에서 이 모델에 대한 액세스 권한이 부여되었는지 확인해야 합니다. [빠른 시작 가이드](https://github.com/bghira/SimpleTuner/blob/main/documentation/quickstart/SD3.md)의 지침을 따르면 됩니다.

다음 명령은 다음과 같습니다.


**필수**

모델을 다운로드하기 위한 접근 권한을 얻기 위한 것입니다.

```bash
huggingface-cli login
```

나머지 설정을 다루기 전에 지금 'multidatabackend.json' 파일을 설정하는 것이 좋습니다.

### Dataloader


관련 매개변수를 인간이 이해할 수 있는 어휘로 구문 분석하기 전에 데이터 부분인 `--data_backend_config` 및 `--output_dir`부터 시작하고 싶습니다. 이전 버전의 `SimpleTuner`에는 데이터를 처리하는 `multidatabackend.json` 파일이 있었습니다.

Excerpt from old code:

```bash
export BASE_DIR="/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/"
export DATALOADER_CONFIG="${BASE_DIR}/multidatabackend.json"
export OUTPUT_DIR="${BASE_DIR}/models"
```

보시다시피 `BASE_DIR`이 선언된 다음 `DATALOADER_CONFIG`와 `OUTPUT_DIR`이 이를 확장합니다. `multidatabackend.json`은 `BASE_DIR` 내부에 생성된 파일입니다.


그러나 SimpleTuner의 기본 구성 폴더에는 'SimpleTuner/config/multidatabackend.json' 파일이 있습니다. 개인 취향에 따라 'multidatabackend.json' 파일을 원하는 곳에 모두 배치할 수 있지만, 모든 모델과 캐시를 한 곳에 보관하므로 이전 버전의 'SimpleTuner' 구조를 보존하겠습니다.

따라서 `BASE_DIR` 역할을 할 폴더 위치를 생성하겠습니다. 따라서 `--data_backend_config`와 `--output_dir` 모두 이 경로를 활용합니다.


우리는 `json`을 사용하고 있으므로 하드코딩해야 합니다.

```
 "--data_backend_config": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/multidatabackend.json",
  "--output_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models",
```


모든 모델은 `--output_dir`에 저장되며, 이 경우 하드 코딩된 `BASE_DIR/models`입니다.

다음은 내 사용자 정의 `multidatabackend.json`입니다.

- Custom `multidatabackend.json`

    ```json
    [
      {
        "id": "fantasy_art_neo",
        "type": "local",
        "crop": false,
        "crop_aspect": "square",
        "crop_style": "center",
        "resolution": 1.0,
        "minimum_image_size": 1.0,
        "maximum_image_size": 1.0,
        "target_downsample_size": 1.0,
        "resolution_type": "area",
        "cache_dir_vae": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/cache/vae/sd3/fantasy_art_neo",
        "instance_data_dir": "/weka2/home-yeo/datasets/SDXL/duplicate_shuffle_01",
        "disabled": false,
        "skip_file_discovery": "",
        "caption_strategy": "textfile",
        "metadata_backend": "json",
        "repeats": 1
      },
      {
        "id": "text-embeds",
        "type": "local",
        "dataset_type": "text_embeds",
        "default": true,
        "cache_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/cache/text/sd3/fantasy_art_neo",
        "disabled": false,
        "write_batch_size": 128
      }
    ]
    ```


지정해야 하는 디렉터리는 세 개입니다.

1. `cache_dir_vae`


내 예제 파일에는 다음이 있습니다.

```
    "cache_dir_vae": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/cache/vae/sd3/fantasy_art_neo"
```


가독성과 명확성을 위해 기본 디렉터리 안에 'cache' 폴더를 넣었습니다.

1. `instance_dir_vae`


여기에 이미지와 캡션이 포함된 데이터세트가 저장됩니다. 매우 간단합니다.

```
"instance_data_dir": "/weka2/home-yeo/datasets/SDXL/duplicate_shuffle_01"
```

1. `cache_dir`

위와 동일합니다.

```
    "cache_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/cache/text/sd3/fantasy_art_neo"
```


나머지 설정은 나에게 그다지 중요하지 않습니다. 저는 이미 이미지를 미리 잘라서 `"crop": false`를 설정했습니다.

또한 이전에 다른 교육 리포지토리를 사용해 본 적이 있는지 여부에 따라 익숙할 수도 있고 익숙하지 않을 수도 있는 '반복' 매개변수가 있습니다. 이 내용도 다음 섹션에서 다루겠습니다. 그래서 ``repeats": 1'을 제가 직접 처리하는 것입니다.

### Data preparation

내 데이터 세트의 모든 이미지는 이미 다음 종횡비 및 해상도 중 하나로 미리 잘려져 있습니다.

```
[
    (1024, 1024), (1152, 896), (896, 1152), (1216, 832),
    (832, 1216), (1344, 768), (768, 1344), (1472, 704)
]
```

이미지를 자동으로 미리 자르는 데 도움이 필요한 경우 이를 위해 제가 작성한 경량의 기본 [스크립트](https://github.com/kasukanra/autogen_local_LLM/blob/main/Detect_utils.py)가 있습니다. 다음에 따라 최상의 작물을 찾습니다.


1. 이미지에 사람 얼굴이 포함되어 있나요? 그렇다면 이미지의 해당 영역을 중심으로 자르기를 수행합니다.
2. 감지된 사람의 얼굴이 없으면 이미지에서 가장 흥미로운 영역을 감지하는 돌출 맵을 사용하여 자르기를 수행합니다. 그러면 해당 지역을 중심으로 가장 좋은 작물이 추출됩니다.


어쨌든 내 기본 데이터 세트 구조는 다음과 같습니다(텍스트 파일은 캡션입니다).

내 캡션이 어떻게 보이는지에 대한 몇 가지 예는 다음과 같습니다.

```markdown
k4s4, a close up portrait view of a young man with green eyes and short dark hair, looking at the viewer with a slight smile, visible ears, wearing a dark jacket, hair bangs, a green and orange background
```

```markdown
k4s4, a rear view of a woman wearing a red hood and faded skirt holding a staff in each hand and steering a small boat with small white wings and large white sail towards a city with tall structures, blue sky with white clouds, cropped
```


자체 미세 조정 데이터 세트가 없다면 John이 그린 그림의 [이 데이터 세트](https://drive.google.com/file/d/1capT9kF-zCu2OiNVzm7VG5DQDaAQLl1Q/view?usp=sharing)를 자유롭게 사용해 보세요. 가수 Sargent(WikiArt에서 다운로드하고 자동 캡션 있음) 또는 합성 픽셀 아트 [데이터세트](https://drive.google.com/file/d/1tOyNsjR5i7ki5UkyxHhjjT_VVD8vK5WN/view?usp=drive_link).

다양한 데이터 세트 크기의 여러 미세 조정된 'LoRA' 모델의 결과를 보여줌으로써 내가 선택한 설정이 'LoRA' 미세 조정을 위한 좋은 출발점이 될 만큼 충분히 일반화된다는 것을 보여줄 것입니다.

| `name` | `fantasy art` | `cinema photo` | `john singer sargent` | `underexposed photography` | `pixel art`  | `ethnic paint`  |
| --- | --- | --- | --- | --- | --- | --- |
| `number of images` | 476 | 460 | 460 | 96 | 82 | 68 |
| `number of repeats` | 5 | 5 | 5 | 5 | 5 | 5 |

`반복`은 이미지를 복제하고(선택적으로 회전하고, 색조/채도 등을 변경하는 등) 캡션도 모델에 일반화하고 과적합을 방지하는 데 도움이 됩니다. `SimpleTuner`는 캡션 드롭아웃(지정된 시간 비율에 따라 캡션을 무작위로 삭제)을 지원하지만 현재로서는 셔플링 토큰(토큰은 캡션의 단어와 유사함)을 지원하지 않지만 kohya의 동작을 시뮬레이션할 수 있습니다. [sd-scripts](https://github.com/kohya-ss/sd-scripts) [토큰 섞기](https://github.com/kohya-ss/sd-scripts/blob/25f961bc779bc79aef440813e3e8e92244ac5739/)할 수 있는 곳 docs/config_README-en.md?plain=1#L146) [유지]하는 동안(https://github.com/kohya-ss/sd-scripts/blob/25f961bc779bc79aef440813e3e8e92244ac5739/docs/config_README-en.md?plain=1 #L143) 시작 위치에 'n'개의 토큰이 있습니다. **이렇게 하면 모델이 외부 토큰에 너무 집착하지 않도록 도와줍니다.**

해당 기능을 복제하려면 여기에 이미지를 복제하고 캡션을 조작하는 스크립트를 제공했습니다.

- `duplicate_shuffle.py`

    ```python
    import os
    import shutil
    import random
    from pathlib import Path
    import re
    
    def duplicate_and_shuffle_dataset(input_folder, output_folder, dataset_repeats, n_tokens_to_keep):
        # Create output folder if it doesn't exist
        Path(output_folder).mkdir(parents=True, exist_ok=True)
    
        # Get all image files
        image_files = [f for f in os.listdir(input_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
        for i in range(dataset_repeats):
            for image_file in image_files:
                # Get corresponding text file
                text_file = os.path.splitext(image_file)[0] + '.txt'
                
                if not os.path.exists(os.path.join(input_folder, text_file)):
                    print(f"Warning: No corresponding text file found for {image_file}")
                    continue
    
                # Create new file names
                new_image_file = f"{os.path.splitext(image_file)[0]}_{i+1}{os.path.splitext(image_file)[1]}"
                new_text_file = f"{os.path.splitext(text_file)[0]}_{i+1}.txt"
    
                # Copy image file
                shutil.copy2(os.path.join(input_folder, image_file), os.path.join(output_folder, new_image_file))
    
                # Read, shuffle, and write text file
                with open(os.path.join(input_folder, text_file), 'r') as f:
                    content = f.read().strip()
    
                # Split tokens using comma or period as separator
                tokens = re.split(r'[,.]', content)
                tokens = [token.strip() for token in tokens if token.strip()]  # Remove empty tokens and strip whitespace
    
                tokens_to_keep = tokens[:n_tokens_to_keep]
                tokens_to_shuffle = tokens[n_tokens_to_keep:]
                random.shuffle(tokens_to_shuffle)
    
                new_content = ', '.join(tokens_to_keep + tokens_to_shuffle)
    
                with open(os.path.join(output_folder, new_text_file), 'w') as f:
                    f.write(new_content)
    
        print(f"Dataset duplication and shuffling complete. Output saved to {output_folder}")
    
    # Example usage
    input_folder = "/weka2/home-yeo/datasets/SDXL/full_dataset_neo"
    output_folder = "/weka2/home-yeo/datasets/SDXL/duplicate_shuffle_1"
    dataset_repeats = 5
    n_tokens_to_keep = 2
    
    duplicate_and_shuffle_dataset(input_folder, output_folder, dataset_repeats, n_tokens_to_keep)
    ```



그렇게 하면 최종 데이터 세트는 아래 이미지와 비슷해집니다. 제가 사용한 설정으로는 5번의 '반복'이 허용되는 것 같았습니다.


## Returning to the custom config


이제 사용자 정의 구성에서 이러한 특정 설정을 다루겠습니다.

### Learning rate/steps

- Custom SD3.5 Large  `config.json` for LoRA training

    ```json
    {
      "--model_type": "lora",
      "--model_family": "sd3",
      "--resume_from_checkpoint": "latest",
      "--checkpointing_steps": 400,
      "--checkpoints_total_limit": 60,
      "--learning_rate": 1.05e-3,
      "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3.5-large",
      "--report_to": "wandb",
      "--tracker_project_name": "sd35-training",
      "--tracker_run_name": "simpletuner-fantasy-art-lora-01",
      "--max_train_steps": 24000,
      "--num_train_epochs": 0,
      "--data_backend_config": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/multidatabackend.json",
      "--output_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models",
      "--push_to_hub": false,
      "--push_checkpoints_to_hub": true,
      "--hub_model_id": "sd35-training",
      "--resolution": 1024,
      "--resolution_type": "pixel",
      "--minimum_image_size": 1024,
      "--instance_prompt": "k4s4 ",
      "--validation_prompt": "k4s4, a waist up view of a beautiful blonde woman, green eyes",
      "--validation_guidance": 7.5,
      "--validation_guidance_rescale": 0.0,
      "--validation_steps": 200,
      "--validation_num_inference_steps": 30,
      "--validation_negative_prompt": "blurry, cropped, ugly",
      "--validation_seed": 42,
      "--validation_resolution": 1024,
      "--train_batch_size": 6,
      "--gradient_accumulation_steps": 1,
      "--lr_scheduler": "cosine",
      "--lr_warmup_steps": 2400,
      "--caption_dropout_probability": 0,
      "--metadata_update_interval": 65,
      "--vae_batch_size": 12,
      "--delete_unwanted_images": false,
      "--delete_problematic_images": false,
      "--training_scheduler_timestep_spacing": "trailing",
      "--inference_scheduler_timestep_spacing": "trailing",
      "--snr_gamma": 5,
      "--enable_xformers_memory_efficient_attention": true,
      "--gradient_checkpointing": true,
      "--allow_tf32": true,
      "--optimizer": "adamw_bf16",
      "--use_ema": false,
      "--ema_decay": 0.999,
      "--seed": 42,
      "--mixed_precision": "bf16",
      "--lora_rank": 768,
      "--lora_alpha": 768,
      "--lora_type": "standard"
    }
    ```

이제 사용자 정의 구성에서 이러한 설정을 다루겠습니다.

```json
{
  "--checkpointing_steps": 400,
  "--checkpoints_total_limit": 60,
  "--learning_rate": 1.05e-3,
  "--max_train_steps": 24000
}
```

### Steps calculation

최대 훈련 단계는 간단한 수학 방정식을 기반으로 계산할 수 있습니다(**단일 개념**의 경우).

$$
\text{Max training steps} = \left(\frac{\text{Number of samples} \times \text{Repeats}}{\text{Batch size}}\right) \times \text{Epochs}
$$

여기에는 네 가지 변수가 있습니다.

- 배치 크기: 한 번의 반복으로 처리되는 샘플 수입니다.
- 샘플 수: 데이터 세트의 총 샘플 수입니다.
- 반복 횟수: 한 에포크 내에서 데이터 세트를 반복하는 횟수입니다.
- Epochs: 전체 데이터세트가 처리되는 횟수입니다.


'fantasy art' 데이터세트에는 '476' 이미지가 있습니다. `multidatabackend.json`의 `5` 반복 위에 추가합니다. 나는 두 가지 이유로 `train_batch_size`를 `6`으로 선택했습니다:

1. 이 값을 사용하면 진행률 표시줄이 1~2초마다 업데이트되는 것을 볼 수 있습니다.
2. 한 번의 반복으로 '6'개의 샘플을 취할 수 있을 만큼 충분히 크므로 훈련 과정에서 더 많은 일반화가 이루어지도록 합니다.

30개 정도의 에포크를 원했다면 최종 계산은 다음과 같습니다.

$$
\text{Max training steps} = \left(\frac{\text{476} \times \text{5}}{\text{6}}\right) \times \text{30}
$$

이는 대략 '11,900' 단계와 같습니다.

괄호 안의 부분:

$$
\left(\frac{\text{476} \times \text{5}}{\text{6}}\right)
$$

는 에포크당 단계 수, 즉 '396'을 나타냅니다.

따라서 `CHECKPOINTING_STEPS`에 대해 이 값을 `400`으로 반올림했습니다.

[**⚠️](https://emojipedia.org/warning)** `MAX_NUM_STEPS`에 대해 `11,900`을 계산했지만 결국 `24,000`으로 설정했습니다. LoRA 훈련 샘플을 더 보고 싶었습니다. 따라서 원래 '11,900' 이후의 모든 값은 내가 과도한 훈련을 했는지 여부에 대한 좋은 척도가 될 것입니다. 그래서 총 단계 `11,900` x `2` = `23,800`을 두 배로 늘린 다음 반올림했습니다.

`CHECKPOINTING_STEPS`는 모델 체크포인트를 저장하려는 빈도를 나타냅니다. '400'으로 설정하는 것은 제게는 한 시대에 꽤 가깝기 때문에 괜찮아 보였습니다.

`CHECKPOINTING_LIMIT`은 이전 체크포인트를 덮어쓰기 전에 저장하려는 체크포인트 수입니다. 제 경우에는 체크포인트를 모두 유지하고 싶어서 '60'처럼 높은 숫자로 제한을 두었습니다.

### Multiple concepts

The above example is trained on a single concept with one unifying trigger word at the beginning: `k4s4`. However, if your dataset has multiple concepts/trigger words, then your step calculation could be something like this so:

`2` concepts `[a, b]`

$$
\text{Max steps} = \left(\frac{N_a \times R_a + N_b \times R_b}{\text{Batch size}}\right) \times \text{Epochs}
$$

`i` concepts

$$
\text{Max steps} = \left(\frac{\sum_{i \in C} N_i \times R_i}{\text{Batch size}}\right) \times \text{Epochs}
$$

마지막으로 학습률의 경우 '1.5e-3'으로 설정했습니다. 더 높을수록 기울기가 다음과 같이 폭발하기 때문입니다.

다른 관련 설정은 'LoRA'와 관련이 있습니다.

```json
{
  "--lora_rank": 768,
  "--lora_alpha": 768,
  "--lora_type": "standard"
}
```


개인적으로는 좀 더 높은 'LoRA' 랭크와 알파를 사용해 아주 만족스러운 결과를 얻었습니다. 내 YouTube [채널](https://youtube.com/@kasukanra)에서 'LoRA' 순위를 높일수록 이미지 충실도가 어떻게 증가하는지에 대한 보다 정확한 경험적 분석을 보려면 최신 동영상을 시청할 수 있습니다. .

어쨌든 VRAM, 저장 용량 또는 그렇게 높아질 시간이 없다면 '256' 또는 '128'과 같이 더 낮은 값을 선택할 수 있습니다.

`lora_type`에 관해서는, 나는 시도되고 진실된 `standard`를 사용하겠습니다. 'LoRA'의 'lycoris' 유형에 대한 또 다른 옵션이 있지만 아직은 매우 실험적이며 잘 탐색되지 않았습니다. 나는 'lycoris'에 대해 직접 심층 분석했지만 만족스러운 결과를 얻을 수 있는 올바른 설정을 찾지 못했습니다.

### Custom `config.json` miscellaneous

삶의 질을 위해 변경할 수 있는 몇 가지 추가 설정이 있습니다.

```json
{
  "--validation_prompt": "k4s4, a waist up view of a beautiful blonde woman, green eyes",
  "--validation_guidance": 7.5,
  "--validation_steps": 200,
  "--validation_num_inference_steps": 30,
  "--validation_negative_prompt": "blurry, cropped, ugly",
  "--validation_seed": 42,
  "--lr_scheduler": "cosine",
  "--lr_warmup_steps": 2400,
}
```

`"--validation_prompt": "k4s4, a waist up view of a beautiful blonde woman, green eyes"`

`"--validation_guidance": 7.5`
`"--validation_steps": 200`
`"--validation_num_inference_steps": 30`
`"--validation_negative_prompt": "blurry, cropped, ugly"`

`"--lr_scheduler": "cosine"`

`"--lr_warmup_steps": 2400`

이것들은 매우 자명합니다:

`"--validation_prompt"`

검증 이미지를 생성하는 데 사용할 프롬프트입니다. 이것이 당신의 긍정적인 메시지입니다.

`"--validation_negative_prompt"`

부정적인 프롬프트.

`"--validation_guidance"`

Classifier free guidance (CFG) scale.

`"--validation_num_inference_steps"`

사용할 샘플링 단계 수입니다.

`"--validation_seed"`

검증 이미지 생성 시 시드 값입니다.

`"--lr_warmup_steps"`

'SimpleTuner'는 설정하지 않을 경우 기본 워밍업을 전체 훈련 단계의 '10%'로 설정했는데, 이는 제가 자주 사용하는 값입니다. 그래서 (`24,000` * `0.1` = `2,400`)에 하드코딩했습니다. 자유롭게 변경해 보세요.

`"--validation_steps"`

검증 이미지를 생성하려는 빈도는 `"--validation_steps"`로 설정됩니다. 저는 400의 1/2인 200으로 설정했습니다(판타지 아트 예제 데이터세트에 대한 한 시대의 단계 수). 이는 에포크의 1/2마다 검증 이미지를 생성한다는 의미입니다. 온전한 확인을 위해 최소한 반기점마다 검증 이미지를 생성하는 것이 좋습니다. 그렇지 않으면 최대한 빨리 오류를 포착하지 못할 수도 있습니다.


마지막으로 `"--lr_scheduler"`와 `"--lr_warmup_steps"`입니다.

저는 '코사인' 스케줄러를 사용했습니다. 다음과 같은 모습입니다.


### What happened to the low-level `config.env` ?

앞서 언급했듯이 `SimpleTuner`는 낮은 수준의 `config.env` 형식에서 벗어나 사용 편의성을 위해 `json`을 선택하는 것으로 보입니다. 대부분의 다른 교육 리포지토리도 `json`을 사용합니다.

그러나 [loader.py](https://github.com/bghira/SimpleTuner/blob/main/helpers/configuration/loader.py#L17)의 코드를 기반으로 하위 수준 `config.env`는 계속 지원됩니다. . 또한 이전의 낮은 수준 `config.env` 파일이 이미 있는 `SimpleTuner`의 이전 사용자는 파일 형식을 전환하지 않고도 일부 매개변수를 조정하여 신속하게 속도를 얻을 수 있습니다(해당 [OPTIONS.MD](https //github.com/bghira/SimpleTuner/blob/main/OPTIONS.md#environment-configuration-variables)).

이는 위의 `config.json`과 동일한 버전이지만 `.env` 형식입니다.
- 
- Custom SD3.5 Large `LoRA` `config.env`

    ```bash
    export MODEL_TYPE='lora'
    export MODEL_FAMILY='sd3'
    export CONTROLNET=false
    export USE_DORA=false
    # Restart where we left off. Change this to "checkpoint-1234" to start from a specific checkpoint.
    export RESUME_CHECKPOINT="latest"
    export CHECKPOINTING_STEPS=400
    # This is how many checkpoints we will keep. Two is safe, but three is safer.
    export CHECKPOINTING_LIMIT=60
    
    # This is decided as a relatively conservative 'constant' learning rate.
    # Adjust higher or lower depending on how burnt your model becomes.
    export LEARNING_RATE=1.05e-3
    
    # Using a Huggingface Hub model:
    export MODEL_NAME="stabilityai/stable-diffusion-3.5-large"
    
    # Make DEBUG_EXTRA_ARGS empty to disable wandb.
    export DEBUG_EXTRA_ARGS="--report_to=wandb"
    export TRACKER_PROJECT_NAME="sd35-training"
    export TRACKER_RUN_NAME="simpletuner-fantasy-art-lora-01"
    
    # Max number of steps OR epochs can be used. Not both.
    export MAX_NUM_STEPS=24000
    export NUM_EPOCHS=0
    
    # A convenient prefix for all of your training paths.
    export DATALOADER_CONFIG="/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/multidatabackend.json"
    export OUTPUT_DIR="/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models"
    # Set this to "true" to push your model to Hugging Face Hub.
    export PUSH_TO_HUB="false"
    # If PUSH_TO_HUB and PUSH_CHECKPOINTS are both enabled, every saved checkpoint will be pushed to Hugging Face Hub.
    export PUSH_CHECKPOINTS="true"
    # This will be the model name for your final hub upload, eg. "yourusername/yourmodelname"
    # It defaults to the wandb project name, but you can override this here.
    # export HUB_MODEL_NAME=$TRACKER_PROJECT_NAME
    
    # By default, images will be resized so their SMALLER EDGE is 1024 pixels, maintaining aspect ratio.
    # Setting this value to 768px might result in more reasonable training data sizes for SDXL.
    export RESOLUTION=1024
    # If you want to have the training data resized by pixel area (Megapixels) rather than edge length,
    #  set this value to "area" instead of "pixel", and uncomment the next RESOLUTION declaration.
    export RESOLUTION_TYPE="pixel"
    #export RESOLUTION=1          # 1.0 Megapixel training sizes
    # If RESOLUTION_TYPE="pixel", the minimum resolution specifies the smaller edge length, measured in pixels. Recommended: 1024.
    # If RESOLUTION_TYPE="area", the minimum resolution specifies the total image area, measured in megapixels. Recommended: 1.
    export MINIMUM_RESOLUTION=1024
    
    # How many decimals to round aspect buckets to.
    #export ASPECT_BUCKET_ROUNDING=2
    
    # Use this to append an instance prompt to each caption, used for adding trigger words.
    # This has not been tested in SDXL.
    export INSTANCE_PROMPT="k4s4 "
    # If you also supply a user prompt library or `--use_prompt_library`, this will be added to those lists.
    export VALIDATION_PROMPT="k4s4, a waist up view of a beautiful blonde woman, green eyes"
    export VALIDATION_GUIDANCE=7.5
    # You'll want to set this to 0.7 if you are training a terminal SNR model.
    export VALIDATION_GUIDANCE_RESCALE=0.0
    # How frequently we will save and run a pipeline for validations.
    # export VALIDATION_STEPS=200
    export VALIDATION_STEPS=70
    export VALIDATION_NUM_INFERENCE_STEPS=30
    
    export VALIDATION_NEGATIVE_PROMPT="blurry, cropped, ugly"
    export VALIDATION_SEED=42
    export VALIDATION_RESOLUTION=1024
    
    # Adjust this for your GPU memory size. This, and resolution, are the biggest VRAM killers.
    export TRAIN_BATCH_SIZE=6
    # Accumulate your update gradient over many steps, to save VRAM while still having higher effective batch size:
    # effective batch size = ($TRAIN_BATCH_SIZE * $GRADIENT_ACCUMULATION_STEPS).
    export GRADIENT_ACCUMULATION_STEPS=1
    
    # Use any standard scheduler type. constant, polynomial, constant_with_warmup
    export LR_SCHEDULE="cosine"
    # A warmup period allows the model and the EMA weights more importantly to familiarise itself with the current quanta.
    # For the cosine or sine type schedules, the warmup period defines the interval between peaks or valleys.
    # Use a sine schedule to simulate a warmup period, or a Cosine period to simulate a polynomial start.
    # export LR_WARMUP_STEPS=$((MAX_NUM_STEPS / 10))
    export LR_WARMUP_STEPS=2400
    
    # Caption dropout probability. Set to 0.1 for 10% of captions dropped out. Set to 0 to disable.
    # You may wish to disable dropout if you want to limit your changes strictly to the prompts you show the model.
    # You may wish to increase the rate of dropout if you want to more broadly adopt your changes across the model.
    export CAPTION_DROPOUT_PROBABILITY=0
    
    export METADATA_UPDATE_INTERVAL=65
    export VAE_BATCH_SIZE=12
    
    # If this is set, any images that fail to open will be DELETED to avoid re-checking them every time.
    export DELETE_ERRORED_IMAGES=0
    # If this is set, any images that are too small for the minimum resolution size will be DELETED.
    export DELETE_SMALL_IMAGES=0
    
    # Bytedance recommends these be set to "trailing" so that inference and training behave in a more congruent manner.
    # To follow the original SDXL training strategy, use "leading" instead, though results are generally worse.
    export TRAINING_SCHEDULER_TIMESTEP_SPACING="trailing"
    export INFERENCE_SCHEDULER_TIMESTEP_SPACING="trailing"
    
    # Removing this option or unsetting it uses vanilla training. Setting it reweights the loss by the position of the timestep in the noise schedule.
    # A value "5" is recommended by the researchers. A value of "20" is the least impact, and "1" is the most impact.
    export MIN_SNR_GAMMA=5
    
    # Set this to an explicit value of "false" to disable Xformers. Probably required for AMD users.
    export USE_XFORMERS=true
    
    # There's basically no reason to unset this. However, to disable it, use an explicit value of "false".
    # This will save a lot of memory consumption when enabled.
    export USE_GRADIENT_CHECKPOINTING=true
    
    ##
    # Options below here may require a bit more complicated configuration, so they are not simple variables.
    ##
    
    # TF32 is great on Ampere or Ada, not sure about earlier generations.
    export ALLOW_TF32=true
    # AdamW 8Bit is a robust and lightweight choice. Adafactor might reduce memory consumption, and Dadaptation is slow and experimental.
    # AdamW is the default optimizer, but it uses a lot of memory and is slower than AdamW8Bit or Adafactor.
    # Choices: adamw, adamw8bit, adafactor, dadaptation
    # export OPTIMIZER="adamw_bf16"
    export OPTIMIZER="adamw_bf16"
    
    # EMA is a strong regularisation method that uses a lot of extra VRAM to hold two copies of the weights.
    # This is worthwhile on large training runs, but not so much for smaller training runs.
    export USE_EMA=false
    export EMA_DECAY=0.999
    
    export TRAINER_EXTRA_ARGS="--lora_rank=768 --lora_alpha=768"
    
    # Reproducible training. Set to -1 to disable.
    export TRAINING_SEED=42
    
    # Mixed precision is the best. You honestly might need to YOLO it in fp16 mode for Google Colab type setups.
    export MIXED_PRECISION="bf16"
    export PURE_BF16=true
    
    # This has to be changed if you're training with multiple GPUs.
    export TRAINING_NUM_PROCESSES=1
    export TRAINING_NUM_MACHINES=1
    export ACCELERATE_EXTRA_ARGS=""
    
    # With Pytorch 2.1, you might have pretty good luck here.
    # If you're using aspect bucketing however, each resolution change will recompile. Seriously, just don't do it.
    # Well, then again... Pytorch 2.2 has support for dynamic shapes. Why not?
    export TRAINING_DYNAMO_BACKEND='no'
    
    export TOKENIZERS_PARALLELISM=false
    ```


[**☝️](https://emojipedia.org/index-pointing-up)** `LoRA` 순위/알파는 `TRAINER_EXTRA_ARGS` 변수 내에서 변경될 수 있다는 점을 지적하고 싶습니다.

```bash
export TRAINER_EXTRA_ARGS="--lora_rank=768 --lora_alpha=768"
```

[**⚠️](https://emojipedia.org/warning)** `.env` 형식을 사용하기로 결정한 경우 인라인 주석, 참조 변수 또는 계산이 없는지 확인하세요. 이것은 새로운 `SimpleTuner` [env 도우미](https://github.com/bghira/SimpleTuner/blob/main/helpers/configuration/env_file.py#L94)가 작동하는 방식이므로 모든 것을 하드 코딩해야 합니다. . ****예를 들어:

**Failure case 1 (inline comments):**

```bash
export LEARNING_RATE=1.05e-3 #@param {type:"number"}
```

**Failure case 2 (reference variable with `TRAINER_EXTRA_ARGS`):**

```bash
export TRAINER_EXTRA_ARGS="${TRAINER_EXTRA_ARGS} --offset_noise --noise_offset=0.02"
```

**Failure case 3 (calculations)**:

```bash
export LR_WARMUP_STEPS=$((MAX_NUM_STEPS / 10))
```

원하는 경우 위의 하위 수준 `config.env`를 기본 참조로 사용할 수 있습니다. 하위 수준 `env` 파일을 사용하기로 결정한 경우 상위 수준 `config.env`에서 `CONFIG_BACKEND`를 `env`로 변경하는 것을 잊지 마세요.

```bash
TRAINING_NUM_PROCESSES=1
TRAINING_NUM_MACHINES=1
TRAINING_DYNAMO_BACKEND='no'
MIXED_PRECISION='bf16'
export CONFIG_BACKEND="env"
export ENV="sd35_fantasy_art_lora"
```

## Training process

마지막으로 훈련 과정을 시작할 수 있습니다. 참고용으로 필요한 모든 파일을 여기에 가져오겠습니다.

- High-level `config.env`

    ```bash
    TRAINING_NUM_PROCESSES=1
    TRAINING_NUM_MACHINES=1
    TRAINING_DYNAMO_BACKEND='no'
    MIXED_PRECISION='bf16'
    export CONFIG_BACKEND="json"
    export ENV="sd35_fantasy_art_lora"
    ```

- Custom SD3.5 Large `config.json` for LoRA training

    ```json
    {
      "--model_type": "lora",
      "--model_family": "sd3",
      "--resume_from_checkpoint": "latest",
      "--checkpointing_steps": 400,
      "--checkpoints_total_limit": 60,
      "--learning_rate": 1.05e-3,
      "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3.5-large",
      "--report_to": "wandb",
      "--tracker_project_name": "sd35-training",
      "--tracker_run_name": "simpletuner-fantasy-art-lora-01",
      "--max_train_steps": 24000,
      "--num_train_epochs": 0,
      "--data_backend_config": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/multidatabackend.json",
      "--output_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models",
      "--push_to_hub": false,
      "--push_checkpoints_to_hub": true,
      "--hub_model_id": "sd35-training",
      "--resolution": 1024,
      "--resolution_type": "pixel",
      "--minimum_image_size": 1024,
      "--instance_prompt": "k4s4 ",
      "--validation_prompt": "k4s4, a waist up view of a beautiful blonde woman, green eyes",
      "--validation_guidance": 7.5,
      "--validation_guidance_rescale": 0.0,
      "--validation_steps": 200,
      "--validation_num_inference_steps": 30,
      "--validation_negative_prompt": "blurry, cropped, ugly",
      "--validation_seed": 42,
      "--validation_resolution": 1024,
      "--train_batch_size": 6,
      "--gradient_accumulation_steps": 1,
      "--lr_scheduler": "cosine",
      "--lr_warmup_steps": 2400,
      "--caption_dropout_probability": 0,
      "--metadata_update_interval": 65,
      "--vae_batch_size": 12,
      "--delete_unwanted_images": false,
      "--delete_problematic_images": false,
      "--training_scheduler_timestep_spacing": "trailing",
      "--inference_scheduler_timestep_spacing": "trailing",
      "--snr_gamma": 5,
      "--enable_xformers_memory_efficient_attention": true,
      "--gradient_checkpointing": true,
      "--allow_tf32": true,
      "--optimizer": "adamw_bf16",
      "--use_ema": false,
      "--ema_decay": 0.999,
      "--seed": 42,
      "--mixed_precision": "bf16",
      "--lora_rank": 768,
      "--lora_alpha": 768,
      "--lora_type": "standard"
    }
    ```

- Custom SD3.5 Large  `config.env` for LoRA training

    ```bash
     
    export MODEL_TYPE='lora'
    export MODEL_FAMILY='sd3'
    export CONTROLNET=false
    export USE_DORA=false
    # Restart where we left off. Change this to "checkpoint-1234" to start from a specific checkpoint.
    export RESUME_CHECKPOINT="latest"
    export CHECKPOINTING_STEPS=400
    # This is how many checkpoints we will keep. Two is safe, but three is safer.
    export CHECKPOINTING_LIMIT=60
    
    # This is decided as a relatively conservative 'constant' learning rate.
    # Adjust higher or lower depending on how burnt your model becomes.
    export LEARNING_RATE=1.05e-3
    
    # Using a Huggingface Hub model:
    export MODEL_NAME="stabilityai/stable-diffusion-3.5-large"
    
    # Make DEBUG_EXTRA_ARGS empty to disable wandb.
    export DEBUG_EXTRA_ARGS="--report_to=wandb"
    export TRACKER_PROJECT_NAME="sd35-training"
    export TRACKER_RUN_NAME="simpletuner-fantasy-art-lora-01"
    
    # Max number of steps OR epochs can be used. Not both.
    export MAX_NUM_STEPS=24000
    export NUM_EPOCHS=0
    
    # A convenient prefix for all of your training paths.
    export DATALOADER_CONFIG="/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/multidatabackend.json"
    export OUTPUT_DIR="/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models"
    # Set this to "true" to push your model to Hugging Face Hub.
    export PUSH_TO_HUB="false"
    # If PUSH_TO_HUB and PUSH_CHECKPOINTS are both enabled, every saved checkpoint will be pushed to Hugging Face Hub.
    export PUSH_CHECKPOINTS="true"
    # This will be the model name for your final hub upload, eg. "yourusername/yourmodelname"
    # It defaults to the wandb project name, but you can override this here.
    # export HUB_MODEL_NAME=$TRACKER_PROJECT_NAME
    
    # By default, images will be resized so their SMALLER EDGE is 1024 pixels, maintaining aspect ratio.
    # Setting this value to 768px might result in more reasonable training data sizes for SDXL.
    export RESOLUTION=1024
    # If you want to have the training data resized by pixel area (Megapixels) rather than edge length,
    #  set this value to "area" instead of "pixel", and uncomment the next RESOLUTION declaration.
    export RESOLUTION_TYPE="pixel"
    #export RESOLUTION=1          # 1.0 Megapixel training sizes
    # If RESOLUTION_TYPE="pixel", the minimum resolution specifies the smaller edge length, measured in pixels. Recommended: 1024.
    # If RESOLUTION_TYPE="area", the minimum resolution specifies the total image area, measured in megapixels. Recommended: 1.
    export MINIMUM_RESOLUTION=1024
    
    # How many decimals to round aspect buckets to.
    #export ASPECT_BUCKET_ROUNDING=2
    
    # Use this to append an instance prompt to each caption, used for adding trigger words.
    # This has not been tested in SDXL.
    export INSTANCE_PROMPT="k4s4 "
    # If you also supply a user prompt library or `--use_prompt_library`, this will be added to those lists.
    export VALIDATION_PROMPT="k4s4, a waist up view of a beautiful blonde woman, green eyes"
    export VALIDATION_GUIDANCE=7.5
    # You'll want to set this to 0.7 if you are training a terminal SNR model.
    export VALIDATION_GUIDANCE_RESCALE=0.0
    # How frequently we will save and run a pipeline for validations.
    # export VALIDATION_STEPS=200
    export VALIDATION_STEPS=70
    export VALIDATION_NUM_INFERENCE_STEPS=30
    
    export VALIDATION_NEGATIVE_PROMPT="blurry, cropped, ugly"
    export VALIDATION_SEED=42
    export VALIDATION_RESOLUTION=1024
    
    # Adjust this for your GPU memory size. This, and resolution, are the biggest VRAM killers.
    export TRAIN_BATCH_SIZE=6
    # Accumulate your update gradient over many steps, to save VRAM while still having higher effective batch size:
    # effective batch size = ($TRAIN_BATCH_SIZE * $GRADIENT_ACCUMULATION_STEPS).
    export GRADIENT_ACCUMULATION_STEPS=1
    
    # Use any standard scheduler type. constant, polynomial, constant_with_warmup
    export LR_SCHEDULE="cosine"
    # A warmup period allows the model and the EMA weights more importantly to familiarise itself with the current quanta.
    # For the cosine or sine type schedules, the warmup period defines the interval between peaks or valleys.
    # Use a sine schedule to simulate a warmup period, or a Cosine period to simulate a polynomial start.
    # export LR_WARMUP_STEPS=$((MAX_NUM_STEPS / 10))
    export LR_WARMUP_STEPS=2400
    
    # Caption dropout probability. Set to 0.1 for 10% of captions dropped out. Set to 0 to disable.
    # You may wish to disable dropout if you want to limit your changes strictly to the prompts you show the model.
    # You may wish to increase the rate of dropout if you want to more broadly adopt your changes across the model.
    export CAPTION_DROPOUT_PROBABILITY=0
    
    export METADATA_UPDATE_INTERVAL=65
    export VAE_BATCH_SIZE=12
    
    # If this is set, any images that fail to open will be DELETED to avoid re-checking them every time.
    export DELETE_ERRORED_IMAGES=0
    # If this is set, any images that are too small for the minimum resolution size will be DELETED.
    export DELETE_SMALL_IMAGES=0
    
    # Bytedance recommends these be set to "trailing" so that inference and training behave in a more congruent manner.
    # To follow the original SDXL training strategy, use "leading" instead, though results are generally worse.
    export TRAINING_SCHEDULER_TIMESTEP_SPACING="trailing"
    export INFERENCE_SCHEDULER_TIMESTEP_SPACING="trailing"
    
    # Removing this option or unsetting it uses vanilla training. Setting it reweights the loss by the position of the timestep in the noise schedule.
    # A value "5" is recommended by the researchers. A value of "20" is the least impact, and "1" is the most impact.
    export MIN_SNR_GAMMA=5
    
    # Set this to an explicit value of "false" to disable Xformers. Probably required for AMD users.
    export USE_XFORMERS=true
    
    # There's basically no reason to unset this. However, to disable it, use an explicit value of "false".
    # This will save a lot of memory consumption when enabled.
    export USE_GRADIENT_CHECKPOINTING=true
    
    ##
    # Options below here may require a bit more complicated configuration, so they are not simple variables.
    ##
    
    # TF32 is great on Ampere or Ada, not sure about earlier generations.
    export ALLOW_TF32=true
    # AdamW 8Bit is a robust and lightweight choice. Adafactor might reduce memory consumption, and Dadaptation is slow and experimental.
    # AdamW is the default optimizer, but it uses a lot of memory and is slower than AdamW8Bit or Adafactor.
    # Choices: adamw, adamw8bit, adafactor, dadaptation
    # export OPTIMIZER="adamw_bf16"
    export OPTIMIZER="adamw_bf16"
    
    # EMA is a strong regularisation method that uses a lot of extra VRAM to hold two copies of the weights.
    # This is worthwhile on large training runs, but not so much for smaller training runs.
    export USE_EMA=false
    export EMA_DECAY=0.999
    
    export TRAINER_EXTRA_ARGS="--lora_rank=768 --lora_alpha=768"
    
    # Reproducible training. Set to -1 to disable.
    export TRAINING_SEED=42
    
    # Mixed precision is the best. You honestly might need to YOLO it in fp16 mode for Google Colab type setups.
    export MIXED_PRECISION="bf16"
    export PURE_BF16=true
    
    # This has to be changed if you're training with multiple GPUs.
    export TRAINING_NUM_PROCESSES=1
    export TRAINING_NUM_MACHINES=1
    export ACCELERATE_EXTRA_ARGS=""
    
    # With Pytorch 2.1, you might have pretty good luck here.
    # If you're using aspect bucketing however, each resolution change will recompile. Seriously, just don't do it.
    # Well, then again... Pytorch 2.2 has support for dynamic shapes. Why not?
    export TRAINING_DYNAMO_BACKEND='no'
    
    export TOKENIZERS_PARALLELISM=false
    ```

- Default [train.sh](http://train.sh)

    ```bash
    #!/usr/bin/env bash
    
    # Pull config from config.env
    [ -f "config/config.env" ] && source config/config.env
    
    # If the user has not provided VENV_PATH, we will assume $(pwd)/.venv
    if [ -z "${VENV_PATH}" ]; then
        # what if we have VIRTUAL_ENV? use that instead
        if [ -n "${VIRTUAL_ENV}" ]; then
            export VENV_PATH="${VIRTUAL_ENV}"
        else
            export VENV_PATH="$(pwd)/.venv"
        fi
    fi
    if [ -z "${DISABLE_LD_OVERRIDE}" ]; then
        export NVJITLINK_PATH="$(find "${VENV_PATH}" -name nvjitlink -type d)/lib"
        # if it's not empty, we will add it to LD_LIBRARY_PATH at the front:
        if [ -n "${NVJITLINK_PATH}" ]; then
            export LD_LIBRARY_PATH="${NVJITLINK_PATH}:${LD_LIBRARY_PATH}"
        fi
    fi
    
    export TOKENIZERS_PARALLELISM=false
    export PLATFORM
    PLATFORM=$(uname -s)
    if [[ "$PLATFORM" == "Darwin" ]]; then
        export MIXED_PRECISION="no"
    fi
    
    if [ -z "${ACCELERATE_EXTRA_ARGS}" ]; then
        ACCELERATE_EXTRA_ARGS=""
    fi
    
    if [ -z "${TRAINING_NUM_PROCESSES}" ]; then
        echo "Set custom env vars permanently in config/config.env:"
        printf "TRAINING_NUM_PROCESSES not set, defaulting to 1.\n"
        TRAINING_NUM_PROCESSES=1
    fi
    
    if [ -z "${TRAINING_NUM_MACHINES}" ]; then
        printf "TRAINING_NUM_MACHINES not set, defaulting to 1.\n"
        TRAINING_NUM_MACHINES=1
    fi
    
    if [ -z "${MIXED_PRECISION}" ]; then
        printf "MIXED_PRECISION not set, defaulting to bf16.\n"
        MIXED_PRECISION=bf16
    fi
    
    if [ -z "${TRAINING_DYNAMO_BACKEND}" ]; then
        printf "TRAINING_DYNAMO_BACKEND not set, defaulting to no.\n"
        TRAINING_DYNAMO_BACKEND="no"
    fi
    
    if [ -z "${ENV}" ]; then
        printf "ENV not set, defaulting to default.\n"
        export ENV="default"
    fi
    export ENV_PATH=""
    if [[ "$ENV" != "default" ]]; then
        export ENV_PATH="${ENV}/"
    fi
    
    if [ -z "${CONFIG_BACKEND}" ]; then
        if [ -n "${CONFIG_TYPE}" ]; then
            export CONFIG_BACKEND="${CONFIG_TYPE}"
        fi
    fi
    
    if [ -z "${CONFIG_BACKEND}" ]; then
        export CONFIG_BACKEND="env"
        export CONFIG_PATH="config/${ENV_PATH}config"
        if [ -f "${CONFIG_PATH}.json" ]; then
            export CONFIG_BACKEND="json"
        elif [ -f "${CONFIG_PATH}.toml" ]; then
            export CONFIG_BACKEND="toml"
        elif [ -f "${CONFIG_PATH}.env" ]; then
            export CONFIG_BACKEND="env"
        fi
        echo "Using ${CONFIG_BACKEND} backend: ${CONFIG_PATH}.${CONFIG_BACKEND}"
    fi
    
    # Update dependencies
    if [ -z "${DISABLE_UPDATES}" ]; then
        echo 'Updating dependencies. Set DISABLE_UPDATES to prevent this.'
        if [ -f "pyproject.toml" ] && [ -f "poetry.lock" ]; then
            nvidia-smi 2> /dev/null && poetry install
            uname -s | grep -q Darwin && poetry install -C install/apple
            rocm-smi 2> /dev/null && poetry install -C install/rocm
        fi
    fi
    # Run the training script.
    if [[ -z "${ACCELERATE_CONFIG_PATH}" ]]; then
        ACCELERATE_CONFIG_PATH="${HOME}/.cache/huggingface/accelerate/default_config.yaml"
    fi
    if [ -f "${ACCELERATE_CONFIG_PATH}" ]; then
        echo "Using Accelerate config file: ${ACCELERATE_CONFIG_PATH}"
        accelerate launch --config_file="${ACCELERATE_CONFIG_PATH}" train.py
    else
        echo "Accelerate config file not found: ${ACCELERATE_CONFIG_PATH}. Using values from config.env."
        accelerate launch ${ACCELERATE_EXTRA_ARGS} --mixed_precision="${MIXED_PRECISION}" --num_processes="${TRAINING_NUM_PROCESSES}" --num_machines="${TRAINING_NUM_MACHINES}" --dynamo_backend="${TRAINING_DYNAMO_BACKEND}" train.py
    
    fi
    
    exit 0
    ```


### Possible `accelerate` issues

여기서는 훈련을 시작하는 데 방해가 될 수 있는 한 가지 작은 사항을 언급하고 싶습니다. 끝 부분에 있는 기본 `train.sh` 안에는 훈련을 실행하는 명령이 있습니다.

```bash
accelerate launch --config_file="${ACCELERATE_CONFIG_PATH}" train.py
```

```python
# Run the training script.
if [[ -z "${ACCELERATE_CONFIG_PATH}" ]]; then
    ACCELERATE_CONFIG_PATH="${HOME}/.cache/huggingface/accelerate/default_config.yaml"
fi
if [ -f "${ACCELERATE_CONFIG_PATH}" ]; then
    echo "Using Accelerate config file: ${ACCELERATE_CONFIG_PATH}"
    accelerate launch --config_file="${ACCELERATE_CONFIG_PATH}" train.py
else
    echo "Accelerate config file not found: ${ACCELERATE_CONFIG_PATH}. Using values from config.env."
    accelerate launch ${ACCELERATE_EXTRA_ARGS} --mixed_precision="${MIXED_PRECISION}" --num_processes="${TRAINING_NUM_PROCESSES}" --num_machines="${TRAINING_NUM_MACHINES}" --dynamo_backend="${TRAINING_DYNAMO_BACKEND}" train.py

fi
```


이것이 처음으로 훈련 저장소를 설치하는 것이라면 아마도 오류 없이 실행될 것입니다. 그러나 다른 저장소에서 `accelerate`를 사용한 경우 `default_config.yaml`을 이미 구성했을 가능성이 높습니다. 훈련에서 오류가 발생하는 경우 일반 훈련을 위해 여기에 자체 `config.yaml`을 제공했습니다. 또한 'LoRA' 교육이 아닌 완전한 미세 조정을 시도하려는 경우 'DeepSpeed' 'config.yaml'을 제공했습니다.


'DeepSpeed'는 GPU VRAM이 충분하지 않을 때 내부의 특수 기술을 사용하여 최적화 상태, 그라데이션 및 기타 매개변수를 CPU 메모리(RAM)로 오프로드합니다. '80GB' VRAM과 '128GB' CPU RAM을 갖춘 단일 'H100' GPU에서는 'SD3.5 Large'로 완전한 미세 조정을 수행할 수 있었습니다. VRAM이 부족하고 CPU RAM으로 오프로드해야 할 때마다 이 `config.yaml`을 사용할 수도 있습니다.

- Custom general use `base_config.yaml`

    ```yaml
    compute_environment: LOCAL_MACHINE
    debug: false
    distributed_type: 'NO'
    downcast_bf16: 'no'
    enable_cpu_affinity: false
    gpu_ids: all
    machine_rank: 0
    main_training_function: main
    mixed_precision: bf16
    num_machines: 1
    num_processes: 1
    rdzv_backend: static
    same_network: true
    tpu_env: []
    tpu_use_cluster: false
    tpu_use_sudo: false
    use_cpu: false
    ```

- Custom `DeepSpeed 2` `deepspeed_config.yaml`

    ```yaml
    compute_environment: LOCAL_MACHINE
    debug: false
    deepspeed_config:
      gradient_accumulation_steps: 8
      gradient_clipping: 1.0
      offload_optimizer_device: cpu
      offload_param_device: cpu
      zero3_init_flag: false
      zero_stage: 2
    distributed_type: DEEPSPEED
    downcast_bf16: 'no'
    enable_cpu_affinity: true
    machine_rank: 0
    main_training_function: main
    mixed_precision: bf16
    num_machines: 1
    num_processes: 1
    rdzv_backend: static
    same_network: true
    tpu_env: []
    tpu_use_cluster: false
    tpu_use_sudo: false
    use_cpu: false
    ```


이러한 `yaml` 파일을 배치할 위치를 선택할 때마다 `train.sh` 코드에서 해당 파일을 올바르게 참조해야 합니다. 예를 들어, 저는 `SimpleTuner` 디렉토리의 루트에 파일을 배치합니다. 따라서 코드의 'ACCELERATE_CONFIG_PATH' 부분이 그에 따라 수정됩니다.

```bash
# Run the training script with base config.
if [[ -z "${ACCELERATE_CONFIG_PATH}" ]]; then
    ACCELERATE_CONFIG_PATH="${HOME}/SimpleTuner/base_config.yaml"
fi
```

or

```bash
# Run the training script with DeepSpeed config.
if [[ -z "${ACCELERATE_CONFIG_PATH}" ]]; then
    ACCELERATE_CONFIG_PATH="${HOME}/SimpleTuner/deepspeed_config.yaml"
fi
```

결국 `DeepSpeed` 지원 훈련을 시도하게 된다면, 이에 따라 사용할 수 있는 하위 수준 `config.env` 샘플이 있습니다.

- Custom SD3.5 Large `full` fine-tune`config.json`

    ```json
    {
      "--model_type": "full",
      "--model_family": "sd3",
      "--resume_from_checkpoint": "latest",
      "--checkpointing_steps": 100,
      "--checkpoints_total_limit": 100,
      "--learning_rate": 5e-5,
      "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3.5-large",
      "--report_to": "wandb",
      "--tracker_project_name": "sd35-training",
      "--tracker_run_name": "simpletuner-fantasy-art-full-01",
      "--max_train_steps": 24000,
      "--num_train_epochs": 0,
      "--data_backend_config": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/multidatabackend.json",
      "--output_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models",
      "--push_to_hub": false,
      "--push_checkpoints_to_hub": true,
      "--hub_model_id": "sd35-training",
      "--resolution": 1024,
      "--resolution_type": "pixel",
      "--minimum_image_size": 1024,
      "--instance_prompt": "k4s4 ",
      "--validation_prompt": "k4s4, a waist up view of a beautiful blonde woman, green eyes",
      "--validation_guidance": 7.5,
      "--validation_guidance_rescale": 0.0,
      "--validation_steps": 25,
      "--validation_num_inference_steps": 30,
      "--validation_negative_prompt": "blurry, cropped, ugly",
      "--validation_seed": 42,
      "--validation_resolution": 1024,
      "--train_batch_size": 6,
      "--gradient_accumulation_steps": 1,
      "--lr_scheduler": "cosine",
      "--lr_warmup_steps": 2400,
      "--caption_dropout_probability": 0,
      "--metadata_update_interval": 65,
      "--vae_batch_size": 12,
      "--delete_unwanted_images": false,
      "--delete_problematic_images": false,
      "--training_scheduler_timestep_spacing": "trailing",
      "--inference_scheduler_timestep_spacing": "trailing",
      "--snr_gamma": 5,
      "--enable_xformers_memory_efficient_attention": true,
      "--gradient_checkpointing": true,
      "--allow_tf32": true,
      "--optimizer": "adamw_bf16",
      "--use_ema": false,
      "--ema_decay": 0.999,
      "--seed": 42,
      "--mixed_precision": "bf16",
    }
    ```

- Custom SD3.5 Large `full` fine-tune`config.env`

    ```bash
     
    export MODEL_TYPE='full'
    export MODEL_FAMILY='sd3'
    export CONTROLNET=false
    export USE_DORA=false
    # Restart where we left off. Change this to "checkpoint-1234" to start from a specific checkpoint.
    export RESUME_CHECKPOINT="latest"
    export CHECKPOINTING_STEPS=100
    # This is how many checkpoints we will keep. Two is safe, but three is safer.
    export CHECKPOINTING_LIMIT=100
    
    # This is decided as a relatively conservative 'constant' learning rate.
    # Adjust higher or lower depending on how burnt your model becomes.
    export LEARNING_RATE=5e-5
    
    # Using a Huggingface Hub model:
    export MODEL_NAME="stabilityai/stable-diffusion-3.5-large"
    
    # Make DEBUG_EXTRA_ARGS empty to disable wandb.
    export DEBUG_EXTRA_ARGS="--report_to=wandb"
    export TRACKER_PROJECT_NAME="sd35-training"
    export TRACKER_RUN_NAME="simpletuner-fantasy-art-full-01"
    
    # Max number of steps OR epochs can be used. Not both.
    export MAX_NUM_STEPS=24000
    export NUM_EPOCHS=0
    
    # A convenient prefix for all of your training paths.
    export DATALOADER_CONFIG="/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_full_L_01/datasets/multidatabackend.json"
    export OUTPUT_DIR="/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_full_L_01/datasets/models"
    # Set this to "true" to push your model to Hugging Face Hub.
    export PUSH_TO_HUB="false"
    # If PUSH_TO_HUB and PUSH_CHECKPOINTS are both enabled, every saved checkpoint will be pushed to Hugging Face Hub.
    export PUSH_CHECKPOINTS="true"
    # This will be the model name for your final hub upload, eg. "yourusername/yourmodelname"
    # It defaults to the wandb project name, but you can override this here.
    # export HUB_MODEL_NAME=$TRACKER_PROJECT_NAME
    
    # By default, images will be resized so their SMALLER EDGE is 1024 pixels, maintaining aspect ratio.
    # Setting this value to 768px might result in more reasonable training data sizes for SDXL.
    export RESOLUTION=1024
    # If you want to have the training data resized by pixel area (Megapixels) rather than edge length,
    #  set this value to "area" instead of "pixel", and uncomment the next RESOLUTION declaration.
    export RESOLUTION_TYPE="pixel"
    #export RESOLUTION=1          # 1.0 Megapixel training sizes
    # If RESOLUTION_TYPE="pixel", the minimum resolution specifies the smaller edge length, measured in pixels. Recommended: 1024.
    # If RESOLUTION_TYPE="area", the minimum resolution specifies the total image area, measured in megapixels. Recommended: 1.
    export MINIMUM_RESOLUTION=1024
    
    # How many decimals to round aspect buckets to.
    #export ASPECT_BUCKET_ROUNDING=2
    
    # Use this to append an instance prompt to each caption, used for adding trigger words.
    # This has not been tested in SDXL.
    export INSTANCE_PROMPT="k4s4 "
    # If you also supply a user prompt library or `--use_prompt_library`, this will be added to those lists.
    export VALIDATION_PROMPT="k4s4, a waist up view of a beautiful blonde woman, green eyes"
    export VALIDATION_GUIDANCE=7.5
    # You'll want to set this to 0.7 if you are training a terminal SNR model.
    export VALIDATION_GUIDANCE_RESCALE=0.0
    # How frequently we will save and run a pipeline for validations.
    # export VALIDATION_STEPS=200
    export VALIDATION_STEPS=25
    export VALIDATION_NUM_INFERENCE_STEPS=30
    
    export VALIDATION_NEGATIVE_PROMPT="blurry, cropped, ugly"
    export VALIDATION_SEED=42
    export VALIDATION_RESOLUTION=1024
    
    # Adjust this for your GPU memory size. This, and resolution, are the biggest VRAM killers.
    export TRAIN_BATCH_SIZE=6
    # Accumulate your update gradient over many steps, to save VRAM while still having higher effective batch size:
    # effective batch size = ($TRAIN_BATCH_SIZE * $GRADIENT_ACCUMULATION_STEPS).
    export GRADIENT_ACCUMULATION_STEPS=1
    
    # Use any standard scheduler type. constant, polynomial, constant_with_warmup
    export LR_SCHEDULE="cosine"
    # A warmup period allows the model and the EMA weights more importantly to familiarise itself with the current quanta.
    # For the cosine or sine type schedules, the warmup period defines the interval between peaks or valleys.
    # Use a sine schedule to simulate a warmup period, or a Cosine period to simulate a polynomial start.
    # export LR_WARMUP_STEPS=$((MAX_NUM_STEPS / 10))
    export LR_WARMUP_STEPS=2400
    
    # Caption dropout probability. Set to 0.1 for 10% of captions dropped out. Set to 0 to disable.
    # You may wish to disable dropout if you want to limit your changes strictly to the prompts you show the model.
    # You may wish to increase the rate of dropout if you want to more broadly adopt your changes across the model.
    export CAPTION_DROPOUT_PROBABILITY=0
    
    export METADATA_UPDATE_INTERVAL=65
    export VAE_BATCH_SIZE=12
    
    # If this is set, any images that fail to open will be DELETED to avoid re-checking them every time.
    export DELETE_ERRORED_IMAGES=0
    # If this is set, any images that are too small for the minimum resolution size will be DELETED.
    export DELETE_SMALL_IMAGES=0
    
    # Bytedance recommends these be set to "trailing" so that inference and training behave in a more congruent manner.
    # To follow the original SDXL training strategy, use "leading" instead, though results are generally worse.
    export TRAINING_SCHEDULER_TIMESTEP_SPACING="trailing"
    export INFERENCE_SCHEDULER_TIMESTEP_SPACING="trailing"
    
    # Removing this option or unsetting it uses vanilla training. Setting it reweights the loss by the position of the timestep in the noise schedule.
    # A value "5" is recommended by the researchers. A value of "20" is the least impact, and "1" is the most impact.
    export MIN_SNR_GAMMA=5
    
    # Set this to an explicit value of "false" to disable Xformers. Probably required for AMD users.
    export USE_XFORMERS=true
    
    # There's basically no reason to unset this. However, to disable it, use an explicit value of "false".
    # This will save a lot of memory consumption when enabled.
    export USE_GRADIENT_CHECKPOINTING=true
    
    ##
    # Options below here may require a bit more complicated configuration, so they are not simple variables.
    ##
    
    # TF32 is great on Ampere or Ada, not sure about earlier generations.
    export ALLOW_TF32=true
    # AdamW 8Bit is a robust and lightweight choice. Adafactor might reduce memory consumption, and Dadaptation is slow and experimental.
    # AdamW is the default optimizer, but it uses a lot of memory and is slower than AdamW8Bit or Adafactor.
    # Choices: adamw, adamw8bit, adafactor, dadaptation
    # export OPTIMIZER="adamw_bf16"
    export OPTIMIZER="adamw_bf16"
    
    # EMA is a strong regularisation method that uses a lot of extra VRAM to hold two copies of the weights.
    # This is worthwhile on large training runs, but not so much for smaller training runs.
    export USE_EMA=false
    export EMA_DECAY=0.999
    
    export TRAINER_EXTRA_ARGS=""
    
    # Reproducible training. Set to -1 to disable.
    export TRAINING_SEED=42
    
    # Mixed precision is the best. You honestly might need to YOLO it in fp16 mode for Google Colab type setups.
    export MIXED_PRECISION="bf16"
    export PURE_BF16=true
    
    # This has to be changed if you're training with multiple GPUs.
    export TRAINING_NUM_PROCESSES=1
    export TRAINING_NUM_MACHINES=1
    export ACCELERATE_EXTRA_ARGS=""
    
    # With Pytorch 2.1, you might have pretty good luck here.
    # If you're using aspect bucketing however, each resolution change will recompile. Seriously, just don't do it.
    # Well, then again... Pytorch 2.2 has support for dynamic shapes. Why not?
    export TRAINING_DYNAMO_BACKEND='no'
    
    export TOKENIZERS_PARALLELISM=false
    ```


Changed parameters

```json
{
	"--model_type": "full",
	"--checkpointing_steps": 100,
  "--checkpoints_total_limit": 100,
  "--learning_rate": 5e-5,
  "--tracker_run_name": "simpletuner-fantasy-art-full-01"
}

```

특히 학습률이 '5e-5'로 감소했습니다.

모든 것이 정상이면 계속해서 훈련을 시작하십시오.

```bash
bash train.sh
```

### Memory usage

텍스트 인코더를 훈련하지 않는 경우(우리는 그렇지 않습니다) 'SimpleTuner'를 사용하면 약 '10.4GB'의 VRAM을 절약할 수 있습니다.

'배치 크기'를 '6'으로 설정하고 'lora 순위/알파'를 '768'로 설정하면 훈련에서 약 '32GB'의 VRAM을 소비합니다.

당연히 이는 소비자 '24GB' VRAM GPU의 범위를 벗어납니다. 그래서 `batch size`를 `1`, `lora Rank/alpha`를 `128`로 사용하여 메모리 비용을 줄이려고 했습니다.

잠정적으로 VRAM 비용을 약 '19.65GB' VRAM으로 낮출 수 있었습니다.

그러나 유효성 검사 프롬프트에 대한 추론을 실행하면 VRAM이 최대 '23.37GB'까지 급증합니다.

안전을 위해 'lora 순위/알파'를 '64'로 더욱 줄여야 할 수도 있습니다. 그렇다면 훈련 중에 약 '18.83GB'의 VRAM을 소비하게 됩니다.

검증 추론 중에는 최대 약 '21.50GB'의 VRAM이 사용됩니다. 이 정도면 충분히 안전해 보입니다.

'배치 크기' '6' 및 'lora 순위/알파' '768'의 더 높은 사양 교육을 사용하기로 결정한 경우 [위](https:// www.notion.so/Stable-Diffusion-3-5-Large-Fine-tuning-Tutorial-11a61cdcd1968027a15bdbd7c40be8c6?pvs=21) GPU VRAM이 부족하고 CPU RAM이 충분한 경우.

### Monitoring the training


훈련 과정에서 검증 이미지가 픽셀화되거나 검게 변하는 경우가 있을 수 있습니다. 이는 '1.05e-3'이라는 매우 공격적인 학습률을 사용하고 있기 때문입니다. 더 안전하게 플레이하고 싶다면 '9.5e-4'를 사용하면 픽셀화 문제가 거의 발생하지 않습니다. 그럼에도 불구하고 두 손실 곡선은 결국 훌륭하게 수렴했습니다.

하지만 우려사항을 해소하기 위해 어떤 모습일지 몇 가지 예를 보여드리고 싶습니다.


### Observing training loss

### `LoRA`

판타지 아트 'LoRA' 수련을 통해 얻은 피규어들입니다. 손실이 감소하고 있으며 아직 수렴되지 않았습니다. 그러나 확산 모델을 미세 조정한 경험이 있는 경우 손실 최소화는 미적 극대화와 거의 관련이 없습니다. 또한 높은 학습률을 사용하는 경우 손실 곡선의 최고점 근처에서 검증 이미지의 픽셀화 또는 품질 저하가 발생할 수 있음을 확인했습니다. 훈련이 모델 가중치가 만족스럽지 않은 학습 속도에 도달하면 이는 의미가 있습니다.

학습률이 높으면 열차 손실도 최고점에 달합니다.

## Evaluating the results

### How to actually get the LoRA models into ComfyUI

이제 모델이 모두 훈련되었으므로 `ComfyUI`를 사용하여 테스트할 차례입니다. 그러나 SimpleTuner가 모델을 저장하는 방식으로 인해 'ComfyUI/models/loras' 디렉터리로 가져오기가 약간 어렵습니다.

모델을 저장한 디렉터리로 이동하면 해당 형식이 이 형식인 것을 볼 수 있습니다.

각 디렉토리에서 원하는 파일은 `pytorch_lora_weights.safetensors` 파일입니다. 이러한 파일을 `ComfyUI`로 가져오는 프로세스를 간소화하기 위해 다음 스크립트를 작성했습니다.

- `create_symlinks_lora.sh`

    ```bash
    #!/bin/bash
    
    # Source directory where the models are stored
    SOURCE_DIR="/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models"
    
    # Target directory for symlinks
    TARGET_DIR="/weka2/home-yeo/ComfyUI/models/loras/sd35_large/fantasy_art"
    
    # Ensure target directory exists or create it
    mkdir -p "${TARGET_DIR}"
    
    # Iterate over each checkpoint directory
    for CHECKPOINT_DIR in ${SOURCE_DIR}/checkpoint-*; do
        # Check if it's indeed a directory
        if [ -d "${CHECKPOINT_DIR}" ]; then
            # Extract the checkpoint number from the directory name
            CHECKPOINT_NAME=$(basename ${CHECKPOINT_DIR})
            
            # Define the source file path
            SOURCE_FILE="${CHECKPOINT_DIR}/pytorch_lora_weights.safetensors"
            
            # Define the symlink name with 'lora' added before 'safetensors'
            LINK_NAME="${TARGET_DIR}/${CHECKPOINT_NAME}_lora.safetensors"
            
            # Check if the source file exists
            if [ -f "${SOURCE_FILE}" ]; then
                # Create a symlink in the target directory
                echo "Creating symlink from ${SOURCE_FILE} to ${LINK_NAME}"
                ln -s "${SOURCE_FILE}" "${LINK_NAME}"
                echo "Symlink created for ${CHECKPOINT_NAME}"
            else
                echo "File not found: ${SOURCE_FILE}"
            fi
        else
            echo "Not a directory: ${CHECKPOINT_DIR}"
        fi
    done
    
    echo "Symlinking complete."
    ```


위의 쉘 스크립트가 수행할 작업은 `SimpleTuner`에서 `SOURCE_DIR`을 반복한 다음 ***만*** `pytorch_lora_weights.safetensors` 파일을 `TARGET_DIR`에 심볼릭 링크하는 것입니다. 이 파일은 `ComfyUI 내부 디렉토리여야 합니다. /모델/로라스`. 파일을 추적하기 위해 파일 이름 안에 해당 체크포인트 번호가 포함되도록 이름도 변경했습니다.

### Determining the best checkpoint


제가 사용하고 있는 기본적인 'SD3.5 Large' 워크플로는 이것이었습니다.

가장 좋은 체크포인트를 결정하는 방법은 특정 프롬프트에 대해 x축에 체크포인트 번호를 표시하는 것입니다. 그래서 저는 다음과 같은 단일 스트립을 얻습니다.

판타지 아트 'LoRA'

Prompt

```bash
a three fourth perspective waist up portrait view of a young woman with messy long blonde hair and light purple eyes, looking at viewer with a closed mouth smile, wearing tight black dress, a faded pink simple background during golden hour
```



이를 위해 `ComfyUI` 워크플로의 `api` 버전에 로드되는 사용자 정의 스크립트를 사용합니다. 저장(API 형식) 버튼을 클릭하면 모든 워크플로우를 'API' 형식으로 저장할 수 있습니다. 귀하가 사용할 수 있도록 이미 위 버전을 저장했습니다. 'ComfyUI' API 사용에 대한 더 심층적인 비디오 가이드를 원하시면 제가 작년에 [여기](https://youtu.be/WwsJ_QIgsG8)를 만들었습니다.


`ComfyUI`가 실행 중인지 확인한 후 아래 스크립트를 실행하세요. 또한 스크립트를 실행하는 동일한 위치에 `.env` 파일을 설정해야 합니다.

- `API script`

  This is my custom `python` script:

    ```
    import os
    import json
    import random
    from urllib import request
    import datetime
    from PIL import Image, ImageDraw, ImageFont
    import time
    import re
    import urllib.error
    
    from dotenv import load_dotenv
    load_dotenv()
    
    # Configuration
    api_workflow_dir = os.getenv("API_WORKFLOW_DIR")
    lora_dir = os.getenv("LORA_DIR")
    
    api_workflow_file = os.getenv("API_WORKFLOW_FILE")
    api_endpoint = os.getenv("API_ENDPOINT")
    image_output_dir = os.getenv("IMAGE_OUTPUT_DIR")
    font_ttf_path = os.getenv("FONT_TTF_PATH")
    
    comfyui_output_dir = os.getenv("COMFYUI_OUTPUT_DIR")
    
    api_endpoint = f"http://{api_endpoint}/prompt"
    
    workflow_file_path = os.path.join(api_workflow_dir, api_workflow_file)
    workflow = json.load(open(workflow_file_path))
    
    current_datetime = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    relative_output_path = current_datetime
    
    directory_creation_timeout = 3000  # Timeout for directory creation in seconds
    image_generation_timeout = 30000  # Timeout for image generation in seconds
    
    def get_checkpoint_number(filename):
        match = re.search(r'checkpoint-(\d+)', filename)
        if match:
            return int(match.group(1))
        match = re.search(r'/checkpoint-(\d+)/', filename)
        if match:
            return int(match.group(1))
        return None
    
    def get_most_recent_output_folder(base_dir):
        folders = [f for f in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, f))]
        if not folders:
            return None
        return max(folders, key=lambda f: os.path.getctime(os.path.join(base_dir, f)))
    
    def process_loras(lora_dir, workflow):
        print(f"Scanning directory: {lora_dir}")
        
        # Extract the last two directories from LORA_DIR
        lora_path_parts = lora_dir.split('/')
        dynamic_lora_path = '/'.join(lora_path_parts[-2:])
        
        all_items = os.listdir(lora_dir)
        
        lora_items = [f for f in all_items if f.endswith('_lora.safetensors')]
        
        lora_items.sort(key=lambda x: int(x.split('-')[1].split('_')[0]))
        
        print(f"Found items: {lora_items}")
        
        for item in lora_items:
            checkpoint_num = item.split('-')[1].split('_')[0]
            
            print(f"Processing: {item}")
    
            # Update the LoRA loader node
            lora_loader_node = workflow["276"]
            lora_loader_node["inputs"]["lora_name"] = f"{dynamic_lora_path}/{item}"
    
            save_image = workflow["314"]
            filename_prefix = f"checkpoint-{checkpoint_num}"
            save_image["inputs"]["output_path"] = relative_output_path
            save_image["inputs"]["filename_prefix"] = filename_prefix
    
            success = queue_prompt(workflow)
            if not success:
                print(f"Failed to queue prompt for checkpoint {checkpoint_num}")
            else:
                print(f"Successfully queued prompt for checkpoint {checkpoint_num}")
    
        if not lora_items:
            print("No LoRA files found in the directory.")
        
        return len(lora_items)
    
    def create_image_strip(lora_dir, image_folder, output_filename):
        lora_files = [f for f in os.listdir(lora_dir) if f.endswith('_lora.safetensors')]
        lora_files.sort(key=get_checkpoint_number)
        checkpoints = [get_checkpoint_number(f) for f in lora_files if get_checkpoint_number(f) is not None]
    
        images = []
        for checkpoint in checkpoints:
            filename = f"checkpoint-{checkpoint}_0001.png"
            filepath = os.path.join(image_folder, filename)
            if os.path.exists(filepath):
                try:
                    img = Image.open(filepath)
                    images.append(img)
                except IOError as e:
                    print(f"Cannot open image: {filepath}")
                    print(f"Error: {e}")
    
        if not images:
            print("No valid images found.")
            return
    
        img_width, img_height = images[0].size
        strip_width = img_width * len(images)
        label_height = 50  # Space for labels
        strip_height = img_height + label_height
    
        strip_image = Image.new('RGB', (strip_width, strip_height), 'white')
        draw = ImageDraw.Draw(strip_image)
        font = ImageFont.truetype(font_ttf_path, 20)
    
        for i, (img, checkpoint) in enumerate(zip(images, checkpoints)):
            strip_image.paste(img, (i * img_width, label_height))
            
            label = f"checkpoint-{checkpoint}"
            label_width = draw.textlength(label, font=font)
            label_x = i * img_width + (img_width - label_width) // 2
            draw.text((label_x, 10), label, fill="black", font=font)
    
        strip_image.save(output_filename)
        print(f"Image strip saved to: {output_filename}")
    
    def queue_prompt(workflow):
        p = {"prompt": workflow}
        data = json.dumps(p).encode('utf-8')
        req = request.Request(api_endpoint, data=data, headers={'Content-Type': 'application/json'})
        try:
            with request.urlopen(req) as response:
                print(f"API request successful. Status code: {response.getcode()}")
                return True
        except urllib.error.URLError as e:
            if hasattr(e, 'reason'):
                print(f"Failed to reach the server. Reason: {e.reason}")
            elif hasattr(e, 'code'):
                print(f"The server couldn't fulfill the request. Error code: {e.code}")
            print(f"API endpoint: {api_endpoint}")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        return False
    
    def wait_for_directory_creation(directory, timeout):
        print(f"Waiting for directory {directory} to be created...")
        start_time = time.time()
        while time.time() - start_time < timeout:
            if os.path.exists(directory):
                print(f"Directory {directory} found.")
                return True
            time.sleep(5)  # Check every 5 seconds
        print(f"Timeout waiting for directory {directory} to be created.")
        return False
    
    def wait_for_images(image_folder, expected_count, timeout):
        print("Waiting for images to be generated...")
        start_time = time.time()
        while time.time() - start_time < timeout:
            if os.path.exists(image_folder):
                image_files = [f for f in os.listdir(image_folder) if f.endswith('.png')]
                if len(image_files) >= expected_count:
                    print(f"Found all {expected_count} images.")
                    return True
            time.sleep(5)  # Check every 5 seconds
        print("Timeout waiting for images to be generated.")
        return False
    
    if __name__ == "__main__":
        print(f"LoRA directory: {lora_dir}")
    
        # Generate images
        expected_image_count = process_loras(lora_dir, workflow)
    
        absolute_output_path = os.path.join(comfyui_output_dir, current_datetime)
        print(f"Absolute output path: {absolute_output_path}")
    
        # Create the image strip
        if wait_for_directory_creation(absolute_output_path, directory_creation_timeout):
            print(f"Expected image count: {expected_image_count}")
            if wait_for_images(absolute_output_path, expected_image_count, image_generation_timeout):
                output_strip_filename = os.path.join(absolute_output_path, "output_image_strip.png")
                create_image_strip(lora_dir, absolute_output_path, output_strip_filename)
            else:
                print("Failed to generate all images in time.")
        else:
            print("Output directory was not created.")
    ```

- sample `.env` file

    ```bash
    API_WORKFLOW_DIR=/weka2/home-yeo/workflows
    COMFYUI_OUTPUT_DIR = /weka2/home-yeo/ComfyUI/output/
    LORA_DIR=/admin/home-yeo/workspace/ComfyUI/models/loras/sd35_large/fantasy_art_01
    API_WORKFLOW_FILE=sd35_fantasy_art_02_api.json
    API_ENDPOINT=127.0.0.1:8188
    FONT_TTF_PATH=/weka2/home-yeo/fonts/arial.ttf
    BOLD_FONT_TTF_PATH=/weka2/home-yeo/fonts/arialbd.ttf
    ```


Fantasy Art `LoRA`

Prompt

```markdown
a three fourth perspective waist up portrait view of a young woman with messy long blonde hair and light purple eyes, looking at viewer with a closed mouth smile, wearing tight black dress, a faded pink simple background during golden hour
```

결국 '24,000' 단계에서 거의 마지막에 체크포인트를 선택하게 되었습니다.

나는 또한 건전성 확인을 위해 수행한 다른 모든 훈련에 대해 동일한 실험을 실행했습니다.

Cinema Photo `LoRA`

Prompt

```markdown
a few hooded figures walking on an empty road in the rain, desolate, high skyscrapers
```

John Singer Sargent `LoRA`

Prompt

```markdown
an abandoned beach with a lighthouse
```

Underexposed Photography `LoRA`

Prompt

```markdown
waist up view of a woman posing on a runway, streetwear in the style of alexander mcqueen
```


전문적인 이유로 원래 그리드의 특정 부분이 생략되었습니다. 전체 그리드에는 모든 청중에게 적합하지 않을 수 있는 콘텐츠가 포함되어 있으므로 기술적인 측면에 초점을 맞추기 위해 잘린 버전이 표시됩니다.

Pixel Art `LoRA`

Prompt

```bash
a plush chibi mythical creature
```

Ethnic Paint `LoRA`

Prompt

```bash
a skyline view of a futuristic maritime village floating above ground, in the clouds, towering skyscrapers, golden hour, day time lighting
```

## A/B evaluation

### Improving/tuning generations with APG scaling

최고의 미적 결과를 제공하는 'LoRA' 체크포인트를 찾았으면 'APG' 스케일링을 통해 이를 더욱 향상시킬 수 있습니다. 'APG' 스케일링은 적응형 예측 지침을 의미합니다.

[APG 논문](https://arxiv.org/abs/2410.02416) 초록의 핵심 부분

```markdown
Our approach, termed adaptive projected guidance (APG), retains the quality-boosting advantages of CFG while enabling the use of higher guidance scales without oversaturation. APG is easy to implement and introduces practically no additional computational overhead to the sampling process.
```

이것이 이 샘플 워크플로에 포함된 [ComfyUI 노드](https://github.com/logtd/ComfyUI-APGScaling)입니다. 세 가지 다른 이미지를 생성합니다. 하나는 기본 이미지, 하나는 ***`APG` 스케일링 없이 ***`LoRA` 적용, 세 번째 이미지는 ***` 사용*** ` LoRA` 적용 APG` 스케일링.

The parameters for APG are:

```markdown
eta
norm_threshold
use_momentum
momentum
```

이 노드에 대해 그렇게 많이 심층 분석하지는 않았지만 이미지 품질이 좋든 나쁘든 변경됩니다.

### Before and after comparison

Fantasy Art

Prompt

```markdown
a three fourth perspective waist up portrait view of a young woman with messy long blonde hair and light purple eyes, perfect face, looking at viewer with a closed mouth smile, wearing loose black dress, a faded pink simple background during golden hour
```

`Base model`


`LoRA`


`LoRA` + `APG`


Cinema Photo

Prompt

```markdown
a wide view of a figure looking up at a meteor breaking apart
```

`Base model`

`LoRA`


`LoRA` + `APG`


John Singer Sargent

Prompt

```markdown
an abandoned beach with a lighthouse
```

`Base model`

`LoRA`

`LoRA` + `APG`

Underexposed Photography

Prompt

```markdown
waist up view of a woman posing on a runway, streetwear in the style of alexander mcqueen
```

`Base model`

`LoRA`

`LoRA` + `APG`

Pixel Art

Prompt

```markdown
a sci-fi venetian town near the water
```

`Base model`

`LoRA`

`LoRA` + `APG`

Ethnic Paint

Prompt

```markdown
a man in his late 30s to early 40s, rendered in a dark, moody style, The subject is depicted from the shoulders up, facing the viewer directly, He has a full, thick beard and mustache, which is dark and well-groomed, with a few strands of gray, His hair is short and neatly combed, with a few strands falling over his forehead, His eyes are dark and piercing, with a slight hint of sadness or introspection, 
```

`Base model`

`LoRA`

`LoRA` + `APG`


`APG` 는 그 말에 충실한 것 같습니다. 채도를 줄여줍니다. 개인적으로 나는 바랜 색상을 선호하지 않지만 밋밋한 "RAW" 같은 이미지를 얻을 수 있는 좋은 방법이 될 수 있습니다.


## Other fine-tuning tools/libraries for SD3.5

Hugging Face의 [이 스크립트 및 구성](https://huggingface.co/blog/sd3-5#training-loras-with-sd35-large-with-Quantization)을 참조하세요. 이는 사용하기가 더 간단하지만 결과는 약간 더 나쁠 수 있습니다.

## Conclusion & Feedback


여기 있는 모든 정보가 출시일에 SD3.5 Large를 미세 조정하는 데 도움이 되기를 바랍니다. 'DiT' 아키텍처는 여전히 상대적으로 새로운 것이기 때문에 우리는 구성, 질감 및 전체적인 미학 측면에서 최고의 이미지 품질을 달성하기 위해 다양한 방법을 시도했습니다. 최상의 결과를 얻지 못하는 문제가 발생하는 경우 훈련 중에 보다 세부적인 레이어 조작을 적극 권장합니다.



## Two cents from Dango

따라서 SD3.5 시리즈의 주요 설계자 중 하나인 Dango의 추가 정보는 다음과 같습니다.

[Dango's Hugging Face profile](https://huggingface.co/Dango233)

### Diving into SD3.5 Large Architecture


SD 3.5 Large의 큰 그림을 이해하기 위해 먼저 아키텍처를 인쇄해 보겠습니다.

모델을 로컬 디렉터리에 다운로드하는 경우 `stable-diffusion-3-medium-diffusers`와 유사한 파일 구조를 가져야 합니다.


SD3.5 Large의 경우 다음과 같습니다.

키를 나열하려고 하면 샤딩된 디퓨저 형식의 기본 모델에서 오류가 발생하므로 이를 단일 모델로 병합하는 코드입니다. 이 시점에서 나는 모델의 로컬 버전으로 작업하고 있었지만 `.cache`에 다운로드한 Hugging Face 버전과 동일합니다.

Example path:

```markdown
/home-kasukanra/.cache/huggingface/hub/models--stabilityai--stable-diffusion-3.5-large/snapshots/1a43aa3b9bb52ead637f9693a228092aa802a5dd/transformer
```

```

import safetensors.torch

shards = [
    "/weka2/home-yeo/sd3_diffusers/ckpts/35L_1024_rc6b/test_convert/transformer/diffusion_pytorch_model-00001-of-00002.safetensors",
    "/weka2/home-yeo/sd3_diffusers/ckpts/35L_1024_rc6b/test_convert/transformer/diffusion_pytorch_model-00002-of-00002.safetensors"
]

# Initialize an empty state dictionary
combined_state_dict = {}

# Load each shard and merge into combined_state_dict
for shard in shards:
    ckpt = safetensors.torch.load_file(shard)
    combined_state_dict.update(ckpt)

# Specify the output path for the combined model
output_path = "/weka2/home-yeo/sd3_diffusers/ckpts/35L_1024_rc6b/merged/combined_model.safetensors"

# Save the combined state dictionary to a single .safetensors file
safetensors.torch.save_file(combined_state_dict, output_path)
print(f"Combined model saved successfully at {output_path}")

```


제 경우에는 병합된 모델(`combined_model.safetensors`)이 있으면 이 스크립트를 실행하여 아키텍처를 텍스트 파일에 저장하세요. 스크립트는 변환기 모델의 일반적인 순차 흐름을 출력합니다.

```

import safetensors.torch
import re
import json
from collections import defaultdict

def group_keys(keys):
    groups = defaultdict(list)
    for key in keys:
        if 'transformer_blocks' in key:
            block_num = int(re.search(r'transformer_blocks\.(\d+)', key).group(1))
            groups[f'transformer_block_{block_num}'].append(key)
        elif 'embed' in key:
            groups['embedding'].append(key)
        elif 'pos_embed' in key:
            groups['positional_embedding'].append(key)
        elif 'time_text_embed' in key:
            groups['time_text_embedding'].append(key)
        elif 'norm_out' in key:
            groups['output_normalization'].append(key)
        elif 'proj_out' in key:
            groups['output_projection'].append(key)
        else:
            groups['other'].append(key)
    return groups

def order_groups(groups):
    order = [
        'embedding',
        'positional_embedding',
        'time_text_embedding',
    ] + [f'transformer_block_{i}' for i in range(38)] + [
        'output_normalization',
        'output_projection',
        'other'
    ]
    return {k: groups[k] for k in order if k in groups}

def pretty_print_and_save(ckpt, output_file):
    keys_list = list(ckpt.keys())
    grouped_keys = group_keys(keys_list)
    ordered_groups = order_groups(grouped_keys)
    
    output = []
    for group, keys in ordered_groups.items():
        output.append(f"\n{group.upper()}:")
        output.extend(sorted(keys))
    
    pretty_output = '\n'.join(output)
    
    with open(output_file, 'w') as f:
        f.write(pretty_output)
    
    print(f"Grouped keys have been saved to {output_file}")

# Load the checkpoint
checkpoint_path = "/weka2/home-yeo/sd3_diffusers/ckpts/35L_1024_rc6b/merged/combined_model.safetensors"
ckpt = safetensors.torch.load_file(checkpoint_path)

# Pretty-print and save the grouped keys to a file
output_file = "ckpt_keys_grouped_output.txt"
pretty_print_and_save(ckpt, output_file)

```

# 참조
-----

* [Stable Diffusion 3.5 Large Fine-tuning Tutorial](https://stabilityai.notion.site/Stable-Diffusion-3-5-Large-Fine-tuning-Tutorial-11a61cdcd1968027a15bdbd7c40be8c6)
