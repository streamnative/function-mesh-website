---
title: Function Mesh Worker service overview
category: function-mesh-worker
id: function-mesh-worker-overview
---

This document gives a brief introduction into Function Mesh Worker service.

## What is Function Mesh Worker service

Function Mesh Worker service is a plug-in for Pulsar. It is similar to Pulsar Function Worker service but uses Function Mesh operators to schedule and run functions. Function Mesh Worker service enables you to use the [`pulsar-admin`](https://pulsar.apache.org/docs/en/pulsar-admin/) or [`pulsarctl`](https://docs.streamnative.io/pulsarctl/v2.7.0.7/) CLI tools to manage Pulsar functions and connectors in Function Mesh.

## How Function Mesh Worker service works

The following figure illustrates how Function Mesh Worker service works with Pulsar proxy, converts and forwards function and / or connector admin requests to the Kubernetes cluster. The benefit of this approach is that you do not need to change the way you create and submit functions and / or connectors.

![Function Mesh Workflow](./../assets/function-mesh-workflow.png)

## Authentication

In previous releases, Function Mesh Worker service used the super admin account to read the configuration file for Function Mesh operators, which is not secure. Therefore, starting from this release, Function Mesh Worker service supports setting a separate account for each user.

> **Note**
>
> Currently, only OAuth2 and Token authentication is supported.

To enable separate authentication, you need to configure Function Mesh Worker Service like below:

```yaml
functions:
  configData:
    functionsWorkerServiceCustomConfigs:
      usingInsecureAuth: false # default is true
```

### OAuth2 authentication

For clients that use OAuth2 authentication, you need to create a Kubernetes Secret in advance in the same cluster where Function Mesh operators work. The Kubernetes Secret is something like the below:

```yaml
apiVersion: v1
data:
  auth.json: |
    {
      "client_id": "xxxx",
      "client_secret": "xxxx",
      "issuer_url": "xxx"
    }
kind: Secret
metadata:
  name: any-name
  annotations:
    cloud.streamnative.io/service-account.email: ${OAUTH-CLIENT-ROLE}
type: Opaque
```

### Token authentication

For clients that use Token authentication, nothing is required to do. FunctionMeshWorkerService will take the token passed from client and pass it to FunctionMesh

## Version matrix

This table lists the version mapping relationships between Function Mesh and Function Mesh Worker service.

| Function Mesh | Function Mesh Worker service |
| --- | --- |
| v0.1.9 | <br />- v2.9.1.x (v2.9.1.1-v2.9.1.2) <br />- v2.8.2.x (v2.8.2.0-v2.8.2.2) <br />- v2.8.1 x (2.8.1.25-v2.8.1.26, v.2.8.1.28-v2.8.1.30)|
| v0.1.10| <br />- v2.9.2.1+ <br />- v2.8.2.3+ |
| v0.1.11| <br />- v2.10.0+ <br />- v2.9.2.13+ <br />- v2.8.2.14+ |
| v0.2.0| <br />- v2.10.0.5-v2.10.0.6 <br />- v2.9.2.18-v2.9.2.22 <br />- v2.8.3.4 |
| v0.3.0| <br />- v2.10.0.7 <br />- v2.9.2.23+ <br />- v2.8.3.5+ |
| v0.4.0| <br />- v2.10.1.4+ <br />- v2.9.3.3+ <br />- v2.8.3.6+ |
| v0.5.0| <br />- v2.10.1.7-v2.10.1.8 <br />- v2.9.3.6-v2.9.3.8  <br />- v2.8.4.1 |
| v0.6.0| <br />- v2.10.1.9+ <br />- v2.9.3.9+ <br />- v2.8.4.2+ |
| v0.7.0| <br />- v2.10.1.10+ <br />- v2.9.3.14+ <br />- v2.8.4.2+ |
| v0.8.0| <br />- v2.10.2.1+ <br />- v2.9.3.16+ |
| v0.9.0| <br />- v2.10.2.5+ <br />- v2.9.3.21+ |
| v0.10.0| <br />- v2.10.3.1+ <br />- v2.9.4.2+ |
| v0.11.0| <br />- v2.10.3.5+ <br />- v2.9.4.4+ |
| v0.12.0| <br />- v2.11.0.5+ <br />- v2.10.3.7+ <br />- v2.9.4.6+ |
| v0.13.0| <br />- v2.11.0.6+ <br />- v2.10.3.8+ <br />- v2.9.4.7+ |
| v0.14.0| <br />- v3.0.0.1+ <br />- v2.11.1.3+ <br />- v2.10.4.4+ <br />- v2.9.5.2+ |
