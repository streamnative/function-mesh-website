---
title: Release notes v0.1.9
category: releases
id: release-note-0-1-9
---

Here are some highlights of this release. For a full list of updates available for Release v0.1.9, check out [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.1.9).

# Move the Function Mesh Worker service into a separate repository

In this release, we moved the Function Mesh Worker service into a separate repository `streamnative/function-mesh-worker-service`. Therefore, the `function-mesh` repository does not include releases of the Function Mesh Worker service.

For a detailed version matrix between Function Mesh and Function Mesh worker service, see [version matrix](/function-mesh-worker/function-mesh-worker-overview.md#version-matrix).

# Support validating CRDs with WebHook

In this release, we added [CRD validating markers](https://book.kubebuilder.io/reference/markers/crd-validation.html#crd-validation) to Function Mesh to support validating CRDs.

# Supports custom images

In this release, we added `functionRunnerImages` to `MeshWorkerServiceCustomConfig` to allow users to use the Function Mesh Worker service to set the default function runner images for each Pulsar Functions runtime.

# Support the `secretsMap` option

In this release, Function Mesh Worker service can handle the `--secrets` option from the `pulsar-admin` CLI tool and transfer the secrets as `secretsMap` to the Function Mesh operator.




