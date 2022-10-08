---
title: Release notes v0.6.0
category: releases
id: release-note-0-6-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.6.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.6.0).

## Support window functions

A window function is a function that performs computation across a window. Java SDK provides access to a window context object that can be used by a window function. This context object provides a wide variety of information and functionality for a Pulsar window function.

For details, see [window functions](functions/function-overview.md#window-functions).

## Support OAuth2 configurations

Function Mesh supports the OAuth2 authentication options. If a Pulsar cluster uses OAuth2 authentication, users can directly configure the OAuth2 authentication using the `authConfig` fields in the Function, Source, and Sink CRDs. For details about OAuth2 authentication, see [authentication](/functions/function-crd.md#authentication).

## Enhance HPA autoscaling

With [Kubernetes Horizontal Pod Autoscaler (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-Pod-autoscale/), Function Mesh supports automatically scaling the number of Pods (Pulsar instances) that are required to run Pulsar functions, sources, and sinks.

When HPA auto-scaling is enabled, the HPA controller scales the Pods up / down based on the values of the `minReplicas` and `maxReplicas` options. The number of the Pods should be greater than the value of the `minReplicas` and be smaller than the value of the `maxReplicas`.

For details, see [autoscaling](/scaling.md#autoscaling).