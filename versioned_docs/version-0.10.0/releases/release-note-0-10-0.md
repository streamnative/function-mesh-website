---
title: Release notes v0.10.0
category: releases
id: release-note-0-10-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.10.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.10.0).

## Support using wget to download HTTP/HTTPS function packages

In previous releases, if a function package uses the HTTP or HTTPS protocol, you cannot download the function package directly if you do not have the `admin` access right. In this release, Function Mesh supports downloading an HTTP or HTTPs function package using [wget](https://www.gnu.org/software/wget/) if you enable the [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) when installing the Function Mesh Operator. For details, see [Function Mesh Operator configurations](/reference/function-mesh-config.md).

## Function Mesh Worker service supports HPA and VPA specifications

Function Mesh supports Kubernetes [Horizontal Pod Autoscaler (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-Pod-autoscale/) and [Vertical Pod Autoscaler (VPA)](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) to automatically adjust capacity of your Pods to maintain steady, predictable performance at the lowest possible cost. In this release, the Function Mesh Worker service also supports HPA and VPA specifications. For details, see [customizable options](/function-mesh-worker/reference/customizable-option.md).
