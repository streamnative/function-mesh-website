---
title: Release notes v0.4.0
category: releases
id: release-note-0-4-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.4.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.4.0).

## Support deploying Function Mesh Worker service separately

When you want to isolate resources for running the Function Mesh Worker service and the Pulsar brokers, you can run the Function Mesh Worker service separately. In this case, even if the Function Mesh Worker service fails, the Pulsar brokers can work properly without causing data loss or service interruption. For details, see [deploy the Function Mesh Worker service separately](/function-mesh-worker/deploy-mesh-worker.md#deploy-function-mesh-worker-service-separately).

## Support specifying a resource as an unmanaged object

In this release, Function Mesh Worker service supports specifying the Pulsar functions, sources, and sinks as unmanaged resources by using the `managed` customizable option. Therefore, the Controller can skip unmanaged objects when checking in the reconciliation loop. For details, see [customizable options](/function-mesh-worker/reference/customizable-option.md).

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

Starting with Function Mesh v0.1.5, you can use the `tlsSecret` option to provide Secret-related information when submitting Pulsar functions, sources, or sinks. However, you need to provide parameters for the `tlsSecret` option, which is not easy to use. In this release, Function Mesh provides the `tlsConfig` option that allows you to provide Secret information as required. For details, see [authentication configurations](/functions/function-crd.md#authentication).