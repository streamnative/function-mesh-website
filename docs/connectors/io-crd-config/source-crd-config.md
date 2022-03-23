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
| `namespace` | The Pulsar namespace of a source connector. |
| `ClusterName` | The Pulsar cluster of a source connector. |
| `Replicas`| The number of instances that you want to run this source connector. |
| `MaxReplicas`| The maximum number of Pulsar instances that you want to run for this source connector. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the source controller automatically scales the source connector based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `SourceConfig` | The source connector configurations in YAML format. |
| `ProcessingGuarantee` | The processing guarantees (delivery semantics) applied to the source connector. Available values: `ATLEAST_ONCE`, `ATMOST_ONCE`, `EFFECTIVELY_ONCE`.|
| `ForwardSourceMessageProperty` | Configure whether to pass message properties to a target topic. |

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

Function Mesh provides the `SecretsMap` field for Function, Source and Sink in the CRD definition. You can refer to the created secret under the same namespace and the controller can include those referred secrets as environment variables. You can specify the `data.username` and `data.password` fields when creating a secret, as shown below.

```yaml
apiVersion: v1
data:
  username: <secret_key>
  password: <secret_password>
kind: Secret
metadata:
  name: <secret_name>
type: Opaque
```

This table lists configurations about the `SecretsMap` field.

| Field | Description |
| --- | --- |
| `name` | The name of the environment variable. <br />- `path`: the secret name. <br />- `key`: the key in the secret, which is defined using the `data.username` field. |
| `pwd` | The password infomation of the secret. <br />- `path`: the secret name. <br />- `password`: the password in the secret, which is defined using the `data.password` field.|

## Authentication

Function Mesh provides the `TLSSecret` and `AuthSecret` fields for Function, Source and Sink in the CRD definition. You can configure TLS encryption and/or TLS authentication using the following configurations.

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
| `BuiltinAutoscaler` | Specify the built-in autoscaling rules. <br /> - CPU-based autoscaling: auto-scale the number of Pods based on the CPU usage (80%, 50%, or 20%). <br />- Memory-based autoscaling: auto-scale the number of Pods based on the memory usage (80%, 50%, or 20%). <br /> If you configure the `BuiltinAutoscaler` field, you do not need to configure the `AutoScalingMetrics` and `AutoScalingBehavior` options and vice versa.|
| `AutoScalingMetrics` | Specify how to scale based on customized metrics defined in connectors. For details, see [MetricSpec v2beta2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#metricspec-v2beta2-autoscaling). |
| `AutoScalingBehavior` | Configure the scaling behavior of the target in both up and down directions (`scaleUp` and `scaleDown` fields respectively). If not specified, the default Kubernetes scaling behaviors are adopted. For details, see [HorizontalPodAutoscalerBehavior v2beta2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#horizontalpodautoscalerbehavior-v2beta2-autoscaling). |
