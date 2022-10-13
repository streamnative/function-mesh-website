---
title: Release notes v0.1.11
category: releases
id: release-note-0-1-11
---

Here are some highlights of this release. For a full list of updates available for Release v0.1.11, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.1.11).


## Move `apiextensions.k8s.io/v1beta1` to `apiextensions.k8s.io/v1`

In this release, we moved `apiextensions.k8s.io/v1beta1` to `apiextensions.k8s.io/v1` because some Kubernetes versions are deprecated and eventually removed. This table outlines the version relationship between Function Mesh and the Kubernetes server.

| Function Mesh operator                                                          | Kubernetes 1.16  | Kubernetes 1.17 | Kubernetes 1.18 | Kubernetes 1.19 | Kubernetes 1.20 | Kubernetes 1.21 | Kubernetes 1.22 |
|---------------------------------------------------------------------------------|------------------|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|
| [`v0.1.11`](https://github.com/streamnative/function-mesh/releases/tag/v0.1.11) | ✗                | ✔               | ✔               | ✔               | ✔               | ✔               | ✔               |
| [`v0.1.10`](https://github.com/streamnative/function-mesh/releases/tag/v0.1.10) | ✔                | ✔               | ✔               | ✔               | ✔               | ✔               | ✗               |
| [`v0.1.9`](https://github.com/streamnative/function-mesh/releases/tag/v0.1.9)   | ✔                | ✔               | ✔               | ✔               | ✔               | ✔               | ✗               |
| [`Master`](https://github.com/streamnative/function-mesh/tree/master)           | ✗                | ✔               | ✔               | ✔               | ✔               | ✔               | ✔               |


## Apply function-mesh services with Istio service port naming convention

In this release, we verified the compatibility of [Istio](https://istio.io/latest/) on Function Mesh by applying the [Istio service port name convention](https://istio.io/latest/docs/ops/deployment/requirements/). We renamed the port with a `<protocol>[-<suffix>]` format, such as `http-metrics-service`, to take advantage of Istio's routing features.

## Support more controller manager parameters for Helm charts

In this release, we exposed some parameters for the Function Mesh Controller Manager. Therefore, you can customize them for a particular purpose. For example, you can set `pprof.enable` to `true` if you want to enable pprof when installing the Function Mesh Operator. For details, see [Install Function Mesh through Helm](https://functionmesh.io/docs/next/install-function-mesh#install-function-mesh-through-helm).