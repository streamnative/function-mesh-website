---
title: Installation
category: installation
id: install-function-mesh
---

This document describes how to install Function Mesh based on your application in Kubernetes.

## Install Function Mesh

This section describes how to install Function Mesh through the `install.sh` script or through the Helm.

### Prerequisites

Before installing Function Mesh, ensure to perform the following operations.

- Kubernetes server 1.12 or higher.
- Create and connect to a [Kubernetes cluster](https://kubernetes.io/).
- Create a [Pulsar cluster](https://pulsar.apache.org/docs/en/kubernetes-helm/) in the Kubernetes cluster.
- Install [Helm v3](https://helm.sh/docs/intro/install/).
- (Optional) enable [Role-based Access Control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

### Install Function Mesh through `install.sh` script

This example shows how to use the `install.sh` command to install Function Mesh on your laptop (Linux or Mac OS), including a local [kind](https://kind.sigs.k8s.io/) cluster, all the Custom Resource Definitions (CRDs), required service account configuration, and Function Mesh components.

```shell
curl -sSL https://github.com/streamnative/function-mesh/releases/download/v0.1.7/install.sh | bash
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

1. Clone the StreamNative Function Mesh repository.

    ```shell
    git clone https://github.com/streamnative/function-mesh.git
    cd function-mesh
    ```

2. Create the custom resource type.

    ```shell
    curl -sSL https://github.com/streamnative/function-mesh/releases/download/v0.1.7/crd.yaml | kubectl create -f -
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