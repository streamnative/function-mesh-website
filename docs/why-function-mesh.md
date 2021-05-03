---
title: "Why Function Mesh?"
category: why
id: why-function-mesh
---

## Pulsar Functions

Pulsar Functions is a computing infrastructure native to Pulsar. It enables the creation of complex processing logic on a per message basis and brings simplicity and serverless concepts to event streaming, thereby eliminating the need to deploy a separate system.

## Pulsar connectors

Pulsar IO, a framework that allows you to ingress or egress data from and to Pulsar using the existing Pulsar Functions framework. Pulsar IO connectors consists **source** and **sink**. A source is an application that ingests data from an external system into Pulsar, while a sink is an application that egresses data from Pulsar to an external system.

The Pulsar IO framework runs on top of the existing Pulsar functions framework. Individual sources and sinks can run like any function alongside Pulsar brokers.


However, both Pulsar Functions and Pulsar connectors have the following issues:

- Pulsar Functions and Pulsar connectors do not fully utilize all the tools provided by the Kubernetes ecosystem.

- Functions and connectors are tied to a specific Pulsar cluster and it is hard to use functions and connectors across multiple Pulsar clusters.

- Currently, it is hard to manage a bundle of functions or connectors. Users have to launch and track them manually one by one.

To solve these issues, we developed Function Mesh to run Pulsar Functions in the Kubernetes environment in a native and integral way.
