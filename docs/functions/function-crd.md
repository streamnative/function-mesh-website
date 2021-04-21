---
title: Pulsar Function CRD configurations
category: functions
id: function-crd
---

This document lists CRD configurations available for Pulsar Functions. The CRD configurations for Pulsar Functions consists of Function configurations and common CRD configurations.

## Function configurations

This table lists Pulsar Function configurations.

| Field | Description |
| ---|---|
| `name` | The name of a Pulsar Function. |  
| `classname` | The class name of a Pulsar Function. |
| `tenant` | The tenant of a Pulsar Function. |  
| `namespace` | The namespace of a Pulsar Function. |
| `Replicas`| The number of Pulsar instances that you want to run this Pulsar Functions. |
| `MaxReplicas`| The maximum number of Pulsar instances that you want to run for this Pulsar Functions. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the Functions controller automatically scales the Pulsar Functions based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `Timeout` | The message timeout in milliseconds. |
| `DeadLetterTopic` | The topic where all messages that were not processed successfully are sent. This parameter is not supported in Python Functions. | 
| `FuncConfig` | The map to a ConfigMap specifying the configuration of a Pulsar function. |
| `LogTopic` | The topic to which the logs of a Pulsar Function are produced. |  
| `AutoAck` | Whether or not the framework acknowledges messages automatically. |
| `MaxMessageRetry` | How many times to process a message before giving up. |  
| `ProcessingGuarantee` | The processing guarantees (delivery semantics) applied to the function. Available values: `ATLEAST_ONCE`, `ATMOST_ONCE`, `EFFECTIVELY_ONCE`.| 
| `RetainOrdering` | Function consumes and processes messages in order. |  
| `RetainKeyOrdering`| Configure whether to retain the key order of messages. |
| SubscriptionName | Pulsar Functions’ subscription name if you want a specific subscription-name for the input-topic consumer. |  
| `CleanupSubscription` | Configure whether to clean up subscriptions. |
| `SubscriptionPosition` | The subscription position. |

## Common CRD configurations

This section lists CRD configurations that are common for Pulsar functions, sources, sinks, and Function Mesh.

### Images

This section describes image options available for Pulsar Function, source, sink and Function Mesh CRDs.

#### Base runner

The base runner is an image base for other runners. The base runner is located at `./pulsar-functions-base-runner`. The base runner image contains basic tool-chains like `/pulsar/bin`, `/pulsar/conf` and `/pulsar/lib` to ensure that the `pulsar-admin` CLI tool works properly to support [Apache Pulsar Packages](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

#### Runner images

Function Mesh uses runner images as images of Pulsar functions' and connectors' Pods. Each runner image only contains necessary tool-chains and libraries for specified runtime.

This table lists  available Function runtime runner images.

| Type | Description |
| --- | --- |
| Java runner | The Java runner is based on the base runner and contains the Java function instance to run Java functions or connectors. The `streamnative/pulsar-functions-java-runner` Java runner is stored at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-java-runner) and is automatically updated to align with Apache Pulsar release.
| Python runner | The Python runner is based on the base runner and contains the Python function instance to run Python functions. You can build your own Python runner to customize Python dependencies. The `streamnative/pulsar-functions-python-runner` Python runner is located at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-java-runner) and is automatically updated to align with Apache Pulsar release.
| Golang runner | The Golang runner provides all the tool-chains and dependencies required to run Golang functions. The `streamnative/pulsar-functions-go-runner` Golang runner is located at the [Docker Hub](https://hub.docker.com/r/streamnative/pulsar-functions-java-runner) and is automatically updated to align with Apache Pulsar release.

### Input

> **Note**
>
> This section is not available for the source connector.

The input topics of a Pulsar Function. The following table lists options available for the `Input`.

| Field | Description |
| --- | --- |
| Topics | The configuration of the topic from which messages are fetched. |
| CustomSerdeSources | The map of input topics to SerDe class names (as a JSON string). |
| CustomSchemaSources | The map of input topics to Schema class names (as a JSON string). |
| SourceSpecs | The map of source specifications to consumer specifications. Consumer specifications include these options: <br>- schema-type: the built-in schema type or custom schema class name to be used for messages fetched by the function. <br>- SerdeClassName: the SerDe class to be used for messages fetched by the function. <br>- IsRegexPattern: configure whether the input topic adopts a Regex pattern. <br>- SchemaProperties: the schema properties for messages fetched by the function. <br>- ConsumerProperties: the consumer properties for messages fetched by the function. <br>- ReceiverQueueSize: the size of the consumer receive queue <br> - CryptoConfig: cryptography configurations of the consumer. |

### Output

> **Note**
>
> This section is not available for the sink connector.

The output topics of a Pulsar Function. This table lists options available for the `Output`.

|Name | Description |
| --- | --- |
| `Topics` | The output topic of a Pulsar Function (If none is specified, no output is written). | 
| `SinkSerdeClassName` | The map of output topics to SerDe class names (as a JSON string). |
| `SinkSchemaType` | The built-in schema type or custom schema class name to be used for messages sent by the function.|
| `ProducerConf` | The producer specifications. The producer specifications. Available options: <br>- MaxPendingMessages: the maximum number of pending messages. <br>- MaxPendingMessagesAcrossPartitions: the maximum number of pending messages across partitions. <br>- UseThreadLocalProducers: configure whether the producer uses a thread. <br>- CryptoConfig: cryptography configurations of the producer. <br>- BatchBuilder: support key-based batcher. 
| `CustomSchemaSinks` | The map of output topics to Schema class names (as a JSON string). |
| `output-serde-classname` | The SerDe class to be used for messages output by the function. |

### Resource

When you specify a function or connector, you can optionally specify how much of each resource they need. The resources available to specify are CPU and memory (RAM). This table lists resource configurations. 

If the node where a Pod is running has enough of a resource available, it's possible (and allowed) for a pod to use more resource than its `request` for that resource specifies. However, a pod is not allowed to use more than its resource `limit`.

| Field | Description |
| --- | --- |
| `request` | When you specify the resource `request` for Containers in a Pod, the scheduler uses this information to decide which node to place the Pod on. <br>-CPU: the CPU in cores that need to be allocated per function instance. <br>- Memory: The memory in bytes that need to be allocated per function instance. |
| `limit` | When you specify a resource `limit` for a Container, the kubelet enforces those limits so that the running container is not allowed to use more of that resource than the limit you set. <br>-CPU: the CPU in cores that need to be allocated per function instance. <br>- Memory: The memory in bytes that need to be allocated per function instance. |

### Secrets

In Function Mesh, the secret is defined through a secretsMap. To use a secret, a Pod needs to reference the secret. Pods can consume secretsMaps as environment variables in a volume. You can specify the `data` field when creating a configuration file for a secret. This table lists secret configurations.

To use a secret in an environment variable in a Pod, follow these steps.

Create a secret or use an existing one. Multiple Pods can reference the same secret.
Modify your Pod definition in each container, which you want to consume the value of a secret key, to add an environment variable for each secret key that you want to consume.
Modify your image and/or command line so that the program looks for values in the specified environment variables.

### Packages

Function Mesh supports running Pulsar Functions in Java, Python and Go. This table lists fields available for running Pulsar Functions in different languages.

| Field | Description |
| --- | --- |
| `jarLocation` | Path to the JAR file for the function. It is only available for Pulsar functions written in Java. |
| `goLocation` | Path to the JAR file for the function. It is only available for Pulsar functions written in Go.  |  
| `pyLocation` | Path to the JAR file for the function. It is only available for Pulsar functions written in Python.  |  

### Cluster location

In Function Mesh, the Pulsar cluster is defined through a ConfigMap. Pods can consume ConfigMaps as environment variables in a volume. The Pulsar cluster ConfigMap defines the Pulsar cluster URLs.

| Field | Description |
| --- | --- |
| `webServiceURL` | The Web service URL of the Pulsar cluster. |
| `brokerServiceURL` | The broker service URL of the  Pulsar cluster. |

### Pod specifications

Function Mesh supports customizing the pod running function instance. This table lists sub-fields available for the `pod` field.

| Field | Description |
| --- | --- |
| `Labels` | Specify llabels attached to a Pod. |
| `NodeSelector` |  Specify a map of key-value pairs. For a Pod running on a node, the node must have each of the indicated key-value pairs as labels. |
| `Affinity` | Specify the scheduling constraints of a Pod. |
| `Tolerations` | Specify the tolerations of a Pod. |
| `Annotations`| Specify the annotations to attach to a Pod. |
| `SecurityContext` | Specify the security context for a Pod. |
| `TerminationGracePeriodSeconds` | It is the amount of time that Kubernetes gives for a Pod before terminating it. |
| `Volumes` | It is a list of volumes that can be mounted by containers belonging to a Pod. |
| `ImagePullSecrets` | It is an optional list of references to secrets in the same namespace for pulling any of the images used by a Pod. |
| `InitContainers` | Initialization containers belonging to a Pod. A typical use case could be using an init container to download a remote JAR to a local path. |
| `Sidecars` | Sidecar containers run together with the main function container in a Pod. |

