---
title: Function Mesh Operator configurations
category: reference
id: function-mesh-config
---

This table outlines the configurable parameters of the Function Mesh Operator and their default values.

| Parameters | Description | Default|
| --- | --- | --- |
|`enable-leader-election`| Whether the Function Mesh Controller Manager should enable leader election. | `true` |
| `enable-pprof` |Whether the Function Mesh Controller Manager should enable [pprof](https://github.com/google/pprof). | `false`|
| `enable-init-containers` | Whether the Function Mesh Controller Manager should enable the [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/). | `false` |
|`pprof-addr`|The address of the pprof. |`:8090`|
| `metrics-addr`| The address of the metrics. |`:8080`|
| `health-probe-addr`|The address of the health probe. |`:8000`|
|`config-file`| The configuration file of the Function Mesh Controller Manager, which includes `runnerImages`, `resourceLabels`, and `resourceAnnotations` configurations. <br />- `runnerImage`: the runner image to run the Pulsar Function instances. Currently, it supports Java, Python, and Go runner images. <br />- `resourceLabels`: set labels for Pulsar Functions, Sources, or Sinks. <br />- `resourceAnnotations`: set annotations for Pulsar Functions, Sources, or Sinks.  |`/etc/config/configs.yaml`|
| `grpcurlPersistentVolumeClaim` | The [PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) for the [`grpcurl`](https://github.com/fullstorydev/grpcurl) CLI tool. | N/A |

For example, if you want to enable `pprof` for the Function Mesh Operator, set the `controllerManager.pprof.enable` to `true`.

```shell
helm install <release_name> function-mesh/function-mesh-operator -n <k8s_namespace> \
  --set controllerManager.pprof.enable=true
```