---
title: Configure Pulsar Functions
category: configure
id: pulsar-functions
---
Pulsar Functions is a succinct computing abstraction that Apache Pulsar allows users to express simple ETL and streaming tasks.

# Prerequisites

- Create a Kubernetes cluster.
- Create a pulsar cluster.
- Install FunctionMesh operator and CRD into Kubernetes.

# Steps

Function Mesh supports using the Functions CRD to define Pulsar Functions. This example launches a single Pulsar Functions inside Kubernetes with auto-scaling turned on.

1. Define a Pulsar Functions named `function-sample` by using a YAML file and save the YAML file `function-sample.yaml`.

    ```yml
    apiVersion: cloud.streamnative.io/v1alpha1
    kind: Function
    metadata:
      name: java-function-sample
      namespace: default
    spec:
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
      resources:
        requests:
          cpu: "0.1"
          memory: 1G
        limits:
          cpu: "0.2"
          memory: 1.1G
      # each secret will be loaded ad an env variable from the `path` secret with the `key` in that secret in the name of `name`
      secretsMap:
        "name":
            path: "test-secret"
            key: "username"
        "pwd":
            path: "test-secret"
            key: "password"
      pulsar:
        pulsarConfig: "test-pulsar"
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
      pod:
        labels:
          "locaction": "mtv"
        annotations:
          "managed-function": "true"
        volumes:
        - name: cache-volume
          emptyDir: {}
        imagePullSecrets:
        - name: regcred
      java:
        jar: pulsar-functions-api-examples.jar
        jarLocation: public/default/nlu-test-java-function
      clusterName: test-pulsar
      autoAck: true
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-pulsar
    data:
        webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
        brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
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

    For details about fields used for creating the Pulsar Functions, see [available fields](#available-fields).

2. Apply the YAML file to create the Pulsar Functions.

    ```shell
    kubectl apply -f /path/to/function-sample.yaml
    ```

3. Check whether the Pulsar Functions is created successfully.

    ```shell
    kubectl get all
    ```

    **Output**

    ```
    NAME                         READY   STATUS    RESTARTS   AGE
    pod/java-function-sample-0   1/1     Running   0          14s

    NAME                           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    service/java-function-sample   ClusterIP   None         <none>        9093/TCP   14s
    service/kubernetes             ClusterIP   10.12.0.1    <none>        443/TCP    2d19h

    NAME                                    READY   AGE
    statefulset.apps/java-function-sample   1/1     15s

    NAME                                                       REFERENCE                       TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
    horizontalpodautoscaler.autoscaling/java-function-sample   Function/java-function-sample   <unknown>/80%   1         5         0          14s
    ```

# Available fields

In the `.yaml` file for the Pulsar Functions you want to create, you need to set values for the following fields:

- `apiVersion`: the API version used to create the object
- `kind`: the kind of the object to be created
- `metadata`: data that uniquely identify the object, including the `name` of the object to be created and a Kubernetes `namespace`
- `spec`: the state desired for the object, including specifications about the Pulsar Functions

The following lists fields available for each Pulsar Functions.

- `ClassName`: the class name of the Pulsar Functions
- `ClusterName`: the name of Pulsar cluster
- `SourceType`: the type of the Source
- `SinkType`: the type pf the Sink
- `Replicas`: the number of Pulsar instances that you want to run this Pulsar Functions
- `MaxReplicas`: the maximum number of Pulsar instances that you want to run for this Pulsar Functions. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the Functions controller will automatically scale the Pulsar Functions based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled.
- `Input`: the topic to which messages are sent
- `Output`: the topic from which messages are dispatched
- `LogTopic`: the topic to which logs are output
- `FuncConfig`: the configurations about Pulsar Functions.
- `Resources`: the resources used by the Pulsar Functions, including required and maximum CPU and memory resources.
- `secretsMap`: secret configurations. Function Mesh leverages the Kubernetes secret and you can just reference the Kubernetes secret in the Pulsar Functions configuration. That would improve the whole security for your Pulsar Functions.
- `VolumeMounts`: Pod volumes to mount into the container's filesystem, including the `mountPath` and the `name`
- `volumes`: a directory on disk or in another container
- `imagePullSecrets`: specify the Secret that Kubernetes should get the credentials.
- `pulsarConfig`: Pulsar clusters referred by the Pulsar Functions. Each Pulsar cluster is defined as a `ConfigMap`. The `ConfigMap` contains configurations for the specific cluster. This allows you to use Pulsar Functions across multiple clusters.
- `Timeout`: the time out of the request
- `autoAck`: Enable/Disable automatic acknowledgement.
- `MaxMessageRetry`: the maximum of retries for each message 
- `ProcessingGuarantee`: configurations of processing guarantee
- `RetainOrdering`: configure whether to retain ordering when moving data from Pulsar to external systems.
- `RetainKeyOrdering`: configure whether to retain the key order of messages.
- `DeadLetterTopic`: the dead letter topic
- `forwardSourceMessageProperty`: Enable/Disable forwarding source messages' property.
- `MaxPendingAsyncRequests`: the maximum size of the pending asynchronous requests
- `RuntimeFlags`: the Kubernetes Runtime flags
- `SubscriptionName`: the subscription name
- `CleanupSubscription`: configure whether to clean up subscriptions.
- `SubscriptionPosition`: the subscription position
- `pod`: a group of one or more containers, with shared storage and network resources, and a specification for how to run the containers