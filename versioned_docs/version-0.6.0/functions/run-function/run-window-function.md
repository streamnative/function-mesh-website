---
title: Run Window Functions
category: functions
id: run-window-function
---

To run a Java [window function](/functions/function-overview.md#window-functions) in Function Mesh, you need to package the window function and then submit the package to a Pulsar cluster.

## Prerequisites

- Apache Pulsar v2.3.0 or higher
- Function Mesh v0.6.0 or higher

## Package a window function

For details, see [package Java Functions](/functions/run-function/run-java-function.md#package-java-functions).

## Submit a window function

This section describes how to submit a window function through a function CRD.

1. Define a window function in a YAML file.

    This example shows how to publish a `java-window-function:v1` window function to a Pulsar cluster. You can use the `spec.windowConfig` option to specify the window function configurations. For details, see [window function configurations](/functions/function-crd.md#window-function-configurations).

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: Function
    metadata:
      name: window-function-example
      namespace: default
    spec:
      image: java-window-function:v1
      className: org.example.GetInputTopicsWindowFunction
      forwardSourceMessageProperty: true
      maxPendingAsyncRequests: 1000
      minReplicas: 1
      windowConfig:
        windowLengthCount: 10       # --- [1]
        slidingIntervalCount: 5     # --- [2]
      logTopic: persistent://public/default/logging-function-logs
      input:
        topics:
        - persistent://public/default/input-window-function
        typeClassName: java.lang.String
      output:
        topic: persistent://public/default/output-window-function
        typeClassName: java.lang.String
      resources:
        requests:
          cpu: 50m
          memory: 1G
        limits:
          cpu: "0.2"
          memory: 1.1G
      secretsMap:
        "name":
            path: "test-secret"
            key: "username"
        "pwd":
            path: "test-secret"
            key: "password"
      pulsar:
        pulsarConfig: "test-pulsar"
        tlsConfig:
          enabled: false
          allowInsecure: false
          hostnameVerification: true
          certSecretName: sn-platform-tls-broker
          certSecretKey: ""
        #authConfig: "test-auth"
      java:
        jar: /pulsar/java-window-function-1.0-SNAPSHOT.jar
      clusterName: test
      autoAck: true
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-pulsar
    data:
      webServiceURL: http://sn-platform-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://sn-platform-pulsar-broker.default.svc.cluster.local:6650
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

    [1] `windowLengthCount`: represents the number of messages per window.
    [2] `slidingIntervalCount`: represents the number of messages which the window slides after.

2. Apply the YAML file to create the window function.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

3. Check whether the window function is created successfully.

    ```bash
    kubectl get all
    ```
