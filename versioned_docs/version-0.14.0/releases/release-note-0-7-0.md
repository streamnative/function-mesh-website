---
title: Release notes v0.7.0
category: releases
id: release-note-0-7-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.7.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.7.0).

## Introduced more configurations for Function Mesh Worker service

- **General options**

  In this release, a general option `usingInsecureAuth` is introduced to Function Mesh Worker service for enhancing the insecure authentication handler to parse the `authParameter` from the configuration file.

- **Customizable options**

  In release v0.5.0, Function Mesh supported setting multiple [log levels](/reference/crd-config/function-crd.md#log-levels) and [log rotation policies](/reference/crd-config/function-crd.md#log-rotation-policies) for different Pulsar function runtimes. In this release, you can set log levels and log rotation policies for Function Mesh worker service. For details, see [customizable options](/reference/function-mesh-worker/customizable-option.md).

## Download packages/functions using init container

  In this release, a `downloaderImage` option is introduced that specifies the image that is used to install the [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/). The init container is responsible for downloading packages or functions from Pulsar if the [download path](/reference/crd-config/function-crd.md#packages) is specified.