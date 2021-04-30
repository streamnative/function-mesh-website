---
title: Function Mesh Overview
category: function-mesh
id: function-mesh-overview
---

This document gives a brief introduction into Function Mesh.

## What is Function Mesh

Function Mesh is a Kubernetes operator that enables users to run [Pulsar Functions](/functions/function-overview.md) and [connectors](/connectors/pulsar-io-overview.md) natively on Kubernetes, unlocking the full power of Kubernetes’ features and resources.

By providing a serverless framework that enables users to organize a collection of Pulsar Functions and connectors, Function Mesh simplifies the process of creating complex streaming jobs. Function Mesh is a valuable tool for users who are seeking cloud-native serverless streaming solutions. Key benefits include:

- Enable users of Pulsar Functions and connectors to utilize the full power of Kubernetes Scheduler, including rebalancing, rescheduling, fault-tolerance, and more.

- Make Pulsar Functions and connectors a first-class citizen in the cloud environment, which leads to greater possibilities when more resources become available in the cloud.

- Enable Pulsar Functions to work with different messaging systems and to integrate with existing tools in the cloud environment.

## How Function Mesh works

Function Mesh is designed to run Pulsar Functions and connectors natively on Kubernetes. Instead of using the pulsar-admin CLI tool and sending function requests to Pulsar clusters, you can use `kubectl` to submit a Function Mesh CRD directly to Kubernetes clusters. The corresponding Mesh operator installed inside Kubernetes launches functions and connectors individually, organize scheduling, and load balance them together.

Function Mesh works in this way, and both the metadata and running state are stored directly in Kubernetes.

1. Create Pulsar Functions, source, sink, and Function Mesh `.yaml` files as CRDs.

2. The Functions controller receives CRDs from Kubernetes service and then schedules the individual pod for running function/connector instances.

3. The running function/connector instances run with the configured Pulsar cluster and topics.

The following diagram illustrates how Function Mesh works.

![Function Mesh](./../assets/function-mesh-overview.png)