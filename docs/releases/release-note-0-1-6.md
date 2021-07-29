---
title: Release notes v0.1.6
category: releases
id: release-note-0-1-6
---

Here are some highlights of this release. For a full list of updates available for Release V0.1.6, check out [here](https://github.com/streamnative/function-mesh/releases/tag/v0.1.6)

## Remove the `logTopic` option from source and sink CRDs

Currently, Pulsar connectors do not support the `logTopic` option. Therefore, we remove the `logTopic` option from connector CRDs.

## Support Pulsar Functions and connectors (sinks and sources) status API in Function Mesh Worker service

Function Mesh Worker service can forward requests to the Kubernetes cluster. After Function Mesh Worker service is started, users can use the [pulsar-admin](https://pulsar.apache.org/docs/en/pulsar-admin/) CLI tool to manage Pulsar Functions and connectors.

In this release, we add Pulsar Functions and connectors (sinks and sources) status API, including adding Function metrics and the `serviceName` in Function Mesh Worker service. Therefore, users can get status of Pulsar Functions and connectors (sinks and sources).

## Support setting the service account name for running Pods

In release v0.1.4, we introduced the Function Mesh Worker service, which ensures users can use the Pulsar CLI tools, such as the pulsar-admin CLI tool, to configure and manage Pulsar Functions and connectors.

In this release, we expose the expose the `serviceAccountName` option in Pulsar Functions' and connectors' CRDs. Therefore, users can run  Pulsar Functions and connectors using the Function Mesh Worker service.

## Fix the NPE that is generated when the `AutoAck` option is not set

If the `AutoAck` option is not set in the Pulsar Functions and connectors' CRDs, an Null Pointer Exception (NPE) is generated when creating a function, connector (sink or source) using the pulsar-admin CLI tool. To fix this bug, we set the `AutoAck` option to `true` by default. Therefore, users can successfully create Pulsar Functions and connectors.