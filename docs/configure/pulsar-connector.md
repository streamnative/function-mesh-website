---
title: Configure Pulsar connectors
category: configure
id: pulsar-connector
---


Pulsar IO connectors consist of source and sink. Sources pass through data from external systems into Pulsar while sinks output data from Pulsar into external systems. Function Mesh supports defining ources and Sinks through the Function CRD.

# Prerequisites

- Create a Kubernetes cluster.
- Create a Pulsar cluster.
- Install FunctionMesh operator and CRD into Kubernetes.
- Set up the external source or sink system to communicate with the Pulsar connector.

# Create source

To create a source, follow these steps.

1. Define a source named `source-sample` by using a YAML file and save the YAML file `source-sample.yaml`.

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
      maxReplicas: 1
      output:
        producerConf:
          maxPendingMessages: 1000
          maxPendingMessagesAcrossPartitions: 50000
          useThreadLocalProducers: true
        topic: persistent://public/default/destination
      resources:
        limits:
          cpu: "0.2"
          memory: 1.1G
        requests:
          cpu: "0.1"
          memory: 1G
      sourceConfig:
        mongodb.hosts: rs0/mongo-dbz-0.mongo.default.svc.cluster.local:27017,rs0/mongo-dbz-1.mongo.default.svc.cluster.local:27017,rs0/mongo-dbz-2.mongo.default.svc.cluster.local:27017
        mongodb.name: dbserver1
        mongodb.user: debezium
        mongodb.password: dbz
        mongodb.task.id: "1"
        database.whitelist: inventory
        pulsar.service.url: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
      pulsar:
        pulsarConfig: "test-source"
      java:
        jar: connectors/pulsar-io-debezium-mongodb-2.7.0-rc-pm-3.nar
        jarLocation: "" # use pulsar provided connectors
        # use package name:
        # jarLocation: function://public/default/nul-test-java-source@v1
      clusterName: test-pulsar
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-source
    data:
      webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
    ```

    For details about fields used for creating the source, see [available fields for source](#available-fields-for-source).

2. Apply the YAML file to create the source.

    ```shell
    kubectl apply -f /path/to/source-sample.yaml
    ```

3. Check whether the source is created successfully.

    ```shell
    kubectl get all
    ```

    **Output**

    ```
    NAME                  READY   STATUS    RESTARTS   AGE
    pod/source-sample-0   1/1     Running   0          2s

    NAME                    TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    service/kubernetes      ClusterIP   10.12.0.1    <none>        443/TCP    2d20h
    service/source-sample   ClusterIP   None         <none>        9093/TCP   3s

    NAME                             READY   AGE
    statefulset.apps/source-sample   1/1     3s

    NAME                                                REFERENCE              TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
    horizontalpodautoscaler.autoscaling/source-sample   Source/source-sample   <unknown>/80%   1         1         0          3s
    ```

# Create sink

To create a sink, follow these steps.

1. Define a sink named `sink-sample` by using a YAML file and save the YAML file `sink-sample.yaml`.

    ```yaml
    apiVersion: cloud.streamnative.io/v1alpha1
    kind: Sink
    metadata:
      name: sink-sample
    spec:
      # Add fields here
      className: org.apache.pulsar.io.elasticsearch.ElasticSearchSink
      sourceType: "[B"
      sinkType: "[B"
      replicas: 1
      maxReplicas: 1
      input:
        topics:
        - persistent://public/default/input
      sinkConfig:
        elasticSearchUrl: "http://quickstart-es-http.default.svc.cluster.local:9200"
        indexName: "my_index"
        typeName: "doc"
        username: "elastic"
        password: "wJ757TmoXEd941kXm07Z2GW3"
      pulsar:
        pulsarConfig: "test-sink"
      resources:
        limits:
          cpu: "0.2"
          memory: 1.1G
        requests:
          cpu: "0.1"
          memory: 1G
      java:
        jar: connectors/pulsar-io-elastic-search-2.7.0-rc-pm-3.nar
        jarLocation: "" # use pulsar provided connectors
        # use package name:
        # jarLocation: function://public/default/nul-test-java-sink@v1
      clusterName: test-pulsar
      autoAck: true
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-sink
    data:
      webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
    ```

    For details about fields used for creating the sink, see [available fields for sink](#available-fields-for-sink).

2. Apply the YAML file to create the sink.

    ```shell
    kubectl apply -f /path/to/sink-sample.yaml
    ```

3. Check whether the sink is created successfully.

    ```shell
    kubectl get all
    ```

    **Output**

    ```
    NAME                READY   STATUS    RESTARTS   AGE
    pod/sink-sample-0   1/1     Running   0          2s

    NAME                  TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    service/kubernetes    ClusterIP   10.12.0.1    <none>        443/TCP    2d20h
    service/sink-sample   ClusterIP   None         <none>        9093/TCP   3s

    NAME                           READY   AGE
    statefulset.apps/sink-sample   1/1     3s

    NAME                                              REFERENCE          TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
    horizontalpodautoscaler.autoscaling/sink-sample   Sink/sink-sample   <unknown>/80%   1         1         0          3s
    ```

# Available fields

This section lists available fields for source and sink.

## Available fields for source

In the `.yaml` file for the source you want to create, you need to set values for the the following fields.

This table lists common fields used in the `.yaml` file, which is used to create the source.

| Field | Description |
| --- | --- |
| `apiVersion` | The API version used to create the object. |
| `kind` | The kind of the object to be created. |
| `metadata` | Data that uniquely identify the object, including the name of the object to be created and a Kubernetes namespace. |
| `spec` | The state desired for the object, including specifications about the source. |

This table lists sub-fields available for the `spec` field.

|Field | Description |
| --- |--- |
| `ClassName`| The class name of the source. |
| `SourceType`| The type of incoming messages. |
| `SinkType`| The type pf the outgoing messages. |
| `Replicas`| The number of Pulsar instances that you want to run this source. |
| `MaxReplicas`| The maximum number of Pulsar instances that you want to run for this source. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the source controller automatically scales the source based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `Output` | The configuration of topic to which messages are sent. |
| `SourceConfig` | The configurations about the source. |
| `Resources` | The resources used by the source, including required and maximum CPU and memory resources. |
| `secretsMap` | Secret configurations. Function Mesh leverages the Kubernetes secret and you can just reference the Kubernetes secret in the source configuration. That would improve the whole security for the source. |
| `ProcessingGuarantee` | The configurations of processing guarantee. |
| `RuntimeFlags` | The Kubernetes Runtime flags. |
| `VolumeMounts` | Pod volumes to mount into the container's filesystem, including the `mountPath` and the `name`. |
| `pod` | A set of fields to be customized based on the user's need. |

This table lists sub-fields available for the `pod` field.

| Field | Description |
| --- | --- |
| `Volumes` | Volumes that can be mounted by containers belonging to the pod. |
| `InitContainers` | Initialization containers belonging to the pod. |
| `Containers` | Containers belonging to the pod. |
| `EphemeralContainers` | Ephemeral containers running in this pod. Ephemeral containers run in an existing pod to perform user-initiated actions such as debugging. |
| `RestartPolicy` | The restart policy for all containers within the pod. |
| `TerminationGracePeriodSeconds` | The duration (in seconds) required to terminate the pod gracefully. The value must be an non-negative integer. If it is set to 0, it indicates terminating the pod immediately. |
| `ActiveDeadlineSeconds` | The duration (in seconds) that the pod is active on the node. The value must be a positive integer. |
| `DNSPolicy` | Set the DNS policy for the pod. Valid values are `ClusterFirstWithHostNet`, `ClusterFirst`, `Default` or `None`. By default, it is set to `ClusterFirst`. |
| `NodeSelector` | The selector which must match a node's labels for the pod to be scheduled on that node. |
| `ServiceAccountName` | The name of the service account used to run this pod. |
| `DeprecatedServiceAccount` | The depreciated alias for the service account. |
| `AutomountServiceAccountToken` | It indicates whether a service account token should be automatically mounted. |
| `NodeName` | The request to schedule the pod onto a specific node. |
| `HostNetwork` | The host networking required for this pod. |
| `HostPID` | Configure whether to use the PID namespace of the host. By default, it is set to `false`.|
| `HostIPC` | Configure whether to use the PIC namespace of the host. By default, it is set to `false`. |
| `ShareProcessNamespace` | Configure whether to share a single process namespace between all of the containers in a pod. |
| `SecurityContext` | The `SecurityContext` holds pod-level security attributes and common container settings. |
| `ImagePullSecrets` | It is a list of references to secrets in the same namespace for pulling any of the images used by this pod. If specified, these secrets are passed to individual puller implementations for them to use. |
| `Hostname` | The hostname of the pod. |
| `Subdomain` | If specified, the fully qualified pod is in a format of "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>". Otherwise, the pod does not have a domain name at all. |
| `Affinity` | If specified, the pod's scheduling constraints. |
| `SchedulerName` | If specified, the pod is dispatched by a specified scheduler. Otherwise, the pod is dispatched by the default scheduler. |
| `Tolerations` | Allow (but do not require) the pods to schedule onto nodes with matching taints. |
| `HostAliases` | Hosts and IPs that are injected into the pod's hosts file. This is only valid for non-`hostNetwork` pods. |
| `PriorityClassName`| It indicates the pod's priority. |
| `Priority` | The priority value. The higher the value, the higher the priority. |
| `DNSConfig` | Specify the DNS parameters of a pod. |
| `ReadinessGates` | If specified, all readiness gates are evaluated for pod readiness. |
| `RuntimeClassName` | It is a `RuntimeClass` object in the `node.k8s.io` group, which is used to run this pod. If no `RuntimeClass` resource matches the named class, the pod does not run. If it is unset or empty, the "legacy" `RuntimeClass` is used, which is an implicit class with an empty definition that uses the default runtime handler.|
| `EnableServiceLinks` | Configure whether to inject information about services into the pod's environment variables. By default, it is set to `true`. |
| `PreemptionPolicy` | The Policy for preempting pods with lower priority. Valid values are `Never` or `PreemptLowerPriority`. By default, it is set to `PreemptLowerPriority`. |
| `Overhead` | The resource overhead associated with running a pod for a given `RuntimeClass`.|
| `TopologySpreadConstraints` | It describes how a group of pods spread across topology domains. |

## Available fields for sink

In the `.yaml` file for the sink you want to create, you need to set values for the the following fields:

This table lists common fields used in the `.yaml` file, which is used to create the sink.

| Field | Description |
| --- | --- |
| `apiVersion` | The API version used to create the object. |
| `kind` | The kind of the object to be created. |
| `metadata` | Data that uniquely identify the object, including the name of the object to be created and a Kubernetes namespace. |
| `spec` | The state desired for the object, including specifications about the sink. |

This table lists sub-fields available for the `spec` field.

|Field | Description |
| --- |--- |
| `ClassName`| The class name of the sink. |
| `SourceType`| The type of incoming messages. |
| `SinkType`| The type pf the outgoing messages. |
| `Replicas`| The number of Pulsar instances that you want to run this sink. |
| `MaxReplicas`| The maximum number of Pulsar instances that you want to run for this sink. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the sink controller automatically scales the sink based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `Input` | The configuration of topic from which messages are fetched. |
| `SinkConfig` | The configurations about the sink. |
| `Resources` | The resources used by the sink, including required and maximum CPU and memory resources. |
| `secretsMap` | Secret configurations. Function Mesh leverages the Kubernetes secret and you can just reference the Kubernetes secret in the sink configuration. That would improve the whole security for the sink. |
| `Timeout` | The time out of the request. |
| `NegativeAckRedeliveryDelayMs` | The number of redelivered messages due to negative acknowledgement. |
| `autoAck` | Enable or disable automatic acknowledgement. |
| `MaxMessageRetry` | The maximum of retries for each message. |
| `ProcessingGuarantee` | The configurations of processing guarantee. |
| `RetainOrdering` | Configure whether to retain ordering when moving data from Pulsar to external systems. |
| `RetainKeyOrdering`| Configure whether to retain the key order of messages. |
| `DeadLetterTopic`| The dead letter topic. |
| `RuntimeFlags` | The Kubernetes Runtime flags. |
| `SubscriptionName` | The subscription name. |
| `CleanupSubscription` | Configure whether to clean up subscriptions. |
| `SubscriptionPosition` | The subscription position. |
| `pod` | A set of fields to be customized based on the user's need. |

This table lists sub-fields available for the `pod` field.

| Field | Description |
| --- | --- |
| `Volumes` | Volumes that can be mounted by containers belonging to the pod. |
| `InitContainers` | Initialization containers belonging to the pod. |
| `Containers` | Containers belonging to the pod. |
| `EphemeralContainers` | Ephemeral containers running in this pod. Ephemeral containers run in an existing pod to perform user-initiated actions such as debugging. |
| `RestartPolicy` | The restart policy for all containers within the pod. |
| `TerminationGracePeriodSeconds` | The duration (in seconds) required to terminate the pod gracefully. The value must be an non-negative integer. If it is set to 0, it indicates terminating the pod immediately. |
| `ActiveDeadlineSeconds` | The duration (in seconds) that the pod is active on the node. The value must be a positive integer. |
| `DNSPolicy` | Set the DNS policy for the pod. Valid values are `ClusterFirstWithHostNet`, `ClusterFirst`, `Default` or `None`. By default, it is set to `ClusterFirst`. |
| `NodeSelector` | The selector which must match a node's labels for the pod to be scheduled on that node. |
| `ServiceAccountName` | The name of the service account used to run this pod. |
| `DeprecatedServiceAccount` | The depreciated alias for the service account. |
| `AutomountServiceAccountToken` | It indicates whether a service account token should be automatically mounted. |
| `NodeName` | The request to schedule the pod onto a specific node. |
| `HostNetwork` | The host networking required for this pod. |
| `HostPID` | Configure whether to use the PID namespace of the host. By default, it is set to `false`.|
| `HostIPC` | Configure whether to use the PIC namespace of the host. By default, it is set to `false`. |
| `ShareProcessNamespace` | Configure whether to share a single process namespace between all of the containers in a pod. |
| `SecurityContext` | The `SecurityContext` holds pod-level security attributes and common container settings. |
| `ImagePullSecrets` | It is a list of references to secrets in the same namespace for pulling any of the images used by this pod. If specified, these secrets are passed to individual puller implementations for them to use. |
| `Hostname` | The hostname of the pod. |
| `Subdomain` | If specified, the fully qualified pod is in a format of "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>". Otherwise, the pod does not have a domain name at all. |
| `Affinity` | If specified, the pod's scheduling constraints. |
| `SchedulerName` | If specified, the pod is dispatched by a specified scheduler. Otherwise, the pod is dispatched by the default scheduler. |
| `Tolerations` | Allow (but do not require) the pods to schedule onto nodes with matching taints. |
| `HostAliases` | Hosts and IPs that are injected into the pod's hosts file. This is only valid for non-`hostNetwork` pods. |
| `PriorityClassName`| It indicates the pod's priority. |
| `Priority` | The priority value. The higher the value, the higher the priority. |
| `DNSConfig` | Specify the DNS parameters of a pod. |
| `ReadinessGates` | If specified, all readiness gates are evaluated for pod readiness. |
| `RuntimeClassName` | It is a `RuntimeClass` object in the `node.k8s.io` group, which is used to run this pod. If no `RuntimeClass` resource matches the named class, the pod does not run. If it is unset or empty, the "legacy" `RuntimeClass` is used, which is an implicit class with an empty definition that uses the default runtime handler.|
| `EnableServiceLinks` | Configure whether to inject information about services into the pod's environment variables. By default, it is set to `true`. |
| `PreemptionPolicy` | The Policy for preempting pods with lower priority. Valid values are `Never` or `PreemptLowerPriority`. By default, it is set to `PreemptLowerPriority`. |
| `Overhead` | The resource overhead associated with running a pod for a given `RuntimeClass`.|
| `TopologySpreadConstraints` | It describes how a group of pods spread across topology domains. |
