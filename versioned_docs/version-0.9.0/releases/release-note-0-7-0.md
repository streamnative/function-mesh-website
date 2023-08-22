---
title: Release notes v0.7.0
category: releases
id: release-note-0-7-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.7.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.7.0).

## Download packages/functions using init container

  In this release, a `downloaderImage` option is introduced that specifies the image that is used to install the [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/). The init container is responsible for downloading packages or functions from Pulsar if the [download path](/functions/function-crd.md#packages) is specified.