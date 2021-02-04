---
title: Overview
category: overview
id: overview
---
# What is Function Mesh

Pulsar Functions is a succinct computing abstraction that Apache Pulsar allows users to express simple ETL and streaming tasks. However, Pulsar Functions has the following issues:

- Pulsar Functions does not fully utilize all the tools provided by the Kubernetes ecosystem.
- Functions are tied to a specific Pulsar cluster and it is hard to use functions across multiple Pulsar clusters.
- Currently, it is hard to manage a bundle of functions. Users have to launch and track functions manually one by one.

To solve these issues, we developed Function Mesh to run Pulsar Functions in the Kubernetes environment in a native and integral way. Function Mesh is a collection of functions collaborated together to process data with clearly-defined stages on Kubernetes environments. Function Mesh leverages the powerful scheduling functionality provided by Kubernetes to ensure that functions are resilient to failures, can be scheduled properly at any time, as well as utilize many available Kubernetes tools.

At the current stage, Function Mesh has the following components:

- Functions CRD: it is used to define Pulsar Functions, Source, Sink, and Function Mesh.
- Functions controller: it is used to watch the CRDs and reconcile Pulsar Functions, Source, Sink, and Function Mesh in Kubernetes.

# Features

- Be easily deployed directly on Kubernetes clusters, including [Minikube](https://github.com/kubernetes/minikube) and [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/), without special dependencies.
- Use [CustomResourceDefinitions (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) to define Functions, Source, Sink, and Mesh. Using CRD makes Function Mesh naturally integrate with the Kubernetes ecosystem.
- Integrate with Kubernetes secrets seamlessly to read secrets directly. This would help improve the overall security for the Pulsar Functions.
- Leverage the Kubernetes’s auto-scaler to auto-scale instances for functions based on the CPU usage. In future, Function Mesh will support auto-scaling based on the backlog.
- Utilize the full power scheduling capability provided by Kubernetes. Therefore, users do not need to write any customized codes to communicate with the Kubernetes API server. 
- Allow one function to talk to multiple different Pulsar clusters, which are defined as config maps.
- Support function registry for function package management. We are going to introduce the Pulsar registry in Pulsar 2.8.0 for function package management. Then, the function package can be reused by different functions.

# Architecture

Function Mesh works in the following way.

1. Create Pulsar Functions, Source, Sink, and Function Mesh `.yaml` files as CRDs.

2. The Functions controller receives CRDs from Kubernetes service and then it schedules the individual pod.

3. The pod talks to Pulsar.

The benefit of this approach is that both the metadata and running state are actually stored directly on the Kubernetes API server.

The following diagram illustrates the architecture for Function Mesh.

![](/image/function-mesh-architecture.png)

# Documentation

TBD
