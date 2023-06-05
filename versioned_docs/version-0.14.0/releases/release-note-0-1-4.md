---
title: Release notes v0.1.4
category: releases
id: release-note-0-1-4
---

Function Mesh v0.1.4 provides a serverless framework purpose-built for stream processing applications. It brings powerful event-streaming capabilities to your applications by orchestrating multiple [Pulsar Functions](/functions/function-overview.md) and [Pulsar IO connectors](/connectors/pulsar-io-overview.md) for complex stream processing jobs.

Function Mesh is a valuable tool for users who are seeking cloud-native serverless streaming solutions. Key benefits include:

- Utilize the full power of Kubernetes to provision, schedule, and even auto-scale Pulsar Functions and Pulsar IO connectors.

- Make Pulsar Functions and connectors run natively in the cloud environment, which leads to greater possibilities when more resources become available in the cloud.

- Enable Pulsar Functions to work with different messaging systems and to integrate with existing tools in the cloud environment.

## New Features and Enhancements

- Provide [Function](/reference/crd-config/function-crd.md), [source](/reference/crd-config/source-crd-config.md), [sink](/reference/crd-config/sink-crd-config.md), and [FunctionMesh](/reference/crd-config/function-mesh-crd.md) Custom Resource Definitions (CRDs) to manages the whole lifecycle of a Pulsar Functions, Pulsar IO connectors, and your event streaming application.

- Support deploying Function Mesh to Kubernetes clusters through Helm.

- Support defining Pulsar Functions, Pulsar IO connector (source and sink), and Mesh through YAML files.

- Provide a migration tool to migrate existing Pulsar Functions to Function Mesh.

- Provide runner images on Apache Pulsar 2.7.1 to build event streaming applications using your favorite languages, such as Java, Python, and Go.

- Provide the Function Mesh Worker service to manage connectors through the `pulsar-admin` CLI tool.
