---
title: Scaling
category: scaling
id: scaling
---

Autoscaling monitors your Pods and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost. With autoscaling, it is easy to set up Pods scaling for resources in minutes. The service provides a simple, powerful user interface that lets you build scaling plans for resources.

This document describes how to scale Pods (Pulsar instances) which are used for running functions, sources, and sinks.

## How it works

With Kubernetes [Horizontal Pod Autoscaler (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-Pod-autoscale/), Function Mesh supports automatically scaling the number of Pods (Pulsar instances) that are required to run for Pulsar functions, sources, and sinks.

For resources with HPA configured, the HPA controller monitors the resource's Pods to determine if it needs to change the number of Pod replicas. In most cases, where the controller takes the mean of a per-pod metric value, it calculates whether adding or removing replicas would move the current value closer to the target value.

![scaling](./assets/scaling.png)

## Manual scaling

In CRDs, the `replicas` parameter is used to specify the number of Pods (Pulsar instances) that are required for running Pulsar functions, sources, or sinks. You can set the number of Pods based on the CPU threshold. When the target CPU threshold is reached, you can scale the Pods manually through either of the two ways:

- Use the `kubectl scale --replicas` command. The CLI command does not change the `replicas` configuration in the CRD. If you use the `kunectl apply -f` command to re-submit the CRD file, the CLI configuration may be overwritten.

    ```bash
    kubectl scale --replicas="" pod/POD_NAME
    ```

- Update the value of the `replicas` parameter in the CRD and re-submit the CRD with the `kubectl apply -f` command.

## Autoscaling

Function Mesh auto-scales the number of Pods based on the CPU usage, memory usage, customized metrics. 

- CPU usage: auto-scale the number of Pods based on CPU utilization.
  
  This table lists built-in CPU-based autoscaling metrics. If these metrics cannot meet your requirements, you can auto-scale the number of Pods based on customized metrics defined in Pulsar Functions or connectors. For details, see [MetricSpec v2beta2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#metricspec-v2beta2-autoscaling).
  
  | Option | Description |
  | --- | --- |
  | AverageUtilizationCPUPercent80 | Auto-scale the number of Pods if 80% CPU is utilized.|
  | AverageUtilizationCPUPercent50 | Auto-scale the number of Pods if 50% CPU is utilized.|
  | AverageUtilizationCPUPercent20 | Auto-scale the number of Pods if 20% CPU is utilized. |

- Memory usage: auto-scale the number of Pods based on memory utilization.
  
  This table lists built-in CPU-based autoscaling metrics. If these metrics cannot meet your requirements, you can auto-scale the number of Pods based on customized metrics defined in Pulsar Functions or connectors. For details, see [MetricSpec v2beta2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#metricspec-v2beta2-autoscaling).
  
  | Option | Description |
  | --- | --- |
  | AverageUtilizationMemoryPercent80 | Auto-scale the number of Pods if 80% memory is utilized. |
  | AverageUtilizationMemoryPercent50 | Auto-scale the number of Pods if 50% memory is utilized. |
  | AverageUtilizationMemoryPercent20 | Auto-scale the number of Pods if 20% memory is utilized. |

- metrics: auto-scale the number of Pods based on customized metrics defined in Pulsar Functions or connectors. For details, see [MetricSpec v2beta2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#metricspec-v2beta2-autoscaling).

> **Note**
>
> If you have configured autoscaling based on the CPU usage, memory usage, or both of them, you do not need to configure autoscaling based on customized metrics defined in Pulsar Functions or connectors and vice versa.

By default, autoscaling is disabled (the value of the `maxReplicas` parameter is set to `0`). To enable autoscaling, you can specify the `maxReplicas` parameter and set a value for it in the CRD. This value should be greater than the value of the `replicas` parameter. Then, the number of Pods is automatically scaled when 80% CPU is utilized.

### Prerequisites

Deploy the metrics server in the cluster. The Metrics server provides metrics through the Metrics API. The Horizontal Pod Autoscaler (HPA) uses this API to collect metrics. To learn how to deploy the metrics-server, see the [metrics-server documentation](https://github.com/kubernetes-sigs/metrics-server#deployment).

### Auto-scale Pulsar Functions

- Function Mesh supports automatically scaling up the number of Pods by updating the `maxReplica` parameter. In this case, the number of Pods is updated when 80% CPU is utilized.

  1. Specify the `maxReplicas` to `8` in the Pulsar Functions CRD. The `maxReplicas` refers to the maximum number of Pods that are required for running the Pulsar Functions.

      ```yaml
      apiVersion: cloud.streamnative.io/v1alpha1
      kind: Function
      metadata:
        name: java-function-sample
        namespace: default
      spec:
        className: org.apache.pulsar.functions.api.examples.ExclamationFunction
        forwardSourceMessageProperty: true
        MaxPendingAsyncRequests: 1000
        replicas: 1
        maxReplicas: 8
        logTopic: persistent://public/default/logging-function-logs
        input:
          topics:
          - persistent://public/default/java-function-input-topic
          typeClassName: java.lang.String
        output:
          topic: persistent://public/default/java-function-output-topic
          typeClassName: java.lang.String
        # Other function configs
      ```

  2. Apply the configurations.

      ```bash
      kubectl apply -f path/to/source-sample.yaml
      ```

- Function Mesh supports automatically scaling up the number of Pods based on a built-in autoscaling metric. This example auto-scales the number of Pods if 20% CPU is utilized.

  1. Specify the CPU-based autoscaling metric in the Pulsar Functions CRD.

      ```yaml
      apiVersion: cloud.streamnative.io/v1alpha1
      kind: Function
      metadata:
        name: java-function-sample
        namespace: default
      spec:
        className: org.apache.pulsar.functions.api.examples.ExclamationFunction
        forwardSourceMessageProperty: true
        MaxPendingAsyncRequests: 1000
        replicas: 1
        maxReplicas: 4
        logTopic: persistent://public/default/logging-function-logs
        input:
          topics:
          - persistent://public/default/java-function-input-topic
          typeClassName: java.lang.String
        pod:
          builtinAutoscaler:
            - AverageUtilizationCPUPercent20
        # Other function configs
      ```

  2. Apply the configurations.

      ```bash
      kubectl apply -f path/to/source-sample.yaml
      ```
    
- Function Mesh supports automatically scaling up the number of Pods based on a customized autoscaling metric. This example auto-scales the number of Pods if 45% CPU is utilized.

  1. Specify the `maxReplicas` to `8` in the Pulsar Functions CRD. The `maxReplicas` refers to the maximum number of Pods that are required for running the Pulsar Functions.

      ```yaml
      apiVersion: cloud.streamnative.io/v1alpha1
      kind: Function
      metadata:
        name: java-function-sample
        namespace: default
      spec:
        className: org.apache.pulsar.functions.api.examples.ExclamationFunction
        forwardSourceMessageProperty: true
        MaxPendingAsyncRequests: 1000
        replicas: 1
        maxReplicas: 4
        logTopic: persistent://public/default/logging-function-logs
        pod:
          autoScalingMetrics:
          - type: Resource
            resource:
              name: cpu
              target:
                type: Utilization
                averageUtilization: 45
        # Other function configs
      ```

  2. Apply the configurations.

      ```bash
      kubectl apply -f path/to/source-sample.yaml
      ```

### Auto-scale Pulsar connectors

This example shows how to auto-scale the number of Pods for running a Pulsar source connector to `5`.

1. Specify the `maxReplicas` to `5` in the Pulsar source CRD. The `maxReplicas` refers to the maximum number of Pods that are required for running the Pulsar source connector.

    **Example**

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: Source
    metadata:
      name: source-sample
    spec:
      className: org.apache.pulsar.io.debezium.mongodb.DebeziumMongoDbSource
      replicas: 1
      maxReplicas: 5
      replicas: 1
      maxReplicas: 1
      output:
        producerConf:
          maxPendingMessages: 1000
          maxPendingMessagesAcrossPartitions: 50000
          useThreadLocalProducers: true
        topic: persistent://public/default/destination
        typeClassName: org.apache.pulsar.common.schema.KeyValue
      resources:
        limits:
          cpu: "0.2"
          memory: 1.1G
        requests:
          cpu: "0.1"
          memory: 1G
      # Other configurations
    ```

2. Apply the configurations.

    ```bash
    kubectl apply -f path/to/source-sample.yaml
    ```