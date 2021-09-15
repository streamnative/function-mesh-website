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
          MaxPendingAsyncRequests: 1000
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
        MaxPendingAsyncRequests: 1000
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
