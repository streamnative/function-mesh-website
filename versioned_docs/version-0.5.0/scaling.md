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

- Use the `kubectl scale --replicas` command. The CLI command does not change the `replicas` configuration in the CRD. If you use the `kubectl apply -f` command to re-submit the CRD file, the CLI configuration may be overwritten.

    ```bash
    kubectl scale --replicas="" pod/POD_NAME
    ```

- Update the value of the `replicas` parameter in the CRD and re-submit the CRD with the `kubectl apply -f` command.

## Autoscaling

Function Mesh auto-scales the number of Pods based on the CPU usage, memory usage, customized metrics. 

- CPU usage: auto-scale the number of Pods based on CPU utilization.
  
  This table lists built-in CPU-based autoscaling metrics. If these metrics do not meet your requirements, you can auto-scale the number of Pods based on customized metrics defined in Pulsar Functions or connectors. For details, see [MetricSpec v2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#metricspec-v2-autoscaling).
  
  | Option | Description |
  | --- | --- |
  | AverageUtilizationCPUPercent80 | Auto-scale the number of Pods if 80% CPU is used.|
  | AverageUtilizationCPUPercent50 | Auto-scale the number of Pods if 50% CPU is used.|
  | AverageUtilizationCPUPercent20 | Auto-scale the number of Pods if 20% CPU is used. |

- Memory usage: auto-scale the number of Pods based on memory utilization.
  
  This table lists built-in memory-based autoscaling metrics. If these metrics do not meet your requirements, you can auto-scale the number of Pods based on customized metrics defined in Pulsar Functions or connectors. For details, see [MetricSpec v2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#metricspec-v2-autoscaling).
  
  | Option | Description |
  | --- | --- |
  | AverageUtilizationMemoryPercent80 | Auto-scale the number of Pods if 80% memory is used. |
  | AverageUtilizationMemoryPercent50 | Auto-scale the number of Pods if 50% memory is used. |
  | AverageUtilizationMemoryPercent20 | Auto-scale the number of Pods if 20% memory is used. |

- metrics: auto-scale the number of Pods based on customized metrics defined in Pulsar Functions or connectors. For details, see [MetricSpec v2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#metricspec-v2-autoscaling).

> **Note**
>
> If you have configured autoscaling based on the CPU usage, memory usage, or both of them, you do not need to configure autoscaling based on customized metrics defined in Pulsar Functions or connectors and vice versa.

By default, autoscaling is disabled (the value of the `maxReplicas` parameter is set to `0`). To enable autoscaling, you can specify the `maxReplicas` parameter and set a value for it in the CRD. This value should be greater than the value of the `replicas` parameter. Then, the number of Pods is automatically scaled when 80% CPU is used.

### Prerequisites

Deploy the metrics server in the cluster. The Metrics server provides metrics through the Metrics API. The Horizontal Pod Autoscaler (HPA) uses this API to collect metrics. To learn how to deploy the metrics-server, see the [metrics-server documentation](https://github.com/kubernetes-sigs/metrics-server#deployment).

### Examples

These examples describe how to auto-scale the number of Pods running Pulsar Functions.

- Function Mesh supports automatically scaling up the number of Pods by updating the `maxReplicas` parameter. In this case, the number of Pods is updated to `8` when 80% CPU is used.

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
        maxPendingAsyncRequests: 1000
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

- Function Mesh supports automatically scaling up the number of Pods based on a built-in autoscaling metric. This example auto-scales the number of Pods if 20% CPU is used.

  1. Specify the CPU-based autoscaling metric under `pod.builtinAutoscaler` in the Pulsar Functions CRD.

      ```yaml
      apiVersion: cloud.streamnative.io/v1alpha1
      kind: Function
      metadata:
        name: java-function-sample
        namespace: default
      spec:
        className: org.apache.pulsar.functions.api.examples.ExclamationFunction
        forwardSourceMessageProperty: true
        maxPendingAsyncRequests: 1000
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

  >**Note**
  >
  > If you specify multiple metrics for the HPA to scale on, the HPA controller evaluates each metric, and proposes a new scale based on that metric. The largest of the proposed scales will be used as the new scale.

- Function Mesh supports automatically scaling up the number of Pods based on a customized autoscaling metric. This example auto-scales the number of Pods if 45% CPU is used.

  1. Specify the customized autoscaling metric under `pod.autoScalingMetrics` in the Pulsar Functions CRD.

      ```yaml
      apiVersion: cloud.streamnative.io/v1alpha1
      kind: Function
      metadata:
        name: java-function-sample
        namespace: default
      spec:
        className: org.apache.pulsar.functions.api.examples.ExclamationFunction
        forwardSourceMessageProperty: true
        maxPendingAsyncRequests: 1000
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