---
title: Pulsar Function CRD configurations
category: reference
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
| `replicas`| The number of instances that you want to run for a function. If it is set to `0`, it means to stop the function. When HPA is enabled, you cannot set the `replicas` parameter to `0` or a negative number. |
| `ShowPreciseParallelism` | Configure whether to show the precise parallelism. If it is set to `true`, the `Parallelism` is equal to value of the `replicas` parameter. In this situation, when you update the value of the `replicas` parameter, it will cause all Pods to be recreated. By default, it is set to `false`.|
| `minReplicas`| The minimum number of instances that you want to run for a function. If it is set to `0`, it means to stop the function. By default, it is set to `1`. When HPA auto-scaling is enabled, the HPA controller scales the Pods up / down based on the values of the `minReplicas` and `maxReplicas` options. The number of the Pods should be greater than the value of the `minReplicas` and be smaller than the value of the `maxReplicas`.  |
| `downloaderImage` | The image of the [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) that is used to download a package from Pulsar if the [download path](#packages) is specified. By default, the `downloaderImage` is an [official pulsarctl image](https://hub.docker.com/r/streamnative/pulsarctl). |
| `cleanupImage` | The image that is used to remove the subscriptions created or used by a function when the function is deleted. If no clean-up image is set, the runner image will be used. |
| `maxReplicas`| The maximum number of instances that you want to run for this Pulsar function. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the Functions controller automatically scales the Pulsar Functions based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `timeout` | The message timeout in milliseconds. |
| `deadLetterTopic` | The topic where all messages that were not processed successfully are sent. This parameter is not supported in Python Functions. |
| `funcConfig` | Pulsar Functions configurations in YAML format. |
| `logTopic` | If it is configured, Function Mesh will produce logs of the function to this log topic. Otherwise, you can only view the printed logs for the Pod.  |
| `logTopicAgent` | The log agent that reads the logs and sends them to the Pulsar log topic (`logTopic`). Available options are `runtime` and `sidecar`.  <br /> - `runtime`: when you set the `logTopic` option, Function Mesh will send the predefined logs of the function to the Pulsar log topic (`logTopic`). <br /> - `runtime`: when you set the `logTopic` option, Function Mesh will send all logs of the pod to the Pulsar log topic (`logTopic`) through the [Pulsar Beat output plugin](https://docs.streamnative.io/hub/logging-pulsar-beat-output-master.undefined). |
| `filebeatImage` | The Docker image that is used to run [Filebeat](https://www.elastic.co/beats/filebeat), which is used to send logs of the pod to the Pulsar log topic when you use a `sidecar` log agent. |
| `autoAck` (Deprecated) | Whether or not the framework acknowledges messages automatically. This field is required. You can set it to `true` or `false`.|
| `maxMessageRetry` | How many times to process a message before giving up. |
| `processingGuarantee` | The processing guarantees (delivery semantics) applied to the function. Available values: `atleast_once`, `atmost_once`, `effectively_once`, and `manual`. When you set `ProcessingGuarantees` to `effectively_once`, the runtime will set the subscription type to `FAILOVER`. By default, the subscription type is set to `SHARED`. The `manual` option is only available for the runner image v2.11.0 or above.|
| `forwardSourceMessageProperty` | Configure whether to pass message properties to a target topic. |
| `retainOrdering` | The function consumes and processes messages in order. When you set `retainOrdering`, the runtime will set the subscription type to `FAILOVER`. By default, the subscription type is set to `SHARED`. |
| `retainKeyOrdering`| Configure whether to retain the key order of messages. When you set `retainKeyOrdering`, the runtime will set the subscription type to `KEY_SHARED`. By default, the subscription type is set to `SHARED`.  |
| `subscriptionName` | Pulsar Functions’ subscription name if you want a specific subscription-name for the input-topic consumer. |
| `cleanupSubscription` | Configure whether to clean up subscriptions that are created or used by a function when the function is deleted. |
| `subscriptionPosition` | The subscription position. |
| `pulsar` | The configurations about the Pulsar cluster. For details, see [messaging](#messaging). |
| `VolumeClaimTemplates` | A list of claims that a Pod is allowed to reference. It provides stable storage using [PersistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) provisioned by a PersistentVolume Provisioner. This property is specified at the first time when you create the function and it cannot be modified when you update the resource. |
| `persistentVolumeClaimRetentionPolicy` | Configure whether and how PVCs are deleted during the lifecycle of a StatefulSet. Available options are `whenDeleted` and `whenScaled`. <br />- `whenDeleted`: configure the volume retention behavior that applies when the StatefulSet is deleted. <br />- `whenScaled`: configure the volume retention behavior that applies when the replica count of the StatefulSet is deleted. |

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

### Runner images

Function Mesh uses runner images as images of Pulsar functions and connectors. Each runner image only contains necessary tool-chains and libraries for specified runtime.

This table lists available Function runtime runner images.

| Type | Description |
| --- | --- |
| Java runner | The Java runner is based on the base runner and contains the Java function instance to run Java functions or connectors. The `streamnative/pulsar-functions-pulsarctl-java-runner`(`streamnative/pulsar-functions-java-runner` will be deprecated) Java runner is stored at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-pulsarctl-java-runner) and is automatically updated to align with Apache Pulsar release.
| Python runner | The Python runner is based on the base runner and contains the Python function instance to run Python functions. You can build your own Python runner to customize Python dependencies. The `streamnative/pulsar-functions-pulsarctl-python-runner`(`streamnative/pulsar-functions-python-runner` will be deprecated) Python runner is located at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-pulsarctl-python-runner) and is automatically updated to align with Apache Pulsar release.
| Golang runner | The Golang runner provides all the tool-chains and dependencies required to run Golang functions. The `streamnative/pulsar-functions-pulsarctl-go-runner`(`streamnative/pulsar-functions-go-runner` will be deprecated) Golang runner is located at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-pulsarctl-go-runner) and is automatically updated to align with Apache Pulsar release.
| Generic Python Runnner | A python function runner built on top of the generic base runner image. It is hosted [here](https://hub.docker.com/r/streamnative/pulsar-functions-generic-python-runner).
| Generic Node Runner | A node function runner built on top of the generic base runner image. It is hosted [here](https://hub.docker.com/r/streamnative/pulsar-functions-generic-node-runner).
| Generic base runner | If you do not want to build your function on a specific version of Pulsar this base image is available for use. It is hosted [here](https://hub.docker.com/r/streamnative/pulsar-functions-generic-base-runner).

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
    <td>The authentication configurations of the Pulsar cluster. Currently, you can only configure generic authentication or <a href="https://oauth.net/">OAuth2 authentication</a> through this field. For other authentication methods, you can configure them using the <code>authSecret</code> field. <p><b>Generic authentication</b></p>
    <ul>
      <li><code>clientAuthenticationParameters</code>: specify the client authentication parameters.</li>
      <li><code>clientAuthenticationPlugin</code>: specify the client authentication plugin.</li>
    </ul>
    <p><b>OAuth2 authentication</b></p>
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
    <td><code>cleanupAuthConfig</code></td>
    <td>The authentication configurations for removing subscriptions and intermediate topics. You can configure generic authentication or <a href="https://oauth.net/">OAuth2 authentication</a> through this field. If not provided, the `authConfig` will be used. <p><b>Generic authentication</b></p>
    <ul>
      <li><code>clientAuthenticationParameters</code>: specify the client authentication parameters.</li>
      <li><code>clientAuthenticationPlugin</code>: specify the client authentication plugin.</li>
    </ul>
    <p><b>OAuth2 authentication</b></p>
      <ul>
        <li><code>audience</code>: specify the OAuth2 resource server identifier.</li>
        <li><code>issuerUrl</code>: specify the URL of the OAuth2 identity provider that allows a Pulsar client to obtain an access token.</li>
        <li><code>scope</code>: specify the scope of an access request. For more information, see <a href="https://datatracker.ietf.org/doc/html/rfc6749#section-3.3">access token scope</a>.</li>
        <li><code>keySecretName</code>: specify the name of the Kubernetes Secret.</li>
        <li><code>keySecretKey</code>: specify the key of the Kubernetes Secret that contains the content of the OAuth2 private key.</li>
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
| `producerConf` | The producer specifications. Available options:  <br />- `batchBuilder`: The type of batch construction method. Support the key-based batcher. <br />- `compressionType`: the message data compression type used by a producer. Available options are `LZ4`, `NONE`, `ZLIB`, `ZSTD`, and `SNAPPY`. By default, it is set to `LZ4`. This option is only available for the runner image v3.0.0 or above. <br />- `cryptoConfig`: the cryptography configurations of the producer. <br />- `maxPendingMessages`: the maximum number of pending messages. <br />- `maxPendingMessagesAcrossPartitions`: the maximum number of pending messages across all partitions. <br />- `useThreadLocalProducers`: configure whether the producer uses a thread. |
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

Function Mesh supports running Pulsar Functions in Java, Python, Go and a generic runtime. This table lists fields available for running Pulsar Functions in different languages.

The language fields are nested under each type in the CRD.

For example, a java runtime would nest under a `java` key.

```
java:
  extraDependenciesDir: /pulsar/lib
  jar: /tmp/api-examples.jar
  jarLocation: function://public/default/test
  log:
    javaLog4JConfigFileType: yaml
    logConfig:
      key: log4j2-function.yaml
      name: new-metrics-test-broker-log4j-config
```

The key for the generic runtime is `genericRuntime`.

| Field | Description |
| --- | --- |
| `jarLocation` | The path to the JAR file for the function. It is only available for Pulsar functions written in Java. |
| `javaOpts` | It specifies JVM options to better configure JVM behaviors, including `exitOnOOMError`, Garbage Collection logs, Garbage Collection tuning, and so on. |
| `goLocation` | The path to the JAR file for the function. It is only available for Pulsar functions written in Go.|
| `pyLocation` | The path to the JAR file for the function. It is only available for Pulsar functions written in Python.|
| `extraDependenciesDir` | It specifies the dependent directory for the JAR package. |
| `functionFile` | This is the location of the executable to run. |
| `functionFileLocation` | The location on the filesystem where the function is at. |
| `language` | The programming language used for the function. Currently supports `nodejs`, `python`, `executable`, and `wasm`. |

## Runtime logs

Runtime logs include all logs generated by your pods. These logs provide information about the output of your functions. Function Mesh provides the following fields for the runtime logs in the CRD definition.

| Field | Description |
| --- | --- |
| `level` | The log level. Available options are `off`, `trace`, `debug`, `warn`, `error`, `fatal`, `all`, and `panic`. For details about each log level, see [log levels](#log-levels).
| `rotatePolicy`| The log rotation policy. Available options are `TimedPolicyWithDaily`, `TimedPolicyWithWeekly`, `TimedPolicyWithMonthly`, `SizedPolicyWith10MB`, and `SizedPolicyWith100MB`. For details, see [log rotation policies](#log-rotation-policies).
| `format` | The log format that defines how the content of a log file should be interpreted. Available options are `json` and `text`. The log format configurations are only available for the Java and Python runtimes. |
| `logConfig`| A key-name format option used to reference to a custom log configuration file. |
| `javaLog4JConfigFileType` | The Log4j configuration file type. Available options are `yaml` and `xml`. By default, it is set to `xml`. This option is only available for the Java runtime. |

### Log levels

By default, the log level for Pulsar functions is `info`. Function Mesh supports setting multiple log levels for Pulsar functions.

> **Notes**
>
> The log levels are only available for the Go runtime 2.11 or higher.

| Critical | Description | Java runtime | Python runtime | Go runtime |
|---|---|---|---|---|
| `off` | Nothing will be logged. | ✔ | ✗ | ✗ |
| `trace` | The logs that contain the most detailed messages.  | ✔ | ✗ |  ✔ |
| `debug` | The logs that are used for interactive investigation during development. These logs primarily contain information useful for debugging and have no long-term value. | ✔ | ✔ |  ✔ |
| `warn` | The logs that highlight an abnormal or unexpected event in the function, but do not cause the function to stop. | ✔ | ✔ |  ✔ |
| `error` | The logs that highlight when the function is stopped due to a failure. These indicate a failure in the current activity, not an application-wide failure. | ✔ | ✔ |  ✔ |
| `fatal` | The logs that contain fatal errors. It indicates that the function is unusable. | ✔ | ✔ |  ✔ |
| `all` | All events are logged. | ✔ | ✗ | ✗ |
| `panic` | It indicates the function is in panic. | ✗ | ✗ | ✔ |

For details about how to set log levels and produce logs for Pulsar functions, see [produce function logs](/functions/produce-function-log.md).

### Log rotation policies

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
> To enable health checks, you need to create a [PVC](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim) and a [PV](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume), and bind the PVC to the PV.

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
  logTopic: persistent://public/default/logging-function-logs
  pod:
    liveness:
      failureThreshold:              # --- [1]
      initialDelaySeconds: 10        # --- [2]
      periodSeconds: 10              # --- [3]
      successThreshold: 1            # --- [4]

...
# Other configs
```

- [1] `failureThreshold`: specify the times to restart a failed probe before giving up the probe. By default, it is set to `3`.
- [2] `initialDelaySeconds`: specify the time that should wait before performing the first liveness probe.
- [3] `periodSeconds`: specify the frequency to perform a liveness probe.
- [4] `successThreshold`: specify the minimum consecutive successes for the probe to be considered successful after having failed. By default, it is set to `1`.

For more information about probe types, probe check mechanisms, and probe parameters, see Kubernetes documentation on [Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle) and [configure probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).

## Security context

A security context defines privilege and access control settings for a Pod. By default, Function Mesh uses the following `PodSecurityContext` as the default value and applies to every function's Pod.

```yaml
podSecurityContext:
     fsGroup: 10001
     runAsGroup: 10001
     runAsNonRoot: false
     runAsUser: 10000
     seccompProfile:
          type: "RuntimeDefault"
```

Apart from the `PodSecurityContext`, Function Mesh also applies the following `SecurityContext` to the Function's container to ensure the [Pod Security Standard](https://kubernetes.io/docs/concepts/security/pod-security-standards/) follows the restricted specification.

```yaml
SecurityContext:
     capabilities:
          drop:
               - ALL
      allowPrivilegeEscalation: false
```

| Field | Description |
| --- | --- |
| `fsGroup` | A special supplemental group that applies to all containers in a Pod. |
| `fsGroupChangePolicy` | Define the behavior of changing ownership and permission of the volume before being exposed inside a Pod. This field only applies to volume types that support `fsGroup`-based ownership and permissions. |
| `runAsGroup`| The Group ID (GID) that is used to run the entry point of the container process. If it is unset, the runtime is used. |
| `runAsNonRoot`| Indicate that the container must run as a non-root user. If it is set to `true`, the system will validate the image at runtime to ensure that it does not run as a root user (User ID 0) and fail to start the container if it does. If it is unset or is set to `false`, no such validation will be performed.|
| `runAsUser` | The User ID (UID) that is used to run the entry point of the container process. |
| `seLinuxOptions` | The SELinux context that is applied to a container. |
| `seccompProfile` | The seccomp options that is used by a container. |
| `supplementalGroups` | A list of groups that is applied to the first process running in each container, in addition to the container's primary GID, the `fsGroup` (if specified), and group memberships defined in the container image for the UID of the container process. |
| `sysctls` | Sysctls hold a list of namespaced sysctls used for the Pod. |
| `windowsOptions` | The windows-specific settings that are applied to all containers. |
| `allowPrivilegeEscalation` | Control whether a process can gain more privileges than its parent process. |
| `capabilities` | The capabilities to add/drop when running a container. |
| `privileged` | Run the container in privileged or unprivileged mode. |
| `procMount` | The type of proc mount that is used by a container. |
| `readOnlyRootFilesystem`| Mount the container's root filesystem as read-only. |

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
    <td>Specify the security context for a Pod. For details, see [security context](#security-context).</td>
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
