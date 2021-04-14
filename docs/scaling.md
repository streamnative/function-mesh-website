---
title: Scaling
category: scaling
id: scaling
---

Autoscaling monitors your Pods and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost. With autoscaling, it’s easy to set up Pods scaling for resources in minutes. The service provides a simple, powerful user interface that lets you build scaling plans for resources.

This document describes how to scale Pods (Pulsar instances) which are used for running functions, sources, and sinks.

## How it works

With Kubernetes [Horizontal Pod Autoscaler (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-Pod-autoscale/), Function Mesh supports automatically scaling the number of Pods (Pulsar instances) that are required to run for Pulsar functions, sources, and sinks.

For resources with HPA configured, the HPA controller monitors the resource's Pods to determine if it needs to change the number of Pod replicas. In most cases, where the controller takes the mean of a per-pod metric value, it calculates whether adding or removing replicas would move the current value closer to the target value.

![scaling](../assets/scaling.png)

## Manual scaling

In CRDs, the `replicas` parameter is used to specify the number of Pods (Pulsar instances) that are quired for running Pulsar functions, sources, or sinks. You can set the number of Pods based on the CPU threshold. When the target CPU threshold is reached, you can scale the Pods through either of the two ways:

- Use the `kubectl scale --replicas` command. The CLI command does not change the `replicas` configuration in the CRD. If you use the `kunectl apply -f` command to re-submit the CRD file, the CLI configuration may be overwritten.

    ```bash
    kubectl scale --replicas="" pod/POD_NAME
    ```
- Update the value of the `replicas` parameter in the CRD and re-submit the CRD with the `kubectl apply -f` command.

## Autoscaling

As mentioned in the previous section, Function Mesh supports automatically scaling Pods (Pulsar instances) based on the CPU utilization. By default, autoscaling is disabled (The value of the `maxReplicas` parameter is set to 0). To enable autoscaling, you can specify the `maxReplicas` parameter and set a value for it in the CRD. This value should be greater than the value of the `replicas` parameter.

**Example**

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
    maxReplicas: 5
    # Other configurations
```