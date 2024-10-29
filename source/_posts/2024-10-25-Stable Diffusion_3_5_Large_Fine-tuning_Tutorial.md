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


In addition, I’m using one of the latest main branches of `SimpleTuner` instead of a [release branch](https://github.com/bghira/SimpleTuner/tree/release) as I wanted to keep it as up-to-date as possible. This is the commit hash (10/15/2024):

```
694784083c70bf81086bb3ceba86262b7b22757d
```

### Python Dependencies

To install the dependencies, follow the [quickstart guide](https://github.com/bghira/SimpleTuner/blob/main/documentation/quickstart/SD3.md) for SD3 on the repository page. I’ll  go over it here as well and add an alternative installation method as well. The dependency installation can be pretty straightforward if you have matching `CUDA` versions as `SimpleTuner` (`12.4+`), or it can be a little more convoluted if you’re on an older version of `CUDA`.

First of all, `git clone` the repository.

```jsx
git clone https://github.com/bghira/SimpleTuner.git
```

`cd` into the repository.

```jsx
cd SimpleTuner
```

Finally, check out the commit hash I mentioned above. In case you want to do any debugging, let’s go ahead and create a branch out of it (named `base_branch`, feel free to rename).

```jsx
git checkout -b base_branch 694784083c70bf81086bb3ceba86262b7b22757d
```

Double-check that you are on the new branch. It should tell you that you are on `base_branch` now.

```jsx
git branch
```

Once you’re on your new branch, it’s time to create a python virtual environment. It’s recommended that you be on `python 3.11` when installing your dependencies.

You can check your `OS` and `CUDA` environments using these commands, respectively:

```bash
uname -a
```

```bash
nvcc --version
```

My `OS`/`CUDA` environment is:

```jsx
Ubuntu 20.04.6 LTS
NVIDIA-SMI 535.161.08
Driver Version: 535.161.08
CUDA Version: 12.2 
```

Check your python version with:

```jsx
python --version
```

My python version is:

```jsx
Python 3.11.6
```

Create a `virtualenv` using this command in the root of the `SimpleTuner` directory:

```jsx
python -m venv .venv
```

Activate it with:

```jsx
source .venv/bin/activate
```

Once that’s completed, install `poetry` (a dependency manager similar to `pip` or `uv` )

```jsx
pip install -U poetry pip
```

`bghira` recommends that you run this command just to be safe:

```jsx
poetry config virtualenvs.create false
```

As I’m using `Linux` , the next step is installing all your dependencies with this command:

```jsx
poetry install
```

However, SD3.5 Large depends on a specific commit of `diffusers` (probably newer versions will work too). Make sure you are using a version that includes this [commit](https://github.com/huggingface/diffusers/commit/e2d037bbf1388fdc172458bed7a8a58b34fc6f84) or later.

```markdown
e2d037bbf1388fdc172458bed7a8a58b34fc6f84
```

This is subject to change as `bghira` and his team updates the SimpleTuner repository very quickly. To ensure that you’re using the correct version of `diffusers` , change the `pyproject.toml` file in your `SimpleTuner` directory to use the correct commit.

- Custom `pyproject.toml` with the correct `diffusers` version

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


The change was this one:

Old

```toml
diffusers = {git = "https://github.com/huggingface/diffusers", rev = "quantization-config"}
```

New

```toml
diffusers = {git = "https://github.com/huggingface/diffusers", rev = "e2d037b"}
```

You should have all the necessary `SimpleTuner` dependencies installed now.

- [**🚨](https://emojipedia.org/police-car-light)** If you’re not on `CUDA 12.4` or above on your machine environment, you may encounter CUDA dependency issues as `SimpleTuner` operates under the assumption that you are on `CUDA 12.4` or above. If you noticed earlier, I was on `CUDA 12.2` , and ran into an issue with`poetry install`.
    - Click the ▷ to unfold this paragraph and see **alternative** installation instructions.

      Instead, what I did was install my default `torch` dependencies first, then create a `requirements.txt` file that had the rest of the dependencies from the `pyproject.toml`. Then, I ran `pip install` on that text file.

      If you tried `poetry install` first and ran into issues, I suggest removing the existing `virtualenv` and installing it again.

        ```jsx
        rm -rf .venv
        ```

        ```jsx
        python -m venv .venv
        ```

        ```jsx
        source .venv/bin/activate
        ```

      Now, install your torch dependencies first according to your `CUDA` version. CUDA 12.1 works for me as it’s a lower version compared to my environment of `CUDA 12.2` .

        ```jsx
        pip install torch==2.4.1+cu121 torchvision==0.19.1+cu121 torchaudio==2.4.1+cu121 --index-url https://download.pytorch.org/whl/cu121
        ```

      You may notice that there is an appended `cu121` . This specifies the `CUDA` version. Change it accordingly for your version of `CUDA` .

      Afterwards, install `torchao` :

        ```jsx
        pip install torchao --extra-index-url https://download.pytorch.org/whl/cu121
        ```

      Now, create a `requirements.txt` file in the root of your `SimpleTuner` directory.

        - `requirements.txt`

            ```markdown
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


        Once that’s completed, install your dependencies:
        
        ```jsx
        pip install -r requirements.txt
        ```
        
        You should have all the necessary dependencies installed now.


### Model Dependencies

This time, the base checkpoint as well as the diffusers are all packaged together nicely in this Hugging Face [repository](https://huggingface.co/stabilityai/stable-diffusion-3.5-large) named `stabilityai/stable-diffusion-3.5-large`.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/7dc0cc81-37f0-4827-aeff-2ba5cf9639ed/image.png)

The previous `stabilityai/stable-diffusion-3-medium-diffusers` directory organization looked something like this:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/91356702-56bc-4282-9492-fc030a370f98/image.png)

Just set your `MODEL_NAME` (if using`config.env`) or `--pretrained_model_name_or_path` (if using `config.json`) to `stabilityai/stable-diffusion-3.5-large`. `SimpleTuner` will pull the model from Hugging Face for you and store it in the `.cache` directory in your home directory.

```markdown
~/.cache/huggingface/hub 
```

The model files will show up something like this inside the `~/.cache/huggingface/hub/models--stabilityai--stable-diffusion-3.5-large/snapshots/hash` like so:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/0f877456-4463-461e-af4b-a7902781086f/image.png)

### Configuration setup (high-level)

If you are coming from an older version of `SimpleTuner`, the high-level configuration file setup has changed significantly. However, the internal [OPTIONS.MD](https://github.com/bghira/SimpleTuner/blob/main/OPTIONS.md#environment-configuration-variables) still remain the same.

[**⚠️](https://emojipedia.org/warning) Notably**, if you just follow the [SD3 quickstart](https://github.com/bghira/SimpleTuner/blob/main/documentation/quickstart/SD3.md), you may not get the full picture of how exactly the configuration files should be set up. The [INSTALL.MD](https://github.com/bghira/SimpleTuner/blob/main/INSTALL.md) file from `SimpleTuner` gives a full picture of how exactly the configuration file system works.

Before we go further, I want to touch upon how training actually starts. From the quickstart, it says that you run it with:

```bash
bash train.sh
```

- The default [train.sh](http://train.sh) is provided here:

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


This is the general flow.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/8c7f41e0-1bc4-41d9-9caa-9bbd4a058c91/image.png)

At the very beginning, it sources a `config.env` from the `SimpleTuner/config` directory. This is confusing because you have a high-level `config.env` with overarching settings such as number of `gpus`, and then your low-level config such as `config.json` or `config.env` with your more granular settings (i.e. `model_family`, `learning_rate`, etc.).

However, if you `git clone` the repository, you will not see a `config.env` file.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/578bc16b-4ff9-458e-ad51-6a764acb31da/image.png)

In my testing, you don’t need to actually create a high-level `config.env` according to the [INSTALL.MD](https://github.com/bghira/SimpleTuner/blob/main/INSTALL.md), but I highly recommend to do so as it helps you dynamically switch folders within the `config` folder.

Create the `config.env` file inside your `config` directory:

```jsx
vim SimpleTuner/config/config.env
```

- High-level `config.env`

    ```jsx
    TRAINING_NUM_PROCESSES=1
    TRAINING_NUM_MACHINES=1
    TRAINING_DYNAMO_BACKEND='no'
    MIXED_PRECISION='bf16'
    export CONFIG_BACKEND="json"
    export ENV="default"
    ```


If I run this:

```jsx
bash train.sh
```

`SimpleTuner` will search inside the `ENV` directory for a `config.json`, which is the `config` directory. The reason being, in the master `config.env` file, `ENV` was set to `default` , which means `SimpleTuner/config`.

You might also ask, why does it look for `config.json`? Well, if you look at this code block from the [`train.sh`](http://train.sh) file, you’ll see that it looks for this file depending on what you specified as the `CONFIG_BACKEND` in the master `config.env` file:

```jsx
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

You might also wonder, can I change the name of the `config.*`? Can I use `config_fantasy_art_lora_01.*`? What about `config_fantasy_art_full_01.*`?

Sadly, it seems like you cannot. Even if you change the name of your `config.*` in the `train.sh`file, the [loader.py](https://github.com/bghira/SimpleTuner/blob/main/helpers/configuration/loader.py#L17) code in the configuration helpers defaults to these values:

```jsx
default_config_paths = {
    "json": "config.json",
    "toml": "config.toml",
    "env": "config.env",
}
```

So, if you want to differentiate between low-level `config.*` files with your detailed training parameter settings and don’t want to modify the [loader.py](https://github.com/bghira/SimpleTuner/blob/main/helpers/configuration/loader.py#L17) code, I suggest that you create a folder within the `SimpleTuner/config` directory that corresponds with your training. I’ll be doing the same.

Inside `SimpleTuner/config` , let’s create a directory for the first training.

```jsx
mkdir SimpleTuner/config/sd35_fantasy_art_lora
```

Now, I’ll modify my high-level `config.env` at `SimpleTuner/config/config.env` to be this:

- High-level `config.env`

    ```jsx
    TRAINING_NUM_PROCESSES=1
    TRAINING_NUM_MACHINES=1
    TRAINING_DYNAMO_BACKEND='no'
    MIXED_PRECISION='bf16'
    export CONFIG_BACKEND="json"
    export ENV="sd35_fantasy_art_lora"
    ```


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/5b234473-9e5b-430e-ae72-85711595006b/image.png)

When training starts, it will first source the master `config.env` at `SimpleTuner/config/config.env` , then look inside `SimpleTuner/config/sd35_fantasy_art_lora` for the corresponding `config.${CONFIG_BACKEND}` file. In this case, it is `config.json` .

I hope this clarifies the flow of the training as understanding this will make it extremely easy for you to manage your different `config` training parameters for different models.

Let’s head to the low-level `config.*` files now.

### Configuration setup (low-level)

There is a default `config.json.example` provided by `bghira` inside the `SimpleTuner/config/` directory.

Just skip to using my custom `config.json` if you don’t want to know the details.

- Custom SD3.5 Large `LoRA` `config.json`

    ```jsx
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


If you do want to know the details, read on.

You can get started by copying the `config` file in the root of the `SimpleTuner` to your `ENV` directory. This is my command.

```jsx
cp config/config.json.example config/sd35_fantasy_art_lora/config.json
```

Once you open it up, the `json` file looks something like this:

- `config.json.example`

    ```jsx
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


If you like, you could use this out of the box if you want. However, the provided `json` lacks plenty of the other parameters in [OPTIONS.MD](https://github.com/bghira/SimpleTuner/blob/main/OPTIONS.md#environment-configuration-variables). Even if you use the [configure.py](https://github.com/bghira/SimpleTuner/blob/main/configure.py), you end up with this generated`config.json` file:

- Sample `.json` generated with `configure.py` (used as a reference)

    ```jsx
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


The [configure.py](https://github.com/bghira/SimpleTuner/blob/main/configure.py) restricts some of the parameters such as `lora_rank` as well as leaving out a negative prompt during validation (`validation_negative_prompt`) among other things, so I recommend just copying my `config.json` below as a starting point:

- Custom SD3.5 Large `LoRA` `config.json`

    ```jsx
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


You might have noticed something, but we **no** **longer** have this parameter from the old low-level `config.env`:

```jsx
export STABLE_DIFFUSION_3=true
```

Instead, it’s been replaced with the `"--model_family"` parameter. Set this to `sd3`:

```jsx
"--model_family": "sd3"
```

In fact, low-level `config.env` is possibly deprecated by `SimpleTuner`. However, I’ll show you how to use it still if you want in this [section](https://www.notion.so/Stable-Diffusion-3-5-Large-Fine-tuning-Tutorial-11a61cdcd1968027a15bdbd7c40be8c6?pvs=21).

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/6f31cfde-e490-4319-a6b6-f9ec6df80e16/image.png)

In addition, make sure this parameter is set properly or else you won’t be able to pull the model from `HuggingFace`.

```jsx
 "--pretrained_model_name_or_path": "stabilityai/stable-diffusion-3.5-large"
```

To ensure that this works, you’ll have to make sure that your `HuggingFace` account has been granted access to this model on the model card page here. You can follow the instructions here from the [quickstart guide](https://github.com/bghira/SimpleTuner/blob/main/documentation/quickstart/SD3.md) to do so.

These are the commands:

**Optional**

This is for logging the metrics of your model during training via [Weights & Biases](https://wandb.ai/).

```bash
wandb login
```

**Mandatory**

This is for getting access to download the model.

```bash
huggingface-cli login
```

Before we address the rest of the settings, it’s a good idea to set up the `multidatabackend.json` file now.

### Dataloader

Before I parse the relevant parameters into digestible vocabulary for humans, I want to start with the data portion: `--data_backend_config` and `--output_dir`. In the previous version of `SimpleTuner` , there was a `multidatabackend.json` file that handled the data.

Excerpt from old code:

```jsx
export BASE_DIR="/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/"
export DATALOADER_CONFIG="${BASE_DIR}/multidatabackend.json"
export OUTPUT_DIR="${BASE_DIR}/models"
```

As you can see, the `BASE_DIR` is declared, then both the `DATALOADER_CONFIG` and `OUTPUT_DIR` expands it. `multidatabackend.json` is a file created inside of the `BASE_DIR` .

However, SimpleTuner’s default config folder has this file `SimpleTuner/config/multidatabackend.json`. Depending on your personal preference, you can place all your `multidatabackend.json` files wherever you like, but I’m going to preserve the structure from older versions of `SimpleTuner` as it keeps all my models and caches in one place.

Thus, I will create a folder location that will serve as my `BASE_DIR` . As such, both `--data_backend_config` and `--output_dir` will utilize this path.

Since we’re using `json`, we’ll have to hard-code it.

```jsx
 "--data_backend_config": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/multidatabackend.json",
  "--output_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/datasets/models",
```

All the models will be saved in the `--output_dir` , which in this case is the hard-coded `BASE_DIR/models`.

Below is my custom `multidatabackend.json` .

- Custom `multidatabackend.json`

    ```jsx
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


There are three directories that need to be specified:

1. `cache_dir_vae`

I have this in my example file:

```jsx
    "cache_dir_vae": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/cache/vae/sd3/fantasy_art_neo"
```

For readability and clarity, I’ve put the `cache` folder inside the base directory.

1. `instance_dir_vae`

This is where your dataset with images and captions go. Pretty straightforward.

```jsx
"instance_data_dir": "/weka2/home-yeo/datasets/SDXL/duplicate_shuffle_01"
```

1. `cache_dir`

Same thing as above.

```jsx
    "cache_dir": "/weka2/home-yeo/simpletuner_models/sd3_large/full_finetune/fantasy_art_L_01/cache/text/sd3/fantasy_art_neo"
```

The rest of the settings are not so important to me. I’ve already pre-cropped my images, so I’ve set `"crop": false` .

In addition, there is a `repeats` parameter that you may or may not be familiar with depending on whether or not you’ve used other training repositories before. I will cover this as well in the next section. That’s why `"repeats": 1` as I handle it on my own.

### Data preparation

All of the images in my datasets were already pre-cropped into one of these aspect ratios and resolutions:

```python
[
    (1024, 1024), (1152, 896), (896, 1152), (1216, 832),
    (832, 1216), (1344, 768), (768, 1344), (1472, 704)
]
```

If you need help automatically pre-cropping your images, this is a lightweight, barebones [script](https://github.com/kasukanra/autogen_local_LLM/blob/main/detect_utils.py) I wrote to do it. It will find the best crop depending on:

1. Is there a human face in the image? If so, we’ll do the cropping oriented around that region of the image.
2. If there is no human face detected, we’ll do the cropping using a saliency map, which will detect the most interesting region of the image. Then, a best crop will be extracted centered around that region.

Anyway, my base dataset structure looks something like this (text files are the captions):

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/397b1f8c-331d-4d14-933c-a26a1178fe0f/image.png)

Here are some examples of what my captions look like:

```markdown
k4s4, a close up portrait view of a young man with green eyes and short dark hair, looking at the viewer with a slight smile, visible ears, wearing a dark jacket, hair bangs, a green and orange background
```

```markdown
k4s4, a rear view of a woman wearing a red hood and faded skirt holding a staff in each hand and steering a small boat with small white wings and large white sail towards a city with tall structures, blue sky with white clouds, cropped
```

If you don't have your own fine-tuning dataset, feel free to use [this dataset](https://drive.google.com/file/d/1capT9kF-zCu2OiNVzm7VG5DQDaAQLl1Q/view?usp=sharing) of paintings by John Singer Sargent (downloaded from WikiArt and auto-captioned) or a synthetic pixel art [dataset](https://drive.google.com/file/d/1tOyNsjR5i7ki5UkyxHhjjT_VVD8vK5WN/view?usp=drive_link).

I’ll be showing results from several fine-tuned `LoRA` models of varying dataset size to show that the settings I chose generalize well enough to be a good starting point for fine-tuning `LoRA`.

| `name` | `fantasy art` | `cinema photo` | `john singer sargent` | `underexposed photography` | `pixel art`  | `ethnic paint`  |
| --- | --- | --- | --- | --- | --- | --- |
| `number of images` | 476 | 460 | 460 | 96 | 82 | 68 |
| `number of repeats` | 5 | 5 | 5 | 5 | 5 | 5 |

`repeats` duplicates your images (and optionally rotates, changes the hue/saturation, etc.) and captions as well to help generalize the style into the model and prevent overfitting. While `SimpleTuner` supports caption dropout (randomly dropping captions a specified percentage of the time), it doesn’t support shuffling tokens (tokens are kind of like words in the caption) as of this moment, but you can simulate the behavior of kohya’s [sd-scripts](https://github.com/kohya-ss/sd-scripts) where you can [shuffle tokens](https://github.com/kohya-ss/sd-scripts/blob/25f961bc779bc79aef440813e3e8e92244ac5739/docs/config_README-en.md?plain=1#L146) while [keeping](https://github.com/kohya-ss/sd-scripts/blob/25f961bc779bc79aef440813e3e8e92244ac5739/docs/config_README-en.md?plain=1#L143) an `n` amount of tokens in the beginning positions. **Doing so helps the model not get too fixated on extraneous tokens.**

If you’d like to replicate that function, I’ve provided a script here that will duplicate the images and manipulate the captions:

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


If you do so, the final dataset looks something like the image below. I felt that with the settings I used, 5 `repeats` seemed acceptable.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/e3502df8-bfac-4e20-b462-b7a8127e927e/image.png)

## Returning to the custom config

At this point, let’s address these specific settings in the custom config:

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


At this point, let’s address these settings in the custom config:

```jsx
{
  "--checkpointing_steps": 400,
  "--checkpoints_total_limit": 60,
  "--learning_rate": 1.05e-3,
  "--max_train_steps": 24000
}
```

### Steps calculation

Max training steps can be calculated based on a simple mathematical equation (for a **single concept**):

$$
\text{Max training steps} = \left(\frac{\text{Number of samples} \times \text{Repeats}}{\text{Batch size}}\right) \times \text{Epochs}
$$

There are four variables here:

- Batch size: The number of samples processed in one iteration.
- Number of samples: Total number of samples in your dataset.
- Number of repeats: How many times you repeat the dataset within one epoch.
- Epochs: The number of times the entire dataset is processed.

There are `476` images in the `fantasy art` dataset. Add on top of the `5` repeats from `multidatabackend.json` . I chose a `train_batch_size` of `6` for two reasons:

1. This value would let me see the progress bar update every second or two.
2.  It’s large enough in that it can take `6` samples in one iteration, making sure that there is more generalization during the training process.

If I wanted 30 or something epochs, then the final calculation would be this:

$$
\text{Max training steps} = \left(\frac{\text{476} \times \text{5}}{\text{6}}\right) \times \text{30}
$$

This equals `11,900` steps, more or less.

The part inside the parentheses:

$$
\left(\frac{\text{476} \times \text{5}}{\text{6}}\right)
$$

represents the number of steps per epoch, which is `396`.

As such, I rounded these values up to `400` for  `CHECKPOINTING_STEPS` .

[**⚠️](https://emojipedia.org/warning)** Although I calculated `11,900` for `MAX_NUM_STEPS`, I set it to `24,000` in the end. I wanted to see more of samples of the LoRA training. Thus, anything after the original `11,900` would give me a good gauge on whether I was overtraining or not. So, I just doubled the total steps `11,900` x `2` = `23,800`, then rounded up.

`CHECKPOINTING_STEPS` represents how often you want to save a model checkpoint. Setting it to `400` is pretty close to one epoch for me, so that seemed fine.

`CHECKPOINTING_LIMIT` is how many checkpoints you want to save before overwriting the earlier ones. In my case, I wanted to keep all of the checkpoints, so I set the limit to a high number like `60`.

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

Lastly, for learning rate, I set it to `1.5e-3` as any higher would cause the gradient to explode like so:

![checkpoint-5600_0001.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/fca2f221-6b2a-4465-abed-84db356e7c42/checkpoint-5600_0001.png)

The other relevant settings are related to `LoRA`.

```jsx
{
  "--lora_rank": 768,
  "--lora_alpha": 768,
  "--lora_type": "standard"
}
```

Personally, I received very satisfactory results using a higher `LoRA` rank and alpha. You can watch the more recent videos on my YouTube [channel](https://youtube.com/@kasukanra) for a more precise heuristic breakdown of how image fidelity increases the higher you raise the `LoRA` rank (in my opinion).

Anyway, If you don’t have the VRAM, storage capacity, or time to go so high, you can choose to go with a lower value such as `256` or `128` .

As for `lora_type` , I’m just going with the tried and true `standard` . There is another option for the `lycoris` type of `LoRA` , but it’s still very experimental and not well explored. I have done the deep-dive of `lycoris` myself, but I haven’t found the correct settings that produces acceptable results.

### Custom `config.json` miscellaneous

There are some extra settings that you can change for quality of life.

```jsx
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

These are pretty self-explanatory:

`"--validation_prompt"`

The prompt that you want to use to generate validation images. This is your positive prompt.

`"--validation_negative_prompt"`

Negative prompt.

`"--validation_guidance"`

Classifier free guidance (CFG) scale.

`"--validation_num_inference_steps"`

The number of sampling steps to use.

`"--validation_seed"`

Seed value when generating validation images.

`"--lr_warmup_steps"`

`SimpleTuner` has set the default warm up to `10%` of the total training steps behind the scenes if you don’t set it, and that’s a value I use often. So, I hard-coded it in (`24,000` * `0.1` = `2,400`). Feel free to change this.

`"--validation_steps"`

The frequency at which you want to generate validation images is set with `"--validation_steps"`. I set mine to 200, which is a 1/2 of 400 (number of steps in an epoch for my fantasy art example dataset). This means that I generate a validation image every 1/2 of an epoch. I suggest generating validation images at least every half epoch as a sanity check. If you don’t, you might not be able to catch errors as quickly as you can.

Lastly is `"--lr_scheduler"` and `"--lr_warmup_steps"`.

I went with a `cosine` scheduler. This is what it will look like:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/a5f404ff-e50b-455d-8153-fb6ef7ed2c78/image.png)

### What happened to the low-level `config.env` ?

As I mentioned before, it appears that `SimpleTuner` is moving away from the low-level `config.env` format, opting to go with `json` for ease of use. Most other training repositories also use `json` .

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/6f31cfde-e490-4319-a6b6-f9ec6df80e16/image.png)

However, low-level `config.env` is still supported based on the code in [loader.py](https://github.com/bghira/SimpleTuner/blob/main/helpers/configuration/loader.py#L17). Furthermore, previous users of `SimpleTuner` who already have a previous low-level `config.env` file can just adjust some parameters to get up to speed quickly without switching file formats (involves looking up the corresponding [OPTIONS.MD](https://github.com/bghira/SimpleTuner/blob/main/OPTIONS.md#environment-configuration-variables)).

This is the equivalent version of the `config.json` above, but in `.env` format.

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


[**☝️](https://emojipedia.org/index-pointing-up)** I just want to point out that `LoRA` rank/alpha can be changed inside the `TRAINER_EXTRA_ARGS` variable.

```bash
export TRAINER_EXTRA_ARGS="--lora_rank=768 --lora_alpha=768"
```

[**⚠️](https://emojipedia.org/warning)** If you end up deciding to go with the `.env` format, make sure that there are no inline comments,  reference variables, or calculations. The is just how the new `SimpleTuner` [env helper](https://github.com/bghira/SimpleTuner/blob/main/helpers/configuration/env_file.py#L94) works, so everything needs to be hard-coded. ****For example:

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

You can use the above low-level `config.env` as a base reference if you’d like. Remember, if you do decide to use a low-level `env` file, don’t forget to change your `CONFIG_BACKEND` to be `env` in your high-level `config.env`:

```bash
TRAINING_NUM_PROCESSES=1
TRAINING_NUM_MACHINES=1
TRAINING_DYNAMO_BACKEND='no'
MIXED_PRECISION='bf16'
export CONFIG_BACKEND="env"
export ENV="sd35_fantasy_art_lora"
```

## Training process

Finally, we can start the training process. Let’s bring all the necessary files here just for reference.

- High-level `config.env`

    ```jsx
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

I want to mention one small thing here that could prevent you from launching your training. Inside the default `train.sh` near the end, there is a command to run the the training.

```python
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

If this is your first training repository install ever, this will probably run without error. However, if you have used `accelerate` in any other repository, odds are that you will have already configured a `default_config.yaml`. If your training does run into an error, then I’ve provided my own `config.yaml` here for normal training. I’ve also provided a `DeepSpeed` `config.yaml` if you’d like to attempt a full fine-tune as opposed to `LoRA` training.

`DeepSpeed` uses special techniques under the hood to offload optimizer states, gradients, and other parameters to CPU memory (RAM) when not enough GPU VRAM is available. On a single `H100` GPU with `80 GB` of VRAM and `128 GB` of CPU RAM, I could perform full fine-tuning with `SD3.5 Large`. You can also use this `config.yaml` whenever you have low VRAM and need to offload to CPU RAM.

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


Wherever you choose to place these `yaml` files, make sure to properly reference them in the `train.sh` code. For example, I place my files inside the root of the `SimpleTuner` directory. As such, the `ACCELERATE_CONFIG_PATH` part of the code will be modified accordingly.

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

If you do end up trying out `DeepSpeed`-assisted training, this is a sample low-level `config.env` to go with it.

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

Notably, the learning rate was decreased to `5e-5`.

If everything is in order, go ahead and start your training.

```bash
bash train.sh
```

### Memory usage

If you aren’t training the text encoders (we aren’t), `SimpleTuner` saves us about `10.4 GB` of VRAM.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/316002db-297b-45a9-b919-cec6b311c773/image.png)

With the settings of `batch size` of `6` and a `lora rank/alpha` of `768`, the training consumes about `32 GB` of VRAM.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/c2aac70a-8c65-4f6f-b602-487f24de4bd2/image.png)

Understandably, this is out of the range of consumer `24 GB` VRAM GPUs. As such, I tried to decrease the memory costs by using a `batch size` of `1` and `lora rank/alpha` of `128` .

Tentatively, I was able to bring the VRAM cost down to around `19.65 GB` of VRAM.

However, when running inference for the validation prompts, it spikes up to around `23.37 GB` of VRAM.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/0c5240d6-6f71-404e-bea7-b18cc35ee5ad/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/026be306-8331-45a2-9c02-541005f2cdfd/image.png)

To be safe, you might have to decrease the `lora rank/alpha` even further to `64`. If so, you’ll consume around `18.83 GB` of VRAM during training.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/5edcaaf9-bf0d-4db0-a183-cfab44963b8e/image.png)

During validation inference, it will go up to around `21.50 GB` of VRAM. This seems safe enough.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/bd41ce4e-a0db-443b-b3d2-63eac136779d/image.png)

If you do decide to go with the higher spec training of `batch size` of `6` and `lora rank/alpha` of `768` , you can use the `DeepSpeed` config I provided [above](https://www.notion.so/Stable-Diffusion-3-5-Large-Fine-tuning-Tutorial-11a61cdcd1968027a15bdbd7c40be8c6?pvs=21) if your GPU VRAM is insufficient and you have enough CPU RAM.

### Monitoring the training

Throughout the training, there may be times when your validation images pixelate or turn black. This is because I’m using a pretty aggressive learning rate of `1.05e-3` . If you want to play it safer, `9.5e-4` gave me very few pixelating issues, if at all. Nevertheless, both loss curves converged nicely in the end.

However, I’d like to show some examples of what it may look like to assuage any concerns.

`Fantasy Art`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/c900b6d5-9a90-4de1-9fde-335bb9ce9887/image.png)

`Underexposed photography`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/d6c34f3d-f320-433a-a914-24699f6803b5/image.png)

### Observing training loss

### `LoRA`

These are the figures that I received from my fantasy art `LoRA` training. Loss is decreasing and hasn’t converged yet. However, if you have some experience with fine-tuning diffusion models, minimizing loss has almost nothing to do with maximizing aesthetics. Also, I noticed that near the peaks of the loss curve, pixelation or degradation in validation images may occur, if using a high learning rate. This makes sense as training reaches a learning rate that the model weights aren’t comfortable with.

When learning rate is high, train loss peaks high as well.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/011c7bbf-c601-4797-a5b3-b90dbdf2e293/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/548c5118-ff38-4653-97ea-019a87879026/image.png)

## Evaluating the results

### How to actually get the LoRA models into ComfyUI

Now that the models are all trained, it’s time to test them out with `ComfyUI` . However, the way that SimpleTuner saves models makes it a little difficult to bring into the `ComfyUI/models/loras` directory.

When you go to the directory where you saved your models, you’ll see that it’s in this format.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/4c576802-3c82-4347-87aa-055e9dfdf0c1/image.png)

The file of interest that we want from each directory is the file `pytorch_lora_weights.safetensors` . To streamline the process of getting these files into `ComfyUI`, I’ve written this script:

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


What this shell script above will do is loop through your `SOURCE_DIR` from `SimpleTuner` , and then symlink ***only*** the `pytorch_lora_weights.safetensors` files to your `TARGET_DIR`, which should be a directory inside `ComfyUI/models/loras`. To keep track of the files, I’ve also renamed them so that they have their corresponding checkpoint numbers inside the file name.

### Determining the best checkpoint

The basic `SD3.5 Large` workflow that I’m using is this one.

[sd35_fantasy_art_01.json](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/43deb260-8159-48b7-affd-65230ce190c7/sd35_fantasy_art_02.json)

[sd35_fantasy_art_01_api.json](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/3b896d45-20f7-4ec1-b416-14e42524067c/sd35_fantasy_art_02_api.json)

The way that I determine the best checkpoint is to plot the checkpoint number on the x-axis for a specific prompt. So, I’ll just get one single strip like this:

Fantasy Art `LoRA`

Prompt

```bash
a three fourth perspective waist up portrait view of a young woman with messy long blonde hair and light purple eyes, looking at viewer with a closed mouth smile, wearing tight black dress, a faded pink simple background during golden hour
```

![output_image_strip.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/a9496ce6-ef22-4bc2-8fad-f0de6a7a5a89/output_image_strip.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/d81a252f-695f-4499-aefa-9ef15595dea5/image.png)

To do this, I use a custom script that loads in the `api` version of the `ComfyUI` workflow. You can save any workflow in the `API` format if you click the save (API format) button. I’ve already saved a version above for your use. If you want a more in-depth video guide about using the `ComfyUI` API, I made one [here](https://youtu.be/WwsJ_QIgsG8) last year.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/f3c7ce48-5f0c-4784-b744-f813423a75bc/image.png)

Make sure that `ComfyUI` is running, and then run this script below. You’ll also need to set up an `.env` file in the same place where you run the script.

- `API script`

  This is my custom `python` script:

    ```python
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

I ended up choosing the checkpoint near the end at step`24,000`.

I also ran the same experiments for every other training I did as a sanity check.

Cinema Photo `LoRA`

Prompt

```markdown
a few hooded figures walking on an empty road in the rain, desolate, high skyscrapers
```

![output_image_strip.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/e679c9bb-339d-44be-814f-11f6d69a681e/output_image_strip.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/a896482a-4e3a-4bc5-9600-a78b32f49b28/image.png)

John Singer Sargent `LoRA`

Prompt

```markdown
an abandoned beach with a lighthouse
```

![output_image_strip.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/4c52b80d-fa70-421b-8bf4-cf1f46824551/output_image_strip.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/b4f05ec3-6652-4697-9643-2a7783b0ae21/image.png)

Underexposed Photography `LoRA`

Prompt

```markdown
waist up view of a woman posing on a runway, streetwear in the style of alexander mcqueen
```

For professional reasons, certain parts of the original grid have been omitted. The full grid contains content that may not be appropriate for all audiences, so a cropped version is displayed to maintain the focus on the technical aspects.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/58bd3b25-ab8e-45e0-8847-34d624204229/image.png)

Pixel Art `LoRA`

Prompt

```bash
a plush chibi mythical creature
```

![output_image_strip.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/c2b059ca-f3ae-4045-a7f4-91ab4c02d029/output_image_strip.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/20b793d1-99a1-4721-883a-fca98f021d9e/image.png)

Ethnic Paint `LoRA`

Prompt

```bash
a skyline view of a futuristic maritime village floating above ground, in the clouds, towering skyscrapers, golden hour, day time lighting
```

![output_image_strip.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/594e0733-15b2-44da-903e-f861d52e8198/output_image_strip.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/4a3684d2-1150-4ac1-ae08-15460fb65bb5/image.png)

## A/B evaluation

### Improving/tuning generations with APG scaling

Once you’ve found the `LoRA` checkpoint that gives you the best aesthetic results, you can further improve it with `APG` scaling. `APG` scaling stands for adaptive projected guidance.

Key part of the abstract from the [APG paper](https://arxiv.org/abs/2410.02416)

```markdown
Our approach, termed adaptive projected guidance (APG), retains the quality-boosting advantages of CFG while enabling the use of higher guidance scales without oversaturation. APG is easy to implement and introduces practically no additional computational overhead to the sampling process.
```

This is the [ComfyUI node](https://github.com/logtd/ComfyUI-APGScaling) that’s included in this sample workflow. It will generate three different images, one with the base image, one with the `LoRA` applied ***without*** `APG` scaling, and a third image with the `LoRA` applied ***with*** `APG` scaling.

The parameters for APG are:

```markdown
eta
norm_threshold
use_momentum
momentum
```

I didn’t do that much of a deep dive for this node, but it does change the image quality, for better or for worse.

### Before and after comparison

Fantasy Art

Prompt

```markdown
a three fourth perspective waist up portrait view of a young woman with messy long blonde hair and light purple eyes, perfect face, looking at viewer with a closed mouth smile, wearing loose black dress, a faded pink simple background during golden hour
```

`Base model`

![ComfyUI_temp_foqht_00038_.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/c625a584-ea9f-4439-ab05-491bb69b4e5c/ComfyUI_temp_foqht_00038_.png)

`LoRA`

![ComfyUI_temp_okvik_00013_.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/c41e4924-19db-4f5b-aa4c-ef1aa87d840e/ComfyUI_temp_okvik_00013_.png)

`LoRA` + `APG`

![ComfyUI_temp_xmuld_00011_NEW.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/970e85dd-586a-4978-b1bb-4a9cb0c14114/ComfyUI_temp_xmuld_00011_NEW.png)

Cinema Photo

Prompt

```markdown
a wide view of a figure looking up at a meteor breaking apart
```

`Base model`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/9f2673ce-47f1-490a-b43b-59b70a07f85f/image.png)

`LoRA`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/bdaf166b-2653-496f-ba34-42564dc28569/image.png)

`LoRA` + `APG`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/f197b2f2-bd22-43b3-9aa2-aa0104c89ab1/image.png)

John Singer Sargent

Prompt

```markdown
an abandoned beach with a lighthouse
```

`Base model`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/700fccf5-a1da-4ff1-92a4-274e9ee0638a/image.png)

`LoRA`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/383df80f-06a9-418a-936b-0e48c57c71bb/image.png)

`LoRA` + `APG`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/a64a36b0-85db-4e07-99ff-69fddc4e6af4/image.png)

Underexposed Photography

Prompt

```markdown
waist up view of a woman posing on a runway, streetwear in the style of alexander mcqueen
```

`Base model`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/752c7d28-f6ec-49fb-8d49-76544e5167fd/image.png)

`LoRA`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/5cd2cbd3-e81c-4ada-99bf-1f8a45ac3c36/image.png)

`LoRA` + `APG`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/15b84758-d663-4acf-8b30-69acc4f9e257/image.png)

Pixel Art

Prompt

```markdown
a sci-fi venetian town near the water
```

`Base model`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/2af8625c-11c7-4d36-b6a3-1a5d1d3aaa6f/image.png)

`LoRA`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/410cc312-4e90-4a33-af16-21941fbf1b8f/image.png)

`LoRA` + `APG`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/df49439c-08b5-4db5-b2a2-d8983c1ed820/image.png)

Ethnic Paint

Prompt

```markdown
a man in his late 30s to early 40s, rendered in a dark, moody style, The subject is depicted from the shoulders up, facing the viewer directly, He has a full, thick beard and mustache, which is dark and well-groomed, with a few strands of gray, His hair is short and neatly combed, with a few strands falling over his forehead, His eyes are dark and piercing, with a slight hint of sadness or introspection, 
```

`Base model`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/9ec25fae-a57b-46c3-a4d7-2d049cf09aa2/image.png)

`LoRA`

![ComfyUI_temp_bavyy_00005_PERFECT.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/bcebc65e-23bb-48ba-be0e-6b7643d9edc8/ComfyUI_temp_bavyy_00005_PERFECT.png)

`LoRA` + `APG`

![ComfyUI_temp_pmjav_00001_.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/71a85dab-28f1-4ad3-a151-e10c85d5956a/ComfyUI_temp_pmjav_00001_.png)

`APG` seems to be true to its word. It does reduce saturation. Personally, I don’t prefer the washed out colors it brings, but it could be a great way to acquire a flat ‘’`RAW`”-ish image.

## Other fine-tuning tools/libraries for SD3.5

See [this script and config](https://huggingface.co/blog/sd3-5#training-loras-with-sd35-large-with-quantization) from Hugging Face. This is simpler to use, but the result might be a bit worse.

## Conclusion & Feedback

I hope all of the information here helps you fine-tune SD3.5 Large on release day. As `DiT` architectures are still relatively new, we've tried various methods to achieve the best image quality in terms of composition, texture, and overall aesthetics. If you do run into issues where you’re not attaining the best result, more granular layer manipulation during training is highly recommended.

We'd love to hear how this guide helped you and what we could do to make it even better! If you have 2 minutes, please fill out this form:

## Two cents from Dango

As such, here is some extra information from Dango, one of the main architects of SD3.5 Series.

[Dango's Hugging Face profile](https://huggingface.co/Dango233)

### Diving into SD3.5 Large Architecture

In order to understand the big picture of SD 3.5 Large, let’s go ahead and print out the architecture.

If you download the model to your local directory, it should have a file structure similar to `stable-diffusion-3-medium-diffusers`:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/e1d595cc-5bcd-497a-8872-128ad07fbcf9/image.png)

In SD3.5 Large’s case, it will look like this:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/11853e4d-b1c7-4ffb-ab92-e8e2f3f4c7f1/image.png)

The base model in sharded diffusers format errors out when I try to list its keys, so this is the code to merge it into a single model. At this point, I was working with a local version of the model, but it’s the same as the Hugging Face version downloaded to your `.cache` .

Example path:

```markdown
/home-kasukanra/.cache/huggingface/hub/models--stabilityai--stable-diffusion-3.5-large/snapshots/1a43aa3b9bb52ead637f9693a228092aa802a5dd/transformer
```

```python
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

Once you have the merged model (`combined_model.safetensors` ) in my case, go ahead and run this script to save the architecture in a text file. The script outputs the general sequential flow of transformer models.

```python
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

- SD3.5 Large Architecture

    ```markdown
    EMBEDDING:
    context_embedder.bias
    context_embedder.weight
    pos_embed.pos_embed
    pos_embed.proj.bias
    pos_embed.proj.weight
    time_text_embed.text_embedder.linear_1.bias
    time_text_embed.text_embedder.linear_1.weight
    time_text_embed.text_embedder.linear_2.bias
    time_text_embed.text_embedder.linear_2.weight
    time_text_embed.timestep_embedder.linear_1.bias
    time_text_embed.timestep_embedder.linear_1.weight
    time_text_embed.timestep_embedder.linear_2.bias
    time_text_embed.timestep_embedder.linear_2.weight
    
    TRANSFORMER_BLOCK_0:
    transformer_blocks.0.attn.add_k_proj.bias
    transformer_blocks.0.attn.add_k_proj.weight
    transformer_blocks.0.attn.add_q_proj.bias
    transformer_blocks.0.attn.add_q_proj.weight
    transformer_blocks.0.attn.add_v_proj.bias
    transformer_blocks.0.attn.add_v_proj.weight
    transformer_blocks.0.attn.norm_added_k.weight
    transformer_blocks.0.attn.norm_added_q.weight
    transformer_blocks.0.attn.norm_k.weight
    transformer_blocks.0.attn.norm_q.weight
    transformer_blocks.0.attn.to_add_out.bias
    transformer_blocks.0.attn.to_add_out.weight
    transformer_blocks.0.attn.to_k.bias
    transformer_blocks.0.attn.to_k.weight
    transformer_blocks.0.attn.to_out.0.bias
    transformer_blocks.0.attn.to_out.0.weight
    transformer_blocks.0.attn.to_q.bias
    transformer_blocks.0.attn.to_q.weight
    transformer_blocks.0.attn.to_v.bias
    transformer_blocks.0.attn.to_v.weight
    transformer_blocks.0.ff.net.0.proj.bias
    transformer_blocks.0.ff.net.0.proj.weight
    transformer_blocks.0.ff.net.2.bias
    transformer_blocks.0.ff.net.2.weight
    transformer_blocks.0.ff_context.net.0.proj.bias
    transformer_blocks.0.ff_context.net.0.proj.weight
    transformer_blocks.0.ff_context.net.2.bias
    transformer_blocks.0.ff_context.net.2.weight
    transformer_blocks.0.norm1.linear.bias
    transformer_blocks.0.norm1.linear.weight
    transformer_blocks.0.norm1_context.linear.bias
    transformer_blocks.0.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_1:
    transformer_blocks.1.attn.add_k_proj.bias
    transformer_blocks.1.attn.add_k_proj.weight
    transformer_blocks.1.attn.add_q_proj.bias
    transformer_blocks.1.attn.add_q_proj.weight
    transformer_blocks.1.attn.add_v_proj.bias
    transformer_blocks.1.attn.add_v_proj.weight
    transformer_blocks.1.attn.norm_added_k.weight
    transformer_blocks.1.attn.norm_added_q.weight
    transformer_blocks.1.attn.norm_k.weight
    transformer_blocks.1.attn.norm_q.weight
    transformer_blocks.1.attn.to_add_out.bias
    transformer_blocks.1.attn.to_add_out.weight
    transformer_blocks.1.attn.to_k.bias
    transformer_blocks.1.attn.to_k.weight
    transformer_blocks.1.attn.to_out.0.bias
    transformer_blocks.1.attn.to_out.0.weight
    transformer_blocks.1.attn.to_q.bias
    transformer_blocks.1.attn.to_q.weight
    transformer_blocks.1.attn.to_v.bias
    transformer_blocks.1.attn.to_v.weight
    transformer_blocks.1.ff.net.0.proj.bias
    transformer_blocks.1.ff.net.0.proj.weight
    transformer_blocks.1.ff.net.2.bias
    transformer_blocks.1.ff.net.2.weight
    transformer_blocks.1.ff_context.net.0.proj.bias
    transformer_blocks.1.ff_context.net.0.proj.weight
    transformer_blocks.1.ff_context.net.2.bias
    transformer_blocks.1.ff_context.net.2.weight
    transformer_blocks.1.norm1.linear.bias
    transformer_blocks.1.norm1.linear.weight
    transformer_blocks.1.norm1_context.linear.bias
    transformer_blocks.1.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_2:
    transformer_blocks.2.attn.add_k_proj.bias
    transformer_blocks.2.attn.add_k_proj.weight
    transformer_blocks.2.attn.add_q_proj.bias
    transformer_blocks.2.attn.add_q_proj.weight
    transformer_blocks.2.attn.add_v_proj.bias
    transformer_blocks.2.attn.add_v_proj.weight
    transformer_blocks.2.attn.norm_added_k.weight
    transformer_blocks.2.attn.norm_added_q.weight
    transformer_blocks.2.attn.norm_k.weight
    transformer_blocks.2.attn.norm_q.weight
    transformer_blocks.2.attn.to_add_out.bias
    transformer_blocks.2.attn.to_add_out.weight
    transformer_blocks.2.attn.to_k.bias
    transformer_blocks.2.attn.to_k.weight
    transformer_blocks.2.attn.to_out.0.bias
    transformer_blocks.2.attn.to_out.0.weight
    transformer_blocks.2.attn.to_q.bias
    transformer_blocks.2.attn.to_q.weight
    transformer_blocks.2.attn.to_v.bias
    transformer_blocks.2.attn.to_v.weight
    transformer_blocks.2.ff.net.0.proj.bias
    transformer_blocks.2.ff.net.0.proj.weight
    transformer_blocks.2.ff.net.2.bias
    transformer_blocks.2.ff.net.2.weight
    transformer_blocks.2.ff_context.net.0.proj.bias
    transformer_blocks.2.ff_context.net.0.proj.weight
    transformer_blocks.2.ff_context.net.2.bias
    transformer_blocks.2.ff_context.net.2.weight
    transformer_blocks.2.norm1.linear.bias
    transformer_blocks.2.norm1.linear.weight
    transformer_blocks.2.norm1_context.linear.bias
    transformer_blocks.2.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_3:
    transformer_blocks.3.attn.add_k_proj.bias
    transformer_blocks.3.attn.add_k_proj.weight
    transformer_blocks.3.attn.add_q_proj.bias
    transformer_blocks.3.attn.add_q_proj.weight
    transformer_blocks.3.attn.add_v_proj.bias
    transformer_blocks.3.attn.add_v_proj.weight
    transformer_blocks.3.attn.norm_added_k.weight
    transformer_blocks.3.attn.norm_added_q.weight
    transformer_blocks.3.attn.norm_k.weight
    transformer_blocks.3.attn.norm_q.weight
    transformer_blocks.3.attn.to_add_out.bias
    transformer_blocks.3.attn.to_add_out.weight
    transformer_blocks.3.attn.to_k.bias
    transformer_blocks.3.attn.to_k.weight
    transformer_blocks.3.attn.to_out.0.bias
    transformer_blocks.3.attn.to_out.0.weight
    transformer_blocks.3.attn.to_q.bias
    transformer_blocks.3.attn.to_q.weight
    transformer_blocks.3.attn.to_v.bias
    transformer_blocks.3.attn.to_v.weight
    transformer_blocks.3.ff.net.0.proj.bias
    transformer_blocks.3.ff.net.0.proj.weight
    transformer_blocks.3.ff.net.2.bias
    transformer_blocks.3.ff.net.2.weight
    transformer_blocks.3.ff_context.net.0.proj.bias
    transformer_blocks.3.ff_context.net.0.proj.weight
    transformer_blocks.3.ff_context.net.2.bias
    transformer_blocks.3.ff_context.net.2.weight
    transformer_blocks.3.norm1.linear.bias
    transformer_blocks.3.norm1.linear.weight
    transformer_blocks.3.norm1_context.linear.bias
    transformer_blocks.3.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_4:
    transformer_blocks.4.attn.add_k_proj.bias
    transformer_blocks.4.attn.add_k_proj.weight
    transformer_blocks.4.attn.add_q_proj.bias
    transformer_blocks.4.attn.add_q_proj.weight
    transformer_blocks.4.attn.add_v_proj.bias
    transformer_blocks.4.attn.add_v_proj.weight
    transformer_blocks.4.attn.norm_added_k.weight
    transformer_blocks.4.attn.norm_added_q.weight
    transformer_blocks.4.attn.norm_k.weight
    transformer_blocks.4.attn.norm_q.weight
    transformer_blocks.4.attn.to_add_out.bias
    transformer_blocks.4.attn.to_add_out.weight
    transformer_blocks.4.attn.to_k.bias
    transformer_blocks.4.attn.to_k.weight
    transformer_blocks.4.attn.to_out.0.bias
    transformer_blocks.4.attn.to_out.0.weight
    transformer_blocks.4.attn.to_q.bias
    transformer_blocks.4.attn.to_q.weight
    transformer_blocks.4.attn.to_v.bias
    transformer_blocks.4.attn.to_v.weight
    transformer_blocks.4.ff.net.0.proj.bias
    transformer_blocks.4.ff.net.0.proj.weight
    transformer_blocks.4.ff.net.2.bias
    transformer_blocks.4.ff.net.2.weight
    transformer_blocks.4.ff_context.net.0.proj.bias
    transformer_blocks.4.ff_context.net.0.proj.weight
    transformer_blocks.4.ff_context.net.2.bias
    transformer_blocks.4.ff_context.net.2.weight
    transformer_blocks.4.norm1.linear.bias
    transformer_blocks.4.norm1.linear.weight
    transformer_blocks.4.norm1_context.linear.bias
    transformer_blocks.4.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_5:
    transformer_blocks.5.attn.add_k_proj.bias
    transformer_blocks.5.attn.add_k_proj.weight
    transformer_blocks.5.attn.add_q_proj.bias
    transformer_blocks.5.attn.add_q_proj.weight
    transformer_blocks.5.attn.add_v_proj.bias
    transformer_blocks.5.attn.add_v_proj.weight
    transformer_blocks.5.attn.norm_added_k.weight
    transformer_blocks.5.attn.norm_added_q.weight
    transformer_blocks.5.attn.norm_k.weight
    transformer_blocks.5.attn.norm_q.weight
    transformer_blocks.5.attn.to_add_out.bias
    transformer_blocks.5.attn.to_add_out.weight
    transformer_blocks.5.attn.to_k.bias
    transformer_blocks.5.attn.to_k.weight
    transformer_blocks.5.attn.to_out.0.bias
    transformer_blocks.5.attn.to_out.0.weight
    transformer_blocks.5.attn.to_q.bias
    transformer_blocks.5.attn.to_q.weight
    transformer_blocks.5.attn.to_v.bias
    transformer_blocks.5.attn.to_v.weight
    transformer_blocks.5.ff.net.0.proj.bias
    transformer_blocks.5.ff.net.0.proj.weight
    transformer_blocks.5.ff.net.2.bias
    transformer_blocks.5.ff.net.2.weight
    transformer_blocks.5.ff_context.net.0.proj.bias
    transformer_blocks.5.ff_context.net.0.proj.weight
    transformer_blocks.5.ff_context.net.2.bias
    transformer_blocks.5.ff_context.net.2.weight
    transformer_blocks.5.norm1.linear.bias
    transformer_blocks.5.norm1.linear.weight
    transformer_blocks.5.norm1_context.linear.bias
    transformer_blocks.5.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_6:
    transformer_blocks.6.attn.add_k_proj.bias
    transformer_blocks.6.attn.add_k_proj.weight
    transformer_blocks.6.attn.add_q_proj.bias
    transformer_blocks.6.attn.add_q_proj.weight
    transformer_blocks.6.attn.add_v_proj.bias
    transformer_blocks.6.attn.add_v_proj.weight
    transformer_blocks.6.attn.norm_added_k.weight
    transformer_blocks.6.attn.norm_added_q.weight
    transformer_blocks.6.attn.norm_k.weight
    transformer_blocks.6.attn.norm_q.weight
    transformer_blocks.6.attn.to_add_out.bias
    transformer_blocks.6.attn.to_add_out.weight
    transformer_blocks.6.attn.to_k.bias
    transformer_blocks.6.attn.to_k.weight
    transformer_blocks.6.attn.to_out.0.bias
    transformer_blocks.6.attn.to_out.0.weight
    transformer_blocks.6.attn.to_q.bias
    transformer_blocks.6.attn.to_q.weight
    transformer_blocks.6.attn.to_v.bias
    transformer_blocks.6.attn.to_v.weight
    transformer_blocks.6.ff.net.0.proj.bias
    transformer_blocks.6.ff.net.0.proj.weight
    transformer_blocks.6.ff.net.2.bias
    transformer_blocks.6.ff.net.2.weight
    transformer_blocks.6.ff_context.net.0.proj.bias
    transformer_blocks.6.ff_context.net.0.proj.weight
    transformer_blocks.6.ff_context.net.2.bias
    transformer_blocks.6.ff_context.net.2.weight
    transformer_blocks.6.norm1.linear.bias
    transformer_blocks.6.norm1.linear.weight
    transformer_blocks.6.norm1_context.linear.bias
    transformer_blocks.6.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_7:
    transformer_blocks.7.attn.add_k_proj.bias
    transformer_blocks.7.attn.add_k_proj.weight
    transformer_blocks.7.attn.add_q_proj.bias
    transformer_blocks.7.attn.add_q_proj.weight
    transformer_blocks.7.attn.add_v_proj.bias
    transformer_blocks.7.attn.add_v_proj.weight
    transformer_blocks.7.attn.norm_added_k.weight
    transformer_blocks.7.attn.norm_added_q.weight
    transformer_blocks.7.attn.norm_k.weight
    transformer_blocks.7.attn.norm_q.weight
    transformer_blocks.7.attn.to_add_out.bias
    transformer_blocks.7.attn.to_add_out.weight
    transformer_blocks.7.attn.to_k.bias
    transformer_blocks.7.attn.to_k.weight
    transformer_blocks.7.attn.to_out.0.bias
    transformer_blocks.7.attn.to_out.0.weight
    transformer_blocks.7.attn.to_q.bias
    transformer_blocks.7.attn.to_q.weight
    transformer_blocks.7.attn.to_v.bias
    transformer_blocks.7.attn.to_v.weight
    transformer_blocks.7.ff.net.0.proj.bias
    transformer_blocks.7.ff.net.0.proj.weight
    transformer_blocks.7.ff.net.2.bias
    transformer_blocks.7.ff.net.2.weight
    transformer_blocks.7.ff_context.net.0.proj.bias
    transformer_blocks.7.ff_context.net.0.proj.weight
    transformer_blocks.7.ff_context.net.2.bias
    transformer_blocks.7.ff_context.net.2.weight
    transformer_blocks.7.norm1.linear.bias
    transformer_blocks.7.norm1.linear.weight
    transformer_blocks.7.norm1_context.linear.bias
    transformer_blocks.7.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_8:
    transformer_blocks.8.attn.add_k_proj.bias
    transformer_blocks.8.attn.add_k_proj.weight
    transformer_blocks.8.attn.add_q_proj.bias
    transformer_blocks.8.attn.add_q_proj.weight
    transformer_blocks.8.attn.add_v_proj.bias
    transformer_blocks.8.attn.add_v_proj.weight
    transformer_blocks.8.attn.norm_added_k.weight
    transformer_blocks.8.attn.norm_added_q.weight
    transformer_blocks.8.attn.norm_k.weight
    transformer_blocks.8.attn.norm_q.weight
    transformer_blocks.8.attn.to_add_out.bias
    transformer_blocks.8.attn.to_add_out.weight
    transformer_blocks.8.attn.to_k.bias
    transformer_blocks.8.attn.to_k.weight
    transformer_blocks.8.attn.to_out.0.bias
    transformer_blocks.8.attn.to_out.0.weight
    transformer_blocks.8.attn.to_q.bias
    transformer_blocks.8.attn.to_q.weight
    transformer_blocks.8.attn.to_v.bias
    transformer_blocks.8.attn.to_v.weight
    transformer_blocks.8.ff.net.0.proj.bias
    transformer_blocks.8.ff.net.0.proj.weight
    transformer_blocks.8.ff.net.2.bias
    transformer_blocks.8.ff.net.2.weight
    transformer_blocks.8.ff_context.net.0.proj.bias
    transformer_blocks.8.ff_context.net.0.proj.weight
    transformer_blocks.8.ff_context.net.2.bias
    transformer_blocks.8.ff_context.net.2.weight
    transformer_blocks.8.norm1.linear.bias
    transformer_blocks.8.norm1.linear.weight
    transformer_blocks.8.norm1_context.linear.bias
    transformer_blocks.8.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_9:
    transformer_blocks.9.attn.add_k_proj.bias
    transformer_blocks.9.attn.add_k_proj.weight
    transformer_blocks.9.attn.add_q_proj.bias
    transformer_blocks.9.attn.add_q_proj.weight
    transformer_blocks.9.attn.add_v_proj.bias
    transformer_blocks.9.attn.add_v_proj.weight
    transformer_blocks.9.attn.norm_added_k.weight
    transformer_blocks.9.attn.norm_added_q.weight
    transformer_blocks.9.attn.norm_k.weight
    transformer_blocks.9.attn.norm_q.weight
    transformer_blocks.9.attn.to_add_out.bias
    transformer_blocks.9.attn.to_add_out.weight
    transformer_blocks.9.attn.to_k.bias
    transformer_blocks.9.attn.to_k.weight
    transformer_blocks.9.attn.to_out.0.bias
    transformer_blocks.9.attn.to_out.0.weight
    transformer_blocks.9.attn.to_q.bias
    transformer_blocks.9.attn.to_q.weight
    transformer_blocks.9.attn.to_v.bias
    transformer_blocks.9.attn.to_v.weight
    transformer_blocks.9.ff.net.0.proj.bias
    transformer_blocks.9.ff.net.0.proj.weight
    transformer_blocks.9.ff.net.2.bias
    transformer_blocks.9.ff.net.2.weight
    transformer_blocks.9.ff_context.net.0.proj.bias
    transformer_blocks.9.ff_context.net.0.proj.weight
    transformer_blocks.9.ff_context.net.2.bias
    transformer_blocks.9.ff_context.net.2.weight
    transformer_blocks.9.norm1.linear.bias
    transformer_blocks.9.norm1.linear.weight
    transformer_blocks.9.norm1_context.linear.bias
    transformer_blocks.9.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_10:
    transformer_blocks.10.attn.add_k_proj.bias
    transformer_blocks.10.attn.add_k_proj.weight
    transformer_blocks.10.attn.add_q_proj.bias
    transformer_blocks.10.attn.add_q_proj.weight
    transformer_blocks.10.attn.add_v_proj.bias
    transformer_blocks.10.attn.add_v_proj.weight
    transformer_blocks.10.attn.norm_added_k.weight
    transformer_blocks.10.attn.norm_added_q.weight
    transformer_blocks.10.attn.norm_k.weight
    transformer_blocks.10.attn.norm_q.weight
    transformer_blocks.10.attn.to_add_out.bias
    transformer_blocks.10.attn.to_add_out.weight
    transformer_blocks.10.attn.to_k.bias
    transformer_blocks.10.attn.to_k.weight
    transformer_blocks.10.attn.to_out.0.bias
    transformer_blocks.10.attn.to_out.0.weight
    transformer_blocks.10.attn.to_q.bias
    transformer_blocks.10.attn.to_q.weight
    transformer_blocks.10.attn.to_v.bias
    transformer_blocks.10.attn.to_v.weight
    transformer_blocks.10.ff.net.0.proj.bias
    transformer_blocks.10.ff.net.0.proj.weight
    transformer_blocks.10.ff.net.2.bias
    transformer_blocks.10.ff.net.2.weight
    transformer_blocks.10.ff_context.net.0.proj.bias
    transformer_blocks.10.ff_context.net.0.proj.weight
    transformer_blocks.10.ff_context.net.2.bias
    transformer_blocks.10.ff_context.net.2.weight
    transformer_blocks.10.norm1.linear.bias
    transformer_blocks.10.norm1.linear.weight
    transformer_blocks.10.norm1_context.linear.bias
    transformer_blocks.10.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_11:
    transformer_blocks.11.attn.add_k_proj.bias
    transformer_blocks.11.attn.add_k_proj.weight
    transformer_blocks.11.attn.add_q_proj.bias
    transformer_blocks.11.attn.add_q_proj.weight
    transformer_blocks.11.attn.add_v_proj.bias
    transformer_blocks.11.attn.add_v_proj.weight
    transformer_blocks.11.attn.norm_added_k.weight
    transformer_blocks.11.attn.norm_added_q.weight
    transformer_blocks.11.attn.norm_k.weight
    transformer_blocks.11.attn.norm_q.weight
    transformer_blocks.11.attn.to_add_out.bias
    transformer_blocks.11.attn.to_add_out.weight
    transformer_blocks.11.attn.to_k.bias
    transformer_blocks.11.attn.to_k.weight
    transformer_blocks.11.attn.to_out.0.bias
    transformer_blocks.11.attn.to_out.0.weight
    transformer_blocks.11.attn.to_q.bias
    transformer_blocks.11.attn.to_q.weight
    transformer_blocks.11.attn.to_v.bias
    transformer_blocks.11.attn.to_v.weight
    transformer_blocks.11.ff.net.0.proj.bias
    transformer_blocks.11.ff.net.0.proj.weight
    transformer_blocks.11.ff.net.2.bias
    transformer_blocks.11.ff.net.2.weight
    transformer_blocks.11.ff_context.net.0.proj.bias
    transformer_blocks.11.ff_context.net.0.proj.weight
    transformer_blocks.11.ff_context.net.2.bias
    transformer_blocks.11.ff_context.net.2.weight
    transformer_blocks.11.norm1.linear.bias
    transformer_blocks.11.norm1.linear.weight
    transformer_blocks.11.norm1_context.linear.bias
    transformer_blocks.11.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_12:
    transformer_blocks.12.attn.add_k_proj.bias
    transformer_blocks.12.attn.add_k_proj.weight
    transformer_blocks.12.attn.add_q_proj.bias
    transformer_blocks.12.attn.add_q_proj.weight
    transformer_blocks.12.attn.add_v_proj.bias
    transformer_blocks.12.attn.add_v_proj.weight
    transformer_blocks.12.attn.norm_added_k.weight
    transformer_blocks.12.attn.norm_added_q.weight
    transformer_blocks.12.attn.norm_k.weight
    transformer_blocks.12.attn.norm_q.weight
    transformer_blocks.12.attn.to_add_out.bias
    transformer_blocks.12.attn.to_add_out.weight
    transformer_blocks.12.attn.to_k.bias
    transformer_blocks.12.attn.to_k.weight
    transformer_blocks.12.attn.to_out.0.bias
    transformer_blocks.12.attn.to_out.0.weight
    transformer_blocks.12.attn.to_q.bias
    transformer_blocks.12.attn.to_q.weight
    transformer_blocks.12.attn.to_v.bias
    transformer_blocks.12.attn.to_v.weight
    transformer_blocks.12.ff.net.0.proj.bias
    transformer_blocks.12.ff.net.0.proj.weight
    transformer_blocks.12.ff.net.2.bias
    transformer_blocks.12.ff.net.2.weight
    transformer_blocks.12.ff_context.net.0.proj.bias
    transformer_blocks.12.ff_context.net.0.proj.weight
    transformer_blocks.12.ff_context.net.2.bias
    transformer_blocks.12.ff_context.net.2.weight
    transformer_blocks.12.norm1.linear.bias
    transformer_blocks.12.norm1.linear.weight
    transformer_blocks.12.norm1_context.linear.bias
    transformer_blocks.12.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_13:
    transformer_blocks.13.attn.add_k_proj.bias
    transformer_blocks.13.attn.add_k_proj.weight
    transformer_blocks.13.attn.add_q_proj.bias
    transformer_blocks.13.attn.add_q_proj.weight
    transformer_blocks.13.attn.add_v_proj.bias
    transformer_blocks.13.attn.add_v_proj.weight
    transformer_blocks.13.attn.norm_added_k.weight
    transformer_blocks.13.attn.norm_added_q.weight
    transformer_blocks.13.attn.norm_k.weight
    transformer_blocks.13.attn.norm_q.weight
    transformer_blocks.13.attn.to_add_out.bias
    transformer_blocks.13.attn.to_add_out.weight
    transformer_blocks.13.attn.to_k.bias
    transformer_blocks.13.attn.to_k.weight
    transformer_blocks.13.attn.to_out.0.bias
    transformer_blocks.13.attn.to_out.0.weight
    transformer_blocks.13.attn.to_q.bias
    transformer_blocks.13.attn.to_q.weight
    transformer_blocks.13.attn.to_v.bias
    transformer_blocks.13.attn.to_v.weight
    transformer_blocks.13.ff.net.0.proj.bias
    transformer_blocks.13.ff.net.0.proj.weight
    transformer_blocks.13.ff.net.2.bias
    transformer_blocks.13.ff.net.2.weight
    transformer_blocks.13.ff_context.net.0.proj.bias
    transformer_blocks.13.ff_context.net.0.proj.weight
    transformer_blocks.13.ff_context.net.2.bias
    transformer_blocks.13.ff_context.net.2.weight
    transformer_blocks.13.norm1.linear.bias
    transformer_blocks.13.norm1.linear.weight
    transformer_blocks.13.norm1_context.linear.bias
    transformer_blocks.13.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_14:
    transformer_blocks.14.attn.add_k_proj.bias
    transformer_blocks.14.attn.add_k_proj.weight
    transformer_blocks.14.attn.add_q_proj.bias
    transformer_blocks.14.attn.add_q_proj.weight
    transformer_blocks.14.attn.add_v_proj.bias
    transformer_blocks.14.attn.add_v_proj.weight
    transformer_blocks.14.attn.norm_added_k.weight
    transformer_blocks.14.attn.norm_added_q.weight
    transformer_blocks.14.attn.norm_k.weight
    transformer_blocks.14.attn.norm_q.weight
    transformer_blocks.14.attn.to_add_out.bias
    transformer_blocks.14.attn.to_add_out.weight
    transformer_blocks.14.attn.to_k.bias
    transformer_blocks.14.attn.to_k.weight
    transformer_blocks.14.attn.to_out.0.bias
    transformer_blocks.14.attn.to_out.0.weight
    transformer_blocks.14.attn.to_q.bias
    transformer_blocks.14.attn.to_q.weight
    transformer_blocks.14.attn.to_v.bias
    transformer_blocks.14.attn.to_v.weight
    transformer_blocks.14.ff.net.0.proj.bias
    transformer_blocks.14.ff.net.0.proj.weight
    transformer_blocks.14.ff.net.2.bias
    transformer_blocks.14.ff.net.2.weight
    transformer_blocks.14.ff_context.net.0.proj.bias
    transformer_blocks.14.ff_context.net.0.proj.weight
    transformer_blocks.14.ff_context.net.2.bias
    transformer_blocks.14.ff_context.net.2.weight
    transformer_blocks.14.norm1.linear.bias
    transformer_blocks.14.norm1.linear.weight
    transformer_blocks.14.norm1_context.linear.bias
    transformer_blocks.14.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_15:
    transformer_blocks.15.attn.add_k_proj.bias
    transformer_blocks.15.attn.add_k_proj.weight
    transformer_blocks.15.attn.add_q_proj.bias
    transformer_blocks.15.attn.add_q_proj.weight
    transformer_blocks.15.attn.add_v_proj.bias
    transformer_blocks.15.attn.add_v_proj.weight
    transformer_blocks.15.attn.norm_added_k.weight
    transformer_blocks.15.attn.norm_added_q.weight
    transformer_blocks.15.attn.norm_k.weight
    transformer_blocks.15.attn.norm_q.weight
    transformer_blocks.15.attn.to_add_out.bias
    transformer_blocks.15.attn.to_add_out.weight
    transformer_blocks.15.attn.to_k.bias
    transformer_blocks.15.attn.to_k.weight
    transformer_blocks.15.attn.to_out.0.bias
    transformer_blocks.15.attn.to_out.0.weight
    transformer_blocks.15.attn.to_q.bias
    transformer_blocks.15.attn.to_q.weight
    transformer_blocks.15.attn.to_v.bias
    transformer_blocks.15.attn.to_v.weight
    transformer_blocks.15.ff.net.0.proj.bias
    transformer_blocks.15.ff.net.0.proj.weight
    transformer_blocks.15.ff.net.2.bias
    transformer_blocks.15.ff.net.2.weight
    transformer_blocks.15.ff_context.net.0.proj.bias
    transformer_blocks.15.ff_context.net.0.proj.weight
    transformer_blocks.15.ff_context.net.2.bias
    transformer_blocks.15.ff_context.net.2.weight
    transformer_blocks.15.norm1.linear.bias
    transformer_blocks.15.norm1.linear.weight
    transformer_blocks.15.norm1_context.linear.bias
    transformer_blocks.15.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_16:
    transformer_blocks.16.attn.add_k_proj.bias
    transformer_blocks.16.attn.add_k_proj.weight
    transformer_blocks.16.attn.add_q_proj.bias
    transformer_blocks.16.attn.add_q_proj.weight
    transformer_blocks.16.attn.add_v_proj.bias
    transformer_blocks.16.attn.add_v_proj.weight
    transformer_blocks.16.attn.norm_added_k.weight
    transformer_blocks.16.attn.norm_added_q.weight
    transformer_blocks.16.attn.norm_k.weight
    transformer_blocks.16.attn.norm_q.weight
    transformer_blocks.16.attn.to_add_out.bias
    transformer_blocks.16.attn.to_add_out.weight
    transformer_blocks.16.attn.to_k.bias
    transformer_blocks.16.attn.to_k.weight
    transformer_blocks.16.attn.to_out.0.bias
    transformer_blocks.16.attn.to_out.0.weight
    transformer_blocks.16.attn.to_q.bias
    transformer_blocks.16.attn.to_q.weight
    transformer_blocks.16.attn.to_v.bias
    transformer_blocks.16.attn.to_v.weight
    transformer_blocks.16.ff.net.0.proj.bias
    transformer_blocks.16.ff.net.0.proj.weight
    transformer_blocks.16.ff.net.2.bias
    transformer_blocks.16.ff.net.2.weight
    transformer_blocks.16.ff_context.net.0.proj.bias
    transformer_blocks.16.ff_context.net.0.proj.weight
    transformer_blocks.16.ff_context.net.2.bias
    transformer_blocks.16.ff_context.net.2.weight
    transformer_blocks.16.norm1.linear.bias
    transformer_blocks.16.norm1.linear.weight
    transformer_blocks.16.norm1_context.linear.bias
    transformer_blocks.16.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_17:
    transformer_blocks.17.attn.add_k_proj.bias
    transformer_blocks.17.attn.add_k_proj.weight
    transformer_blocks.17.attn.add_q_proj.bias
    transformer_blocks.17.attn.add_q_proj.weight
    transformer_blocks.17.attn.add_v_proj.bias
    transformer_blocks.17.attn.add_v_proj.weight
    transformer_blocks.17.attn.norm_added_k.weight
    transformer_blocks.17.attn.norm_added_q.weight
    transformer_blocks.17.attn.norm_k.weight
    transformer_blocks.17.attn.norm_q.weight
    transformer_blocks.17.attn.to_add_out.bias
    transformer_blocks.17.attn.to_add_out.weight
    transformer_blocks.17.attn.to_k.bias
    transformer_blocks.17.attn.to_k.weight
    transformer_blocks.17.attn.to_out.0.bias
    transformer_blocks.17.attn.to_out.0.weight
    transformer_blocks.17.attn.to_q.bias
    transformer_blocks.17.attn.to_q.weight
    transformer_blocks.17.attn.to_v.bias
    transformer_blocks.17.attn.to_v.weight
    transformer_blocks.17.ff.net.0.proj.bias
    transformer_blocks.17.ff.net.0.proj.weight
    transformer_blocks.17.ff.net.2.bias
    transformer_blocks.17.ff.net.2.weight
    transformer_blocks.17.ff_context.net.0.proj.bias
    transformer_blocks.17.ff_context.net.0.proj.weight
    transformer_blocks.17.ff_context.net.2.bias
    transformer_blocks.17.ff_context.net.2.weight
    transformer_blocks.17.norm1.linear.bias
    transformer_blocks.17.norm1.linear.weight
    transformer_blocks.17.norm1_context.linear.bias
    transformer_blocks.17.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_18:
    transformer_blocks.18.attn.add_k_proj.bias
    transformer_blocks.18.attn.add_k_proj.weight
    transformer_blocks.18.attn.add_q_proj.bias
    transformer_blocks.18.attn.add_q_proj.weight
    transformer_blocks.18.attn.add_v_proj.bias
    transformer_blocks.18.attn.add_v_proj.weight
    transformer_blocks.18.attn.norm_added_k.weight
    transformer_blocks.18.attn.norm_added_q.weight
    transformer_blocks.18.attn.norm_k.weight
    transformer_blocks.18.attn.norm_q.weight
    transformer_blocks.18.attn.to_add_out.bias
    transformer_blocks.18.attn.to_add_out.weight
    transformer_blocks.18.attn.to_k.bias
    transformer_blocks.18.attn.to_k.weight
    transformer_blocks.18.attn.to_out.0.bias
    transformer_blocks.18.attn.to_out.0.weight
    transformer_blocks.18.attn.to_q.bias
    transformer_blocks.18.attn.to_q.weight
    transformer_blocks.18.attn.to_v.bias
    transformer_blocks.18.attn.to_v.weight
    transformer_blocks.18.ff.net.0.proj.bias
    transformer_blocks.18.ff.net.0.proj.weight
    transformer_blocks.18.ff.net.2.bias
    transformer_blocks.18.ff.net.2.weight
    transformer_blocks.18.ff_context.net.0.proj.bias
    transformer_blocks.18.ff_context.net.0.proj.weight
    transformer_blocks.18.ff_context.net.2.bias
    transformer_blocks.18.ff_context.net.2.weight
    transformer_blocks.18.norm1.linear.bias
    transformer_blocks.18.norm1.linear.weight
    transformer_blocks.18.norm1_context.linear.bias
    transformer_blocks.18.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_19:
    transformer_blocks.19.attn.add_k_proj.bias
    transformer_blocks.19.attn.add_k_proj.weight
    transformer_blocks.19.attn.add_q_proj.bias
    transformer_blocks.19.attn.add_q_proj.weight
    transformer_blocks.19.attn.add_v_proj.bias
    transformer_blocks.19.attn.add_v_proj.weight
    transformer_blocks.19.attn.norm_added_k.weight
    transformer_blocks.19.attn.norm_added_q.weight
    transformer_blocks.19.attn.norm_k.weight
    transformer_blocks.19.attn.norm_q.weight
    transformer_blocks.19.attn.to_add_out.bias
    transformer_blocks.19.attn.to_add_out.weight
    transformer_blocks.19.attn.to_k.bias
    transformer_blocks.19.attn.to_k.weight
    transformer_blocks.19.attn.to_out.0.bias
    transformer_blocks.19.attn.to_out.0.weight
    transformer_blocks.19.attn.to_q.bias
    transformer_blocks.19.attn.to_q.weight
    transformer_blocks.19.attn.to_v.bias
    transformer_blocks.19.attn.to_v.weight
    transformer_blocks.19.ff.net.0.proj.bias
    transformer_blocks.19.ff.net.0.proj.weight
    transformer_blocks.19.ff.net.2.bias
    transformer_blocks.19.ff.net.2.weight
    transformer_blocks.19.ff_context.net.0.proj.bias
    transformer_blocks.19.ff_context.net.0.proj.weight
    transformer_blocks.19.ff_context.net.2.bias
    transformer_blocks.19.ff_context.net.2.weight
    transformer_blocks.19.norm1.linear.bias
    transformer_blocks.19.norm1.linear.weight
    transformer_blocks.19.norm1_context.linear.bias
    transformer_blocks.19.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_20:
    transformer_blocks.20.attn.add_k_proj.bias
    transformer_blocks.20.attn.add_k_proj.weight
    transformer_blocks.20.attn.add_q_proj.bias
    transformer_blocks.20.attn.add_q_proj.weight
    transformer_blocks.20.attn.add_v_proj.bias
    transformer_blocks.20.attn.add_v_proj.weight
    transformer_blocks.20.attn.norm_added_k.weight
    transformer_blocks.20.attn.norm_added_q.weight
    transformer_blocks.20.attn.norm_k.weight
    transformer_blocks.20.attn.norm_q.weight
    transformer_blocks.20.attn.to_add_out.bias
    transformer_blocks.20.attn.to_add_out.weight
    transformer_blocks.20.attn.to_k.bias
    transformer_blocks.20.attn.to_k.weight
    transformer_blocks.20.attn.to_out.0.bias
    transformer_blocks.20.attn.to_out.0.weight
    transformer_blocks.20.attn.to_q.bias
    transformer_blocks.20.attn.to_q.weight
    transformer_blocks.20.attn.to_v.bias
    transformer_blocks.20.attn.to_v.weight
    transformer_blocks.20.ff.net.0.proj.bias
    transformer_blocks.20.ff.net.0.proj.weight
    transformer_blocks.20.ff.net.2.bias
    transformer_blocks.20.ff.net.2.weight
    transformer_blocks.20.ff_context.net.0.proj.bias
    transformer_blocks.20.ff_context.net.0.proj.weight
    transformer_blocks.20.ff_context.net.2.bias
    transformer_blocks.20.ff_context.net.2.weight
    transformer_blocks.20.norm1.linear.bias
    transformer_blocks.20.norm1.linear.weight
    transformer_blocks.20.norm1_context.linear.bias
    transformer_blocks.20.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_21:
    transformer_blocks.21.attn.add_k_proj.bias
    transformer_blocks.21.attn.add_k_proj.weight
    transformer_blocks.21.attn.add_q_proj.bias
    transformer_blocks.21.attn.add_q_proj.weight
    transformer_blocks.21.attn.add_v_proj.bias
    transformer_blocks.21.attn.add_v_proj.weight
    transformer_blocks.21.attn.norm_added_k.weight
    transformer_blocks.21.attn.norm_added_q.weight
    transformer_blocks.21.attn.norm_k.weight
    transformer_blocks.21.attn.norm_q.weight
    transformer_blocks.21.attn.to_add_out.bias
    transformer_blocks.21.attn.to_add_out.weight
    transformer_blocks.21.attn.to_k.bias
    transformer_blocks.21.attn.to_k.weight
    transformer_blocks.21.attn.to_out.0.bias
    transformer_blocks.21.attn.to_out.0.weight
    transformer_blocks.21.attn.to_q.bias
    transformer_blocks.21.attn.to_q.weight
    transformer_blocks.21.attn.to_v.bias
    transformer_blocks.21.attn.to_v.weight
    transformer_blocks.21.ff.net.0.proj.bias
    transformer_blocks.21.ff.net.0.proj.weight
    transformer_blocks.21.ff.net.2.bias
    transformer_blocks.21.ff.net.2.weight
    transformer_blocks.21.ff_context.net.0.proj.bias
    transformer_blocks.21.ff_context.net.0.proj.weight
    transformer_blocks.21.ff_context.net.2.bias
    transformer_blocks.21.ff_context.net.2.weight
    transformer_blocks.21.norm1.linear.bias
    transformer_blocks.21.norm1.linear.weight
    transformer_blocks.21.norm1_context.linear.bias
    transformer_blocks.21.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_22:
    transformer_blocks.22.attn.add_k_proj.bias
    transformer_blocks.22.attn.add_k_proj.weight
    transformer_blocks.22.attn.add_q_proj.bias
    transformer_blocks.22.attn.add_q_proj.weight
    transformer_blocks.22.attn.add_v_proj.bias
    transformer_blocks.22.attn.add_v_proj.weight
    transformer_blocks.22.attn.norm_added_k.weight
    transformer_blocks.22.attn.norm_added_q.weight
    transformer_blocks.22.attn.norm_k.weight
    transformer_blocks.22.attn.norm_q.weight
    transformer_blocks.22.attn.to_add_out.bias
    transformer_blocks.22.attn.to_add_out.weight
    transformer_blocks.22.attn.to_k.bias
    transformer_blocks.22.attn.to_k.weight
    transformer_blocks.22.attn.to_out.0.bias
    transformer_blocks.22.attn.to_out.0.weight
    transformer_blocks.22.attn.to_q.bias
    transformer_blocks.22.attn.to_q.weight
    transformer_blocks.22.attn.to_v.bias
    transformer_blocks.22.attn.to_v.weight
    transformer_blocks.22.ff.net.0.proj.bias
    transformer_blocks.22.ff.net.0.proj.weight
    transformer_blocks.22.ff.net.2.bias
    transformer_blocks.22.ff.net.2.weight
    transformer_blocks.22.ff_context.net.0.proj.bias
    transformer_blocks.22.ff_context.net.0.proj.weight
    transformer_blocks.22.ff_context.net.2.bias
    transformer_blocks.22.ff_context.net.2.weight
    transformer_blocks.22.norm1.linear.bias
    transformer_blocks.22.norm1.linear.weight
    transformer_blocks.22.norm1_context.linear.bias
    transformer_blocks.22.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_23:
    transformer_blocks.23.attn.add_k_proj.bias
    transformer_blocks.23.attn.add_k_proj.weight
    transformer_blocks.23.attn.add_q_proj.bias
    transformer_blocks.23.attn.add_q_proj.weight
    transformer_blocks.23.attn.add_v_proj.bias
    transformer_blocks.23.attn.add_v_proj.weight
    transformer_blocks.23.attn.norm_added_k.weight
    transformer_blocks.23.attn.norm_added_q.weight
    transformer_blocks.23.attn.norm_k.weight
    transformer_blocks.23.attn.norm_q.weight
    transformer_blocks.23.attn.to_add_out.bias
    transformer_blocks.23.attn.to_add_out.weight
    transformer_blocks.23.attn.to_k.bias
    transformer_blocks.23.attn.to_k.weight
    transformer_blocks.23.attn.to_out.0.bias
    transformer_blocks.23.attn.to_out.0.weight
    transformer_blocks.23.attn.to_q.bias
    transformer_blocks.23.attn.to_q.weight
    transformer_blocks.23.attn.to_v.bias
    transformer_blocks.23.attn.to_v.weight
    transformer_blocks.23.ff.net.0.proj.bias
    transformer_blocks.23.ff.net.0.proj.weight
    transformer_blocks.23.ff.net.2.bias
    transformer_blocks.23.ff.net.2.weight
    transformer_blocks.23.ff_context.net.0.proj.bias
    transformer_blocks.23.ff_context.net.0.proj.weight
    transformer_blocks.23.ff_context.net.2.bias
    transformer_blocks.23.ff_context.net.2.weight
    transformer_blocks.23.norm1.linear.bias
    transformer_blocks.23.norm1.linear.weight
    transformer_blocks.23.norm1_context.linear.bias
    transformer_blocks.23.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_24:
    transformer_blocks.24.attn.add_k_proj.bias
    transformer_blocks.24.attn.add_k_proj.weight
    transformer_blocks.24.attn.add_q_proj.bias
    transformer_blocks.24.attn.add_q_proj.weight
    transformer_blocks.24.attn.add_v_proj.bias
    transformer_blocks.24.attn.add_v_proj.weight
    transformer_blocks.24.attn.norm_added_k.weight
    transformer_blocks.24.attn.norm_added_q.weight
    transformer_blocks.24.attn.norm_k.weight
    transformer_blocks.24.attn.norm_q.weight
    transformer_blocks.24.attn.to_add_out.bias
    transformer_blocks.24.attn.to_add_out.weight
    transformer_blocks.24.attn.to_k.bias
    transformer_blocks.24.attn.to_k.weight
    transformer_blocks.24.attn.to_out.0.bias
    transformer_blocks.24.attn.to_out.0.weight
    transformer_blocks.24.attn.to_q.bias
    transformer_blocks.24.attn.to_q.weight
    transformer_blocks.24.attn.to_v.bias
    transformer_blocks.24.attn.to_v.weight
    transformer_blocks.24.ff.net.0.proj.bias
    transformer_blocks.24.ff.net.0.proj.weight
    transformer_blocks.24.ff.net.2.bias
    transformer_blocks.24.ff.net.2.weight
    transformer_blocks.24.ff_context.net.0.proj.bias
    transformer_blocks.24.ff_context.net.0.proj.weight
    transformer_blocks.24.ff_context.net.2.bias
    transformer_blocks.24.ff_context.net.2.weight
    transformer_blocks.24.norm1.linear.bias
    transformer_blocks.24.norm1.linear.weight
    transformer_blocks.24.norm1_context.linear.bias
    transformer_blocks.24.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_25:
    transformer_blocks.25.attn.add_k_proj.bias
    transformer_blocks.25.attn.add_k_proj.weight
    transformer_blocks.25.attn.add_q_proj.bias
    transformer_blocks.25.attn.add_q_proj.weight
    transformer_blocks.25.attn.add_v_proj.bias
    transformer_blocks.25.attn.add_v_proj.weight
    transformer_blocks.25.attn.norm_added_k.weight
    transformer_blocks.25.attn.norm_added_q.weight
    transformer_blocks.25.attn.norm_k.weight
    transformer_blocks.25.attn.norm_q.weight
    transformer_blocks.25.attn.to_add_out.bias
    transformer_blocks.25.attn.to_add_out.weight
    transformer_blocks.25.attn.to_k.bias
    transformer_blocks.25.attn.to_k.weight
    transformer_blocks.25.attn.to_out.0.bias
    transformer_blocks.25.attn.to_out.0.weight
    transformer_blocks.25.attn.to_q.bias
    transformer_blocks.25.attn.to_q.weight
    transformer_blocks.25.attn.to_v.bias
    transformer_blocks.25.attn.to_v.weight
    transformer_blocks.25.ff.net.0.proj.bias
    transformer_blocks.25.ff.net.0.proj.weight
    transformer_blocks.25.ff.net.2.bias
    transformer_blocks.25.ff.net.2.weight
    transformer_blocks.25.ff_context.net.0.proj.bias
    transformer_blocks.25.ff_context.net.0.proj.weight
    transformer_blocks.25.ff_context.net.2.bias
    transformer_blocks.25.ff_context.net.2.weight
    transformer_blocks.25.norm1.linear.bias
    transformer_blocks.25.norm1.linear.weight
    transformer_blocks.25.norm1_context.linear.bias
    transformer_blocks.25.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_26:
    transformer_blocks.26.attn.add_k_proj.bias
    transformer_blocks.26.attn.add_k_proj.weight
    transformer_blocks.26.attn.add_q_proj.bias
    transformer_blocks.26.attn.add_q_proj.weight
    transformer_blocks.26.attn.add_v_proj.bias
    transformer_blocks.26.attn.add_v_proj.weight
    transformer_blocks.26.attn.norm_added_k.weight
    transformer_blocks.26.attn.norm_added_q.weight
    transformer_blocks.26.attn.norm_k.weight
    transformer_blocks.26.attn.norm_q.weight
    transformer_blocks.26.attn.to_add_out.bias
    transformer_blocks.26.attn.to_add_out.weight
    transformer_blocks.26.attn.to_k.bias
    transformer_blocks.26.attn.to_k.weight
    transformer_blocks.26.attn.to_out.0.bias
    transformer_blocks.26.attn.to_out.0.weight
    transformer_blocks.26.attn.to_q.bias
    transformer_blocks.26.attn.to_q.weight
    transformer_blocks.26.attn.to_v.bias
    transformer_blocks.26.attn.to_v.weight
    transformer_blocks.26.ff.net.0.proj.bias
    transformer_blocks.26.ff.net.0.proj.weight
    transformer_blocks.26.ff.net.2.bias
    transformer_blocks.26.ff.net.2.weight
    transformer_blocks.26.ff_context.net.0.proj.bias
    transformer_blocks.26.ff_context.net.0.proj.weight
    transformer_blocks.26.ff_context.net.2.bias
    transformer_blocks.26.ff_context.net.2.weight
    transformer_blocks.26.norm1.linear.bias
    transformer_blocks.26.norm1.linear.weight
    transformer_blocks.26.norm1_context.linear.bias
    transformer_blocks.26.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_27:
    transformer_blocks.27.attn.add_k_proj.bias
    transformer_blocks.27.attn.add_k_proj.weight
    transformer_blocks.27.attn.add_q_proj.bias
    transformer_blocks.27.attn.add_q_proj.weight
    transformer_blocks.27.attn.add_v_proj.bias
    transformer_blocks.27.attn.add_v_proj.weight
    transformer_blocks.27.attn.norm_added_k.weight
    transformer_blocks.27.attn.norm_added_q.weight
    transformer_blocks.27.attn.norm_k.weight
    transformer_blocks.27.attn.norm_q.weight
    transformer_blocks.27.attn.to_add_out.bias
    transformer_blocks.27.attn.to_add_out.weight
    transformer_blocks.27.attn.to_k.bias
    transformer_blocks.27.attn.to_k.weight
    transformer_blocks.27.attn.to_out.0.bias
    transformer_blocks.27.attn.to_out.0.weight
    transformer_blocks.27.attn.to_q.bias
    transformer_blocks.27.attn.to_q.weight
    transformer_blocks.27.attn.to_v.bias
    transformer_blocks.27.attn.to_v.weight
    transformer_blocks.27.ff.net.0.proj.bias
    transformer_blocks.27.ff.net.0.proj.weight
    transformer_blocks.27.ff.net.2.bias
    transformer_blocks.27.ff.net.2.weight
    transformer_blocks.27.ff_context.net.0.proj.bias
    transformer_blocks.27.ff_context.net.0.proj.weight
    transformer_blocks.27.ff_context.net.2.bias
    transformer_blocks.27.ff_context.net.2.weight
    transformer_blocks.27.norm1.linear.bias
    transformer_blocks.27.norm1.linear.weight
    transformer_blocks.27.norm1_context.linear.bias
    transformer_blocks.27.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_28:
    transformer_blocks.28.attn.add_k_proj.bias
    transformer_blocks.28.attn.add_k_proj.weight
    transformer_blocks.28.attn.add_q_proj.bias
    transformer_blocks.28.attn.add_q_proj.weight
    transformer_blocks.28.attn.add_v_proj.bias
    transformer_blocks.28.attn.add_v_proj.weight
    transformer_blocks.28.attn.norm_added_k.weight
    transformer_blocks.28.attn.norm_added_q.weight
    transformer_blocks.28.attn.norm_k.weight
    transformer_blocks.28.attn.norm_q.weight
    transformer_blocks.28.attn.to_add_out.bias
    transformer_blocks.28.attn.to_add_out.weight
    transformer_blocks.28.attn.to_k.bias
    transformer_blocks.28.attn.to_k.weight
    transformer_blocks.28.attn.to_out.0.bias
    transformer_blocks.28.attn.to_out.0.weight
    transformer_blocks.28.attn.to_q.bias
    transformer_blocks.28.attn.to_q.weight
    transformer_blocks.28.attn.to_v.bias
    transformer_blocks.28.attn.to_v.weight
    transformer_blocks.28.ff.net.0.proj.bias
    transformer_blocks.28.ff.net.0.proj.weight
    transformer_blocks.28.ff.net.2.bias
    transformer_blocks.28.ff.net.2.weight
    transformer_blocks.28.ff_context.net.0.proj.bias
    transformer_blocks.28.ff_context.net.0.proj.weight
    transformer_blocks.28.ff_context.net.2.bias
    transformer_blocks.28.ff_context.net.2.weight
    transformer_blocks.28.norm1.linear.bias
    transformer_blocks.28.norm1.linear.weight
    transformer_blocks.28.norm1_context.linear.bias
    transformer_blocks.28.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_29:
    transformer_blocks.29.attn.add_k_proj.bias
    transformer_blocks.29.attn.add_k_proj.weight
    transformer_blocks.29.attn.add_q_proj.bias
    transformer_blocks.29.attn.add_q_proj.weight
    transformer_blocks.29.attn.add_v_proj.bias
    transformer_blocks.29.attn.add_v_proj.weight
    transformer_blocks.29.attn.norm_added_k.weight
    transformer_blocks.29.attn.norm_added_q.weight
    transformer_blocks.29.attn.norm_k.weight
    transformer_blocks.29.attn.norm_q.weight
    transformer_blocks.29.attn.to_add_out.bias
    transformer_blocks.29.attn.to_add_out.weight
    transformer_blocks.29.attn.to_k.bias
    transformer_blocks.29.attn.to_k.weight
    transformer_blocks.29.attn.to_out.0.bias
    transformer_blocks.29.attn.to_out.0.weight
    transformer_blocks.29.attn.to_q.bias
    transformer_blocks.29.attn.to_q.weight
    transformer_blocks.29.attn.to_v.bias
    transformer_blocks.29.attn.to_v.weight
    transformer_blocks.29.ff.net.0.proj.bias
    transformer_blocks.29.ff.net.0.proj.weight
    transformer_blocks.29.ff.net.2.bias
    transformer_blocks.29.ff.net.2.weight
    transformer_blocks.29.ff_context.net.0.proj.bias
    transformer_blocks.29.ff_context.net.0.proj.weight
    transformer_blocks.29.ff_context.net.2.bias
    transformer_blocks.29.ff_context.net.2.weight
    transformer_blocks.29.norm1.linear.bias
    transformer_blocks.29.norm1.linear.weight
    transformer_blocks.29.norm1_context.linear.bias
    transformer_blocks.29.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_30:
    transformer_blocks.30.attn.add_k_proj.bias
    transformer_blocks.30.attn.add_k_proj.weight
    transformer_blocks.30.attn.add_q_proj.bias
    transformer_blocks.30.attn.add_q_proj.weight
    transformer_blocks.30.attn.add_v_proj.bias
    transformer_blocks.30.attn.add_v_proj.weight
    transformer_blocks.30.attn.norm_added_k.weight
    transformer_blocks.30.attn.norm_added_q.weight
    transformer_blocks.30.attn.norm_k.weight
    transformer_blocks.30.attn.norm_q.weight
    transformer_blocks.30.attn.to_add_out.bias
    transformer_blocks.30.attn.to_add_out.weight
    transformer_blocks.30.attn.to_k.bias
    transformer_blocks.30.attn.to_k.weight
    transformer_blocks.30.attn.to_out.0.bias
    transformer_blocks.30.attn.to_out.0.weight
    transformer_blocks.30.attn.to_q.bias
    transformer_blocks.30.attn.to_q.weight
    transformer_blocks.30.attn.to_v.bias
    transformer_blocks.30.attn.to_v.weight
    transformer_blocks.30.ff.net.0.proj.bias
    transformer_blocks.30.ff.net.0.proj.weight
    transformer_blocks.30.ff.net.2.bias
    transformer_blocks.30.ff.net.2.weight
    transformer_blocks.30.ff_context.net.0.proj.bias
    transformer_blocks.30.ff_context.net.0.proj.weight
    transformer_blocks.30.ff_context.net.2.bias
    transformer_blocks.30.ff_context.net.2.weight
    transformer_blocks.30.norm1.linear.bias
    transformer_blocks.30.norm1.linear.weight
    transformer_blocks.30.norm1_context.linear.bias
    transformer_blocks.30.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_31:
    transformer_blocks.31.attn.add_k_proj.bias
    transformer_blocks.31.attn.add_k_proj.weight
    transformer_blocks.31.attn.add_q_proj.bias
    transformer_blocks.31.attn.add_q_proj.weight
    transformer_blocks.31.attn.add_v_proj.bias
    transformer_blocks.31.attn.add_v_proj.weight
    transformer_blocks.31.attn.norm_added_k.weight
    transformer_blocks.31.attn.norm_added_q.weight
    transformer_blocks.31.attn.norm_k.weight
    transformer_blocks.31.attn.norm_q.weight
    transformer_blocks.31.attn.to_add_out.bias
    transformer_blocks.31.attn.to_add_out.weight
    transformer_blocks.31.attn.to_k.bias
    transformer_blocks.31.attn.to_k.weight
    transformer_blocks.31.attn.to_out.0.bias
    transformer_blocks.31.attn.to_out.0.weight
    transformer_blocks.31.attn.to_q.bias
    transformer_blocks.31.attn.to_q.weight
    transformer_blocks.31.attn.to_v.bias
    transformer_blocks.31.attn.to_v.weight
    transformer_blocks.31.ff.net.0.proj.bias
    transformer_blocks.31.ff.net.0.proj.weight
    transformer_blocks.31.ff.net.2.bias
    transformer_blocks.31.ff.net.2.weight
    transformer_blocks.31.ff_context.net.0.proj.bias
    transformer_blocks.31.ff_context.net.0.proj.weight
    transformer_blocks.31.ff_context.net.2.bias
    transformer_blocks.31.ff_context.net.2.weight
    transformer_blocks.31.norm1.linear.bias
    transformer_blocks.31.norm1.linear.weight
    transformer_blocks.31.norm1_context.linear.bias
    transformer_blocks.31.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_32:
    transformer_blocks.32.attn.add_k_proj.bias
    transformer_blocks.32.attn.add_k_proj.weight
    transformer_blocks.32.attn.add_q_proj.bias
    transformer_blocks.32.attn.add_q_proj.weight
    transformer_blocks.32.attn.add_v_proj.bias
    transformer_blocks.32.attn.add_v_proj.weight
    transformer_blocks.32.attn.norm_added_k.weight
    transformer_blocks.32.attn.norm_added_q.weight
    transformer_blocks.32.attn.norm_k.weight
    transformer_blocks.32.attn.norm_q.weight
    transformer_blocks.32.attn.to_add_out.bias
    transformer_blocks.32.attn.to_add_out.weight
    transformer_blocks.32.attn.to_k.bias
    transformer_blocks.32.attn.to_k.weight
    transformer_blocks.32.attn.to_out.0.bias
    transformer_blocks.32.attn.to_out.0.weight
    transformer_blocks.32.attn.to_q.bias
    transformer_blocks.32.attn.to_q.weight
    transformer_blocks.32.attn.to_v.bias
    transformer_blocks.32.attn.to_v.weight
    transformer_blocks.32.ff.net.0.proj.bias
    transformer_blocks.32.ff.net.0.proj.weight
    transformer_blocks.32.ff.net.2.bias
    transformer_blocks.32.ff.net.2.weight
    transformer_blocks.32.ff_context.net.0.proj.bias
    transformer_blocks.32.ff_context.net.0.proj.weight
    transformer_blocks.32.ff_context.net.2.bias
    transformer_blocks.32.ff_context.net.2.weight
    transformer_blocks.32.norm1.linear.bias
    transformer_blocks.32.norm1.linear.weight
    transformer_blocks.32.norm1_context.linear.bias
    transformer_blocks.32.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_33:
    transformer_blocks.33.attn.add_k_proj.bias
    transformer_blocks.33.attn.add_k_proj.weight
    transformer_blocks.33.attn.add_q_proj.bias
    transformer_blocks.33.attn.add_q_proj.weight
    transformer_blocks.33.attn.add_v_proj.bias
    transformer_blocks.33.attn.add_v_proj.weight
    transformer_blocks.33.attn.norm_added_k.weight
    transformer_blocks.33.attn.norm_added_q.weight
    transformer_blocks.33.attn.norm_k.weight
    transformer_blocks.33.attn.norm_q.weight
    transformer_blocks.33.attn.to_add_out.bias
    transformer_blocks.33.attn.to_add_out.weight
    transformer_blocks.33.attn.to_k.bias
    transformer_blocks.33.attn.to_k.weight
    transformer_blocks.33.attn.to_out.0.bias
    transformer_blocks.33.attn.to_out.0.weight
    transformer_blocks.33.attn.to_q.bias
    transformer_blocks.33.attn.to_q.weight
    transformer_blocks.33.attn.to_v.bias
    transformer_blocks.33.attn.to_v.weight
    transformer_blocks.33.ff.net.0.proj.bias
    transformer_blocks.33.ff.net.0.proj.weight
    transformer_blocks.33.ff.net.2.bias
    transformer_blocks.33.ff.net.2.weight
    transformer_blocks.33.ff_context.net.0.proj.bias
    transformer_blocks.33.ff_context.net.0.proj.weight
    transformer_blocks.33.ff_context.net.2.bias
    transformer_blocks.33.ff_context.net.2.weight
    transformer_blocks.33.norm1.linear.bias
    transformer_blocks.33.norm1.linear.weight
    transformer_blocks.33.norm1_context.linear.bias
    transformer_blocks.33.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_34:
    transformer_blocks.34.attn.add_k_proj.bias
    transformer_blocks.34.attn.add_k_proj.weight
    transformer_blocks.34.attn.add_q_proj.bias
    transformer_blocks.34.attn.add_q_proj.weight
    transformer_blocks.34.attn.add_v_proj.bias
    transformer_blocks.34.attn.add_v_proj.weight
    transformer_blocks.34.attn.norm_added_k.weight
    transformer_blocks.34.attn.norm_added_q.weight
    transformer_blocks.34.attn.norm_k.weight
    transformer_blocks.34.attn.norm_q.weight
    transformer_blocks.34.attn.to_add_out.bias
    transformer_blocks.34.attn.to_add_out.weight
    transformer_blocks.34.attn.to_k.bias
    transformer_blocks.34.attn.to_k.weight
    transformer_blocks.34.attn.to_out.0.bias
    transformer_blocks.34.attn.to_out.0.weight
    transformer_blocks.34.attn.to_q.bias
    transformer_blocks.34.attn.to_q.weight
    transformer_blocks.34.attn.to_v.bias
    transformer_blocks.34.attn.to_v.weight
    transformer_blocks.34.ff.net.0.proj.bias
    transformer_blocks.34.ff.net.0.proj.weight
    transformer_blocks.34.ff.net.2.bias
    transformer_blocks.34.ff.net.2.weight
    transformer_blocks.34.ff_context.net.0.proj.bias
    transformer_blocks.34.ff_context.net.0.proj.weight
    transformer_blocks.34.ff_context.net.2.bias
    transformer_blocks.34.ff_context.net.2.weight
    transformer_blocks.34.norm1.linear.bias
    transformer_blocks.34.norm1.linear.weight
    transformer_blocks.34.norm1_context.linear.bias
    transformer_blocks.34.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_35:
    transformer_blocks.35.attn.add_k_proj.bias
    transformer_blocks.35.attn.add_k_proj.weight
    transformer_blocks.35.attn.add_q_proj.bias
    transformer_blocks.35.attn.add_q_proj.weight
    transformer_blocks.35.attn.add_v_proj.bias
    transformer_blocks.35.attn.add_v_proj.weight
    transformer_blocks.35.attn.norm_added_k.weight
    transformer_blocks.35.attn.norm_added_q.weight
    transformer_blocks.35.attn.norm_k.weight
    transformer_blocks.35.attn.norm_q.weight
    transformer_blocks.35.attn.to_add_out.bias
    transformer_blocks.35.attn.to_add_out.weight
    transformer_blocks.35.attn.to_k.bias
    transformer_blocks.35.attn.to_k.weight
    transformer_blocks.35.attn.to_out.0.bias
    transformer_blocks.35.attn.to_out.0.weight
    transformer_blocks.35.attn.to_q.bias
    transformer_blocks.35.attn.to_q.weight
    transformer_blocks.35.attn.to_v.bias
    transformer_blocks.35.attn.to_v.weight
    transformer_blocks.35.ff.net.0.proj.bias
    transformer_blocks.35.ff.net.0.proj.weight
    transformer_blocks.35.ff.net.2.bias
    transformer_blocks.35.ff.net.2.weight
    transformer_blocks.35.ff_context.net.0.proj.bias
    transformer_blocks.35.ff_context.net.0.proj.weight
    transformer_blocks.35.ff_context.net.2.bias
    transformer_blocks.35.ff_context.net.2.weight
    transformer_blocks.35.norm1.linear.bias
    transformer_blocks.35.norm1.linear.weight
    transformer_blocks.35.norm1_context.linear.bias
    transformer_blocks.35.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_36:
    transformer_blocks.36.attn.add_k_proj.bias
    transformer_blocks.36.attn.add_k_proj.weight
    transformer_blocks.36.attn.add_q_proj.bias
    transformer_blocks.36.attn.add_q_proj.weight
    transformer_blocks.36.attn.add_v_proj.bias
    transformer_blocks.36.attn.add_v_proj.weight
    transformer_blocks.36.attn.norm_added_k.weight
    transformer_blocks.36.attn.norm_added_q.weight
    transformer_blocks.36.attn.norm_k.weight
    transformer_blocks.36.attn.norm_q.weight
    transformer_blocks.36.attn.to_add_out.bias
    transformer_blocks.36.attn.to_add_out.weight
    transformer_blocks.36.attn.to_k.bias
    transformer_blocks.36.attn.to_k.weight
    transformer_blocks.36.attn.to_out.0.bias
    transformer_blocks.36.attn.to_out.0.weight
    transformer_blocks.36.attn.to_q.bias
    transformer_blocks.36.attn.to_q.weight
    transformer_blocks.36.attn.to_v.bias
    transformer_blocks.36.attn.to_v.weight
    transformer_blocks.36.ff.net.0.proj.bias
    transformer_blocks.36.ff.net.0.proj.weight
    transformer_blocks.36.ff.net.2.bias
    transformer_blocks.36.ff.net.2.weight
    transformer_blocks.36.ff_context.net.0.proj.bias
    transformer_blocks.36.ff_context.net.0.proj.weight
    transformer_blocks.36.ff_context.net.2.bias
    transformer_blocks.36.ff_context.net.2.weight
    transformer_blocks.36.norm1.linear.bias
    transformer_blocks.36.norm1.linear.weight
    transformer_blocks.36.norm1_context.linear.bias
    transformer_blocks.36.norm1_context.linear.weight
    
    TRANSFORMER_BLOCK_37:
    transformer_blocks.37.attn.add_k_proj.bias
    transformer_blocks.37.attn.add_k_proj.weight
    transformer_blocks.37.attn.add_q_proj.bias
    transformer_blocks.37.attn.add_q_proj.weight
    transformer_blocks.37.attn.add_v_proj.bias
    transformer_blocks.37.attn.add_v_proj.weight
    transformer_blocks.37.attn.norm_added_k.weight
    transformer_blocks.37.attn.norm_added_q.weight
    transformer_blocks.37.attn.norm_k.weight
    transformer_blocks.37.attn.norm_q.weight
    transformer_blocks.37.attn.to_k.bias
    transformer_blocks.37.attn.to_k.weight
    transformer_blocks.37.attn.to_out.0.bias
    transformer_blocks.37.attn.to_out.0.weight
    transformer_blocks.37.attn.to_q.bias
    transformer_blocks.37.attn.to_q.weight
    transformer_blocks.37.attn.to_v.bias
    transformer_blocks.37.attn.to_v.weight
    transformer_blocks.37.ff.net.0.proj.bias
    transformer_blocks.37.ff.net.0.proj.weight
    transformer_blocks.37.ff.net.2.bias
    transformer_blocks.37.ff.net.2.weight
    transformer_blocks.37.norm1.linear.bias
    transformer_blocks.37.norm1.linear.weight
    transformer_blocks.37.norm1_context.linear.bias
    transformer_blocks.37.norm1_context.linear.weight
    
    OUTPUT_NORMALIZATION:
    norm_out.linear.bias
    norm_out.linear.weight
    
    OUTPUT_PROJECTION:
    proj_out.bias
    proj_out.weight
    ```


### Potential Improvements

**General idea**

A commonly believed heuristic that we verified once again during the construction of the SD3.5 family of models is that later/higher layers (i.e. `30 - 37`)* impact tertiary details more heavily. Conversely, earlier layers (i.e. `12 - 24` )* influence the overall composition/primary form more.

So, freezing other layers/targeting specific layers is a viable approach.

`*`These suggested layers are speculative and not 100% guaranteed. The tips here are more or less a general idea for next steps.

**Photorealism**

In preliminary testing, we observed that freezing the last few layers of the architecture significantly improved model training when using a photorealistic dataset, preventing detail degradation introduced by small dataset from happening.

**Anatomy preservation**

To dampen any possible degradation of anatomy, training only the attention layers and **not** the adaptive linear layers could help. For reference, below is one of the transformer blocks.

- Sample single transformer block

    ```json
    TRANSFORMER_BLOCK_0:
    transformer_blocks.0.attn.add_k_proj.bias
    transformer_blocks.0.attn.add_k_proj.weight
    transformer_blocks.0.attn.add_q_proj.bias
    transformer_blocks.0.attn.add_q_proj.weight
    transformer_blocks.0.attn.add_v_proj.bias
    transformer_blocks.0.attn.add_v_proj.weight
    transformer_blocks.0.attn.norm_added_k.weight
    transformer_blocks.0.attn.norm_added_q.weight
    transformer_blocks.0.attn.norm_k.weight
    transformer_blocks.0.attn.norm_q.weight
    transformer_blocks.0.attn.to_add_out.bias
    transformer_blocks.0.attn.to_add_out.weight
    transformer_blocks.0.attn.to_k.bias
    transformer_blocks.0.attn.to_k.weight
    transformer_blocks.0.attn.to_out.0.bias
    transformer_blocks.0.attn.to_out.0.weight
    transformer_blocks.0.attn.to_q.bias
    transformer_blocks.0.attn.to_q.weight
    transformer_blocks.0.attn.to_v.bias
    transformer_blocks.0.attn.to_v.weight
    transformer_blocks.0.ff.net.0.proj.bias
    transformer_blocks.0.ff.net.0.proj.weight
    transformer_blocks.0.ff.net.2.bias
    transformer_blocks.0.ff.net.2.weight
    transformer_blocks.0.ff_context.net.0.proj.bias
    transformer_blocks.0.ff_context.net.0.proj.weight
    transformer_blocks.0.ff_context.net.2.bias
    transformer_blocks.0.ff_context.net.2.weight
    transformer_blocks.0.norm1.linear.bias
    transformer_blocks.0.norm1.linear.weight
    transformer_blocks.0.norm1_context.linear.bias
    transformer_blocks.0.norm1_context.linear.weight 
    ```


Candidate layers of interest:

```json
transformer_blocks.0.attn.add_k_proj.bias
transformer_blocks.0.attn.add_k_proj.weight
transformer_blocks.0.attn.add_q_proj.bias
transformer_blocks.0.attn.add_q_proj.weight
transformer_blocks.0.attn.add_v_proj.bias
transformer_blocks.0.attn.add_v_proj.weight
transformer_blocks.0.attn.norm_added_k.weight
transformer_blocks.0.attn.norm_added_q.weight
transformer_blocks.0.attn.norm_k.weight
transformer_blocks.0.attn.norm_q.weight
transformer_blocks.0.attn.to_add_out.bias
transformer_blocks.0.attn.to_add_out.weight
transformer_blocks.0.attn.to_k.bias
transformer_blocks.0.attn.to_k.weight
transformer_blocks.0.attn.to_out.0.bias
transformer_blocks.0.attn.to_out.0.weight
transformer_blocks.0.attn.to_q.bias
transformer_blocks.0.attn.to_q.weight
transformer_blocks.0.attn.to_v.bias
transformer_blocks.0.attn.to_v.weight
```

**General case (`i.e.` small or low-quality dataset)**

A possible idea to work around issues caused by small or low quality datasets is to do training of context blocks only (the left “tower” of Figure 2(b)) . This means other layers could be potentially frozen.

Here are the figures from the SD3 paper, [Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206).

`Figure 2(a)`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/9a611922-8b76-4157-a7a0-a6ea7159d287/image.png)

`Figure 2(b)`

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/5c332a25-e1a8-43df-8eff-ec802a0fa1ef/image.png)

The context (text representation) is denoted with the variable `c`. The concatenation of the `CLIP`s and `T5` embeddings go from here into the `MMDiT` block.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/c61b5622-328e-497e-9da9-adb38723bcad/image.png)

![Screenshot 2024-10-22 at 15.19.36.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/4e8dae13-2612-4518-91a4-53485ccdba7c/35eadfb3-e79a-42bc-9cdb-a407ee3c5ab2/Screenshot_2024-10-22_at_15.19.36.png)

**Embedders**

Freezing embedders could also be a potential improvement.

Candidate layers of interest:

```json
time_text_embed.text_embedder.linear_1.bias
time_text_embed.text_embedder.linear_1.weight
time_text_embed.text_embedder.linear_2.bias
time_text_embed.text_embedder.linear_2.weight
time_text_embed.timestep_embedder.linear_1.bias
time_text_embed.timestep_embedder.linear_1.weight
time_text_embed.timestep_embedder.linear_2.bias
time_text_embed.timestep_embedder.linear_2.weight
```

Theses are all potential ideas/food for thought, but it’s highly likely that different types of targeted training will yield improved results.

# 참조
-----

* [Stable Diffusion 3.5 Large Fine-tuning Tutorial](https://stabilityai.notion.site/Stable-Diffusion-3-5-Large-Fine-tuning-Tutorial-11a61cdcd1968027a15bdbd7c40be8c6)
