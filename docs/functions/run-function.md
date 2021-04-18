---
title: Run Pulsar Functions
category: functions
id: run-function
---

Pulsar Functions is a succinct computing abstraction that Apache Pulsar enables users to express simple ETL and streaming tasks. Currently, Function Mesh supports using Java, Python, or Go programming language to define a YAML file of the Functions.

This document describes how to run a Pulsar function.

## Package Pulsar Functions

After developing and testing your Pulsar function, you need to package it so that it can be submitted to a Function Mesh.

### Function packages

This section describes how to create packages for Java, Python, and Go functions.

#### Prerequisites

- Apache Pulsar 2.8.0 or higher
- Function Mesh v0.1.3 or higher

#### Java

To package a function in Java, follow these steps.

1. Create a new Maven project with a `pom.xml` file. In the following code sample, the value of `mainClass` is your package name.

    ```Java
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>

        <groupId>java-function</groupId>
        <artifactId>java-function</artifactId>
        <version>1.0-SNAPSHOT</version>

        <dependencies>
            <dependency>
                <groupId>org.apache.pulsar</groupId>
                <artifactId>pulsar-functions-api</artifactId>
                <version>2.6.0</version>
            </dependency>
        </dependencies>

        <build>
            <plugins>
                <plugin>
                    <artifactId>maven-assembly-plugin</artifactId>
                    <configuration>
                        <appendAssemblyId>false</appendAssemblyId>
                        <descriptorRefs>
                            <descriptorRef>jar-with-dependencies</descriptorRef>
                        </descriptorRefs>
                        <archive>
                        <manifest>
                            <mainClass>org.example.test.ExclamationFunction</mainClass>
                        </manifest>
                    </archive>
                    </configuration>
                    <executions>
                        <execution>
                            <id>make-assembly</id>
                            <phase>package</phase>
                            <goals>
                                <goal>assembly</goal>
                            </goals>
                        </execution>
                    </executions>
                </plugin>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <source>8</source>
                        <target>8</target>
                    </configuration>
                </plugin>
            </plugins>
        </build>

    </project>
    ```

2. Write a Java function.

    ```java
    package org.example.test;

    import java.util.function.Function;

    public class ExclamationFunction implements Function<String, String> {
        @Override
        public String apply(String s) {
            return "This is my function!";
        }
    }
    ```

3. Package the Java function.

    ```bash
    mvn package
    ```

    After the Java function is packaged, a `target` directory is created automatically. Open the `target` directory to check if there is a JAR package similar to `java-function-1.0-SNAPSHOT.jar`.

#### Python

Python Function supports the following three formats:

- One Python file
- ZIP file
- PIP

- **One Python file**

    To package a function with **one Python file** in Python, Write a Python function.

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

    - `input` represents your input.
  
    - `context` represents an interface exposed by the Pulsar Function. You can get the attributes in the Python function based on the provided context object.

- **ZIP file**

    To package a function with the **ZIP file** in Python, you need to prepare a ZIP file. The following is required when packaging the ZIP file of the Python Function.

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

- **PIP**

    The PIP method is only supported in Kubernetes runtime. To package a function with **PIP** in Python, follow these steps.

    1. Configure the `functions_worker.yml` file.

        ```text
        #### Kubernetes Runtime ####
        installUserCodeDependencies: true
        ```

    2. Write your Python Function.

        ```python
        from pulsar import Function
        import js2xml

        # The classic ExclamationFunction that appends an exclamation at the end
        # of the input
        class ExclamationFunction(Function):
        def __init__(self):
          pass

        def process(self, input, context):
          // add your logic
          return input + '!'
        ```

        You can introduce additional dependencies. When Python Function detects that the file currently used is the `whl` file and the `installUserCodeDependencies` parameter is specified, the system uses the `pip install` command to install the dependencies required in Python Function.

    3. Generate the `whl` file.

        ```shell script
        $ cd $PULSAR_HOME/pulsar-functions/scripts/python
        $ chmod +x generate.sh
        $ ./generate.sh <path of your Python Function> <path of the whl output dir> <the version of whl>
        # e.g: ./generate.sh /path/to/python /path/to/python/output 1.0.0
        ```

#### Go

To package a function in Go, follow these steps.

1. Write a Go function.

    Currently, Go function can be **only** implemented using SDK and the interface of the function is exposed in the form of SDK. Before using the Go function, you need to import `github.com/apache/pulsar/pulsar-function-go/pf`. 

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
    - Go function uses Go reflection, which is based on the received function name, to verify whether the parameter list and returned value list are correct. The parameter list and returned value list **must be** one of the following sample functions:
    
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

    ```
    go build <your Go Function filename>.go 
    ```

#### Upload packages

Use the `pulsar-admin` CLI tool to upload the package to the package management service.

This example shows how to upload the package of the `my-function@0.1` function to the package management service.

```bash
bin/pulsar-admin packages upload function://my-tenant/my-ns/my-function@0.1 --path "/path/to/package-file" --description PACKAGE_DESCRIPTION
```

Then, you can define Function Mesh CRDs by specifying the uploaded function package.

### Docker images

StreamNative provides ready-to-use Docker images for Pulsar built-in connectors and StreamNative-managed connectors. For non built-in connectors, you can build Docker images for them.

#### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher

#### Build Docker images

1. Package your Pulsar function. For details, see [package Pulsar functions](#package-pulsar-functions).

2. Define a `Dockerfile`.

    This example shows how to define a `Dockerfile` with a JAR package (`example-function.jar`) of the Java function.

    ```dockerfile
    # Use pulsar-functions-java-runner since we pack Java function
    FROM streamnative/pulsar-functions-java-runner:2.7.1
    # Copy function JAR package into /pulsar directory  
    COPY example-function.jar /pulsar/
    ```

Then, you can push the function Docker image into an image registry (such as the [Docker Hub](https://hub.docker.com/), or any private registry) and use the function Docker image to configure and submit the function to Function Mesh.

## Submit Pulsar Functions

Function Mesh supports using the Functions CRD to define Pulsar Functions.

1. Define a function by using a YAML file and save the YAML file.

   - This example shows how to publish a `java-function-sample` function to Function Mesh by using a JAR package called `function://my-tenant/my-ns/my-function@0.1`.

        ```yaml
        apiVersion: compute.functionmesh.io/v1alpha1
        kind: Function
        metadata:
          name: java-function-sample
          namespace: default
        spec:
          image: streamnative/pulsar-functions-java-runner:2.7.1 # using java function runner
          className: org.apache.pulsar.functions.api.examples.ExclamationFunction
          sourceType: java.lang.String
          sinkType: java.lang.String
          forwardSourceMessageProperty: true
          MaxPendingAsyncRequests: 1000
          replicas: 1
          maxReplicas: 5
          logTopic: persistent://public/default/logging-function-logs
          input:
            topics:
            - persistent://public/default/java-function-input-topic
          output:
            topic: persistent://public/default/java-function-output-topic
          pulsar:
            pulsarConfig: "test-pulsar"
          java:
            jar: my-function.jar # the package will download as this filename.
            jarLocation: function://my-tenant/my-ns/my-function@0.1 # function package URL
        ```

   - This example shows how to publish a `java-function-sample` function to Function Mesh by using a docker image.

      ```yaml
      apiVersion: compute.functionmesh.io/v1alpha1
      kind: Function
      metadata:
        name: java-function-sample
        namespace: default
      spec:
        image: streamnative/example-function-image:latest # using function image here
        className: org.apache.pulsar.functions.api.examples.ExclamationFunction
        sourceType: java.lang.String
        sinkType: java.lang.String
        forwardSourceMessageProperty: true
        MaxPendingAsyncRequests: 1000
        replicas: 1
        maxReplicas: 5
        logTopic: persistent://public/default/logging-function-logs
        input:
          topics:
          - persistent://public/default/java-function-input-topic
        output:
          topic: persistent://public/default/java-function-output-topic
        pulsar:
          pulsarConfig: "test-pulsar"
        java:
          jar: /pulsar/example-function.jar # the package location in image
          jarLocation: "" # leave empty since we will not download package from Pulsar Packages
      ```

    When you use Function Mesh with Docker images, you need to define the executable location in the CRD YAML file. Here are the settings for different Pulsar function runtime.

    ```yaml
      java: # Java runtime
        jar: example-function.jar
      python: # Python runtime
        py: exclamation_function.py
      golang: # Golang runtime
        go: go_func_executable
    ```

2. Apply the YAML file to create the Pulsar function.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

3. Check whether the Pulsar function is created successfully.

    ```bash
    kubectl get all
    ```
