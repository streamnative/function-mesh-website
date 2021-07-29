---
title: Run Function Mesh
category: function-mesh
id: run-function-mesh
---

Function Mesh is a collection of functions collaborated together to process data with clearly-defined stages on Kubernetes environments.

This document describes how to run Function Mesh through a `.yaml` file and submit Pulsar connectors and Pulsar functions through the Function Mesh CRD.

## Prerequisites

- Create and connect to a [Kubernetes cluster](https://kubernetes.io/).
- Create a [Pulsar cluster](https://pulsar.apache.org/docs/en/kubernetes-helm/) in the Kubernetes cluster.
- Install the Function Mesh Operator and CRD into Kubernetes cluster.
- package Pulsar Functions, see [package Pulsar Functions](/functions/run-function/run-java-function.md#package-java-functions).
- Package Pulsar connectors. For details, see [package Pulsar connectors](/connectors/run-connector.md#package-pulsar-connectors).

## Steps

To create a Function Mesh, follow these steps.

1. Define a Function Mesh named `functionmesh-sample` by using a YAML file and save the YAML file `functionmesh-sample.yaml`.

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: FunctionMesh
    metadata:
      name: functionmesh-sample
    spec:
      sinks:
        name: sink-sample
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
      functions:
        name: ex1
        className: exclamation_function.ExclamationFunction
        replicas: 1
        maxReplicas: 1
        input:
          topics:
            - persistent://public/default/functionmesh-input-topic
          typeClassName: java.lang.String
        output:
          topic: persistent://public/default/mid-topic
          typeClassName: java.lang.String
        pulsar:
          pulsarConfig: "mesh-test-pulsar"
        java:
          extraDependenciesDir: random-dir/
          jar: pulsar-functions-api-examples.jar
          jarLocation: public/default/nlu-test-functionmesh-ex1
        # following value must be provided if no auto-filling is enabled
        forwardSourceMessageProperty: true
        autoAck: true
        resources:
          requests:
            cpu: "0.1"
            memory: 1G
          limits:
            cpu: "0.2"
            memory: 1.1G
        clusterName: test-pulsar
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: mesh-test-pulsar
    data:
      webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
    ```

2. Apply the YAML file to create the Function Mesh.

    ```shell
    kubectl apply -f /path/to/functionmesh-sample.yaml
    ```

3. Check whether the Function Mesh is created successfully.

    ```shell
    kubectl get all
    ```