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
| `name` | The connector name is a string of up to `43` characters. |
| `classname` | The class name of a source connector. |
| `tenant` | The tenant of a source connector. |
| `namespace` | The Pulsar namespace of a source connector. |
| `clusterName` | The Pulsar cluster of a source connector. |
| `replicas`| The number of instances that you want to run this source connector. |
| `maxReplicas`| The maximum number of Pulsar instances that you want to run for this source connector. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the source controller automatically scales the source connector based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `sourceConfig` | The source connector configurations in YAML format. |
| `processingGuarantee` | The processing guarantees (delivery semantics) applied to the source connector. Available values: `atleast_once`, `atmost_once`, `effectively_once`.|
| `forwardSourceMessageProperty` | Configure whether to pass message properties to a target topic. |

## Annotations

In Kubernetes, an annotation defines an unstructured Key Value Map (KVM) that can be set by external tools to store and retrieve metadata. `annotations` must be a map of string keys and string values. Annotation values must pass Kubernetes annotations validation. For details, see [Kubernetes documentation on Annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/#syntax-and-character-set).

This example shows how to use an annotation to make an object unmanaged. Therefore, the Controller will skip reconciling unmanaged objects in reconciliation loop.

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Source
metadata:
  annotations:
    compute.functionmesh.io/managed: "false"
```

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
| `topics` | The output topic of a Pulsar Function (If none is specified, no output is written). | 
| `sinkSerdeClassName` | The map of output topics to SerDe class names (as a JSON string). |
| `sinkSchemaType` | The built-in schema type or custom schema class name to be used for messages sent by the function.|
| `producerConf` | The producer specifications. Available options: <br />- `maxPendingMessages`: the maximum number of pending messages. <br />- `maxPendingMessagesAcrossPartitions`: the maximum number of pending messages across partitions. <br />- `useThreadLocalProducers`: configure whether the producer uses a thread. <br />- `cryptoConfig`: cryptography configurations of the producer. <br />- `batchBuilder`: support key-based batcher. 
| `customSchemaSinks` | The map of output topics to Schema class names (as a JSON string). |

## Resources

When you specify a function or connector, you can optionally specify how much of each resource they need. The resources available to specify are CPU and memory (RAM).

If the node where a Pod is running has enough of a resource available, it's possible (and allowed) for a Pod to use more resources than its `request` for that resource. However, a Pod is not allowed to use more than its resource `limit`.

## Secrets

Function Mesh provides the `secretsMap` field for Function, Source, and Sink in the CRD definition. You can refer to the created secrets under the same namespace and the controller can include those referred secrets. The secrets are provide by `EnvironmentBasedSecretsProvider`, which can be used by `context.getSecret()` in Pulsar functions and connectors.

The `secretsMap` field is defined as a `Map` struct with `String` keys and `SecretReference` values. The key indicates the environment value in the container, and the `SecretReference` is defined as below.

| Field | Description |
| --- | --- |
| `path` | The name of the secret in the Pod's namespace to select from. |
| `key` | The key of the secret to select from. It must be a valid secret key.|

Suppose that there is a Kubernetes Secret named `credential-secret` defined as below:

```yaml
apiVersion: v1
data:
  username: foo
  password: bar
kind: Secret
metadata:
  name: credential-secret
type: Opaque
```

To use it in Pulsar Functions in a secure way, you can define the `secretsMap` in the Custom Resource:

```yaml
secretsMap:
  username:
    path: credential-secret
    key: username
  password:
    path: credential-secret
    key: password
```

Then, in the Pulsar Functions and Connectors, you can call `context.getSecret("username")` to get the secret value (`foo`).

## Authentication

Function Mesh provides the `tlsConfig`, `tlsSecret`, and `authSecret` fields for Function, Source, and Sink in the CRD definition. You can configure TLS encryption and/or TLS authentication using the following configurations.

> **Note**
> 
> The TLS configurations and TLS Secret configurations are exclusive. If you configure TLS configurations, TLS Secret configurations will not take effect.

- TLS configurations

    | Field                  | Description                    |
    |------------------------|--------------------------------|
    | `allowInsecure`        | Allow insecure TLS connection. |
    | `certSecretKey`        | The Secret key.                |
    | `certSecretName`       | The Secret name.               |
    | `enabled`              | Enable TLS configurations.     |
    | `hostnameVerification` | Enable hostname verification.  |

- TLS Secret

    | Field | Description |
    | --- | --- |
    | `tlsAllowInsecureConnection` | Allow insecure TLS connection. By default, it is set to `false`.|
    | `tlsHostnameVerificationEnable` | Enable hostname verification. By default, it is set to `true`. |
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

<table>
<thead>
  <tr>
    <th>Field</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><code>labels</code></td>
    <td>Specify labels attached to a Pod.</td>
  </tr>
  <tr>
    <td><code>nodeSelector</code></td>
    <td>Specify a map of key-value pairs. For a Pod running on a node, the node must have each of the indicated key-value pairs as labels.</td>
  </tr>
  <tr>
    <td><code>affinity</code></td>
    <td>Specify the scheduling constraints of a Pod.</td>
  </tr>
  <tr>
    <td><code>tolerations</code></td>
    <td>Specify the tolerations of a Pod.</td>
  </tr>
  <tr>
    <td><code>annotations</code></td>
    <td>Specify the annotations attached to a Pod.</td>
  </tr>
  <tr>
    <td><code>securityContext</code></td>
    <td>Specify the security context for a Pod.</td>
  </tr>
  <tr>
    <td><code>terminationGracePeriodSeconds</code></td>
    <td>The amount of time that Kubernetes gives for a Pod before terminating it.</td>
  </tr>
  <tr>
    <td><code>volumes</code></td>
    <td>A list of volumes that can be mounted by containers belonging to a Pod.</td>
  </tr>
  <tr>
    <td><code>imagePullSecrets</code></td>
    <td>An optional list of references to secrets in the same namespace for pulling any of the images used by a Pod.</td>
  </tr>
  <tr>
    <td><code>serviceAccountName</code></td>
    <td>Specify the name of the service account that is used to run Pulsar Functions or connectors in the Function Mesh Worker service.</td>
  </tr>
  <tr>
    <td><code>initContainers</code></td>
    <td>The initialization containers belonging to a Pod. A typical use case could be using an initialization container to download a remote JAR to a local path.</td>
  </tr>
  <tr>
    <td><code>sidecars</code></td>
    <td>Sidecar containers run together with the main function container in a Pod.</td>
  </tr>
  <tr>
    <td><code>builtinAutoscaler</code></td>
    <td>Specify the built-in autoscaling rules. <ul> <li> CPU-based autoscaling: auto-scale the number of Pods based on the CPU usage (80%, 50%, or 20%). </li> <li> Memory-based autoscaling: auto-scale the number of Pods based on the memory usage (80%, 50%, or 20%). </li> </ul> <p>If you configure the <code>builtinAutoscaler</code> field, you do not need to configure the <code>autoScalingMetrics</code> and <code>autoScalingBehavior</code> options and vice versa.</p></td>
  </tr>
  <tr>
    <td><code>autoScalingMetrics</code></td>
    <td>Specify how to scale based on customized metrics defined in connectors. For details, see <a herf="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#metricspec-v2beta2-autoscaling">MetricSpec v2beta2 autoscaling</a>.</td>
  </tr>
  <tr>
    <td><code>autoScalingBehavior</code></td>
    <td>Configure the scaling behavior of the target in both up and down directions (<code>scaleUp</code> and <code>scaleDown</code> fields respectively). If not specified, the default Kubernetes scaling behaviors are adopted. For details, see <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#horizontalpodautoscalerbehavior-v2beta2-autoscaling">HorizontalPodAutoscalerBehavior v2beta2 autoscaling</a>. </td>
  </tr>
  <tr>
    <td><code>env</code></td>
    <td>Specify the environment variables to expose on the containers. It is a key/value map. You can either use the <code>value</code> option to specify a particular value for the environment variable or use the <code>valueFrom</code> option to specify the <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#envvarsource-v1-core/">source</a> for the environment variable's value, as shown below.

    ```yaml
    env:
    - name: example1
      value: simpleValue
    - name: example2
      valueFrom:
        secretKeyRef:
          name: secret-name
          key: akey
    ```

  </td>
  </tr>
</tbody>
</table>