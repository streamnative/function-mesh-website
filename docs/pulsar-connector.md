---
title: Configure Pulsar connectors
category: configure
id: pulsar-connector
---


Pulsar IO connectors consist of source and sink. Sources pass through data from external systems into Pulsar while sinks output data from Pulsar into external systems. Function Mesh supports defining Sources and Sinks through the Function CRD.

# Prerequisites

- Create a Kubernetes cluster.
- Create a Pulsar cluster.
- Install FunctionMesh operator and CRD into Kubernetes.
- Set up the external source/sink system to communicate with the Pulsar connector.

# Create source

To create a source, follow these steps.

1. Define a source named `source-sample` by using a YAML file and save the YAML file `source-sample.yaml`.

    ```yml
    apiVersion: cloud.streamnative.io/v1alpha1
    kind: Source
    metadata:
      name: source-sample
    spec:
      className: org.apache.pulsar.io.debezium.mongodb.DebeziumMongoDbSource
      sourceType: org.apache.pulsar.common.schema.KeyValue
      sinkType: org.apache.pulsar.common.schema.KeyValue
      replicas: 1
      maxReplicas: 1
      output:
        producerConf:
          maxPendingMessages: 1000
          maxPendingMessagesAcrossPartitions: 50000
          useThreadLocalProducers: true
        topic: persistent://public/default/destination
      resources:
        limits:
          cpu: "0.2"
          memory: 1.1G
        requests:
          cpu: "0.1"
          memory: 1G
      sourceConfig:
        mongodb.hosts: rs0/mongo-dbz-0.mongo.default.svc.cluster.local:27017,rs0/mongo-dbz-1.mongo.default.svc.cluster.local:27017,rs0/mongo-dbz-2.mongo.default.svc.cluster.local:27017
        mongodb.name: dbserver1
        mongodb.user: debezium
        mongodb.password: dbz
        mongodb.task.id: "1"
        database.whitelist: inventory
        pulsar.service.url: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
      pulsar:
        pulsarConfig: "test-source"
      java:
        jar: connectors/pulsar-io-debezium-mongodb-2.7.0-rc-pm-3.nar
        jarLocation: "" # use pulsar provided connectors
        # use package name:
        # jarLocation: function://public/default/nul-test-java-source@v1
      clusterName: test-pulsar
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-source
    data:
      webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
    ```

    For details about fields used for creating the source, see [available fields for source](#available-fields-for-source).

2. Apply the YAML file to create the source.

    ```shell
    kubectl apply -f /path/to/source-sample.yaml
    ```

3. Check whether the source is created successfully.

    ```shell
    kubectl get all
    ```

    **Output**

    ```
    NAME                  READY   STATUS    RESTARTS   AGE
    pod/source-sample-0   1/1     Running   0          2s

    NAME                    TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    service/kubernetes      ClusterIP   10.12.0.1    <none>        443/TCP    2d20h
    service/source-sample   ClusterIP   None         <none>        9093/TCP   3s

    NAME                             READY   AGE
    statefulset.apps/source-sample   1/1     3s

    NAME                                                REFERENCE              TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
    horizontalpodautoscaler.autoscaling/source-sample   Source/source-sample   <unknown>/80%   1         1         0          3s
    ```

# Create sink

To create a sink, follow these steps.

1. Define a sink named `sink-sample` by using a YAML file and save the YAML file `sink-sample.yaml`.

    ```yaml
    apiVersion: cloud.streamnative.io/v1alpha1
    kind: Sink
    metadata:
      name: sink-sample
    spec:
      # Add fields here
      className: org.apache.pulsar.io.elasticsearch.ElasticSearchSink
      sourceType: "[B"
      sinkType: "[B"
      replicas: 1
      maxReplicas: 1
      input:
        topics:
        - persistent://public/default/input
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
        jar: connectors/pulsar-io-elastic-search-2.7.0-rc-pm-3.nar
        jarLocation: "" # use pulsar provided connectors
        # use package name:
        # jarLocation: function://public/default/nul-test-java-sink@v1
      clusterName: test-pulsar
      autoAck: true
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-sink
    data:
      webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
    ```

    For details about fields used for creating the sink, see [available fields for sink](#available-fields-for-sink).

2. Apply the YAML file to create the sink.

    ```shell
    kubectl apply -f /path/to/sink-sample.yaml
    ```

3. Check whether the sink is created successfully.

    ```shell
    kubectl get all
    ```

    **Output**

    ```
    NAME                READY   STATUS    RESTARTS   AGE
    pod/sink-sample-0   1/1     Running   0          2s

    NAME                  TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    service/kubernetes    ClusterIP   10.12.0.1    <none>        443/TCP    2d20h
    service/sink-sample   ClusterIP   None         <none>        9093/TCP   3s

    NAME                           READY   AGE
    statefulset.apps/sink-sample   1/1     3s

    NAME                                              REFERENCE          TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
    horizontalpodautoscaler.autoscaling/sink-sample   Sink/sink-sample   <unknown>/80%   1         1         0          3s
    ```

# Available fields

This section lists available fields for source and sink.

## Available fields for source

In the `.yaml` file for the source you want to create, you need to set values for the the following fields:

- `apiVersion`: the API version used to create the object
- `kind`: the kind of the object to be created
- `metadata`: data that uniquely identify the object, including the `name` of the object to be created
- `spec`: the state desired for the object, including specifications about the source

The following lists specifications about the source.

- `Name`: the name of the the source
- `ClassName`: the class name of the the source
- `Tenant`: the tenant for the Pulsar cluster
- `ClusterName`: the name of Pulsar cluster
- `SourceType`: the type of the source
- `SinkType`: the type of the sink
- `Replicas`: the number of Pulsar instances that you want to run this Pulsar Functions
- `MaxReplicas`: the maximum number of Pulsar instances that you want to run for this Pulsar Functions. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the Functions controller will automatically scale the Pulsar Functions based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled.
- `Output`: the topic from which messages are dispatched, including producer configurations
- `SourceConfig`: configurations about the source
- `pulsarConfig`: Pulsar clusters referred by the Pulsar Functions. Each Pulsar cluster is defined as a `ConfigMap`. The `ConfigMap` contains configurations for the specific cluster. This allows you to use Pulsar Functions across multiple clusters.
- `Resources`: the resources used by the Pulsar Functions, including required and maximum CPU and memory resources.
- `SecretsMap`: secret configurations. Function Mesh leverages the Kubernetes secret and you can just reference the Kubernetes secret in the Pulsar Functions configuration. That would improve the whole security for your Pulsar Functions.
- `ProcessingGuarantee`: configurations of processing Guarantee
- `RuntimeFlag`: the Kubernetes Runtime flags
- `VolumeMounts`: Pod volumes to mount into the container's filesystem, including the `mountPath` and the `name`

## Available fields for sink

In the `.yaml` file for the sink you want to create, you need to set values for the the following fields:

- `apiVersion`: the API version used to create the object
- `kind`: the kind of the object to be created
- `metadata`: data that uniquely identify the object, including the `name` of the object to be created
- `spec`: the state desired for the object, including specifications about the sink

The following lists specifications about the sink.

- `Name`: the name of the the sink
- `ClassName`: the class name of the the sink
- `ClusterName`: the name of Pulsar cluster
- `Tenant`: the tenant for the Pulsar cluster
- `SourceType`: the type of the source
- `SinkType`: the type of the sink
- `Replicas`: the number of Pulsar instances that you want to run this Pulsar Functions
- `MaxReplicas`: the maximum number of Pulsar instances that you want to run for this Pulsar Functions. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the Functions controller will automatically scale the Pulsar Functions based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled.
- `Input`: the topic to which messages are sent
- `sinkConfig`: configurations about the sink
- `resources`: the resources used by the Pulsar Functions, including required and maximum CPU and memory resources.
- `SecretsMap`: secret configurations. Function Mesh leverages the Kubernetes secret and you can just reference the Kubernetes secret in the Pulsar Functions configuration. That would improve the whole security for your Pulsar Functions.
- `VolumeMounts`: Pod volumes to mount into the container's filesystem, including the `mountPath` and the `name`
- `Timeout`: the time out of the request
- `autoAck`: Enable/Disable automatic acknowledgement.
- `ProcessingGuarantee`: configurations of processing guarantee
- `RetainOrdering`: configure whether to retain ordering when moving data from Pulsar to external systems.
- `DeadLetterTopic`: the dead letter topic
- `MaxMessageRetry`: the maximum of retries for each message 
- `RuntimeFlags`: the Kubernetes Runtime flags
- `SubscriptionName`: the subscription name
- `CleanupSubscription`: configure whether to clean up subscriptions.
- `SubscriptionPosition`: the subscription position
- `pulsarConfig`: Pulsar clusters referred by the Pulsar Functions. Each Pulsar cluster is defined as a `ConfigMap`. The `ConfigMap` contains configurations for the specific cluster. This allows you to use Pulsar Functions across multiple clusters.
