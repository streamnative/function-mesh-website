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

- Kubernetes server 1.12 or higher.
- Create and connect to a [Kubernetes cluster](https://kubernetes.io/).
- Create a [Pulsar cluster](https://pulsar.apache.org/docs/en/kubernetes-helm/) in the Kubernetes cluster.
- Deploy [Pulsar Functions](https://pulsar.apache.org/docs/en/functions-overview/).
- (Optional) enable [Role-based Access Control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### Install Function Mesh through `install.sh` script

This example shows how to use the `install.sh` command to install Function Mesh on your laptop (Linux or Mac OS), including a local [kind](https://kind.sigs.k8s.io/) cluster, all the Custom Resource Definitions (CRDs), required service account configuration, and Function Mesh components.

```shell
curl -sSL https://github.com/streamnative/function-mesh/releases/download/v0.1.4/install.sh | bash
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
> - For the use of `kubectl` commands, see [here](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands).

1. Clone the StreamNative Function Mesh repository.

    ```shell
    git clone https://github.com/streamnative/function-mesh.git
    cd function-mesh
    ```

2. Create the custom resource type.

    ```shell
    curl -sSL https://github.com/streamnative/function-mesh/releases/download/v0.1.4/crd.yaml | kubectl create -f -
    ```

3. Install the Function Mesh Operator.

   1. Create a Kubernetes namespace `function-mesh`. If no Kubernetes namespace is specified, the `default` namespace is used.

        ```shell
        kubectl create ns function-mesh
        ```

   2. Install Function Mesh Operator.

        ```shell
        helm install function-mesh --values charts/function-mesh-operator/values.yaml charts/function-mesh-operator --namespace=function-mesh
        ```

4. Check whether Function Mesh is installed successfully.

    ```shell
    kubectl get pods -l app.kubernetes.io/component=controller-manager
    ```

    **Output**

    ```
    NAME                                READY   STATUS      RESTARTS   AGE
    function-mesh-controller-manager-696f6467c9-mbstr               1/1     Running     0          77s
    ```

## Verify installation

- This example shows how to verify whether Function Mesh is installed successfully.

    ```shell
    kubectl get pods -l app.kubernetes.io/component=controller-manager
    ```

    **Output**

    ```
    NAME                                READY   STATUS      RESTARTS   AGE
    function-mesh-controller-manager-696f6467c9-mbstr               1/1     Running     0          77s
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

Use the following command to uninstall Function Mesh through Helm.

```bash
helm delete function-mesh
```

## Work with `pulsar-admin` CLI tool

Function Mesh supports Function Mesh Worker service, which can forward requests to the Kubernetes cluster. After Function Mesh Worker service is started, users can use the [`pulsar-admin`](https://pulsar.apache.org/docs/en/pulsar-admin/) CLI tool to manage Pulsar Functions and connectors.

> **Limitations**
>
> - Function Mesh Worker service is only available for Pulsar 2.8.0 or higher.
> - The Function Mesh Worker service cannot manage the FunctionMesh CRD.
> - You need to configure the `clusterName`, `inputTypeClassName`, `outputTypeClassName` parameters through the `custom-runtime-options` option when creating or updating Pulsar Functions or connectors.
> - You need to manually manage the [`ConfigMap`](/functions/function-crd.md#cluster-location), such as the Pulsar service URL.
> - The Function Mesh Worker service does not support configuring authentication parameters.

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

    ```shell
    helm install function-mesh --values charts/function-mesh-operator/values.yaml charts/function-mesh-operator --namespace=function-mesh
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
