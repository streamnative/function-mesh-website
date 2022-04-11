---
title: Release notes v0.1.8
category: releases
id: release-note-0-1-8
---

Here are some highlights of this release. For a full list of updates available for Release v0.1.8, check out [here](https://github.com/streamnative/function-mesh/releases/tag/v0.1.8).

## Support running Pulsar functions and connectors with a default or a customized service account in Mesh Worker service

In this release, we added `defaultServiceAccountName` to `MeshWorkerServiceCustomConfig` to allow users to set the default service account for running the Pod.

And, we also added `serviceAccountName` to `CustomRuntimeOptions` to allow users to use a specific service account to run the Pod. 