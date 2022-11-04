---
title: Release notes v0.5.0
category: releases
id: release-note-0-5-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.5.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.5.0).

## Set function log levels

In this release, Function Mesh supports setting multiple [log levels](/functions/function-crd.md#log-levels) for different Pulsar function runtimes. By default, the log level for Pulsar functions is `info`. You can use the `spec.log.level` option to specify a particular log level. Or, you can customize a log configuration file based on your requirements and reference to the log configuration file by using the `spec.log.logConfig` option.
For details, see [set log levels](/functions/produce-function-log.md#set-log-levels).

## Build function images using Buildpacks

To deploy a function to a Pulsar cluster, you need to package the function into an artifact or build the function into a Docker image.

Starting from this release, you can use [Buildpacks](https://buildpacks.io/docs/concepts/components/buildpack/) to build a function image through multiple buildpacks. Buildpacks help customize your code as required, change the runner base (`pulsar-function-<runtime>-runner`) of a function image, and switch the runner image versions without building the function again.

For details about how to build function images using Buildpacks, see the Function Mesh documentation.

- [Package Java Functions](/functions/package-function/package-function-java.md)
- [Package Python Functions](/functions/package-function/package-function-python.md)
- [Package Go Functions](/functions/package-function/package-function-go.md)