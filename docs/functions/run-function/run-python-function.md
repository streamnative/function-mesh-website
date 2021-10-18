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
