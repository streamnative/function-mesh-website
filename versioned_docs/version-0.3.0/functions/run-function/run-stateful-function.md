---
title: Run Stateful Functions
category: functions
id: run-stateful-function
---

To run Java or Python stateful functions in Function Mesh, you need to package the function and then submit the package to a Pulsar cluster.

## Prerequisites

- Apache Pulsar v2.8.0 or higher
- Function Mesh v0.2.0 or higher

## Package Stateful Functions

This section describes how to package Java and Python Stateful functions.

### Java Stateful Functions

For details, see [package Java Functions](/functions/run-function/run-java-function.md#package-java-functions).

### Python Stateful Functions

For details, see [package Python Functions](/functions/run-function/run-python-function.md#package-python-functions).

## Submit Stateful Functions

After packaging a stateful function, you can submit it to a Pulsar cluster. This section describes how to submit Java and Python Stateful functions.

### Enable BookKeeper table service

Before submitting a stateful function, you need to enable the Apache BookKeeper table service. This section describes how to enable the  BookKeeper table service.

1. Update the BookKeeper configuration file.

    Currently, the service uses the NAR package, so you need to set the configuration in the `bookkeeper.conf` configuration file.

    ```text
    ##################################################################
    ##################################################################
    # stream/table service settings
    ##################################################################
    ##################################################################

    ### gRPCServer ###

    # The gRPC server port to listen on. The default is 4181.
    storageserver.grpc.port=4181

    ### Dlog settings for table service ###

    #### Replication Settings
    dlog.bkcEnsembleSize=3
    dlog.bkcWriteQuorumSize=2
    dlog.bkcAckQuorumSize=2

    ### Storage ###

    # The local storage directories for storing table range data (e.g. RocksDB sorted string table (sst)  files).
    storage.range.store.dirs=data/bookkeeper/ranges

    # Specify whether the storage server is capable of serving read-only tables. The default is false.
    storage.serve.readonly.tables=false

    # The cluster controller schedule interval, in milliseconds. The default is 30 seconds.
    storage.cluster.controller.schedule.interval.ms=30000
    ```

2. Verify whether the BookKeeper table service is enabled successfully.

    After starting the bookie, execute the following command.

    ```shell
    telnet localhost 4181
    ```

    The output is something like this:

    ```text
    Trying 127.0.0.1...
    Connected to localhost.
    Escape character is '^]'.
    ```

### Submit Java Stateful Functions

This section describes how to submit a Java stateful function through a function CRD.

1. Define a Java stateful function and specify the `statefulConfig.pulsar.serviceUrl` option in a YAML file. 

    This example shows how to publish a `java-function-stateful-sample` stateful function to a Pulsar cluster by using a Docker image. You can use the `spec.image` field to specify the runner image for creating the Java stateful function.

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: Function
    metadata:
      name: java-function-stateful-sample
      namespace: default
    spec:
      className: org.apache.pulsar.functions.api.examples.WordCountFunction
      forwardSourceMessageProperty: true
      maxPendingAsyncRequests: 1000
      replicas: 1
      maxReplicas: 5
      logTopic: persistent://public/default/logging-function-logs
      input:
        topics:
        - persistent://public/default/java-function-stateful-input-topic
        typeClassName: java.lang.String
      output:
        topic: persistent://public/default/java-function-stateful-output-topic
        typeClassName: java.lang.String
      resources:
        requests:
          cpu: "0.1"
          memory: 1G
        limits:
          cpu: "0.2"
          memory: 1.1G
      pulsar:
        pulsarConfig: "test-pulsar"
      java:
        jar: pulsar-functions-api-examples.jar
        jarLocation: public/default/nlu-test-java-function
        extraDependenciesDir: random-dir/
      clusterName: test-pulsar
      autoAck: true
      statefulConfig:
        pulsar:
          serviceUrl: "bk://test-pulsar-bk.default.svc.cluster.local:4181"
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-pulsar
    data:
      webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
    ```

3. Apply the YAML file to create the Java stateful function.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

4. Check whether the Java stateful function is created successfully.

    ```bash
    kubectl get all
    ```

### Submit Python Stateful Functions

This section describes how to submit a Python stateful function through a function CRD. 

1. Define a Python stateful function and specify the `statefulConfig.pulsar.serviceUrl` option in a YAML file. 

    This example shows how to publish a `python-function-stateful-sample` stateful function to a Pulsar cluster by using a Docker image. You can use the `spec.image` field to specify the runner image for creating the Python stateful function.

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: Function
    metadata:
      name: python-function-stateful-sample
      namespace: default
    spec:
      className: wordcount_function.WordCountFunction
      forwardSourceMessageProperty: true
      maxPendingAsyncRequests: 1000
      replicas: 1
      maxReplicas: 5
      logTopic: persistent://public/default/logging-function-logs
      input:
        topics:
        - persistent://public/default/python-function-stateful-input-topic
        typeClassName: java.lang.String
      output:
        topic: persistent://public/default/python-function-stateful-output-topic
        typeClassName: java.lang.String
      resources:
        requests:
          cpu: "0.1"
          memory: 1G
        limits:
          cpu: "0.2"
          memory: 1.1G
      pulsar:
        pulsarConfig: "test-pulsar"
      java:
        py: wordcount_function.py
        pyLocation: public/default/test-python-function
        extraDependenciesDir: random-dir/
      clusterName: test-pulsar
      autoAck: true
      statefulConfig:
        pulsar:
          serviceUrl: "bk://test-pulsar-bk.default.svc.cluster.local:4181"
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-pulsar
    data:
      webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
    ```

3. Apply the YAML file to create the Python stateful function.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

4. Check whether the Python stateful function is created successfully.

    ```bash
    kubectl get all
    ```
