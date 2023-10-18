---
title: Pulsar Function CRD configurations
category: functions
id: function-crd
---

This document lists CRD configurations available for Pulsar Functions. The CRD configurations for Pulsar Functions consist of Function configurations and common CRD configurations.

## Function configurations

This table lists Pulsar Function configurations.

| Field | Description |
| ---|---|
| `name` | The name of a Pulsar Function. |
| `classname` | The class name of a Pulsar Function. |
| `tenant` | The tenant of a Pulsar Function. |
| `namespace` | The Pulsar namespace of a Pulsar Function. |
| `clusterName` | The Pulsar cluster of a Pulsar Function. |
| `replicas`| The number of instances that you want to run this Pulsar Function. By default, the `replicas` is set to `1`. |
| `maxReplicas`| The maximum number of Pulsar instances that you want to run for this Pulsar Function. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the Functions controller automatically scales the Pulsar Functions based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `timeout` | The message timeout in milliseconds. |
| `deadLetterTopic` | The topic where all messages that were not processed successfully are sent. This parameter is not supported in Python Functions. |
| `funcConfig` | Pulsar Functions configurations in YAML format. |
| `logTopic` | The topic to which the logs of a Pulsar Function are produced. |
| `autoAck` | Whether or not the framework acknowledges messages automatically. This field is required. You can set it to `true` or `false`.|
| `maxMessageRetry` | How many times to process a message before giving up. |
| `processingGuarantee` | The processing guarantees (delivery semantics) applied to the function. Available values: `atleast_once`, `atmost_once`, `effectively_once`.|
| `forwardSourceMessageProperty` | Configure whether to pass message properties to a target topic. |
| `retainOrdering` | Function consumes and processes messages in order. |
| `retainKeyOrdering`| Configure whether to retain the key order of messages. |
| `subscriptionName` | Pulsar Functions' subscription name if you want a specific subscription name for the input-topic consumer. |
| `cleanupSubscription` | Configure whether to clean up subscriptions. |
| `subscriptionPosition` | The subscription position. |

## Images

This section describes image options available for Pulsar Function, source, sink and Function Mesh CRDs.

### Base runner

The base runner is an image base for other runners. The base runner is located at `./pulsar-functions-base-runner`. The base runner image contains basic tool-chains like `/pulsar/bin`, `/pulsar/conf` and `/pulsar/lib` to ensure that the `pulsar-admin` CLI tool works properly to support [Apache Pulsar Packages](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

### Runner images

Function Mesh uses runner images as images of Pulsar functions and connectors. Each runner image only contains necessary tool-chains and libraries for specified runtime.

This table lists available Function runtime runner images.

| Type | Description |
| --- | --- |
| Java runner | The Java runner is based on the base runner and contains the Java function instance to run Java functions or connectors. The `streamnative/pulsar-functions-java-runner` Java runner is stored at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-java-runner) and is automatically updated to align with Apache Pulsar release.
| Python runner | The Python runner is based on the base runner and contains the Python function instance to run Python functions. You can build your own Python runner to customize Python dependencies. The `streamnative/pulsar-functions-python-runner` Python runner is located at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-java-runner) and is automatically updated to align with Apache Pulsar release.
| Golang runner | The Golang runner provides all the tool-chains and dependencies required to run Golang functions. The `streamnative/pulsar-functions-go-runner` Golang runner is located at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-java-runner) and is automatically updated to align with Apache Pulsar release.

## Input

The input topics of a Pulsar Function. The following table lists options available for the `Input`.

| Field | Description |
| --- | --- |
| `topics` | The configuration of the topic from which messages are fetched. |
| `customSerdeSources` | The map of input topics to SerDe class names (as a JSON string). |
| `customSchemaSources` | The map of input topics to Schema class names (as a JSON string). |
| `sourceSpecs` | The map of source specifications to consumer specifications. Consumer specifications include these options: <br />- `SchemaType`: the built-in schema type or custom schema class name to be used for messages fetched by the function. <br />- `SerdeClassName`: the SerDe class to be used for messages fetched by the function. <br />- `IsRegexPattern`: configure whether the input topic adopts a Regex pattern. <br />- `SchemaProperties`: the schema properties for messages fetched by the function. <br />- `ConsumerProperties`: the consumer properties for messages fetched by the function. <br />- `ReceiverQueueSize`: the size of the consumer receive queue. br /> - `cryptoConfig`: cryptography configurations of the consumer. |

## Output

The output topics of a Pulsar Function. This table lists options available for the `Output`.

|Name | Description |
| --- | --- |
| `topics` | The output topic of a Pulsar Function (If none is specified, no output is written). | 
| `sinkSerdeClassName` | The map of output topics to SerDe class names (as a JSON string). |
| `sinkSchemaType` | The built-in schema type or custom schema class name to be used for messages sent by the function.|
| `producerConf` | The producer specifications. Available options: < br />- `maxPendingMessages`: the maximum number of pending messages. <br />- `maxPendingMessagesAcrossPartitions`: the maximum number of pending messages across partitions. <br />- `useThreadLocalProducers`: configure whether the producer uses a thread. <br />- `cryptoConfig`: cryptography configurations of the producer. <br />- `batchBuilder`: support key-based batcher.
| `customSchemaSinks` | The map of output topics to Schema class names (as a JSON string). |

## Resources

When you specify a function or connector, you can optionally specify how much of each resource they need. The resources available to specify are CPU and memory (RAM).

If the node where a Pod is running has enough of a resource available, it's possible (and allowed) for a pod to use more resources than its `request` for that resource specifies. However, a pod is not allowed to use more than its resource `limit`.

## Authentication

Function Mesh provides the `tlsSecret` and `authSecret` fields for Function, Source and Sink in the CRD definition. You can configure TLS encryption and/or TLS authentication using the following configurations.

- TLS Secret

    | Field | Description |
    | --- | --- |
    | `tlsAllowInsecureConnection` | Allow insecure TLS connection. |
    | `tlsHostnameVerificationEnable` | Enable hostname verification. |
    | `tlsTrustCertsFilePath` | The path of the TLS trust certificate file. |

- Authentication Secret

    | Field | Description |
    | --- | --- |
    | `clientAuthenticationPlugin` | The client authentication plugin. |
    | `clientAuthenticationParameters` | The client authentication parameters. |

## Packages

Function Mesh supports running Pulsar Functions in Java, Python and Go. This table lists fields available for running Pulsar Functions in different languages.

| Field | Description |
| --- | --- |
| `jarLocation` | Path to the JAR file for the function. It is only available for Pulsar functions written in Java. |
| `goLocation` | Path to the JAR file for the function. It is only available for Pulsar functions written in Go.|
| `pyLocation` | Path to the JAR file for the function. It is only available for Pulsar functions written in Python.|
| `extraDependenciesDir` | It specifies the dependent directory for the JAR package. |

## Cluster location

In Function Mesh, the Pulsar cluster is defined through a ConfigMap. Pods can consume ConfigMaps as environment variables in a volume. The Pulsar cluster ConfigMap defines the Pulsar cluster URLs.

| Field | Description |
| --- | --- |
| `webServiceURL` | The Web service URL of the Pulsar cluster. |
| `brokerServiceURL` | The broker service URL of the Pulsar cluster. |

## Pod specifications

Function Mesh supports customizing the Pod running function instance. This table lists sub-fields available for the `pod` field.

| Field | Description |
| --- | --- |
| `labels` | Specify labels attached to a Pod. |
| `nodeSelector` | Specify a map of key-value pairs. For a Pod running on a node, the node must have each of the indicated key-value pairs as labels. |
| `affinity` | Specify the scheduling constraints of a Pod. |
| `tolerations` | Specify the tolerations of a Pod. |
| `annotations`| Specify the annotations attached to a Pod. |
| `securityContext` | Specify the security context for a Pod. |
| `terminationGracePeriodSeconds` | It is the amount of time that Kubernetes gives for a Pod before terminating it. |
| `volumes` | It is a list of volumes that can be mounted by containers belonging to a Pod. |
| `imagePullSecrets` | It is an optional list of references to secrets in the same namespace for pulling any of the images used by a Pod. |
| `serviceAccountName` | Specify the name of the service account which is used to run Pulsar Functions or connectors.|
| `initContainers` | Initialization containers belonging to a Pod. A typical use case could be using an Initialization container to download a remote JAR to a local path. |
| `sidecars` | Sidecar containers run together with the main function container in a Pod. |
| `builtinAutoscaler` | Specify the built-in autoscaling rules. <br /> - CPU-based autoscaling: auto-scale the number of Pods based on the CPU usage (80%, 50%, or 20%). <br />- Memory-based autoscaling: auto-scale the number of Pods based on the memory usage (80%, 50%, or 20%). <br /> If you configure the `builtinAutoscaler` field, you do not need to configure the `autoScalingMetrics` and `autoScalingBehavior` options and vice versa.|
| `autoScalingMetrics` | Specify how to scale based on customized metrics defined in Pulsar Functions. For details, see [MetricSpec v2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#metricspec-v2-autoscaling). |
| `autoScalingBehavior` | Configure the scaling behavior of the target in both up and down directions (`scaleUp` and `scaleDown` fields respectively). If not specified, the default Kubernetes scaling behaviors are adopted. For details, see [HorizontalPodAutoscalerBehavior v2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#horizontalpodautoscalerbehavior-v2-autoscaling). |
