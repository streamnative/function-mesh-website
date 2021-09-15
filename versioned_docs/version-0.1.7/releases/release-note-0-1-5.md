---
title: Release notes v0.1.5
category: releases
id: release-note-0-1-5
---


Here are some highlights of this release. For a full list of updates available for Release V0.1.5, check out [here](https://github.com/streamnative/function-mesh/releases/tag/v0.1.5)

## Remove descriptions from Function Mesh CRDs

In the first release, function mesh CRDs are too large in YAML format, since they contain too many descriptions. This causes the Operator-Lifecycle-Manager (OLM) to fail to install them because there is a limit on the CRD size (262,144 bytes). In this release, we reduce the CRD sizes by removing some descriptions about options from Function Mesh CRDs to slim the YAML files.

## Separate authentication and TLS encryption into different Secrets

In the first release, both the authentication and TLS configurations are passed through the `authConfig` option. This makes the management of authentication and TLS encryption difficult. In this release, we separate the authentication and TLS encryption into different Secrets. The authentication configuration is passed by the `authSecret` option, while the TLS configuration is passed by the `tlsSecret` option.

## Add `extraDependenciesDir` to Java runtime

In this release, we add the `extraDependenciesDir` option to the Java runtime. The `extraDependenciesDir` option is used to specify the dependent directory for the JAR package. Multiple libraries or JARs can be in that directory. Therefore, users can customize their own dependencies for the Java runtime to run Pulsar functions.

## Add API access and JAR uploading configurations in Function Mesh Worker service

Function Mesh Worker service can forward requests to the Kubernetes cluster. After Function Mesh Worker service is started, users can use the [pulsar-admin](https://pulsar.apache.org/docs/en/pulsar-admin/) CLI tool to manage Pulsar Functions and connectors.

In this release, we add `functionsWorkerServiceCustomConfigs` to `WorkerConfig`. Therefore, users can pass some customized settings to the Function Mesh Worker service.

We also provide the Pulsar cluster ConfigMap and the authentication Secret and pass the ConfigMap name and Secret name as the environment variables in Pulsar broker, so that the Function Mesh Java Proxy can refer to the configs when users manage connectors.

## Support installing CRDs with helm charts

In the first release, we install CRDs by defining a YAML file and then using the `kubectl apply -f` command to apply it. In this release, we add the `crds` directory to Function Mesh helm charts. Therefore, users can directly use the `helm install` command to install Function Mesh CRDs.
