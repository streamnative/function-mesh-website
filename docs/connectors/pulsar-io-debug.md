---
title: Troubleshooting
category: connectors
id: pulsar-io-debug
---

## Use Pod logs

Logs in Kubernetes give you insight into resources such as nodes, pods, containers, deployments and replica sets. This insight allows you to observe the interactions between those resources and see the effects that one action has on another. Pod logs record events happening in a cluster, which can be very useful for debugging. Before debugging a pod, you need to ensure the Pod is already scheduled and running.

The built-in way to check logs on your Kubernetes cluster is with `kubectl` CLI commands. You can use the `kubectl logs pod POD_NAME -n NAMESPACE_NAME` to check logs of the affected container. In addition, you can use `kubectl logs pod POD_NAME -n NAMESPACE_NAME --previous` to retrieve logs from a previous instantiation of a container.

In addition, you can use the following command to check the specific Pod.

- `kubectl get pod POD_NAME -n NAMESPACE_NAME`: check Pod status.

- `kubectl describe pod POD_NAME -n NAMESPACE_NAME`: check the current state of the Pod and recent events.

For the use of `kubectl` commands, see [here](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands).

## Use log topic

In Pulsar connectors, you can generate log information defined in connectors to a specified log topic. You can configure consumers to consume messages from a specified log topic to check the log information.

- This example shows how to specify the log topic through the YAML file.

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
    maxReplicas: 3
    logTopic: persistent://public/default/logging-function-logs
    # Other source configs
    ```

- This example shows how to specify the log topic through the `pulsar-admin` CLI tool.

    > **Note**
    >
    > To use the `pulsar-admin` CLI tool to monitor Pulsar functions and connectors, you should start Function Mesh Proxy in advance. For details, see [work with `pulsar-admin` CLI tool](/install-function-mesh.md#work-with-pulsar-admin-cli-tool).

    ```bash
    bin/pulsar-admin sinks create \
    --log-topic persistent://public/default/logging-sink-logs \
    # Other sink configs
    ```

## Use `pulsar-admin` CLI tool

> **Note**
>
> To use the `pulsar-admin` CLI tool to monitor Pulsar functions and connectors, you should start Function Mesh Proxy in advance. For details, see [work with `pulsar-admin` CLI tool](/install-function-mesh.md#work-with-pulsar-admin-cli-tool).

To debug a Pulsar connector, you can perform the following operations.

* [Get the information of a Pulsar connector](#get).

* [Get the current status of a Pulsar connector](#status).

* [Get the stats for a topic and its connected producer and consumer](#topics-stats).

For more information, see [Pulsar source CLIs](http://pulsar.apache.org/tools/pulsar-admin/2.8.0-SNAPSHOT/#sources) and  [Pulsar sink CLIs](http://pulsar.apache.org/tools/pulsar-admin/2.8.0-SNAPSHOT/#sinks).

### `get`

You can get the information of a Pulsar connector.

<!--DOCUSAURUS_CODE_TABS-->

<!--Source-->

The `pulsar-admin sources get` command is used to get the information of a Pulsar source connector.

```bash
pulsar-admin sources get options
```

<!--Sink-->

The `pulsar-admin sinks get` command is used to get the information of a Pulsar sink connector.

```bash
pulsar-admin sinks get options
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `status`

You can get the current status of a Pulsar connector.

<!--DOCUSAURUS_CODE_TABS-->

<!--Source-->

The `pulsar-admin sources status` command is used to check the current status of a Pulsar source connector.

```bash
pulsar-admin sources status options
```

<!--Sink-->

The `pulsar-admin sinks status` command is used to check the current status of a Pulsar sink connector.

```bash
pulsar-admin sinks status options
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `topics stats`

The `pulsar-admin topics stats` command is used to check the stats for the input or output topic of a connector, and the connected producer and consumer, including information about received messages and backlog, and available permits.

```bash
pulsar-admin topics stats options
```

For more information about the `pulsar-admin topic stats` command, see [`topic stats`](http://pulsar.apache.org/docs/en/pulsar-admin/#stats-1).