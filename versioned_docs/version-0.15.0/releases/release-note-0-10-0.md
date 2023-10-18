---
title: Release notes v0.10.0
category: releases
id: release-note-0-10-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.10.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.10.0).

## Support using wget to download HTTP/HTTPS function packages

In previous releases, if a function package uses the HTTP or HTTPS protocol, you cannot download the function package directly if you do not have the `admin` access right. In this release, Function Mesh supports downloading an HTTP or HTTPs function package using [wget](https://www.gnu.org/software/wget/) if you enable the [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) when installing the Function Mesh Operator. For details, see [Function Mesh Operator configurations](/reference/function-mesh-config.md).
