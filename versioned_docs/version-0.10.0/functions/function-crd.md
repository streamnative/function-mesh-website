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
| `name` | The function name is a string of up to `43` characters. |
| `classname` | The class name of a Pulsar Function. |
| `tenant` | The tenant of a Pulsar Function. |
| `namespace` | The Pulsar namespace of a Pulsar Function. |
| `clusterName` | The Pulsar cluster of a Pulsar Function. |
| `replicas`| The number of instances that you want to run this Pulsar Function. If no value is set, the system will set it to `1`. |
| `minReplicas`| The minimum number of instances that you want to run for this Pulsar function. If no value is set, the system will set it to `1`. When HPA auto-scaling is enabled, the HPA controller scales the Pods up / down based on the values of the `minReplicas` and `maxReplicas` options. The number of the Pods should be greater than the value of the `minReplicas` and be smaller than the value of the `maxReplicas`.  |
| `downloaderImage` | The image of the [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) that is used to download a package from Pulsar if the [download path](#packages) is specified. By default, the `downloaderImage` is an [official pulsarctl image](https://hub.docker.com/r/streamnative/pulsarctl). |
| `maxReplicas`| The maximum number of instances that you want to run for this Pulsar function. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the Functions controller automatically scales the Pulsar Functions based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
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
| `pulsar` | The configurations of the Pulsar cluster. For details, see [messaging](#messaging). |

## Annotations

In Kubernetes, an annotation defines an unstructured Key Value Map (KVM) that can be set by external tools to store and retrieve metadata. `annotations` must be a map of string keys and string values. Annotation values must pass Kubernetes annotations validation. For details, see [Kubernetes documentation on Annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/#syntax-and-character-set).

This example shows how to use an annotation to make an object unmanaged. Therefore, the Controller will skip reconciling unmanaged objects in reconciliation loop.

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  annotations:
    compute.functionmesh.io/managed: "false"
```

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

## Image pull policies

When the Function Mesh Operator creates a container, it uses the `imagePullPolicy` option to determine whether the image should be pulled prior to starting the container. There are three possible values for the `imagePullPolicy` option:

| Field          | Description                                                      |
|----------------|------------------------------------------------------------------|
| `Always`       | Always pull the image.                                           |
| `Never`        | Never pull the image.                                            |
| `IfNotPresent` | Only pull the image if the image does not already exist locally. |

## Messaging

Function Mesh provides Pulsar cluster configurations in the Function, Source, and Sink CRDs. You can configure TLS encryption, TLS authentication, and OAuth2 authentication using the following configurations.

> **Note**
> 
> The `tlsConfig` and `tlsSecret` are exclusive. If you configure TLS configurations, the TLS Secret will not take effect.

<table>
  <tr>
    <th>Field</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>authConfig</code></td>
    <td>The authentication configurations of the Pulsar cluster. Currently, you can only configure <a href="https://oauth.net/">OAuth2 authentication</a> through this field. For other authentication methods, you can configure them using the <code>authSecret</code> field. 
      <ul>
        <li><code>audience</code>: specify the OAuth2 resource server identifier for the Pulsar cluster.</li>
        <li><code>issuerUrl</code>: specify the URL of the OAuth2 identity provider that allows a Pulsar client to obtain an access token.</li>
        <li><code>scope</code>: specify the scope of an access request. For more information, see <a href="https://datatracker.ietf.org/doc/html/rfc6749#section-3.3">access token scope</a>.</li>
        <li><code>keySecretName</code>: specify the name of the Kubernetes Secret.</li>
        <li><code>keySecretKey</code>: specify the key of the Kubernetes Secret that contains the content of the OAuth2 private key.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>authSecret</code></td>
    <td>The name of the authentication <a herf="https://kubernetes.io/docs/concepts/configuration/configmap/">ConfigMap</a> that stores authentication configurations of the Pulsar cluster.
      <ul>
        <li><code>clientAuthenticationPlugin</code>: specify the client authentication plugin.</li>
        <li><code>clientAuthenticationParameters</code>: specify the client authentication parameters.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>pulsarConfig</code></td>
    <td>The name of the <a herf="https://kubernetes.io/docs/concepts/configuration/configmap/">ConfigMap</a> that stores Pulsar cluster configurations.
      <ul>
        <li><code>webServiceURL</code>: specify the web service URL for managing the Pulsar cluster. This URL should be a standard DNS name.  </li>
        <li><code>brokerServiceURL</code>: specify the Pulsar protocol URL for interaction with the brokers in the Pulsar cluster. This URL should not use the same DNS name as the web service URL but should use the <code>pulsar</code> scheme. </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>tlsConfig</code></td>
    <td>The TLS configurations of the Pulsar cluster.
      <ul>
        <li><code>allowInsecure</code>: allow insecure TLS connection. </li>
        <li><code>certSecretKey</code>: specify the TLS Secret key. </li>
        <li><code>certSecretName</code>: specify the TLS Secret name. </li>
        <li><code>enabled</code>: enable TLS configurations. </li>
        <li><code>hostnameVerification</code>: enable hostname verification.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>tlsSecret</code></td>
    <td>The name of the TLS <a herf="https://kubernetes.io/docs/concepts/configuration/configmap/">ConfigMap</a> that stores TLS configurations of the Pulsar cluster.
      <ul>
        <li><code>tlsAllowInsecureConnection</code>: allow insecure TLS connection. By default, it is set to <code>false</code>.</li>
        <li><code>tlsHostnameVerificationEnable</code>: enable hostname verification. By default, it is set to <code>true</code>.</li>
        <li><code>tlsTrustCertsFilePath</code>: specify the path of the TLS trust certificate file. </li>
      </ul>
    </td>
  </tr>
</table>

## State storage

Function Mesh provides the following fields for Stateful functions in the CRD definition.

| Field | Description |
|  ---|  --- |
| `statefulConfig` | The state storage configuration for the Stateful Functions. |
| `statefulConfig.pulsar.serviceUrl` | The service URL that points to the state storage service. By default, the state storage service is the BookKeeper table service. |
| `statefulConfig.pulsar.javaProvider` | (Optional) If you want to overwrite the default configuration, you can use the state storage configuration for the Java runtime. For example, you can change it to other backend services other than the BookKeeper table service. |
| `statefulConfig.pulsar.javaProvider.className` | The Java class name of the state storage provider implementation. The class must implement the `org.apache.pulsar.functions.instance.state.StateStoreProvider` interface. If not, `org.apache.pulsar.functions.instance.state.BKStateStoreProviderImpl` will be used. |
| `statefulConfig.pulsar.javaProvider.config` | The configurations that are passed to the state storage provider. |

## Window function configurations

Function Mesh provides the following fields for window functions in the CRD definition.

| Field                           | Description                                                                                                                                                                 |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `actualWindowFunctionClassName` | Optional. The runner class name of the implemented window function. By default, the value is the same as the `spec.className`.                                              |
| `lateDataTopic`                 | Optional. The late data topic for the late tuple messages. The late data topic must be defined when specifying a timestamp extractor class (`timestampExtractorClassName`). |
| `maxLagMs`                      | Optional. The maximum lag duration (in milliseconds) of the window function. By default, it is set to 0.                                                                    |
| `slidingIntervalCount`          | Optional. The number of messages before the window slides.                                                                                                             |
| `slidingIntervalDurationMs`     | Optional. The time duration (in milliseconds) after which the window slides.                                                                                                |
| `timestampExtractorClassName`   | Optional. The timestamp extractor class name.  It should be set to `org.apache.pulsar.functions.windowing.TimestampExtractor`.                                              |
| `watermarkEmitIntervalMs`       | Optional. The watermark interval (in milliseconds) of the window function.  By default, it is set to 1000 ms.                                                               |
| `windowLengthCount`             | Optional. The number of messages per window.                                                                                                                                |
| `windowLengthDurationMs`        | Optional. The time duration (in milliseconds) of the window.                                                                                                                |

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

## Packages

Function Mesh supports running Pulsar Functions in Java, Python and Go. This table lists fields available for running Pulsar Functions in different languages.

| Field | Description |
| --- | --- |
| `jarLocation` | The path to the JAR file for the function. It is only available for Pulsar functions written in Java. |
| `javaOpts` | It specifies JVM options to better configure JVM behaviors, including `exitOnOOMError`, Garbage Collection logs, Garbage Collection tuning, and so on. |
| `goLocation` | The path to the JAR file for the function. It is only available for Pulsar functions written in Go.|
| `pyLocation` | The path to the JAR file for the function. It is only available for Pulsar functions written in Python.|
| `extraDependenciesDir` | It specifies the dependent directory for the JAR package. |

## Log levels

By default, the log level for Pulsar functions is `info`. Function Mesh supports setting multiple log levels for Pulsar functions.

> **Notes**
>
> The log levels are only available for the Go runtime 2.11 or higher.

| Critical | Description | Java runtime | Python runtime | Go runtime |
|---|---|---|---|---|
| `off` | Nothing will be logged. | ✔ | ✗ | ✗ |
| `trace` | The logs that contain the most detailed messages.  | ✔ | ✔ |  ✔ |
| `debug` | The logs that are used for interactive investigation during development. These logs primarily contain information useful for debugging and have no long-term value. | ✔ | ✔ |  ✔ |
| `warn` | The logs that highlight an abnormal or unexpected event in the function, but do not cause the function to stop. | ✔ | ✔ |  ✔ |
| `error` | The logs that highlight when the function is stopped due to a failure. These indicate a failure in the current activity, not an application-wide failure. | ✔ | ✔ |  ✔ |
| `fatal` | The logs that contain fatal errors. It indicates that the function is unusable. | ✔ | ✔ |  ✔ |
| `all` | All events are logged. | ✔ | ✗ | ✗ |
| `panic` | It indicates the function is in panic. | ✗ | ✗ | ✔ |

For details about how to set log levels and produce logs for Pulsar functions, see [produce function logs](/functions/produce-function-log.md).

## Log rotation policies

With more and more logs being written to the log file, the log file grows in size. Therefore, Function Mesh supports log rotation to avoid large files that could create issues when opening them. You can set the log rotation policies based on the time or the log file size.

| Field | Description |
| --- | --- |
| `TimedPolicyWithDaily` | Rotate the log file daily.   |
| `TimedPolicyWithWeekly` | Rotate the log file weekly.   |
| `TimedPolicyWithMonthly` | Rotate the log file monthly. |
| `SizedPolicyWith10MB` | Rotate the log file at every 10 MB. |
| `SizedPolicyWith50MB` | Rotate the log file at every 50 MB.  |
| `SizedPolicyWith100MB` | Rotate the log file at every 100 MB.  |

For details about how to set a log rotation policy, see [set log rotation policies](/functions/produce-function-log.md#set-log-rotation-policies).

## Cluster location

In Function Mesh, the Pulsar cluster is defined through a ConfigMap. Pods can consume ConfigMaps as environment variables in a volume. The Pulsar cluster ConfigMap defines the Pulsar cluster URLs.

| Field | Description |
| --- | --- |
| `webServiceURL` | The Web service URL of the Pulsar cluster. |
| `brokerServiceURL` | The broker service URL of the Pulsar cluster. |

## Health checks

> **Note**
>
> To enable health checks, you need to create a [PVC](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim) and a [PV](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume), and bind the PVC to the PV. Then, you can use the `--set controllerManager.grpcurlPersistentVolumeClaim=<your_pvc_name>` option to specify the PVC when installing the Function Mesh Operator.

With the Kubernetes [liveness probe](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe), Function Mesh supports monitoring and acting on the state of Pods (Containers) to ensure that only healthy Pods serve traffic. Implementing health checks using probes provides Function Mesh a solid foundation, better reliability, and higher uptime.

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  name: health-check-sample
  namespace: default
spec:
  image: streamnative/pulsar-functions-java-sample:2.9.2.23
  className: org.apache.pulsar.functions.api.examples.ExclamationFunction
  forwardSourceMessageProperty: true
  maxPendingAsyncRequests: 1000
  replicas: 1
  maxReplicas: 5
  liveness:
    initialDelaySeconds: 10        # --- [1]
    periodSeconds: 10              # --- [2]
  logTopic: persistent://public/default/logging-function-logs
... 
# Other configs
```

- `initialDelaySeconds`: specify the time that should wait before performing the first liveness probe.
- `periodSeconds`: specify the frequency to perform a liveness probe.

For more information about probe types, probe check mechanisms, and probe parameters, see Kubernetes documentation on [Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle) and [configure probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).

## Pod specifications

Function Mesh supports customizing the Pod running function instance. This table lists sub-fields available for the `pod` field.

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
    <td><code>liveness</code></td>
    <td>Specify the liveness probe properties for a Pod. <ul> <li> <code>initialDelaySecond</code>: specify the time that should wait before performing the first liveness probe. </li> <li> <code>periodSeconds</code>: specify the frequency to perform a liveness probe.</li> </ul> <p> For details, see <a href="#health-checks">health checks</a>.</p></td>
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
    <td>Specify the name of the service account that is used to run Pulsar Functions or connectors.</td>
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
    <td>Specify how to scale based on customized metrics defined in connectors. For details, see <a herf="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#metricspec-v2-autoscaling">MetricSpec v2 autoscaling</a>.</td>
  </tr>
  <tr>
    <td><code>autoScalingBehavior</code></td>
    <td>Configure the scaling behavior of the target in both up and down directions (<code>scaleUp</code> and <code>scaleDown</code> fields respectively). If not specified, the default Kubernetes scaling behaviors are adopted. For details, see <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#horizontalpodautoscalerbehavior-v2-autoscaling">HorizontalPodAutoscalerBehavior v2 autoscaling</a>. </td>
  </tr>
  <tr>
    <td><code>vpa</code></td>
    <td>Configure the behavior of the Vertical Pod Autoscaling (VPA). It contains two fields: <ul> <li><a href="https://github.com/kubernetes/autoscaler/blob/vertical-pod-autoscaler-0.12.0/vertical-pod-autoscaler/pkg/apis/autoscaling.k8s.io/v1/types.go#L109-L120">updatePolicy</a>: define the policy for updating Pods.</li> <li><a href="https://github.com/kubernetes/autoscaler/blob/vertical-pod-autoscaler-0.12.0/vertical-pod-autoscaler/pkg/apis/autoscaling.k8s.io/v1/types.go#L149-L155">resourcePolicy</a>: define the resource policy for each container. </li> </ul></td>
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
