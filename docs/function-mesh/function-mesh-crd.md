---
title: Function Mesh CRD configurations
category: function-mesh
id: function-mesh-crd
---

This document lists CRD configurations available for Function Mesh. The CRD configurations for Function Mesh consist of Function configurations and common CRD configurations.

## Function Mesh configurations

The Function Mesh configurations are a combination of Pulsar Function configurations, Pulsar source configurations and Pulsar sink configurations. For details, see the following documentation.

- [Pulsar Function CRD configurations](/functions/function-crd.md)
- [Source connector CRD configurations](/connectors/io-crd-config/source-crd-config.md)
- [Sink connector CRD configurations](/connectors/io-crd-config/sink-crd-config.md)

This example shows how to submit the ElasticSearch sink connector and a Pulsar Functions to a Pulsar cluster through the Function Mesh CRD.

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
          jar: connectors/pulsar-io-elastic-search-2.7.1.nar # the NAR location in image
          jarLocation: "" # leave empty since we will not download package from Pulsar Packages
        clusterName: test-pulsar
        autoAck: true
      functions:
        name: ex1
        className: org.apache.pulsar.functions.api.examples.ExclamationFunction
        replicas: 1
        maxReplicas: 1
        logTopic: persistent://public/default/logging-function-log
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