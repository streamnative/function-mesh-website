---
title: Package Go Functions
category: functions
id: package-function-go
---

After developing and testing your Pulsar function, you need to package it so that the function can be submitted to a Pulsar cluster. This document describes how to package a Go function to an external package or an image.

## Function packages

This section describes how to package a Go function and upload it to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

### Prerequisites

- Apache Pulsar 2.8.0 or higher
- Function Mesh v0.1.3 or higher

### Steps

To package a function in Go, follow these steps.

1. Write a Go function.

    Currently, Go functions can be implemented using SDK **only** and the interface of the function is exposed in the form of SDK. Before using a Go function, you need to import `github.com/apache/pulsar/pulsar-function-go/pf`. 

    ```go
    import (
      "context"
      "fmt"

      "github.com/apache/pulsar/pulsar-function-go/pf"
    )

    func HandleRequest(ctx context.Context, input []byte) error {
      fmt.Println(string(input) + "!")
      return nil
    }

    func main() {
      pf.Start(HandleRequest)
    }
    ```

    When writing a Go function, remember that
    - In `main()`, you **only** need to register the function name to `Start()`. **Only** one function name is received in `Start()`. 
    - The Go function uses Go reflection, which is based on the received function name, to verify whether the parameter list and returned value list are correct. The parameter list and returned value list **must be** one of the following sample functions:
    
      ```go
       func ()
       func () error
       func (input) error
       func () (output, error)
       func (input) (output, error)
       func (context.Context) error
       func (context.Context, input) error
       func (context.Context) (output, error)
       func (context.Context, input) (output, error)
      ```

    You can use the context to connect to the Go function.

    ```go
    if fc, ok := pf.FromContext(ctx); ok {
      fmt.Printf("function ID is:%s, ", fc.GetFuncID())
      fmt.Printf("function version is:%s\n", fc.GetFuncVersion())
    }
    ```

2. Build the Go function.

    ```bash
    go build <your Go Function filename>.go 
    ```

### Upload Go function packages

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

This section describes how to package a Go function to a Docker image.

### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher
- Install Docker. Download the [Community edition](https://www.docker.com/community-edition) and follow the instructions for your OS.
- Install [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl).

### Build a Docker image

To build a Docker image, follow these steps.

1. Package your Go function. For details, see [function packages](#function-packages).

2. Define a `Dockerfile`.

    This example shows how to define a `Dockerfile` with a JAR package (`example-function.jar`) of the Go function.

    ```dockerfile
    # Use pulsar-functions-go-runner since we pack Go function
    FROM streamnative/pulsar-functions-go-runner:2.7.1
    # Copy function JAR package into /pulsar directory  
    COPY example-function.jar /pulsar/
    ```

Then, you can push the Docker image to an image registry (such as [Docker Hub](https://hub.docker.com/), or any private registry) and use the Docker image to configure and submit the function to a Pulsar cluster.

## Self-built images

This section describes how to create a Go function image by using [Buildpacks](https://buildpacks.io/docs/concepts/components/buildpack/).

### User flow

To create a Go function image, you need to go through the following steps:

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

2. Run the following command to create the Build image.

    ```shell
    docker build -t fm-stack-build:v1 -f ./stack.build.Dockerfile .
    ```

### Create a Run image

This example shows how to create a Run image.

1. Define a `Dockerfile`.

    This example uses the `streamnative/pulsar-functions-go-runner:2.9.2.23` runner image as the base image. You can specify a specific base image based on your requirements.

    ```dockerfile
    FROM streamnative/pulsar-functions-go-runner:2.9.2.23

    ARG pulsar_uid=10000
    ARG pulsar_gid=10001
    ARG stack_id="io.functionmesh.stack"
    LABEL io.buildpacks.stack.id=${stack_id}

    ENV CNB_USER_ID=${pulsar_uid}
    ENV CNB_GROUP_ID=${pulsar_gid}
    ENV CNB_STACK_ID=${stack_id}
    ```

2. Run the following command to create the Run image.

    ```shell
    docker build -t fm-stack-go-runner-run:v1 -f ./stack.go-runner.run.Dockerfile .
    ```

### Create a buildpack

This example shows how to create a buildpack with the buildpack ID `functionmesh/golang`.

```shell
pack buildpack new functionmesh/golang \
  --api 0.7 \
  --path golang \
  --version 0.0.1 \
  --stacks io.functionmesh.stack
```

Then, a buildpack directory named `golang` is created.

```
`-- golang
  |-- bin
  |   |-- build
  |   `-- detect
  `-- buildpack.toml
```

Update the content of the three files with the following content.

- **buildpack.toml**

    ```toml
    api = "0.7"
    [buildpack]
      id = "functionmesh/golang"
      version = "0.0.1"
    [[stacks]]
      id = "io.functionmesh.stack"
    ```

- **bin/detect**

    ```bash
    #!/usr/bin/env bash
    set -eo pipefail
    go_num=$(find . -maxdepth 1 -name "*.go" | wc -l)
    if [[ ${go_num} -eq 0 ]]; then
      echo "no Go files found"
      exit 100
    fi
    go_mod_num=$(find . -maxdepth 1 -name "go.mod" | wc -l)
    if [[ ${go_mod_num} -eq 0 ]]; then
      echo "no go.mod found"
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
    # LOAD USER-PROVIDED BUILD-TIME ENVIRONMENT VARIABLES
    if compgen -G "${env_dir}/*" > /dev/null; then
      for var in ${env_dir}/*; do
        declare "$(basename ${var})=$(<${var})"
      done
    fi
    # FUNCTION_TARGET=<function name>
    if [[ -z ${FUNCTION_TARGET} ]]; then
      echo "need to set FUNCTION_TARGET"
      exit 100
    fi
    # Download Go runtime, default version is 1.18
    go_url="https://go.dev/dl/go1.18.5.linux-amd64.tar.gz"
    go_version="1.18.5"
    cached_go_url=""
    go_layer_dir=${layers_dir}/go
    if [[ -f ${go_layer_dir}.toml ]]; then
      cached_go_url=$(cat "${go_layer_dir}.toml" | yj -t | jq -r .metadata.url 2>/dev/null || echo 'GO TOML parsing failed')
    fi
    if [[ ${go_url} != ${cached_go_url} ]] ; then
      rm -rf "$layers_dir"/go
      mkdir -p "$layers_dir"/go/env
      wget -q -O - "$go_url" | tar pxz -C "${go_layer_dir}" --strip-components=1
      export PATH=$PATH:${go_layer_dir}/bin
      # here we use the function-runner image as the run image, so we set the `launch = false`
      cat > "${go_layer_dir}.toml" << EOF
    [types]
    launch = false
    build = true
    cache = true
    [metadata]
    version = "${go_version}"
    url = "${go_url}"
    EOF
      echo "${go_layer_dir}" > "$layers_dir"/go/env/GOROOT
    fi
    # Set env variables to make jdk accessible
    for var in "$layers_dir"/go/env/*; do
      declare "$(basename "$var")=$(<"$var")"
    done
    export PATH=${go_layer_dir}/bin:$PATH
    # build golang binary
    mkdir -p target
    go mod tidy
    go build -o target/go_function "${FUNCTION_TARGET}"
    # clear source
    target_dir="target"
    ls | grep -v ${target_dir} | xargs rm -rf
    mv ${target_dir}/go_function .
    rm -rf ${target_dir}
    exit 0
    ```

### Create a Builder image

This section describes how to create a Builder image.

1. Define a Builder configuration file (`builder.toml`) with the following content.

    ```toml
    # Buildpacks to include in builder
    [[buildpacks]]
    uri = "../../buildpacks/golang"
    # Order used for detection
    [[order]]
      # This buildpack will display build-time information (as a dependency)
      [[order.group]]
      id = "functionmesh/golang"
      version = "0.0.1"
    # Stack that will be used by the builder
    [stack]
    id = "io.functionmesh.stack"
    # This image is used at runtime
    run-image = "fm-stack-go-runner-run:v1"
    # This image is used at build-time
    build-image = "fm-stack-build:v1"
    ```

2. Run the following command to create the Builder image. 

    ```shell
    pack builder create fm-golang-builder:v1 \
      --config ./builder.toml \
      --pull-policy if-not-present
    ```

### Create a Go function image

After creating the Build image (`fm-stack-build:v1`), the Run image (`fm-stack-go-runner-run:v1`), and the Builder image (`fm-golang-builder:v1`), you can build a Go function image and then use the Go function image to run a Go function.

The package directory structure is similar to:

```
.
|-- go.mod
`-- exclamation_function.go
```

1. Prepare a Go function file.

    This example writes a Go function named `exclamation_function.go`.

    ```go
    package main
    import (
      "context"
      "fmt"
      "github.com/apache/pulsar/pulsar-function-go/pf"
    )
    func HandleRequest(ctx context.Context, input []byte) error {
      fmt.Println(string(input) + "!")
      return nil
    }
    func main() {
      pf.Start(HandleRequest)
    }
    ```

2. Run the following command to build the Go function image in the current directory.

    ```shell
    pack build golang-exclamation-function:v1 \
      --builder fm-golang-builder:v1 \
      --workspace /pulsar \
      --pull-policy if-not-present \
      --env FUNCTION_TARGET="exclamation_function.go"
    ```

    The output is similar to:

    ```shell
    ===> ANALYZING
    [analyzer] Restoring data for SBOM from previous image
    ===> DETECTING
    [detector] functionmesh/golang 0.0.1
    ===> RESTORING
    [restorer] Restoring metadata for "functionmesh/golang:go" from cache
    [restorer] Restoring data for "functionmesh/golang:go" from cache
    ===> BUILDING
    [builder] go: downloading github.com/apache/pulsar/pulsar-function-go v0.0.0-20220823033039-423ab7542521
    [builder] go: downloading github.com/apache/pulsar-client-go v0.8.1
    [builder] go: downloading github.com/golang/protobuf v1.5.2
    [builder] go: downloading github.com/prometheus/client_golang v1.11.1
    [builder] go: downloading github.com/prometheus/client_model v0.2.0
    ...
    ...
    ...
    [builder] go: downloading github.com/gsterjov/go-libsecret v0.0.0-20161001094733-a6f4afe4910c
    [builder] go: downloading github.com/keybase/go-keychain v0.0.0-20190712205309-48d3d31d256d
    [builder] go: downloading github.com/mitchellh/go-homedir v1.1.0
    [builder] go: downloading github.com/mtibben/percent v0.2.1
    [builder] go: downloading golang.org/x/crypto v0.0.0-20200622213623-75b288015ac9
    [builder] go: downloading google.golang.org/appengine v1.6.7
    [builder] go: downloading github.com/nxadm/tail v1.4.4
    [builder] go: downloading gopkg.in/tomb.v1 v1.0.0-20141024135613-dd632973f1e7
    [builder] go: downloading github.com/fsnotify/fsnotify v1.4.9
    [builder] go: downloading github.com/ardielle/ardielle-go v1.5.2
    [builder] go: downloading github.com/dimfeld/httptreemux v5.0.1+incompatible
    ===> EXPORTING
    [exporter] Reusing layer 'launch.sbom'
    [exporter] Reusing 1/1 app layer(s)
    [exporter] Reusing layer 'launcher'
    [exporter] Reusing layer 'config'
    [exporter] Adding label 'io.buildpacks.lifecycle.metadata'
    [exporter] Adding label 'io.buildpacks.build.metadata'
    [exporter] Adding label 'io.buildpacks.project.metadata'
    [exporter] no default process type
    [exporter] Saving golang-exclamation-function:v1...
    [exporter] *** Images (2d1c29ce58dd):
    [exporter]       golang-exclamation-function:v1
    [exporter] Reusing cache layer 'functionmesh/golang:go'
    Successfully built image golang-exclamation-function:v1
    ```

## Next step

- [Run Go Functions](/functions/run-function/run-go-function.md)