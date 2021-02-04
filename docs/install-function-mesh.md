---
title: Install Function Mesh
category: installation
id: install-function-mesh
---

This document describes how to install Function Mesh based on your application in Kubernetes.

# Prerequisites

Before installing Function Mesh, ensure to perform the following operations.

- Install Kubernetes (version 1.12 or higher).
- Create and connect to a [Kubernetes cluster](https://kubernetes.io/).
- Create a [Pulsar cluster](https://pulsar.apache.org/docs/en/kubernetes-helm/) in the Kubernetes cluster.
- Deploy [Pulsar Functions](https://pulsar.apache.org/docs/en/functions-overview/).
- (Optional) enable [Role-based Access Control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

# Install Function Mesh

This example shows how to use the `install.sh` command to install Function Mesh on your laptop (Linux or Mac OS), including a local KinD cluster, all the Custom Resource Definitions (CRDs), required service account configuration, and Function Mesh components.

```shell
curl -sSL https://github.com/streamnative/function-mesh/releases/download/v0.1.2/install.sh | bash
```

After executing the above command, you should be able to see the output indicating that the Function Mesh pod is up and running. For details, see [verity installation](#verify-installation).

> **Note**
>
> The `install.sh` command is suitable for trying Function Mesh out. If you want to use Function Mesh in production or other serious scenarios, Helm is the recommended deployment method. For details, see [install Function Mesh through Helm](#install-function-mesh-through-helm).

## Install Function Mesh through Helm

This example shows how to install Function Mesh through [helm](https://helm.sh/). Before installation, ensure that Helm v3 is installed properly.

1. Clone the StreamNative Function Mesh repository.

    ```shell
    git clone https://github.com/streamnative/function-mesh.git
    cd function-mesh
    ```

2. Create the custom resource type.

    ```shell
    curl -sSL https://github.com/streamnative/function-mesh/releases/download/v0.1.2/crd.yaml | kubectl apply -f -
    ```

3. Install the Function Mesh Operator.

   1. Create a Kubernetes namespace `function-mesh`. If no Kubernetes namespace is specified, the `default` namespace is used.

        ```shell
        kubectl create ns function-mesh
        ```

   2. Install Function Mesh through Helm.

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

# Verify installation

> **Note**
>
> For the use of `kubectl` commands, see [here](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands).

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

    After installing the Function Mesh Operator and deploying a Pulsar cluster, you can submit a sample CRD to create Pulsar Functions, Source, Sink, or Function Mesh. In this example, a CRD is submitted to the Pulsar cluster for creating a Pulsar Function. You can also submit other CRDs under the `./config/samples` directory.

    1. Submit a sample CRD to the Pulsar cluster. 

        ```bash
        kubectl apply -f config/samples/cloud_v1alpha1_function.yaml
        ```

    2. Verify your submission with the kubectl command, and you will see the Function pod is running.

        ```bash
        kubectl get all
        NAME                                READY   STATUS      RESTARTS   AGE
        pod/function-sample-0               1/1     Running     0          77s
        ```

# Uninstall Function Mesh

Use the following command to uninstall Function Mesh through Helm.

```bash
helm delete function-mesh
```
