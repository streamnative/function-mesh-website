---
title: Release notes v0.4.0
category: releases
id: release-note-0-4-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.4.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.4.0).

## Support key-value environment variables

In previous releases, Function Mesh provided the `.spec.secretsMap` option to pass some configurations to the Pulsar functions, sources, and sinks. However, this option is complicated because it requires multiple Kubernetes resources. In this release, Function Mesh combines the `spec.env` option and the `.spec.secretsMap` option to form the environment variables for the Pulsar functions, sources, or sinks. You can specify the environment variables to expose on the containers. The `spec.env` option is a key/value map. You can either use the `value` option to specify a particular value for the environment variable or use the `valueFrom` option to specify the [source](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#envvarsource-v1-core/) for the environment variable's value, as shown below.

```yaml
env:
- name: example1
  value: simpleValue
- name: example2
  valueFrom:
    secretKeyRef:
      name: secret-name
      key: akey
```

## Provide the `tlsConfig` option to specify required TLS parameters

Starting with Function Mesh v0.1.5, you can use the `tlsSecret` option to provide Secret-related information when submitting Pulsar functions, sources, or sinks. However, you need to provide parameters for the `tlsSecret` option, which is not easy to use. In this release, Function Mesh provides the `tlsConfig` option that allows you to provide Secret information as required. For details, see [authentication configurations](/reference/crd-config/function-crd.md#authentication).