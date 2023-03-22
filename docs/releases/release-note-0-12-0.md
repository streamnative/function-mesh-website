---
title: Release notes v0.12.0
category: releases
id: release-note-0-12-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.12.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.12.0).

## Enhance Pod security context and container security context

In previous releases, Function Mesh Operator applied a security context to the Pods. To ensure Pod and container security, the Pods should follow the [`Restricted` policy](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted). Therefore, in this release, we updated some codes to enhance Pod security context and container security context. For details, see [security context](/docs/function-mesh/function-mesh-crd.md#security-context).

## Support scaling `replicas` to zero when HPA is disabled

In previous releases, the `replicas` parameter is used to set the number of instances to run Functions, sinks, or sources. By default, it is set to `1`. In this release, Function Mesh supports setting the value of the `replica` to `0` to stop the function/source/sink when HPA is enabled.

## Support configuring multiple PVs for a function

To configure individual PVs for each Pod, we add `spec.volumeClaimTemplates` to the Function CRD. The [volumeClaimTemplates](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#volume-claim-templates) provides stable storage using [PersistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) provisioned by a PersistentVolume Provisioner.

## Allow passing Function Mesh Operator configurations through the environment variables

When you [deploy the Function Mesh operator using OLM](/install-function-mesh#install-function-mesh-using-olm.md), you can configure the Function Mesh Operator through the environment variables. For details, see [configure Function Mesh Operator](/reference/function-mesh-config.md#configure-function-mesh-operator).