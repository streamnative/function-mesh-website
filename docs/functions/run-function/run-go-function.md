---
title: Run Go Functions
category: functions
id: run-go-function
---

Pulsar Functions is a succinct computing abstraction that Apache Pulsar enables users to express simple ETL and streaming tasks. Currently, Function Mesh supports using Java, Python, or Go programming language to define a YAML file of the Functions.

This document describes how to run Go Functions. To run a Go Functions in Function Mesh, you need to package the Functions and then submit it to a Pulsar cluster.

## Package Go Functions

After developing and testing your Pulsar Functions, you need to package it so that it can be submitted to a Pulsar cluster. You can package Pulsar Functions to external packages or Docker images.

### Go Function packages

This section describes how to package a Go Functions and upload it to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

#### Build Go Functions packages

This section describes how to build packages for Go Functions.

##### Prerequisites

- Apache Pulsar 2.8.0 or higher
- Function Mesh v0.1.3 or higher

##### Steps

To package Go Functions in Go, follow these steps.

1. Write a Go Functions.

    Currently, Go Functions can be **only** implemented using SDK and the interface of the Functions is exposed in the form of SDK. Before using the Go Functions, you need to import `github.com/apache/pulsar/pulsar-function-go/pf`. 

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

    When writing a Go Functions, remember that
    - In `main()`, you **only** need to register the Functions name to `Start()`. **Only** one Functions name is received in `Start()`. 
    - Go Functions use Go reflection, which is based on the received Functions name, to verify whether the parameter list and returned value list are correct. The parameter list and returned value list **must be** one of the following sample Functions:
    
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

    You can use the context to connect to the Go Functions.

    ```go
    if fc, ok := pf.FromContext(ctx); ok {
        fmt.Printf("function ID is:%s, ", fc.GetFuncID())
        fmt.Printf("function version is:%s\n", fc.GetFuncVersion())
    }
    ```

2. Build the Go Functions.

    ```bash
    go build <your Go Function filename>.go 
    ```

#### Upload Go Function packages

Use the `pulsar-admin` CLI tool to upload the package to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

> **Note**
> 
> Before uploading the package to Pulsar package management service, you need to enable the package management service in the `broker.config` file.

This example shows how to upload the package of the `my-function@0.1` Functions to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

```bash
bin/pulsar-admin packages upload function://my-tenant/my-ns/my-function@0.1 --path "/path/to/package-file" --description PACKAGE_DESCRIPTION
```

Then, you can define Function CRDs by specifying the uploaded Go Functions package.

### Docker images

This section describes how to package a Pulsar Function to a Docker image.

#### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher

#### Build Docker images

To build a Docker image, follow these steps.

1. Package your Go Functions. For details, see [package Pulsar functions](#package-pulsar-functions).

2. Define a `Dockerfile`.

    This example shows how to define a `Dockerfile` with a JAR package (`example-function.jar`) of the Go function.

    ```dockerfile
    # Use pulsar-functions-go-runner since we pack Go function
    FROM streamnative/pulsar-functions-go-runner:2.7.1
    # Copy function JAR package into /pulsar directory  
    COPY example-function.jar /pulsar/
    ```

Then, you can push the Functions Docker image into an image registry (such as the [Docker Hub](https://hub.docker.com/), or any private registry) and use the Functions Docker image to configure and submit the Go functions to a Pulsar cluster.

### Buildpacks

This tutorial will help you go through the FunctionMesh Buildpacks by building a Golang function image.

#### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher
- [Pack](https://buildpacks.io/docs/tools/pack/#install), CLI tools for manipulating Cloud Native Buildpacks

#### Directory structure

```
.
|-- builders
|   `-- golang-builder
|       `-- builder.toml
|-- buildpacks
|   `-- golang
|       |-- bin
|       |   |-- build
|       |   `-- detect
|       `-- buildpack.toml
`-- stack
    |-- stack.build.Dockerfile
    `-- stack.go-runner.run.Dockerfile
```

#### Stack

The Stack is the basic building and running environment for an application (in this case, a Golang function).

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
> Here we use the `streamnative/pulsar-functions-go-runner:2.9.2.23` as the base image. You can also switch the version of the base image according to your needs.

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

Use the following command to create it.

```shell
docker build -t fm-stack-go-runner-run:v1 -f ./stack.go-runner.run.Dockerfile .
```

#### Buildpacks

In this case, we only need one Buildpack, which is used to determine if Golang files (with the ".go" suffix) the required items (e.g. "go.mod") exist, and if so, to do nothing (since we have set the workspace to `/pulsar` , we don't need to move the files).

We can use the following command to create the buildpack.

Note that we set the Buildpack ID: `functionmesh/golang`

```shell
pack buildpack new functionmesh/golang \
    --api 0.7 \
    --path golang \
    --version 0.0.1 \
    --stacks io.functionmesh.stack
```

After the above command has successfully executed, we can find a directory named "golang" is created.

```
`-- golang
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
  id = "functionmesh/golang"
  version = "0.0.1"

[[stacks]]
  id = "io.functionmesh.stack"
```

***bin/detect***

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

***bin/build***

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

#### Builder

A Builder is an image that contains all the components necessary to execute a build.

***builder.toml***

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

Use the following command to create it.

```shell
pack builder create fm-golang-builder:v1 \
    --config ./builder.toml \
    --pull-policy if-not-present
```

#### Usage

First, let's see what we have prepared.

- A Stack build image - fm-stack-build:v1
- A Stack run image - fm-stack-go-runner-run:v1
- A Builder image - fm-golang-builder:v1

Now let's write a Java function file.

***Package directory structure***

```
.
|-- go.mod
`-- exclamation_function.go
```

***exclamation_function.go***

```java
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

Build the function image in the current directory using the following command.

```shell
pack build golang-exclamation-function:v1 \
    --builder fm-golang-builder:v1 \
    --workspace /pulsar \
    --pull-policy if-not-present \
    --env FUNCTION_TARGET="exclamation_function.go"
```

The output is as follows.

```shell
$ pack build golang-exclamation-function:v1 \
    --builder fm-golang-builder:v1 \
    --workspace /pulsar \
    --pull-policy if-not-present \
    --env FUNCTION_TARGET="exclamation_function.go"
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

Use the image `python-exclamation-function:v1` to create Function.

***exlcamation_function.yaml***

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  name: golang-exclamation-function
  namespace: default
spec:
  image: golang-exclamation-function:v1
  forwardSourceMessageProperty: true
  maxPendingAsyncRequests: 1000
  replicas: 1
  maxReplicas: 5
  logTopic: persistent://public/default/logging-function-logs
  input:
    topics:
    - persistent://public/default/input-golang-topic
  output:
    topic: persistent://public/default/output-golang-topic
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
  golang:
    go: /pulsar/go_function
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

## Submit Go Functions

After packaging your Pulsar Go Functions, you can submit your Go Functions to a Pulsar cluster. This section describes how to submit a Go Functions through a Function CRD. You can use the `image` field to specify the runner image use for creating the Go Functions. You can also specify the location where the package or the Docker image is stored.

1. Define a Go Functions by using a YAML file and save the YAML file.

   - This example shows how to publish a `go-function-sample` Functions to a Pulsar cluster by using a JAR package called `function://my-tenant/my-ns/my-function@0.1`.

        ```yaml
        apiVersion: compute.functionmesh.io/v1alpha1
        kind: Function
        metadata:
          name: go-function-sample
          namespace: default
        spec:
          image: streamnative/pulsar-functions-go-runner:2.7.1 # using go function runner
          className: exclamation_function.ExclamationFunction
          forwardSourceMessageProperty: true
          maxPendingAsyncRequests: 1000
          replicas: 1
          maxReplicas: 5
          logTopic: persistent://public/default/logging-function-logs
          input:
            topics:
            - persistent://public/default/go-function-input-topic
            typeClassName: java.lang.String
          output:
            topic: persistent://public/default/go-function-output-topic
            typeClassName: java.lang.String
          pulsar:
            pulsarConfig: "test-pulsar"
          golang:
            go: go_func_all
            goLocation: ""
            # use package name:
            # goLocation: function://public/default/nul-test-go-function@v1
            # to be delete & use admission hook
        ```

   - This example shows how to publish a `go-function-sample` Functions to a Pulsar cluster by using a Docker image.

      ```yaml
      apiVersion: compute.functionmesh.io/v1alpha1
      kind: Function
      metadata:
        name: go-function-sample
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
          - persistent://public/default/go-function-input-topic
          typeClassName: java.lang.String
        output:
          topic: persistent://public/default/go-function-output-topic
          typeClassName: java.lang.String
        pulsar:
          pulsarConfig: "test-pulsar"
        golang:
          go: go_func_all
          goLocation: ""
          # use package name:
          # goLocation: function://public/default/nul-test-go-function@v1
          # to be delete & use admission hook
      ```

2. Apply the YAML file to create the Go Functions.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

3. Check whether the Go Functions is created successfully.

    ```bash
    kubectl get all
    ```
