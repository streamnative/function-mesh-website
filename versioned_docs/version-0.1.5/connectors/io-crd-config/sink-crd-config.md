---
title: Sink CRD configurations
category: connectors
id: sink-crd-config
---
This document lists CRD configurations available for Pulsar sink connectors. The sink CRD configurations consist of sink connector configurations and the common CRD configurations.

## Sink configurations

This table lists sink configurations.

| Field | Description |
| --- | --- |
| `name` | The name of a sink connector. |
| `classname` | The class name of a sink connector. |
| `tenant` | The tenant of a sink connector. |
| `Replicas`| The number of instances that you want to run this sink connector. By default, the `Replicas` is set to `1`. |
| `MaxReplicas`| The maximum number of Pulsar instances that you want to run for this sink connector. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the sink controller automatically scales the sink connector based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `SinkConfig` | The map to a ConfigMap specifying the configuration of a sink connector. |
| `Timeout` | The message timeout in milliseconds. |
| `NegativeAckRedeliveryDelayMs`| The number of redelivered messages due to negative acknowledgement. |
| `AutoAck` | Whether or not the framework acknowledges messages automatically. This field is required. You can set it to `true` or `false`. |
| `MaxMessageRetry` | How many times to process a message before giving up. |
| `ProcessingGuarantee` | The processing guarantees (delivery semantics) applied to the sink connector. Available values: `ATLEAST_ONCE`, `ATMOST_ONCE`, `EFFECTIVELY_ONCE`.|
| `RetainOrdering` | The sink connector consumes and processes messages in order. |
| `DeadLetterTopic` | The topic where all messages that were not processed successfully are sent. |
| `SubscriptionName` | The subscription name of the sink connector if you want a specific subscription-name for the input-topic consumer. |
| `CleanupSubscription` | Configure whether to clean up subscriptions. |
| `SubscriptionPosition` | The subscription position. |

## Images

This section describes image options available for Pulsar sink CRDs.

### Base runner

The base runner is an image base for other runners. The base runner is located at `./pulsar-functions-base-runner`. The base runner image contains basic tool-chains like `/pulsar/bin`, `/pulsar/conf` and `/pulsar/lib` to ensure that the `pulsar-admin` CLI tool works properly to support [Apache Pulsar Packages](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

### Runner images

Function Mesh uses runner images as images of Pulsar connectors. Each runner image only contains necessary tool-chains and libraries for specified runtime.

Pulsar connectors support using the Java runner images as their images. The Java runner is based on the base runner and contains the Java function instance to run Java functions or connectors. The `streamnative/pulsar-functions-java-runner` Java runner is stored at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-java-runner) and is automatically updated to align with Apache Pulsar release.

## Input

The input topics of a Pulsar Function. The following table lists options available for the `Input`.

| Field | Description |
| --- | --- |
| `Topics` | The configuration of the topic from which messages are fetched. |
| `CustomSerdeSources` | The map of input topics to SerDe class names (as a JSON string). |
| `CustomSchemaSources` | The map of input topics to Schema class names (as a JSON string). |
| `SourceSpecs` | The map of source specifications to consumer specifications. Consumer specifications include these options: <br />- `SchemaType`: the built-in schema type or custom schema class name to be used for messages fetched by the connector. <br />- `SerdeClassName`: the SerDe class to be used for messages fetched by the connector. <br />- `IsRegexPattern`: configure whether the input topic adopts a Regex pattern. <br />- `SchemaProperties`: the schema properties for messages fetched by the connector. <br />- `ConsumerProperties`: the consumer properties for messages fetched by the connector. <br />- `ReceiverQueueSize`: the size of the consumer receive queue. <br /> - `CryptoConfig`: cryptography configurations of the consumer. |

## Resources

When you specify a function or connector, you can optionally specify how much of each resource they need. The resources available to specify are CPU and memory (RAM).

If the node where a Pod is running has enough of a resource available, it is possible (and allowed) for a Pod to use more resources than its `request` for that resource. However, a Pod is not allowed to use more than its resource `limit`.

## Secrets

In Function Mesh, the secret is defined through a secretsMap. To use a secret, a Pod needs to reference the secret. Pods can consume secretsMaps as environment variables in a volume. You can specify the `data` field when creating a configuration file for a secret.

To use a secret in an environment variable in a Pod, follow these steps.

1. Create a secret or use an existing one. Multiple Pods can reference the same secret.
2. Modify your Pod definition in each container, which you want to consume the value of a secret key, to add an environment variable for each secret key that you want to consume.
3. Modify your image and or command line so that the program looks for values in the specified environment variables.

Pulsar clusters support using TLS or other authentication plugin for authentication.

- TLS Secret

    | Field | Description |
    | --- | --- |
    | tlsAllowInsecureConnection | Allow insecure TLS connection. |
    | tlsHostnameVerificationEnable | Enable hostname verification. |
    | tlsTrustCertsFilePath | The path of the TLS trust certificate file. |

- Auth Secret

    | Field | Description |
    | --- | --- |
    | clientAuthenticationPlugin | Client authentication plugin. |
    | clientAuthenticationParameters | Client authentication parameters. |

## Packages

Function Mesh supports running Pulsar connectors in Java.

| Field | Description |
| --- | --- |
| `jarLocation` | Path to the JAR file for the connector.|
| `extraDependenciesDir` | It specifies the dependent directory for the JAR package. |

## Cluster location

In Function Mesh, the Pulsar cluster is defined through a ConfigMap. Pods can consume ConfigMaps as environment variables in a volume. The Pulsar cluster ConfigMap defines the Pulsar cluster URLs.

| Field | Description |
| --- | --- |
| `webServiceURL` | The Web service URL of the Pulsar cluster. |
| `brokerServiceURL` | The broker service URL of the Pulsar cluster. |

## Pod specifications

Function Mesh supports customizing the Pod running Pulsar connectors. This table lists sub-fields available for the `pod` field.

| Field | Description |
| --- | --- |
| `Labels` | Specify labels attached to a Pod. |
| `NodeSelector` | Specify a map of key-value pairs. For a Pod running on a node, the node must have each of the indicated key-value pairs as labels. |
| `Affinity` | Specify the scheduling constraints of a Pod. |
| `Tolerations` | Specify the tolerations of a Pod. |
| `Annotations`| Specify the annotations attached to a Pod. |
| `SecurityContext` | Specify the security context for a Pod. |
| `TerminationGracePeriodSeconds` | It is the amount of time that Kubernetes gives for a Pod before terminating it. |
| `Volumes` | It is a list of volumes that can be mounted by containers belonging to a Pod. |
| `ImagePullSecrets` | It is an optional list of references to secrets in the same namespace for pulling any of the images used by a Pod. |
| `InitContainers` | The initialization containers belonging to a Pod. A typical use case could be using an initialization container to download a remote JAR to a local path. |
| `Sidecars` | Sidecar containers run together with the main function container in a Pod. |
