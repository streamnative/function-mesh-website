---
title: Release notes v0.2.0
category: releases
id: release-note-0-2-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.2.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.2.0).

## Support Pulsar stateful functions

In this release, we added the following resources and parameters to run Pulsar stateful functions.
- Resources: `Stateful` and `PulsarStateStore`
- Parameters: `--state_storage_serviceurl` and `-state_storage_impl_class`.

## Release the helm chart of Function Mesh Operator in an independent GitHub repository

In this release, we set up a dedicated Helm charts repository for the Function Mesh Operator. It is now maintained through this [domain](https://charts.functionmesh.io). For details, see [Function Mesh Operator repository](https://artifacthub.io/packages/helm/function-mesh/function-mesh-operator).

## Support Golang 1.18

In this release, Function Mesh supported Golang 1.18.

