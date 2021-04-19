---
title: Configure Pulsar Functions
category: configure
id: pulsar-functions
---
Pulsar Functions is a succinct computing abstraction that Apache Pulsar enables users to express simple ETL and streaming tasks. Currently, Function Mesh supports using Java, Python, or Go programming language to define a YAML file of the FUnctions.

## Prerequisites

- Create and connect to a [Kubernetes cluster](https://kubernetes.io/).
- Create a [Pulsar cluster](https://pulsar.apache.org/docs/en/kubernetes-helm/) in the Kubernetes cluster.
- Install the Function Mesh Operator and CRD into Kubernetes cluster.
- Install FunctionMesh operator and CRD into Kubernetes.

## Steps

Function Mesh supports using the Functions CRD to define Pulsar Functions. This example launches a single Pulsar Functions inside Kubernetes with auto-scaling turned on.

1. Define a Pulsar Functions named `function-sample` by using a YAML file and save the YAML file `function-sample.yaml`.

    ```yml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: Function
    metadata:
      name: java-function-sample
      namespace: default
    spec:
      className: org.apache.pulsar.functions.api.examples.ExclamationFunction
      sourceType: java.lang.String
      sinkType: java.lang.String
      forwardSourceMessageProperty: true
      MaxPendingAsyncRequests: 1000
      replicas: 1
      maxReplicas: 5
      logTopic: persistent://public/default/logging-function-logs
      input:
        topics:
        - persistent://public/default/java-function-input-topic
      output:
        topic: persistent://public/default/java-function-output-topic
      resources:
        requests:
          cpu: "0.1"
          memory: 1G
        limits:
          cpu: "0.2"
          memory: 1.1G
      # each secret will be loaded ad an env variable from the `path` secret with the `key` in that secret in the name of `name`
      secretsMap:
        "name":
            path: "test-secret"
            key: "username"
        "pwd":
            path: "test-secret"
            key: "password"
      pulsar:
        pulsarConfig: "test-pulsar"
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
      pod:
        labels:
          "locaction": "mtv"
        annotations:
          "managed-function": "true"
        volumes:
        - name: cache-volume
          emptyDir: {}
        imagePullSecrets:
        - name: regcred
      java:
        jar: pulsar-functions-api-examples.jar
        jarLocation: public/default/nlu-test-java-function
      clusterName: test-pulsar
      autoAck: true
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-pulsar
    data:
        webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
        brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
    ---
    apiVersion: v1
    data:
      username: YWRtaW4=
      password: MWYyZDFlMmU2N2Rm
    kind: Secret
    metadata:
      name: test-secret
    type: Opaque
    ```

    For details about fields used for creating the Pulsar Functions, see [available fields](#available-fields).

2. Apply the YAML file to create the Pulsar Functions.

    ```shell
    kubectl apply -f /path/to/function-sample.yaml
    ```

3. Check whether the Pulsar Functions is created successfully.

    ```shell
    kubectl get all
    ```

    **Output**

    ```
    NAME                         READY   STATUS    RESTARTS   AGE
    pod/java-function-sample-0   1/1     Running   0          14s

    NAME                           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    service/java-function-sample   ClusterIP   None         <none>        9093/TCP   14s
    service/kubernetes             ClusterIP   10.12.0.1    <none>        443/TCP    2d19h

    NAME                                    READY   AGE
    statefulset.apps/java-function-sample   1/1     15s

    NAME                                                       REFERENCE                       TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
    horizontalpodautoscaler.autoscaling/java-function-sample   Function/java-function-sample   <unknown>/80%   1         5         0          14s
    ```

## Available fields

In the `.yaml` file for the Pulsar Functions that you want to create, you need to set values for the following fields.

This table lists common fields used in the `.yaml` file, which is used to create the Pulsar Functions.

| Field | Description |
| --- | --- |
| `apiVersion` | The API version used to create the object. |
| `kind` | The kind of the object to be created. |
| `metadata` | Data that uniquely identify the object, including the name of the object to be created and a Kubernetes namespace. |
| `spec` | The state desired for the object, including specifications about the Pulsar Functions. |

This table lists sub-fields available for the `spec` field.

|Field | Description |
| --- |--- |
| `ClassName`| The class name of the Pulsar Functions. |
| `SourceType`| The type of incoming messages. |
| `SinkType`| The type pf the outgoing messages. |
| `Replicas`| The number of Pulsar instances that you want to run this Pulsar Functions. |
| `MaxReplicas`| The maximum number of Pulsar instances that you want to run for this Pulsar Functions. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the Functions controller automatically scales the Pulsar Functions based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `Input` | The configuration of topic from which messages are fetched. |
| `Output` | The configuration of topic to which messages are sent. |
| `LogTopic` | The topic to which logs are output. |
| `FuncConfig` | The configurations passed to Function instances. |
| `Resources` | The resources used by the Pulsar Functions, including required and maximum CPU and memory resources. |
| `secretsMap` | Secret configurations. Function Mesh leverages the Kubernetes secret and you can just reference the Kubernetes secret in the Pulsar Functions configuration. That would improve the whole security for your Pulsar Functions. |
| `VolumeMounts` | Pod volumes to mount into the container's filesystem, including the `mountPath` and the `name`. |
| `Timeout` | The time out of the request. |
| `autoAck` | Enable or disable automatic acknowledgement. |
| `MaxMessageRetry` | The maximum of retries for each message. |
| `ProcessingGuarantee` | The configurations of processing guarantee. |
| `RetainOrdering` | Configure whether to retain ordering when moving data from Pulsar to external systems. |
| `RetainKeyOrdering`| Configure whether to retain the key order of messages. |
| `DeadLetterTopic`| The dead letter topic. |
| `forwardSourceMessageProperty` | Enable or disable forwarding source messages' property. |
| `MaxPendingAsyncRequests` | The maximum size of the pending asynchronous requests. |
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
| `Subdomain` | If specified, the fully qualified pod is in a format of `hostname.subdomain.pod-namespace.svc.cluster-domain`. Otherwise, the pod does not have a domain name at all. |
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