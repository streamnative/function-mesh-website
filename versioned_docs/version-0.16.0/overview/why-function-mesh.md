---
title: "Why Function Mesh?"
category: why
id: why-function-mesh
---

## Background

Pulsar introduces [Pulsar Functions](/functions/function-overview.md) and [Pulsar IO connectors](/connectors/pulsar-io-overview.md) since 2.0 release.

Pulsar Functions is a turnkey serverless event streaming framework built natively for Apache Pulsar. Pulsar Functions enable users to create event processing logic on a per message basis and bring simplicity and serverless concepts to event streaming, thus eliminating the need to deploy a separate stream processing system. Popular concepts of Pulsar Functions include ETL jobs, real-time aggregation, microserices, reactive services, event routing, and more.

Pulsar IO is a framework that allows you to ingress or egress events from and to Pulsar using the existing Pulsar Functions framework. Pulsar IO consists **source** and **sink** connectors. A source is an event processor that ingests data from an external system into Pulsar, while a sink is an event processor that egresses data from Pulsar to an external system.

Both Pulsar Functions and Pulsar IO connectors provide serverless frameworks that make building event streaming application become simpler.

Pulsar Functions supports writing streaming functions using popular languages including Java, Python and Go. It also support different deployment options, from co-running functions/connectors with brokers, running them in a dedicated function worker cluster, to scheduling them on Kubernetes.

## Problems

Pulsar supports running functions and connectors on Kubernetes. The existing Kubernetes scheduler implementation stores the functions and connectors metadata within a Pulsar cluster using Pulsar topics and schedules the functions and connectors to run on Kubernetes.

There are a few drawbacks of this implementation:

1. The function metadata is stored in Pulsar and the function running state is managed by Kubernetes. It results in inconsistency between metadata and state, which makes management become complicated and problematic. For example, the StatefulSet running Pulsar Functions can be deleted from Kubernetes, which is beyond the control of Pulsar scheduler.

2. The existing implementation uses Pulsar topics for storing function metadata. It can cause brokers in a crash loop if the function metadata topics are temperaily not available.

3. The existing implementation is tied to one Pulsar cluster. It makes functions interacting with multiple Pulsar clusters become complicated.

4. This existing implementation makes it hard for users deploying Pulsar Functions in Kubernetes to implement certain features, such as auto-scaling.

Additionally, with the increased adoption of Pulsar Functions and Pulsar IO connectors for building serverless event streaming applications, people are looking for orchestrating multiple functions into a single streaming job to archive complex event streaming capabilities. Without Function Mesh, there is a lot of manual work to organize and manage multiple functions to process events. 

To solve the pain points and make Pulsar Functions Kubernetes-native, we developed Function Mesh -- a serverless framework purpose-built for running Pulsar Functions and connectors natively on Kubernetes and for simplifying building complext event streaming applications.