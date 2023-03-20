---
title: Function Mesh Operator configurations
category: reference
id: function-mesh-config
---

This table outlines the configurable parameters of the Function Mesh Operator and their default values.

## Configuration properties

| Parameters | Description | Default|
| --- | --- | --- |
|`enable-leader-election`| Whether the Function Mesh Controller Manager should enable leader election. | `true` |
| `enable-pprof` |Whether the Function Mesh Controller Manager should enable [pprof](https://github.com/google/pprof). | `false`|
| `enable-init-containers` | Whether the Function Mesh Controller Manager should enable the [init container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/). <br />- When enabled, Function Mesh downloads an HTTP or HTTPs package through the [wget](https://www.gnu.org/software/wget/). <br />- When disabled, Function Mesh downloads an HTTP or HTTPs package through the `pulsar-admin` CLI tool. In this case, you need to grant your service account the `admin` access right. | `false` |
|`pprof-addr`|The address of the pprof. |`:8090`|
| `metrics-addr`| The address of the metrics. |`:8080`|
| `health-probe-addr`|The address of the health probe. |`:8000`|
|`config-file`| The configuration file of the Function Mesh Controller Manager, which includes `runnerImages`, `resourceLabels`, and `resourceAnnotations` configurations. <br />- `runnerImage`: the runner image to run the Pulsar Function instances. Currently, it supports Java, Python, and Go runner images. <br />- `resourceLabels`: set labels for Pulsar Functions, Sources, or Sinks. <br />- `resourceAnnotations`: set annotations for Pulsar Functions, Sources, or Sinks.  |`/etc/config/configs.yaml`|

## Configure Function Mesh Operator

When you install the Function Mesh Operator through the [Helm chart](/install-function-mesh.md#install-function-mesh-through-helm), you can apply its configurations through the command flag. For example, if you want to enable `pprof` for the Function Mesh Operator, set the `controllerManager.pprof.enable` to `true`.

```shell
helm install <release_name> function-mesh/function-mesh-operator -n <k8s_namespace> \
  --set controllerManager.pprof.enable=true
```

When you install the Function Mesh Operator through [Operator Lifecycle Manager (OLM)](/install-function-mesh.md#install-function-mesh-using-olm), you can apply its configurations through the `spec.config.env` field and then upgrade the resource.

This example shows how to enable `pprof` for the Function Mesh Operator.

```yaml
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: my-function-mesh
  namespace: operators
spec:
  channel: alpha
  name: function-mesh
  source: operatorhubio-catalog
  sourceNamespace: olm
  config:
    env:
    - name: ENABLE_PPROF
      value: true
```