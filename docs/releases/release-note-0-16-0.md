---
title: Release notes v0.16.0
category: releases
id: release-note-0-16-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.16.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.16.0).

## Use runner images with pulsarctl

By using pulsarctl to replace pulsar-admin, it can reduce lots of time for packages downloading.

Users can use below new runner images to use pulsarctl instead of pulsar-admin for packages downloading:

| Type   | Image                                                                                                                                   |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------|
 | Java   | [streamnative/pulsar-functions-pulsarctl-java-runner](https://hub.docker.com/r/streamnative/pulsar-functions-pulsarctl-java-runner)     |
| Python | [streamnative/pulsar-functions-pulsarctl-python-runner](https://hub.docker.com/r/streamnative/pulsar-functions-pulsarctl-python-runner) |
| Go     | [streamnative/pulsar-functions-pulsarctl-go-runner](https://hub.docker.com/r/streamnative/pulsar-functions-pulsarctl-go-runner)         |