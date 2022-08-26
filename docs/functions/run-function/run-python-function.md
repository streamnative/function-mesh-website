---
title: Run Python Functions
category: functions
id: run-python-function
---

Pulsar Functions is a succinct computing abstraction that Apache Pulsar enables users to express simple ETL and streaming tasks. Currently, Function Mesh supports using Java, Python, or Go programming language to define a YAML file of the Functions.

This document describes how to run Python Functions. To run a Python Functions in Function Mesh, you need to package the Functions and then submit it to a Pulsar cluster.

## Package Python Functions

After developing and testing your Pulsar Functions , you need to package it so that it can be submitted to a Pulsar cluster. You can package Python Functions to external packages (one Python file or ZIP file) or Docker images.

### Python Functions packages

This section describes how to package a Python Functions and upload it to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

#### Build Python Functions packages

This section describes how to build packages for Python Functions.

##### Prerequisites

- Apache Pulsar 2.8.0 or higher
- Function Mesh v0.1.3 or higher

Python Function supports One Python file or ZIP file.

- One Python file
- ZIP file

- **One Python file**

   This example shows how to package a Python Functions with the **one Python file**.

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

    In this example, when you write a Python Functions, you need to inherit the Function class and implement the `process()` method.

    The `process()` method mainly has two parameters:

    - `input` represents your input.
    - `context` represents an interface exposed by the Pulsar Function. You can get the attributes in the Python Functions based on the provided context object.

- **ZIP file**

    To package a Python Functions with the **ZIP file** in Python, you need to prepare a ZIP file. The following is required when packaging the ZIP file of the Python Function.

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

#### Upload Python Function packages

Use the `pulsar-admin` CLI tool to upload the package to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

> **Note**
> 
> Before uploading the package to Pulsar package management service, you need to enable the package management service in the `broker.config` file.

This example shows how to upload the package of the `my-function@0.1` Functions to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

```bash
bin/pulsar-admin packages upload function://my-tenant/my-ns/my-function@0.1 --path "/path/to/package-file" --description PACKAGE_DESCRIPTION
```

Then, you can define Function CRDs by specifying the uploaded Python Functions package.

### Docker images

This section describes how to package a Python Functions to a Docker image.

#### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher

#### Build Docker images

To build a Docker image, follow these steps.

1. Package your Python Functions. For details, see [package Pulsar functions](#package-pulsar-functions).

2. Define a `Dockerfile`.

    This example shows how to define a `Dockerfile` with a JAR package (`example-function.jar`) of the Python Functions.

    ```dockerfile
    # Use pulsar-functions-python-runner since we pack python function
    FROM streamnative/pulsar-functions-python-runner:2.7.1
    # Copy function JAR package into /pulsar directory  
    COPY example-function.jar /pulsar/
    ```

Then, you can push the Functions Docker image into an image registry (such as the [Docker Hub](https://hub.docker.com/), or any private registry) and use the Functions Docker image to configure and submit the Functions to a Pulsar cluster.

### Buildpacks

This tutorial will help you go through the FunctionMesh Buildpacks by building a Python function image.

#### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher
- [Pack](https://buildpacks.io/docs/tools/pack/#install), CLI tools for manipulating Cloud Native Buildpacks

#### Directory structure

```
.
|-- builders
|   `-- python-builder
|       `-- builder.toml
|-- buildpacks
|   `-- python-py
|       |-- bin
|       |   |-- build
|       |   `-- detect
|       `-- buildpack.toml
`-- stack
    |-- stack.build.Dockerfile
    `-- stack.python-runner.run.Dockerfile
```

#### Stack

The Stack is the basic building and running environment for an application (in this case, a Python function).

According to the usage case, we divide the Stack into Build image and Run image.

##### Build Image

The Build image provides the OS environment for the application during the building phase.

Note that we set the stack ID: `io.functionmesh.stack`

***stack.build.Dockerfile***

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

Use the following command to create it.

```shell
docker build -t fm-stack-build:v1 -f ./stack.build.Dockerfile .
```

##### Run Image

The Run image provides the OS environment for the application during the running phase.

***stack.run.Dockerfile***

> **Note**
>
> Here we use the `streamnative/pulsar-functions-python-runner:2.9.2.23` as the base image. You can also switch the version of the base image according to your needs.

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

Use the following command to create it.

```shell
docker build -t fm-stack-python-runner-run:v1 -f ./stack.python-runner.run.Dockerfile .
```

#### Buildpacks

In this case, we only need one Buildpack, which is used to determine if Python files (with the ".py" suffix) exist in the target path, and if so, to do nothing (since we have set the workspace to `/pulsar` , we don't need to move the files).

We can use the following command to create the buildpack.

Note that we set the Buildpack ID: `functionmesh/python-py`

```shell
pack buildpack new functionmesh/python-py \
    --api 0.7 \
    --path python-py \
    --version 0.0.1 \
    --stacks io.functionmesh.stack
```

After the above command has successfully executed, we can find a directory named "python-py" is created.

```
`-- python-py
    |-- bin
    |   |-- build
    |   `-- detect
    `-- buildpack.toml
```

***buildpack.toml***

The `buildpack.toml` is the configuration file for the buildpack, which contains the `buildpack id`, `stack id`, and other information.

```toml
api = "0.7"

[buildpack]
  id = "functionmesh/java-maven"
  version = "0.0.1"

[[stacks]]
  id = "io.functionmesh.stack"
```

***bin/detect***

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

***bin/build***

```bash
#!/usr/bin/env bash

set -euo pipefail

layers_dir="$1"
env_dir="$2/env"
plan_path="$3"

echo "Do nothing is the build logic of this Buildpack!"

exit 0
```

#### Builder

A Builder is an image that contains all the components necessary to execute a build.

***builder.toml***

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

Use the following command to create it.

```shell
pack builder create fm-python-py-builder:v1 \
    --config ./builder.toml \
    --pull-policy if-not-present
```

#### Usage

First, let's see what we have prepared.

- A Stack build image - fm-stack-build:v1
- A Stack run image - fm-stack-python-runner-run:v1
- A Builder image - fm-python-py-builder:v1

Now let's write a Java function file.

***Package directory structure***

```
.
|-- pom.xml
`-- src/
    `-- main/
        `-- java/
            `-- org.example/
                `-- ExclamationFunction.java
```

***exclamation_example.py***

```python
from pulsar import Function

class ExclamationFunction(Function):
    def __init__(self):
        pass

    def process(self, input, context):
        return input + '!'
```

Build the function image in the current directory using the following command.

```shell
pack build python-exclamation-function:v1 \
    --builder fm-python-py-builder:v1 \
    --workspace /pulsar \
    --pull-policy if-not-present
```

The output is as follows.

```shell
$ pack build python-exclamation-function:v1 \
    --builder fm-python-py-builder:v1 \
    --workspace /pulsar \
    --pull-policy if-not-present
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
[exporter]       python-exclamation-function:v1
Successfully built image python-exclamation-function:v1
```

Use the image `python-exclamation-function:v1` to create Function.

***exlcamation_function.yaml***

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  name: python-exclamation-function
  namespace: default
spec:
  image: python-exclamation-function:v1
  className: exclamation_example.ExclamationFunction
  forwardSourceMessageProperty: true
  maxPendingAsyncRequests: 1000
  replicas: 1
  maxReplicas: 5
  logTopic: persistent://public/default/logging-function-logs
  input:
    topics:
    - persistent://public/default/input-python-topic
  output:
    topic: persistent://public/default/output-python-topic
  resources:
    requests:
      cpu: "0.1"
      memory: 1G
    limits:
      cpu: "0.2"
      memory: 1.1G
  secretsMap:
    "name":
        path: "test-secret"
        key: "username"
    "pwd":
        path: "test-secret"
        key: "password"
  pulsar:
    pulsarConfig: "test-pulsar"
  python:
    py: /pulsar/exclamation_example.py
  clusterName: test
  autoAck: true
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: test-pulsar
data:
  webServiceURL: http://sn-platform-pulsar-broker.default.svc.cluster.local:8080
  brokerServiceURL: pulsar://sn-platform-pulsar-broker.default.svc.cluster.local:6650
---
apiVersion: v1
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
kind: Secret
metadata:
  name: test-secret
type: Opaque
```

## Submit Python Functions

After packaging your Pulsar Functions, you can submit your Pulsar Functions to a Pulsar cluster. This section describes how to submit a Python Functions through a Functions CRD. You can use the `image` field to specify the runner image use for creating the Python Functions. You can also specify the location where the package or the Docker image is stored.

1. Define a Python Functions by using a YAML file and save the YAML file.

   - This example shows how to publish a `python-function-sample` Functions to a Pulsar cluster by using a JAR package called `function://my-tenant/my-ns/my-function@0.1`.

        ```yaml
        apiVersion: compute.functionmesh.io/v1alpha1
        kind: Function
        metadata:
          name: python-function-sample
          namespace: default
        spec:
          image: streamnative/pulsar-functions-python-runner:2.7.1 # using python function runner
          className: exclamation_function.ExclamationFunction
          forwardSourceMessageProperty: true
          maxPendingAsyncRequests: 1000
          replicas: 1
          maxReplicas: 5
          logTopic: persistent://public/default/logging-function-logs
          input:
            topics:
            - persistent://public/default/python-function-input-topic
            typeClassName: java.lang.String
          output:
            topic: persistent://public/default/python-function-output-topic
            typeClassName: java.lang.String
          pulsar:
            pulsarConfig: "test-pulsar"
          python:
              py: exclamation_function.py
              pyLocation: ""
              # use package name:
              # pyLocation: function://public/default/nul-py-test-function@v1
          # to be delete & use admission hook
        ```

   - This example shows how to publish a `python-function-sample` Functions to a Pulsar cluster by using a Docker image.

      ```yaml
      apiVersion: compute.functionmesh.io/v1alpha1
      kind: Function
      metadata:
        name: python-function-sample
        namespace: default
      spec:
        image: streamnative/example-function-image:latest # using function image here
        className: exclamation_function.ExclamationFunction
        forwardSourceMessageProperty: true
        maxPendingAsyncRequests: 1000
        replicas: 1
        maxReplicas: 5
        logTopic: persistent://public/default/logging-function-logs
        input:
          topics:
          - persistent://public/default/python-function-input-topic
          typeClassName: java.lang.String
        output:
          topic: persistent://public/default/python-function-output-topic
          typeClassName: java.lang.String
        pulsar:
          pulsarConfig: "test-pulsar"
        python:
            py: exclamation_function.py
            pyLocation: ""
            # use package name:
            # pyLocation: function://public/default/nul-py-test-function@v1
            # to be delete & use admission hook
      ```

2. Apply the YAML file to create the Python Functions.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

3. Check whether the Python Functions is created successfully.

    ```bash
    kubectl get all
    ```
