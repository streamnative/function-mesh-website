---
title: Release notes v0.20.0
category: releases
id: release-note-0-20-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.20.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.20.0).

## What's Changed

- fix redhat api changes for bundle release by @freeznet in #719
- Use numeric uid:gid in Dockerfile to support Tanzu's PSP by @lhotari in #720
- Setup ssh access for integration CI by @jiangpengcheng in #722
- Use /dev/sdb1 to save docker's data in CI by @jiangpengcheng in #723
- Add annotation to exclude the webhook port from Istio proxying by @jiangpengcheng in #728
- Delete HPA when it's disabled by @jiangpengcheng in #726
- Release 0.20.0 by @jiangpengcheng in #729