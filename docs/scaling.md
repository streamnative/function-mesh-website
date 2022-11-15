---
title: Scaling
category: scaling
id: scaling
---

This document describes how to manually and automatically scale Pods (Pulsar instances) that are used for running functions, sources, and sinks.

## Manual scaling

In CRDs, the `replicas` parameter is used to specify the number of Pods (Pulsar instances) that are required for running Pulsar functions, sources, or sinks. You can set the number of Pods based on the CPU threshold. When the target CPU threshold is reached, you can scale the Pods manually through either of the two ways:

- Use the `kubectl scale --replicas` command. The CLI command does not change the `replicas` configuration in the CRD. If you use the `kubectl apply -f` command to re-submit the CRD file, the CLI configuration may be overwritten.

    ```bash
    kubectl scale --replicas="" pod/POD_NAME
    ```

- Update the value of the `replicas` parameter in the CRD and re-submit the CRD with the `kubectl apply -f` command.

## Autoscaling

Autoscaling monitors your Pods and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost. With autoscaling, it is easy to set up Pods scaling for resources in minutes. The service provides a simple, powerful user interface that lets you build scaling plans for resources.

### HPA(horizontal-Pod-autoscaling)

In Kubernetes, a HorizontalPodAutoscaler automatically updates a workload resource (such as a Deployment or StatefulSet), with the aim of automatically scaling the workload to match demand.

Horizontal scaling means that the response to increased load is to deploy more Pods.

#### How it works

With Kubernetes [Horizontal Pod Autoscaler (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-Pod-autoscale/), Function Mesh supports automatically scaling the number of Pods (Pulsar instances) that are required to run Pulsar functions, sources, and sinks.

For resources with HPA configured, the HPA controller monitors the resource's Pods to determine if it needs to change the number of Pod replicas. In most cases, where the controller takes the mean of a per-pod metric value, it calculates whether adding or removing replicas would move the current value closer to the target value.

![scaling](./assets/scaling.png)

#### Supported HPA metrics

Function Mesh auto-scales the number of Pods based on the CPU usage, memory usage, and custom metrics.

> **Note**
>
> If you have configured HPA based on the CPU usage and/or memory usage, you do not need to configure HPA based on custom metrics defined in Pulsar Functions or connectors and vice versa.

- CPU usage: auto-scale the number of Pods based on CPU utilization.
  
  This table lists built-in CPU-based HPA metrics. If these metrics do not meet your requirements, you can auto-scale the number of Pods based on custom metrics defined in Pulsar Functions or connectors. For details, see [MetricSpec v2beta2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#metricspec-v2beta2-autoscaling).
  
  | Option | Description |
  | --- | --- |
  | AverageUtilizationCPUPercent80 | Auto-scale the number of Pods if 80% CPU is used.|
  | AverageUtilizationCPUPercent50 | Auto-scale the number of Pods if 50% CPU is used.|
  | AverageUtilizationCPUPercent20 | Auto-scale the number of Pods if 20% CPU is used. |

- Memory usage: auto-scale the number of Pods based on memory utilization.
  
  This table lists built-in memory-based HPA metrics. If these metrics do not meet your requirements, you can auto-scale the number of Pods based on custom metrics defined in Pulsar Functions or connectors. For details, see [MetricSpec v2beta2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#metricspec-v2beta2-autoscaling).
  
  | Option | Description |
  | --- | --- |
  | AverageUtilizationMemoryPercent80 | Auto-scale the number of Pods if 80% memory is used. |
  | AverageUtilizationMemoryPercent50 | Auto-scale the number of Pods if 50% memory is used. |
  | AverageUtilizationMemoryPercent20 | Auto-scale the number of Pods if 20% memory is used. |

- Custom metrics: auto-scale the number of Pods based on custom metrics defined in Pulsar Functions or connectors. For details, see [MetricSpec v2beta2 autoscaling](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#metricspec-v2beta2-autoscaling).

#### Examples

This section provides some examples about HPA.

##### Prerequisites

Deploy the metrics server in the cluster. The Metrics server provides metrics through the Metrics API. The Horizontal Pod Autoscaler (HPA) uses this API to collect metrics. To learn how to deploy the metrics-server, see the [metrics-server documentation](https://github.com/kubernetes-sigs/metrics-server#deployment).

##### Enable HPA

By default, HPA is disabled (the value of the `maxReplicas` parameter is set to `0`). To enable HPA, you can specify the `maxReplicas` parameter and set a value for it in the CRD. This value should be greater than the value of the `replicas` parameter.

By default, when HPA is enabled, the number of Pods is automatically scaled when 80% CPU is used.

This example shows how to enable HPA by setting the value of the `maxReplicas` to `8`.

```yaml
apiVersion: cloud.streamnative.io/v1alpha1
kind: Function
metadata:
  name: java-function-sample
  namespace: default
spec:
  className: org.apache.pulsar.functions.api.examples.ExclamationFunction
  forwardSourceMessageProperty: true
  maxPendingAsyncRequests: 1000
  replicas: 1
  maxReplicas: 8
  # Other function configs
```

##### Configure HPA with built-in metrics

Function Mesh supports autoscaling the number of Pods based on [supported built-in metrics](#supported-auto-scaling-metrics).

  >**Note**
  >
  > If you specify multiple metrics for the HPA to scale up, the HPA controller evaluates each metric, and proposes a new scale based on that metric. The largest of the proposed scales will be used as the new scale.

This example shows how to auto-scale the number of Pods to `8` when 20% CPU is used.

1. Specify the CPU-based HPA metric under `pod.builtinAutoscaler` in the Pulsar Functions CRD.

    ```yaml
    apiVersion: cloud.streamnative.io/v1alpha1
    kind: Function
    metadata:
      name: java-function-sample
      namespace: default
    spec:
      className: org.apache.pulsar.functions.api.examples.ExclamationFunction
      forwardSourceMessageProperty: true
      maxPendingAsyncRequests: 1000
      replicas: 1
      maxReplicas: 4                    --- [1]
      logTopic: persistent://public/default/logging-function-logs                    
      input:                   
        topics:                    
        - persistent://public/default/java-function-input-topic                    
        typeClassName: java.lang.String                    
      pod:                    
        builtinAutoscaler:               --- [2]
          - AverageUtilizationCPUPercent20
      # Other function configs
    ```

    - [1] `maxReplicas`: enables HPA when the value is greater than that of the `replicas`.
    - [2] `builtinAutoscaler`: configures the built-in HPA metrics.

2. Apply the configurations.

    ```bash
    kubectl apply -f path/to/function-sample.yaml
    ```

##### Configure HPA with custom metrics

Function Mesh supports automatically scaling up the number of Pods based on a custom HPA metric. 

- This example shows how to auto-scale the number of Pods if 45% CPU is used.

  1. Specify the custom HPA metric under `pod.autoScalingMetrics` in the Pulsar Functions CRD.

      ```yaml
      apiVersion: cloud.streamnative.io/v1alpha1
      kind: Function
      metadata:
        name: java-function-sample
        namespace: default
      spec:
        className: org.apache.pulsar.functions.api.examples.ExclamationFunction
        forwardSourceMessageProperty: true
        maxPendingAsyncRequests: 1000
        replicas: 1
        maxReplicas: 4                         --- [1]
        logTopic: persistent://public/default/logging-function-logs            
        pod:            
          autoScalingMetrics:                  --- [2]
          - type: Resource           
            resource:            
              name: cpu                        --- [3]
              target:             
                type: Utilization              
                averageUtilization: 45         --- [4]
        # Other function configs
      ```

      - [1] `maxReplicas`: enables autoscaling when the value is greater than that of the `replicas`.
      - [2] `autoScalingMetrics`: represents the custom autoscaling metrics.
      - [3] `name`: defines the name of resources to be used. It can be set to the value `cpu` or `memory`.
      - [4] `averageUtilization`: defines the percentage of the resource usage.

  2. Apply the configurations.

      ```bash
      kubectl apply -f path/to/function-sample.yaml
      ```

- If a large number of resources are used suddenly, you can use the `autoScalingBehavior.scaleUp.stabilizationWindowSeconds` option to adjust the value of the stabilization window to tune performance.

  1. Specify the value of the stabilization window in the Pulsar Functions CRD.

      ```yaml
      apiVersion: cloud.streamnative.io/v1alpha1
      kind: Function
      metadata:
        name: java-function-sample
        namespace: default
      spec:
        minReplicas: 1
        maxReplicas: 10
        pod:
          autoScalingMetrics:
            - type: Resource
              resource:
                name: cpu
                target:
                  type: Utilization
                  averageUtilization: 80
          autoScalingBehavior:                     
            scaleUp:                               --- [1]
              stabilizationWindowSeconds: 120      --- [2]
              policies:                            --- [3]
              - type: Percent                      --- [4]
                value: 100                         --- [5]
                periodSeconds: 15                  --- [6]
              - type: Pods                         
                value: 4                           
                periodSeconds: 15                  
              selectPolicy: Max                    --- [7]
      ```

     - [1] `scaleUp`: specifies the rules that are used to control scaling behavior while scaling up.
     - [2] `stabilizationWindowSeconds`: indicates the amount of time the HPA controller should consider previous recommendations to prevent flapping of the number of replicas.
     - [3] `policies`: a list of policies that regulate the amount of scaling. Each item has the following fields:
     - [4] `type`: can be set to the value `Pods` or `Percent`, which indicates the allowed changes in terms of absolute number of pods or percentage of current replicas.
     - [5] `periodSeconds`: represents the amount of time in seconds that the rule should hold true for.
     - [6] `value`: represents the value for the policy.
     - [7] `selectPolicy`: can be `Min`, `Max` or `Disabled` and specifies which value from the policies should be selected. By default, it is set to `Max` value.

  2. Apply the configurations.

      ```bash
      kubectl apply -f path/to/function-sample.yaml
      ```

### VPA(Vertical-pod-autoscaling)

Vertical scaling means assigning more resources (for example: memory or CPU) to the Pods that are already running for the workload.

#### How it works

With Kubernetes [Vertical Pod Autoscaler (VPA)](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler), Function Mesh supports automatically update the requested resources(memory and cpu) of Pods (Pulsar instances) that are required to run Pulsar functions, sources, and sinks based on analysis of historical resource utilization, amount of resources available in the cluster and real-time events, such as OOMs.

- the Recommender is a new component which consumes utilization signals and OOM events for all Pods in the cluster from the Metrics Server, it:

  1. watches all Pods, keeps calculating fresh recommended resources for them and stores the recommendations in the VPA objects.

  2. exposes a synchronous API that takes a Pod description and returns recommended resources.

- the VPA Admission Controller controls all pod creation requests, If the Pod is matched by any VerticalPodAutoscaler object, the admission controller overrides resources of containers in the Pod with the recommendation provided by the VPA Recommender. If the Recommender is not available, it falls back to the recommendation cached in the VPA object.

- the VPA Updater is a component responsible for real-time updates of Pods. If a Pod uses VPA in "Auto" mode, the Updater can decide to update it with recommender resources.


![Architecture](./assets/vpa-architecture.png)


> **Note**
>
> If you have configured HPA, do not enable VPA, there exists some conflicts. 

#### Limitations

There are some limitations on VPA, see: [known-limitations](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#known-limitations) for details.


#### Examples

This section provides some examples about VPA.

##### Prerequisites

1. Deploy the metrics server in the cluster. The Metrics server provides metrics through the Metrics API. The Vertical Pod Autoscaler (VPA) uses this API to collect metrics. To learn how to deploy the metrics-server, see the [metrics-server documentation](https://github.com/kubernetes-sigs/metrics-server#deployment).

2. Enable the VPA feature in k8s, currently VPA hasn't integrated into k8s now, so we need to enable it manually, for different k8s vendors, there are different ways to enable: [GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/verticalpodautoscaler), [Openshift](https://docs.openshift.com/container-platform/4.11/nodes/pods/nodes-pods-vertical-autoscaler.html#nodes-pods-vertical-autoscaler-install_nodes-pods-vertical-autoscaler
), [AWS](https://docs.aws.amazon.com/eks/latest/userguide/vertical-pod-autoscaler.html), [Azure](https://learn.microsoft.com/en-us/azure/aks/vertical-pod-autoscaler#deploy-upgrade-or-disable-vpa-on-a-cluster), or for [self hosted](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#installation)


##### Enable VPA with resources limits:

Below is an example to update pod resources with a upper and lower bound automatically.

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  name: function-sample-vpa
  namespace: default
spec:
  image: streamnative/pulsar-functions-java-sample:2.9.2.23
  className: org.apache.pulsar.functions.api.examples.ExclamationFunction
  forwardSourceMessageProperty: true
  maxPendingAsyncRequests: 1000
  replicas: 2                    --- [1]
  pod:
    vpa:
      updatePolicy:
        updateMode: "Auto"       --- [2]
      resourcePolicy:
        containerPolicies:
        - containerName: "*"     --- [3]
          minAllowed:            --- [4]
            cpu: 200m
            memory: 100Mi
          maxAllowed:            --- [5]
            cpu: 1
            memory: 1000Mi

  # Other function configs
```

- [1] `replicas`: it should be >= a minimal value(default 2) to make VPA can update the pod and ensure that at least (minimalValue - 1) pod is alive during resource updating, you can change the minimal value in `pod.vpa.updatePolicy.minReplicas`.
- [2] `updateMode`: the update mode defines the behaviour of the VPA Updater, for `Auto` and `Recreate` it will recreate pod when resource recommendation is changed, for `Initial` it will only assigns resources on pod creation, for `Off`, it will do nothing to pod but just save the recommendation resources in VPA object
- [3] user can specify different resource policy for different containers, `*` means for all containers,
- [4] the min recommended resources
- [5] the max recommended resources

##### Enable VPA on requests resources only

Below is an example to update pod request resources.

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  name: function-sample-vpa
  namespace: default
spec:
  image: streamnative/pulsar-functions-java-sample:2.9.2.23
  className: org.apache.pulsar.functions.api.examples.ExclamationFunction
  forwardSourceMessageProperty: true
  maxPendingAsyncRequests: 1000
  replicas: 2
  pod:
    vpa:
      updatePolicy:
        updateMode: "Auto"
      resourcePolicy:
        containerPolicies:
        - containerName: "*"
          controlledValues: "RequestsOnly"  --- [1]

  # Other function configs
```

- [1] the Recommender will only control the **requests** resources, not including **limits** resources, you can change it to `RequestsAndLimits` to control them both


##### Enable VPA on cpu resources only

Below is an example to update pod request resources.

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  name: function-sample-vpa
  namespace: default
spec:
  image: streamnative/pulsar-functions-java-sample:2.9.2.23
  className: org.apache.pulsar.functions.api.examples.ExclamationFunction
  forwardSourceMessageProperty: true
  maxPendingAsyncRequests: 1000
  replicas: 2
  pod:
    vpa:
      updatePolicy:
        updateMode: "Auto"
      resourcePolicy:
        containerPolicies:
        - containerName: "*"
          controlledResources: ["cpu"]   --- [1]

  # Other function configs
```

- [1] the Recommender will only control the **CPU** resources, you can add **memory** to the array to control it too
