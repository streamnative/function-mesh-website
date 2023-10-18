---
title: Debug Pulsar connectors
category: connectors
id: pulsar-io-debug
---

This document describes how to debug Pulsar connectors through Pod logs and connector log topics.

## Use Pod logs

Logs in Kubernetes give you insight into resources such as nodes, Pods, containers, deployments and replica sets. This insight allows you to observe the interactions between those resources and see the effects that one action has on another. Pod logs record events happening in a cluster, which can be very useful for debugging. Before debugging a Pod, you need to ensure the Pod is already scheduled and running.

The built-in way to check logs on your Kubernetes cluster is with `kubectl` CLI commands. You can use the `kubectl logs pod POD_NAME -n NAMESPACE_NAME` to check logs of the affected container. In addition, you can use `kubectl logs pod POD_NAME -n NAMESPACE_NAME --previous` to retrieve logs from a previous instantiation of a container.

In addition, you can use the following command to check the specific Pod.

- `kubectl get pod POD_NAME -n NAMESPACE_NAME`: check Pod status.

- `kubectl describe pod POD_NAME -n NAMESPACE_NAME`: check the current state of the Pod and recent events.

For the use of `kubectl` commands, see [kubectl command reference](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands).

## Use log topics

In Pulsar connectors, you can generate log information defined in connectors to a specified log topic. You can configure consumers to consume messages from a specified log topic to check the log information.

This example shows how to specify the log topic through the YAML file.

```yaml
apiVersion: cloud.streamnative.io/v1alpha1
kind: Source
metadata:
  name: source-sample
spec:
  className: org.apache.pulsar.io.debezium.mongodb.DebeziumMongoDbSource
  replicas: 1
  maxReplicas: 3
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
  # Other source configs
```