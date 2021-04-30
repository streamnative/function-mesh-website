---
title: Run Java Functions
category: functions
id: run-java-function
---

Pulsar Functions is a succinct computing abstraction that Apache Pulsar enables users to express simple ETL and streaming tasks. Currently, Function Mesh supports using Java, Python, or Go programming language to define a YAML file of the Functions.

This document describes how to run Java Functions. To run a Java Functions in Function Mesh, you need to package the Functions and then submit it to a Pulsar cluster.

## Package Java Functions

After developing and testing your Pulsar Functions , you need to package it so that it can be submitted to a Pulsar cluster. You can package Java Functions to NAR/JAR packages or Docker images.

### Java Functions packages

This section describes how to package a Java Functions and upload it to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

#### Build Java Functions packages

This section describes how to build packages for Java Functions.

##### Prerequisites

- Apache Pulsar 2.8.0 or higher
- Function Mesh v0.1.3 or higher

##### Steps

To package a Functions in Java, follow these steps.

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

2. Write a Java Functions .

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

3. Package the Java Functions .

    ```bash
    mvn package
    ```

    After the Java Functions is packaged, a `target` directory is created automatically. Open the `target` directory to check if there is a JAR package similar to `java-function-1.0-SNAPSHOT.jar`.

#### Upload Java Functions packages

Use the `pulsar-admin` CLI tool to upload the package to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

This example shows how to upload the package of the `my-function@0.1` Functions to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

```bash
bin/pulsar-admin packages upload function://my-tenant/my-ns/my-function@0.1 --path "/path/to/package-file" --description PACKAGE_DESCRIPTION
```

Then, you can define Functions CRDs by specifying the uploaded Functions package.

### Docker images

This section describes how to package a Pulsar Functions to a Docker image.

#### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher

#### Build Docker images

To build a Docker image, follow these steps.

1. Package your Pulsar function. For details, see [package Pulsar functions](#package-pulsar-functions).

2. Define a `Dockerfile`.

    This example shows how to define a `Dockerfile` with a JAR package (`example-function.jar`) of the Java Functions.

    ```dockerfile
    # Use pulsar-functions-java-runner since we pack Java function
    FROM streamnative/pulsar-functions-java-runner:2.7.1
    # Copy function JAR package into /pulsar directory  
    COPY example-function.jar /pulsar/
    ```

Then, you can push the Functions Docker image into an image registry (such as the [Docker Hub](https://hub.docker.com/), or any private registry) and use the Functions Docker image to configure and submit the Functions to a Pulsar cluster.

## Submit Java Functions

After packaging your Pulsar Functions, you can submit your Pulsar Functions to a Pulsar cluster. This section describes how to submit a Java Functions through a Functions CRD. You can use the `image` field to specify the runner image use for creating the Java Functions. You can also specify the location where the package or the Docker image is stored.

1. Define a Java Functions by using a YAML file and save the YAML file.

   - This example shows how to publish a `java-function-sample` Functions to a Pulsar cluster by using a JAR package called `function://my-tenant/my-ns/my-function@0.1`.

        ```yaml
        apiVersion: compute.functionmesh.io/v1alpha1
        kind: Function
        metadata:
          name: java-function-sample
          namespace: default
        spec:
          image: streamnative/pulsar-functions-java-runner:2.7.1 # using java function runner
          className: exclamation_function.ExclamationFunction
          forwardSourceMessageProperty: true
          MaxPendingAsyncRequests: 1000
          replicas: 1
          maxReplicas: 5
          logTopic: persistent://public/default/logging-function-logs
          input:
            topics:
            - persistent://public/default/java-function-input-topic
            typeClassName: java.lang.String
          output:
            topic: persistent://public/default/java-function-output-topic
            typeClassName: java.lang.String
          pulsar:
            pulsarConfig: "test-pulsar"
          java:
            jar: my-function.jar # the package will download as this filename.
            jarLocation: function://my-tenant/my-ns/my-function@0.1 # function package URL
        ```

   - This example shows how to publish a `java-function-sample` Functions to a Pulsar cluster by using a Docker image.

      ```yaml
      apiVersion: compute.functionmesh.io/v1alpha1
      kind: Function
      metadata:
        name: java-function-sample
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
          - persistent://public/default/java-function-input-topic
          typeClassName: java.lang.String
        output:
          topic: persistent://public/default/java-function-output-topic
          typeClassName: java.lang.String
        pulsar:
          pulsarConfig: "test-pulsar"
        java:
          jar: /pulsar/example-function.jar # the package location in image
          jarLocation: "" # leave empty since we will not download package from Pulsar Packages
      ```

2. Apply the YAML file to create the Java Functions.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

3. Check whether the Java Functions is created successfully.

    ```bash
    kubectl get all
    ```