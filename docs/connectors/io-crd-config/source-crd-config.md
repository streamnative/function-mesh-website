---
title: Source CRD configurations
category: connectors
id: source-crd-config
---
This document lists CRD configurations available for Pulsar source connectors. The source CRD configurations consist of source connector configurations and the common CRD configurations.

## Source configurations

This table lists source configurations.

| Field | Description |
| --- | --- |
| `name` | The name of a source connector. |
| `classname` | The class name of a source connector. |
| `tenant` | The tenant of a source connector. |
| `Replicas`| The number of instances that you want to run this source connector. |
| `MaxReplicas`| The maximum number of Pulsar instances that you want to run for this source connector. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the source controller automatically scales the source connector based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `SourceConfig` | The map to a ConfigMap specifying the configuration of a source connector. |
| `ProcessingGuarantee` | The processing guarantees (delivery semantics) applied to the source connector. Available values: `ATLEAST_ONCE`, `ATMOST_ONCE`, `EFFECTIVELY_ONCE`.|

## Images

This section describes image options available for Pulsar source CRDs.

### Base runner

The base runner is an image base for other runners. The base runner is located at `./pulsar-functions-base-runner`. The base runner image contains basic tool-chains like `/pulsar/bin`, `/pulsar/conf` and `/pulsar/lib` to ensure that the `pulsar-admin` CLI tool works properly to support [Apache Pulsar Packages](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

### Runner images

Function Mesh uses runner images as images of Pulsar connectors. Each runner image only contains necessary tool-chains and libraries for specified runtime.

Pulsar connectors support using the Java runner images as their images. The Java runner is based on the base runner and contains the Java function instance to run Java functions or connectors. The `streamnative/pulsar-functions-java-runner` Java runner is stored at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-java-runner) and is automatically updated to align with Apache Pulsar release.

## Output

The output topics of a Pulsar Function. This table lists options available for the `Output`.

|Name | Description |
| --- | --- |
| `Topics` | The output topic of a Pulsar Function (If none is specified, no output is written). | 
| `SinkSerdeClassName` | The map of output topics to SerDe class names (as a JSON string). |
| `SinkSchemaType` | The built-in schema type or custom schema class name to be used for messages sent by the function.|
| `ProducerConf` | The producer specifications. Available options: <br />- `MaxPendingMessages`: the maximum number of pending messages. <br />- `MaxPendingMessagesAcrossPartitions`: the maximum number of pending messages across partitions. <br />- `UseThreadLocalProducers`: configure whether the producer uses a thread. <br />- `CryptoConfig`: cryptography configurations of the producer. <br />- `BatchBuilder`: support key-based batcher. 
| `CustomSchemaSinks` | The map of output topics to Schema class names (as a JSON string). |

## Resources

When you specify a function or connector, you can optionally specify how much of each resource they need. The resources available to specify are CPU and memory (RAM).

If the node where a Pod is running has enough of a resource available, it's possible (and allowed) for a Pod to use more resources than its `request` for that resource. However, a Pod is not allowed to use more than its resource `limit`.

## Secrets

In Function Mesh, the secret is defined through a secretsMap. To use a secret, a Pod needs to reference the secret. Pods can consume secretsMaps as environment variables in a volume. You can specify the `data` field when creating a configuration file for a secret.

To use a secret in an environment variable in a Pod, follow these steps.

1. Create a secret or use an existing one. Multiple Pods can reference the same secret.
2. Modify your Pod definition in each container, which you want to consume the value of a secret key, to add an environment variable for each secret key that you want to consume.
3. Modify your image and/or command line so that the program looks for values in the specified environment variables.

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
| `jarLocation` | Path to the JAR file for the connector. |
| `extraDependenciesDir` | It specifies the dependent directory for the JAR package. |

## Cluster location

In Function Mesh, the Pulsar cluster is defined through a ConfigMap. Pods can consume ConfigMaps as environment variables in a volume. The Pulsar cluster ConfigMap defines the Pulsar cluster URLs.

| Field | Description |
| --- | --- |
| `webServiceURL` | The Web service URL of the Pulsar cluster. |
| `brokerServiceURL` | The broker service URL of the Pulsar cluster. |

## Pod specifications

Function Mesh supports customizing the Pod running connectors. This table lists sub-fields available for the `pod` field.

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
| `ServiceAccountName` | Specify the name of the service account which is used to run Pulsar Functions or connectors in the Function Mesh Worker service.|
| `InitContainers` | Initialization containers belonging to a Pod. A typical use case could be using an Initialization container to download a remote JAR to a local path. |
| `Sidecars` | Sidecar containers run together with the main function container in a Pod. |
