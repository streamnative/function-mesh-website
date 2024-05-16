---
title: BackendConfig CRD configurations
category: reference
id: backendconfig-crd
---

This document lists CRD configurations available for BackendConfig objects. BackendConfig objects allow you to set container environment variables within
the pods deployed in the mesh on a namespace by namespace basis or globally.

## Function configurations

The BackendConfig can be specified with or without a namespace. If specified without a namespace it will affect the entire cluster. If it is specified
with a namespace *only* the namespace specified will have it's containers environment variables changed. The changes to the environment of the containers
is addititve.

<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
    <tr>
  </thead>
  <tbody>
    <tr>
      <td>env</td>
      <td>A key value pair of environment variables to values that you wish for the containers in your pods to have.</td>
    </tr>
  </tbody>
</table>


### Examples

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: BackendConfig
    metadata:
      name: backend-config
      namespace: my-namespace
    spec:
      env:
        namespaced1: namespacedvalue1
        shared1: fromnamespace
    ```

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: BackendConfig
    metadata:
      name: global-backend-config
    spec:
      env:
        namespaced1: namespacedvalue1
        shared1: fromnamespace
    ```