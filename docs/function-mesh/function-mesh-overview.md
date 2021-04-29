---
title: Function Mesh Overview
category: function-mesh
id: function-mesh-overview
---

This document describes 

## What is Function Mesh

Function Mesh is a Kubernetes operator that enables users to run [Pulsar Functions](/functions/function-overview.md) and [connectors](/connectors/pulsar-io-overview.md) natively on Kubernetes, unlocking the full power of Kubernetes’ features and resources.

By providing a serverless framework that enables users to organize a collection of Pulsar Functions and connectors, Function Mesh simplifies the process of creating complex streaming jobs. Function Mesh is a valuable tool for those who are seeking cloud-native serverless streaming solutions. Key benefits include:

- Make Pulsar Functions and connectors easier to manage when multiple Functions and connectors are being used together.
- Enable users of Pulsar Functions and connectors to utilize the full power of Kubernetes Scheduler, including rebalancing, rescheduling, fault-tolerance, and more.
- Make Pulsar Functions and connectors a first-class citizen in the cloud environment, which leads to greater possibilities when more resources become available in the cloud.
- Enable Pulsar Functions to work with different messaging systems and to integrate with existing tools in the cloud environment (Function Mesh runs Pulsar Functions and connectors separately from Pulsar).

Function Mesh is well-suited for common, lightweight streaming use cases, such as ETL jobs, and is not intended to be used as a full-power streaming engine.

![Function Mesh](../docs/assets/function-mesh-overview.png)

## How Function Mesh works

Function Mesh is designed to run Pulsar Functions and connectors natively on Kubernetes. Instead of using the Pulsar admin CLI tool and sending function requests to Pulsar clusters, you can use kubectl to submit a Function Mesh CRD (CustomResourceDefinitions) manifest directly to Kubernetes clusters. The corresponding Mesh operator installed inside Kubernetes will launch functions individually, organize scheduling, and load balance them together. 

Function Mesh works in this way, and both the metadata and running state are stored directly in Kubernetes.
Create Pulsar Functions, source, sink, and Function Mesh `.yaml` files as CRDs.
The Functions controller receives CRDs from Kubernetes service and then schedules the individual pod for running function/connector instances.
The running function/connector instances run with the configured Pulsar cluster and topics.



