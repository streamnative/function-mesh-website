---
title: Release notes v0.13.0
category: releases
id: release-note-0-13-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.13.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.13.0).

## Add generic authentication configurations

In this release, Function Mesh introduced the `pulsar.authConfig.genericAuth` option to configure authentication parameters of the Pulsar cluster, as shown below. For details, see [messaging](/reference/crd-config/function-crd.md#messaging).

```yaml
pulsar:
  properties:
    authConfig:
      properties:
        genericAuth:
          properties:
            clientAuthenticationParameters:
            clientAuthenticationPlugin:
# other configs
```

## Revamp documentation structure

In previous releases, reference topics, such as CRD configurations of the Pulsar functions, sources, and sinks, are scattered in different sections. In this release, we revamped the doc structure by moving all reference topics to the **Reference** section, making it easier for you to access required information as required.