---
title: Package Python Functions
category: functions
id: package-function-python
---

After developing and testing your Pulsar function, you need to package it so that the function can be submitted to a Pulsar cluster. This document describes how to package a Python function to an external package (one Python file or ZIP file) or an image.

## Function packages

This section describes how to package a Python function and upload it to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

### Prerequisites

- Apache Pulsar 2.8.0 or higher
- Function Mesh v0.1.3 or higher

### Steps

You can package a Python function into the  One Python file or ZIP file.

- **One Python file**

    This example shows how to package a Python function with the **One Python file**.

    ```python
    from pulsar import Function //  import the Function module from Pulsar

    # The classic ExclamationFunction that appends an exclamation at the end
    # of the input
    class ExclamationFunction(Function):
      def __init__(self):
        pass

      def process(self, input, context):
        return input + '!'
    ```

    In this example, when you write a Python function, you need to inherit the Function class and implement the `process()` method.

    The `process()` method mainly has two parameters:

    - `input`: represents your input.
    - `context`: represents an interface exposed by the Pulsar function. You can get the attributes in the Python function based on the provided context object.

- **ZIP file**

    To package a Python function with the **ZIP file** in Python, you need to prepare a ZIP file. The following is required when packaging the ZIP file of the Python function.

    ```text
    Assuming the zip file is named as `func.zip`, unzip the `func.zip` folder:
      "func/src"
      "func/requirements.txt"
      "func/deps"
    ```

    Take [exclamation.zip](https://github.com/apache/pulsar/tree/master/tests/docker-images/latest-version-image/python-examples) as an example. The internal structure of the example is as follows.

    ```text
    .
    ├── deps
    │   └── sh-1.12.14-py2.py3-none-any.whl
    └── src
        └── exclamation.py
    ```

#### Upload a Python function package

Use the `pulsar-admin` CLI tool to upload the package to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

> **Note**
> 
> Before uploading the package to the Pulsar package management service, you need to enable the package management service in the `broker.config` file.

This example shows how to upload the package of the `my-function@0.1` function to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

```bash
bin/pulsar-admin packages upload function://my-tenant/my-ns/my-function@0.1 --path "/path/to/package-file" --description PACKAGE_DESCRIPTION
```

Then, you can define a function CRD by specifying the uploaded Python function package.

## Docker images

This section describes how to package a Python function to a Docker image.

### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher
- Install Docker. Download the [Community edition](https://www.docker.com/community-edition) and follow the instructions for your OS.
- Install [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl).

### Build a Docker image

To build a Docker image, follow these steps.

1. Package your Python function. For details, see [function packages](#function-packages).

2. Define a `Dockerfile`.

    This example shows how to define a `Dockerfile` with a JAR package (`example-function.jar`) of the Python function.

    ```dockerfile
    # Use pulsar-functions-python-runner since we pack python function
    FROM streamnative/pulsar-functions-python-runner:2.7.1
    # Copy function JAR package into /pulsar directory  
    COPY example-function.jar /pulsar/
    ```

Then, you can push the Docker image to an image registry (such as the [Docker Hub](https://hub.docker.com/), or any private registry) and use the Docker image to configure and submit the function to a Pulsar cluster.

## Self-built images

This section describes how to create a Python function image by using [Buildpacks](https://buildpacks.io/docs/concepts/components/buildpack/).

### User flow

To create a Python function image, you need to go through the following steps:

1. Create a Build image.
2. Create a Run image.
3. Create a buildpack.
4. Create a Builder.

### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher
- Install the [Pack](https://buildpacks.io/docs/tools/pack/#install) CLI tools.
- Install Docker. Download the [Community edition](https://www.docker.com/community-edition) and follow the instructions for your OS.
- Install [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl).

### Create a Build image

This example shows how to create a Build image.

1. Define a `Dockerfile`.

    This example defines a Dockerfile with the Stack ID (`io.functionmesh.stack`).

    ```dockerfile
    FROM ubuntu:20.04

    ARG pulsar_uid=10000
    ARG pulsar_gid=10001
    ARG stack_id="io.functionmesh.stack"

    RUN apt-get update && \
      apt-get install -y xz-utils ca-certificates git wget jq gcc && \
      rm -rf /var/lib/apt/lists/* && \
      wget -O /usr/local/bin/yj https://github.com/bruceadams/yj/releases/download/v1.2.2/yj.linux.x86_64 && \
      chmod +x /usr/local/bin/yj

    LABEL io.buildpacks.stack.id=${stack_id}

    RUN groupadd pulsar --gid ${pulsar_gid} && \
      useradd --uid ${pulsar_uid} --gid ${pulsar_gid} -m -s /bin/bash pulsar

    ENV CNB_USER_ID=${pulsar_uid}
    ENV CNB_GROUP_ID=${pulsar_gid}
    ENV CNB_STACK_ID=${stack_id}

    USER ${CNB_USER_ID}:${CNB_GROUP_ID}
    ```

2. Apply the command to create the Build image.

    ```shell
    docker build -t fm-stack-build:v1 -f ./stack.build.Dockerfile .
    ```

### Create a Run image

This example shows how to create a Run image.

1. Define a `Dockerfile`.

    This example uses the `streamnative/pulsar-functions-python-runner:2.9.2.23` runner image as the base image. You can specify a specific base image based on your requirements.

    ```dockerfile
    FROM streamnative/pulsar-functions-python-runner:2.9.2.23

    ARG pulsar_uid=10000
    ARG pulsar_gid=10001
    ARG stack_id="io.functionmesh.stack"
    LABEL io.buildpacks.stack.id=${stack_id}

    ENV CNB_USER_ID=${pulsar_uid}
    ENV CNB_GROUP_ID=${pulsar_gid}
    ENV CNB_STACK_ID=${stack_id}
    ```

2. Apply the command to create the Run image.

    ```shell
    docker build -t fm-stack-python-runner-run:v1 -f ./stack.python-runner.run.Dockerfile .
    ```

### Create a buildpack

This example shows how to create a buildpack with the buildpack ID `functionmesh/python-py`.

```shell
pack buildpack new functionmesh/python-py \
  --api 0.7 \
  --path python-py \
  --version 0.0.1 \
  --stacks io.functionmesh.stack
```

Then, a buildpack directory named `python-py` is created.

```
`-- python-py
    |-- bin
    |   |-- build
    |   `-- detect
    `-- buildpack.toml
```

Update the content for the three files with the following content.

- **buildpack.toml**

    ```toml
    api = "0.7"

    [buildpack]
      id = "functionmesh/java-maven"
      version = "0.0.1"

    [[stacks]]
      id = "io.functionmesh.stack"
    ```

- **bin/detect**

    ```bash
    #!/usr/bin/env bash

    set -eo pipefail

    # Skip this buildpack if there are no Python files in the current directory
    py_num=$(find . -maxdepth 1 -name "*.py" | wc -l)
    if [[ ${py_num} -eq 0 ]]; then
      exit 100
    fi

    exit 0
    ```

- **bin/build**

    ```bash
    #!/usr/bin/env bash

    set -euo pipefail

    layers_dir="$1"
    env_dir="$2/env"
    plan_path="$3"

    echo "Do nothing is the build logic of this Buildpack!"

    exit 0
    ```

### Create a Builder image

This section describes how to create a Builder image.

1. Define a Builder configuration file (`builder.toml`) with the following content.

    ```toml
    # Buildpacks to include in builder
    [[buildpacks]]
    uri = "../../buildpacks/python-py"

    # Order used for detection
    [[order]]
      # This buildpack will display build-time information (as a dependency)
      [[order.group]]
      id = "functionmesh/python-py"
      version = "0.0.1"

    # Stack that will be used by the builder
    [stack]
    id = "io.functionmesh.stack"
    # This image is used at runtime
    run-image = "fm-stack-python-runner-run:v1"
    # This image is used at build-time
    build-image = "fm-stack-build:v1"
    ```

2. Apply the command to create the Builder image. 

    ```shell
    pack builder create fm-python-py-builder:v1 \
      --config ./builder.toml \
      --pull-policy if-not-present
    ```

### Create a Python function image

After creating the Build image (`fm-stack-build:v1`), the Run image (`fm-stack-python-runner-run:v1`), and the Builder image (`fm-python-py-builder:v1`), you can build a Python function image and then use the Python function image to run a Python function.

The package directory structure is similar to:

```
.
|-- pom.xml
`-- src/
    `-- main/
        `-- java/
            `-- org.example/
                `-- ExclamationFunction.java
```

1. Prepare a Python function file.

    This example writes a Python function named `exclamation_example.py`.

    ```python
    from pulsar import Function

    class ExclamationFunction(Function):
      def __init__(self):
          pass

      def process(self, input, context):
          return input + '!'
    ```

2. Apply the command to build the Python function image in the current directory.

    ```shell
    pack build python-exclamation-function:v1 \
        --builder fm-python-py-builder:v1 \
        --workspace /pulsar \
        --pull-policy if-not-present
    ```

    The output is similar to:

    ```
    ===> ANALYZING
    [analyzer] Previous image with name "python-exclamation-function:v1" not found
    ===> DETECTING
    [detector] functionmesh/python-py 0.0.1
    ===> RESTORING
    ===> BUILDING
    [builder] Do nothing is the build logic of this Buildpack!
    ===> EXPORTING
    [exporter] Adding layer 'launch.sbom'
    [exporter] Adding 1/1 app layer(s)
    [exporter] Adding layer 'launcher'
    [exporter] Adding layer 'config'
    [exporter] Adding label 'io.buildpacks.lifecycle.metadata'
    [exporter] Adding label 'io.buildpacks.build.metadata'
    [exporter] Adding label 'io.buildpacks.project.metadata'
    [exporter] no default process type
    [exporter] Saving python-exclamation-function:v1...
    [exporter] *** Images (274630b94169):
    [exporter]       python-exclamation-function:v1
    Successfully built image python-exclamation-function:v1
    ```

## Next step

- [Run Python Functions](/functions/run-function/run-python-function.md)
