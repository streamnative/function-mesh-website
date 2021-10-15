---
title: Run Pulsar connectors
category: connectors
id: run-connector
---

Pulsar IO connectors consist of source and sink connectors. Source connectors pass through data from external systems into Pulsar while sink connectors output data from Pulsar into external systems. Function Mesh supports defining sources and sink connectors through source or sink CRDs.

This document describes how to run a Pulsar connector. To run a Pulsar connector in Function Mesh, you need to package the connector and then submit it to a Pulsar cluster.

## Pulsar built-in connectors and StreamNative-managed connectors

StreamNative provides ready-to-use Docker images for Pulsar built-in connectors and StreamNative-managed connectors. These images are public at the [Docker Hub](https://hub.docker.com/), with the image name in a format of `streamnative/pulsar-io-CONNECTOR-NAME:TAG`, such as [`streamnative/pulsar-io-hbase:2.7.1`](https://hub.docker.com/r/streamnative/pulsar-io-hbase). You can check all supported connectors on the [StreamNative Hub](https://hub.streamnative.io/).

For Pulsar built-in connectors and StreamNative-managed connectors, you can create them by specifying the Docker image in the source or sink CRDs.

1. Define a sink connector named `sink-sample` by using a YAML file and save the YAML file `sink-sample.yaml`.

    This example shows how to publish a `elastic-search` sink to Function Mesh by using a docker image.

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: Sink
    metadata:
      name: sink-sample
    spec:
      image: streamnative/pulsar-io-elastic-search:2.7.1 # using connector image here
      className: org.apache.pulsar.io.elasticsearch.ElasticSearchSink
      replicas: 1
      maxReplicas: 1
      input:
        topics:
        - persistent://public/default/input
        typeClassName: "[B"
      sinkConfig:
        elasticSearchUrl: "http://quickstart-es-http.default.svc.cluster.local:9200"
        indexName: "my_index"
        typeName: "doc"
        username: "elastic"
        password: "wJ757TmoXEd941kXm07Z2GW3"
      pulsar:
        pulsarConfig: "test-sink"
      resources:
        limits:
          cpu: "0.2"
          memory: 1.1G
        requests:
          cpu: "0.1"
          memory: 1G
      java:
        extraDependenciesDir: random-dir/
        jar: connectors/pulsar-io-elastic-search-2.7.1.nar # the NAR location in image
        jarLocation: "" # leave empty since we will not download package from Pulsar Packages
      clusterName: test-pulsar
      autoAck: true
    ```

2. Apply the YAML file to create the sink.

    ```bash
    kubectl apply -f /path/to/sink-sample.yaml
    ```

3. Check whether the sink is created successfully.

    ```bash
    kubectl get all
    ```

## Self-built connectors

To run a self-built connector, you need to package it to an external package (NAR package or uber JAR package) or a Docker image and then submit the connector to a Pulsar cluster through source or sink CRDs.

### Package self-built connectors

After developing and testing your connector, you need to package it so that it can be submitted to a Pulsar cluster. You can package a Pulsar connector to a NAR/JAR package or a Docker image.

#### NAR or uber JAR packages

This section describes how to package a Pulsar connector to a NAR or JAR package and upload it to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

##### Prerequisites

- Apache Pulsar 2.8.0 or higher
- Function Mesh v0.1.3 or higher

##### Build NAR and uber JAR packages

- **NAR packages**

    This section describes how to package a Pulsar connector to a NAR package. **NAR** stands for NiFi Archive, which is a custom packaging mechanism used by [Apache NiFi](https://nifi.apache.org/), to provide a bit of Java `ClassLoader` isolation.

    1. Build a NAR package for a connector by using the [nifi-nar-maven-plugin](https://mvnrepository.com/artifact/org.apache.nifi/nifi-nar-maven-plugin).

    2. Include this [nifi-nar-maven-plugin](https://mvnrepository.com/artifact/org.apache.nifi/nifi-nar-maven-plugin) in the Maven project for your connector.

    ```xml
    <plugins>
    <plugin>
        <groupId>org.apache.nifi</groupId>
        <artifactId>nifi-nar-maven-plugin</artifactId>
        <version>1.2.0</version>
    </plugin>
    </plugins>
    ```

    3. Create a `resources/META-INF/services/pulsar-io.yaml` file with the following contents.

    ```yaml
    name: connector name
    description: connector description
    sourceClass: fully qualified class name (only if source connector)
    sinkClass: fully qualified class name (only if sink connector)
    ```

    4. (Optional) if you use the [Gradle NiFi plugin](https://github.com/sponiro/gradle-nar-plugin), you need to create a directive to ensure that your `pulsar-io.yaml` is copied to the NAR file correctly.

- **uber JAR packages**

    You can create an **uber JAR** that contains all the connector's JAR files and other resource files.

    You can use the [maven-shade-plugin](https://maven.apache.org/plugins/maven-shade-plugin/examples/includes-excludes.html) to create an uber JAR as below.

    ```xml
    <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>3.1.1</version>
    <executions>
        <execution>
        <phase>package</phase>
        <goals>
            <goal>shade</goal>
        </goals>
        <configuration>
            <filters>
            <filter>
                <artifact>*:*</artifact>
            </filter>
            </filters>
        </configuration>
        </execution>
    </executions>
    </plugin>
    ```

#### Upload NAR or JAR packages

Use the `pulsar-admin` CLI tool to upload the NAR or uber JAR package to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

This example shows how to upload the NAR package of the `my-sink` connector to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

```bash
bin/pulsar-admin packages upload sink://public/default/my-sink@1.0 --path "/path/to/package-file" --description PACKAGE_DESCRIPTION
```

Then, you can define source or sink CRDs by specifying the uploaded connector package.

#### Docker images

StreamNative provides ready-to-use Docker images for Pulsar built-in connectors and StreamNative-managed connectors. For non built-in connectors, you can build Docker images for them.

##### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher

##### Build Docker images

To build a Docker image, follow these steps.

1. Package your connector to a [NAR package](#nar-package) or [JAR package](#uber-jar-package).

2. Define a `Dockerfile`.

    This example shows how to define a `Dockerfile` with a NAR package called `pulsar-io-example.nar`.

    ```dockerfile
    # Use pulsar-functions-java-runner since we pack Pulsar Connector written in Java
    FROM streamnative/pulsar-functions-java-runner:2.7.1
    # Copy NAR file into /pulsar/connectors/ directory  
    COPY pulsar-io-example.nar /pulsar/connectors/
    ```

3. Build your connector Docker image packaged with your connector NAR or JAR package.

Then, you can push the connector Docker image into an image registry (such as the [Docker Hub](https://hub.docker.com/), or any private registry) and use the connector Docker image to configure and submit the connector to Function Mesh.

### Submit self-built connectors

After packaging your Pulsar connectors, you can submit your Pulsar connectors to a Pulsar cluster. This section describes how to submit a Pulsar connector through a source or sink CRD. Function Mesh supports using the source or sink CRD to define Pulsar connectors.

#### Prerequisites

- Create and connect to a [Kubernetes cluster](https://kubernetes.io/).
- Create a [Pulsar cluster](https://pulsar.apache.org/docs/en/kubernetes-helm/) in the Kubernetes cluster.
- Install the Function Mesh Operator and CRD into Kubernetes cluster.
- Set up the external source or sink system to communicate with the Pulsar connector.

For self-built connectors, you can create them based on how you package them.

1. Define a sink connector by using a YAML file and save the YAML file.

   - This example shows how to publish a sink connector named `my-sink-package-sample` connector to Function Mesh by using a package.

       ```yaml
      apiVersion: compute.functionmesh.io/v1alpha1
      kind: Sink
      metadata:
        name: my-sink-package-sample
        namespace: default
      spec:
        image: streamnative/pulsar-functions-java-runner:2.7.1 # using java function runner
        className: org.example.MySink
        forwardSourceMessageProperty: true
        maxPendingAsyncRequests: 1000
        replicas: 1
        maxReplicas: 1
        input:
          topics:
          - persistent://public/default/input
          typeClassName: java.lang.String
        sinkConfig:
          myconfig: "test-config"
        pulsar:
          pulsarConfig: "test-pulsar"
        java:
          extraDependenciesDir: random-dir/
          jar: /pulsar/connectors/pulsar-io-my-sink.nar # the package will download as this filename.
          jarLocation: sink://public/default/my-sink@1.0 # connector package URL
       ```

   - This example shows how to publish a sink connector named `my-sink-image-sample` connector to Function Mesh by using a Docker image.

     ```yaml
      apiVersion: compute.functionmesh.io/v1alpha1
      kind: Sink
      metadata:
        name: my-sink-image-sample
        namespace: default
      spec:
        image: myorg/pulsar-io-my-sink:2.7.1 # using self built image
        forwardSourceMessageProperty: true
        maxPendingAsyncRequests: 1000
        replicas: 1
        maxReplicas: 1
        input:
          topics:
          - persistent://public/default/input
          typeClassName: java.lang.String
        sinkConfig:
          myconfig: "test-config"
        pulsar:
          pulsarConfig: "test-pulsar"
        java:
          extraDependenciesDir: random-dir/
          jar: /pulsar/connectors/pulsar-io-my-sink.nar # the NAR location in image.
          jarLocation: "" # leave empty since we will not download package from Pulsar Packages
     ```

2. Apply the YAML file to create the sink connector.

    ```bash
    kubectl apply -f /path/to/sink-sample.yaml
    ```

3. Check whether the sink connector is created successfully.

    ```bash
    kubectl get all
    ```