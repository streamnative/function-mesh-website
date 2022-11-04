---
title: Installation
category: installation
id: install-function-mesh
---

This document describes how to install Function Mesh based on your application in Kubernetes and how to start Function Mesh Worker service in case you want to use the [`pulsar-admin`](https://pulsar.apache.org/docs/en/pulsar-admin/) CLI tool to manage Pulsar Functions and connectors.

## Install Function Mesh

This section describes how to install Function Mesh through the `install.sh` script or through the Helm.

### Prerequisites

Before installing Function Mesh, ensure to perform the following operations.

- Kubernetes server v1.17 or higher.
- Create and connect to a [Kubernetes cluster](https://kubernetes.io/).
- Create a [Pulsar cluster](https://pulsar.apache.org/docs/en/kubernetes-helm/) in the Kubernetes cluster.
- Deploy [Pulsar Functions](https://pulsar.apache.org/docs/en/functions-overview/).
- (Optional) enable [Role-based Access Control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### Install cert-manager

Function Mesh is enabled with the [admission control webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) by default. Therefore, you need to prepare the relevant signed certificate. Secrets that contain signed certificates are named with the fixed name `function-mesh-admission-webhook-server-cert`, which is controlled by the [Certificate CRD](https://cert-manager.io/docs/concepts/certificate/).

It is recommended to use [cert-manager](https://cert-manager.io/) to manage these certificates and you can install the cert-manager as follows.

```shell
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.8.0 \
  --set installCRDs=true
```

### Install Function Mesh through `install.sh` script

This example shows how to use the `install.sh` command to install Function Mesh on your laptop (Linux or Mac OS), including a local [kind](https://kind.sigs.k8s.io/) cluster, all the Custom Resource Definitions (CRDs), required service account configuration, and Function Mesh components.

```shell
curl -sSL https://github.com/streamnative/function-mesh/releases/download/v0.7.0/install.sh | bash
```

After executing the above command, you should be able to see the output indicating that the Function Mesh pod is up and running. For details, see [verify installation](#verify-installation).

> **Note**
>
> The `install.sh` command is suitable for trying Function Mesh out. If you want to deploy Function Mesh in production or other mission-critical scenarios, it is recommended to install Function Mesh through Helm.

### Install Function Mesh through Helm

This example shows how to install Function Mesh through [Helm](https://helm.sh/).

> **Note**
>
> - Before installation, ensure that Helm v3 is installed properly.
> - For the use of `kubectl` commands, see [kubectl command reference](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands).

1. Add the StreamNative Function Mesh repository.

    ```shell
    helm repo add function-mesh http://charts.functionmesh.io/
    helm repo update
    ```

2. Install the Function Mesh Operator.

    Let's set some variables for convenient use later.

    ```shell
    export FUNCTION_MESH_RELEASE_NAME=function-mesh  # change the release name according to your scenario
    export FUNCTION_MESH_RELEASE_NAMESPACE=function-mesh  # change the namespace to where you want to install Function Mesh
    ```

    Install the Function Mesh Operator via following command.

    > **Note**
    >
    > - If no Kubernetes namespace is specified, the `default` namespace is used.
    >
    > - If the namespace ${FUNCTION_MESH_RELEASE_NAMESPACE} doesn't exist yet, you can add the parameter `--create-namespace ` to create it automatically.

    ```shell
    helm install ${FUNCTION_MESH_RELEASE_NAME} function-mesh/function-mesh-operator -n ${FUNCTION_MESH_RELEASE_NAMESPACE}
    ```

    This table outlines the configurable parameters of the Function Mesh Operator and their default values.

    | Parameters | Description | Default|
    | --- | --- | --- |
    |`enable-leader-election`| Whether the Function Mesh Controller Manager should enable leader election. | `true` |
    | `enable-pprof` |Whether the Function Mesh Controller Manager should enable [pprof](https://github.com/google/pprof). | `false`|
    |`pprof-addr`|The address of the pprof. |`:8090`|
    | `metrics-addr`| The address of the metrics. |`:8080`|
    | `health-probe-addr`|The address of the health probe. |`:8000`|
    |`config-file`| The configuration file of the Function Mesh Controller Manager, which includes `runnerImages`, `resourceLabels`, and `resourceAnnotations` configurations. <br />- `runnerImage`: the runner image to run the Pulsar Function instances. Currently, it supports Java, Python, and Go runner images. <br />- `resourceLabels`: set labels for Pulsar Functions, Sources, or Sinks. <br />- `resourceAnnotations`: set annotations for Pulsar Functions, Sources, or Sinks.  |`/etc/config/configs.yaml`|

    For example, if you want to enable `pprof` for the Function Mesh Operator, set the `controllerManager.pprof.enable` to `true`.

    ```shell
    helm install ${FUNCTION_MESH_RELEASE_NAME} function-mesh/function-mesh-operator -n ${FUNCTION_MESH_RELEASE_NAMESPACE} \
      --set controllerManager.pprof.enable=true
    ```

3. Check whether Function Mesh is installed successfully.

    ```shell
    kubectl get pods --namespace ${FUNCTION_MESH_RELEASE_NAMESPACE} -l app.kubernetes.io/instance=function-mesh
    ```

    **Output**

    ```
    NAME                                               READY   STATUS    RESTARTS   AGE
    function-mesh-controller-manager-5f867557c-d6vf4   1/1     Running   0          8s
    ```

## Verify installation

- This example shows how to verify whether Function Mesh is installed successfully.

    > **Note**
    >
    > `${NAMESPACE}` indicates the namespace where Function Mesh Operator is installed.

    ```shell
    kubectl get pods --namespace ${NAMEPSACE} -l app.kubernetes.io/instance=function-mesh
    ```

    **Output**

    ```
    NAME                                               READY   STATUS    RESTARTS   AGE
    function-mesh-controller-manager-5f867557c-d6vf4   1/1     Running   0          8s
    ```

- This example shows how to verify whether Function Mesh can run properly.

    After installing the Function Mesh Operator and deploying a Pulsar cluster, you can submit a sample CRD to create Pulsar Functions, source, sink, or Function Mesh. In this example, a CRD is submitted to the Pulsar cluster for creating a Pulsar Function. You can also submit other CRDs under the `./config/samples` directory.

    1. Submit a sample CRD to the Pulsar cluster.

        ```bash
        kubectl apply -f config/samples/compute_v1alpha1_function.yaml
        ```

    2. Verify your submission with the `kubectl` command, and you can see that the Function pod is running.

        ```bash
        kubectl get all
        NAME                                READY   STATUS      RESTARTS   AGE
        pod/function-sample-0               1/1     Running     0          77s
        ```

## Uninstall Function Mesh

1. Use the following command to uninstall Function Mesh through Helm.

> **Note**
>
> `${NAMESPACE}` indicates the namespace where Function Mesh Operator is installed.

```bash
helm delete function-mesh -n ${NAMESPACE}
```

2. Remove the Secrets that contain the signed certificate.

> **Note**
>
> If the Secrets are not cleaned up, future installations in this environment might behave abnormally. For details about how to automatically clean up the corresponding Secrets when you delete a Certificate, see [Cleaning up Secrets when Certificates are deleted](https://cert-manager.io/docs/usage/certificate/#cleaning-up-secrets-when-certificates-are-deleted).

```shell
kubectl delete secret function-mesh-admission-webhook-server-cert -n ${NAMESPACE}
```

## Work with `pulsar-admin` CLI tool

Function Mesh supports Function Mesh Worker service, which can forward requests to the Kubernetes cluster. After Function Mesh Worker service is started, users can use the [`pulsar-admin`](https://pulsar.apache.org/docs/en/pulsar-admin/) CLI tool to manage Pulsar Functions and connectors.

> **Limitations**
>
> - Function Mesh Worker service is only available for Pulsar 2.8.0 or higher.
> - The Function Mesh Worker service cannot manage the FunctionMesh CRD.
> - You need to configure the `clusterName`, `inputTypeClassName`, `outputTypeClassName` parameters through the `custom-runtime-options` option when creating or updating Pulsar Functions or connectors.
> - You need to manually manage the [`ConfigMap`](/functions/function-crd.md#cluster-location), such as the Pulsar service URL.

To start Function Mesh Worker service, follow these steps.

1. Add the following Function Mesh Worker service configuration to your `functions_worker.yml` configuration file.

    ```bash
    functionsWorkerServiceNarPackage: /YOUR-NAR-PATH/function-mesh-worker-service-{version}.nar
    ```

    Replace the `YOUR-NAR-PATH` variable with your real local path.

2. Start Pulsar.

    This example shows how to start Pulsar through Helm.

    ```bash
    helm install \
        --values examples/values-minikube.yaml \
        --set initialize=true \
        --namespace pulsar \
        pulsar-mini apache/pulsar
    ```

3. Start Function Mesh Operator.

    > If the namespace `function-mesh` doesn't exist yet, you can add the parameter `--create-namespace` to create it automatically.

    ```shell
    helm install function-mesh function-mesh/function-mesh-operator -n function-mesh
    ```

4. Verify whether the Function Mesh Worker service is started successfully.

    ```bash
    ./bin/pulsar-admin --admin-url  WEB_SERVICE_URL functions status --tenant TENANT_NAME --namespace NAMESPACE_NAME --name FUNCTION_NAME
    ```

    You should see a similar output as below.

    **Output**

    ```
    {
    "numInstances" : 1,
    "numRunning" : 1,
    "instances" : [ {
        "instanceId" : 0,
        "status" : {
        "running" : true,
        "error" : "",
        "numRestarts" : 0,
        "numReceived" : 0,
        "numSuccessfullyProcessed" : 0,
        "numUserExceptions" : 0,
        "latestUserExceptions" : [ ],
        "numSystemExceptions" : 0,
        "latestSystemExceptions" : [ ],
        "averageLatency" : 0.0,
        "lastInvocationTime" : 0,
        "workerId" : ""
        }
    } ]
    }
    ```
