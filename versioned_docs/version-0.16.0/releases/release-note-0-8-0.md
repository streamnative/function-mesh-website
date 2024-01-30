---
title: Release notes v0.8.0
category: releases
id: release-note-0-8-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.8.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.8.0).

## Support VPA

In preview releases, Function Mesh supported [Kubernetes Horizontal Pod Autoscaler (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-Pod-autoscale/), which automatically scales up a workload resource (such as a Deployment or StatefulSet) by deploying more Pods.

In this release, Function Mesh supports [Kubernetes Vertical Pod Autoscaler (VPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-Pod-autoscale/). VPA is a component that you install in your cluster to automatically adjust CPU and memory requests and limits based on historical resource utilization.

For details about how to configure VPA autoscaling, see [VPA](/scaling.md#vpa).

## Support enabling/disabling init container

Function Mesh v0.7.0 provided a `downloaderImage` option to specify the image that is used to install the [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/). However, after being installed, the init container may not be able to access the Pulsar cluster when [Istio](https://istio.io/latest/docs/concepts/) (Strict mode) is enabled on the Pulsar cluster. Therefore, in this release, an `enable-init-containers` flag is introduced to configure the Function Mesh Controller Manager to enable or disable the init container. By default, the init container is disabled.

## Introduce batch source configurations

In previous releases, Function Mesh did not provide good support for mapping from the `batchSourceConfig` option to the `sourceConfig` option. In this release, a `batchSourceConfig` option is introduced. Therefore, you can run a batch source connector with Function Mesh.

## Performance tuning

In this release, a `javaOpts` option is introduced. This option can be used to specify some JVM options for better configuring JVM behaviors, including `exitOnOOMError`, Garbage Collection logs, Garbage Collection tuning, and so on.