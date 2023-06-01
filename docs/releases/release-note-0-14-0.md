---
title: Release notes v0.14.0
category: releases
id: release-note-0-14-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.14.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.14.0).

## Update the Statefulset configurations

The `VolumeClaimTemplates` describes a list of claims that a Pod is allowed to reference. In previous releases, when you updated resources, some unmodified fields of the statefulset (or other Kubernetes resources) may be changed even with the same YAML file. This causes a failure in updating existing functions, sinks, or sources and results in an infinite reconciliation loop. In this release, this property is specified at the first time when you create a function, and it cannot be modified when you update the resource.

You can only update the following fields for a StatefulSet.

- `replicas`
- `template`
- `updateStrategy`
- `persistentVolumeClaimRetentionPolicy`
- `minReadySeconds`

## Clean up subscriptions and intermediate topics

Function Mesh only passes the `cleanupSubscription` to the function details, but this configuration does not work on the Function Mesh cluster. In this release, the `cleanupImage` configuration is added, which is used to remove the subscriptions created or used by a function when the function is deleted. If no clean-up image is set, the runner image will be used. In addition, you can also configure the generic or OAuth2 authentication for deleting these subscriptions and intermediate topics.

## Synchronize function `prototype` data properties

The Pulsar community introduced some `prototype` data properties. In this release, these properties are synchronized to Function Mesh.

- Add the `Manual` delivery semantics to functions, sinks, and sources.
- Add the `CompressionType` configuration to functions and sources.
- Add the `SkipToLatest` configuration to functions.
- Deprecate the `autoAck` configuration.