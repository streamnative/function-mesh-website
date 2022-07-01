---
title: Release notes v0.3.0
category: releases
id: release-note-0-3-0
---

---
title: Release notes v0.3.0
category: releases
id: release-note-0-3-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.3.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.3.0).

## Support deploying the webhook-enabled operator through Helm Charts

In this release, Function Mesh supports the [admission control webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) by default. Admission webhooks are HTTP callbacks that receive admission requests and operate on them. Consequently, you need to prepare the relevant signed certificates for them. To facilitate managing these signed certificates, you can use [cert-manager](https://cert-manager.io/) to manage them. However, cert-manager does not delete the Secret resource containing the signed certificate when the corresponding resource is deleted. Therefore, when you uninstall the Function Mesh operator, make sure to remove the Secrets as well. Otherwise, it might cause an abnormal re-installation of the Function Mesh operator in the future.

## Support specifying an object as an unmanaged object

In Kubernetes, [annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) define an unstructured Key Value Map (KVM) that can be set by external tools to store and retrieve metadata. In this release, Function Mesh supports specifying Pulsar functions, sources, and sinks as unmanaged objects by using `annotations`. Therefore, the Controller will skip reconciling unmanaged objects in reconciliation loop. For details, see [Annotations](/functions/function-crd.md#annotations).

## Support configuring trusted mode for Function Mesh Worker service

To facilitate submitting Pulsar functions based on your requirements, Function Mesh Worker service provides some [customizable options](/function-mesh-worker/reference/customizable-option.md). However, some customizable options are only available in trusted mode. After you enable trusted mode, you can then override some default configurations across the Pulsar cluster.