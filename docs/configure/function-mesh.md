---
title: Configure Function Mesh
category: configure
id: function-mesh
---

Function Mesh is a collection of functions collaborated together to process data with clearly-defined stages on Kubernetes environments.

This document describes how to create Function Mesh through a `.yaml` file.

## Prerequisites

- Create and connect to a [Kubernetes cluster](https://kubernetes.io/).
- Create a [Pulsar cluster](https://pulsar.apache.org/docs/en/kubernetes-helm/) in the Kubernetes cluster.
- Install the Function Mesh Operator and CRD into Kubernetes cluster.

## Steps

To create a Function Mesh, follow these steps.

1. Define a Function Mesh named `functionmesh-sample` by using a YAML file and save the YAML file `functionmesh-sample.yaml`.

    ```yml
    apiVersion: cloud.streamnative.io/v1alpha1
    kind: FunctionMesh
    metadata:
      name: functionmesh-sample
    spec:
      functions:
        - name: ex1
          className: org.apache.pulsar.functions.api.examples.ExclamationFunction
          sourceType: java.lang.String
          sinkType: java.lang.String
          replicas: 1
          maxReplicas: 1
          logTopic: persistent://public/default/logging-function-log
          input:
            topics:
              - persistent://public/default/functionmesh-input-topic
          output:
            topic: persistent://public/default/mid-topic
          pulsar:
            pulsarConfig: "mesh-test-pulsar"
          java:
            jar: pulsar-functions-api-examples.jar
            jarLocation: public/default/nlu-test-functionmesh-ex1
          # following value must be provided if no auto-filling is enabled
          forwardSourceMessageProperty: true
          autoAck: true
          resources:
            requests:
              cpu: "0.1"
              memory: 1G
            limits:
              cpu: "0.2"
              memory: 1.1G
          clusterName: test-pulsar
        - name: ex2
          className: org.apache.pulsar.functions.api.examples.ExclamationFunction
          sourceType: java.lang.String
          sinkType: java.lang.String
          replicas: 1
          maxReplicas: 1
          logTopic: persistent://public/default/logging-function-logs
          input:
            topics:
              - persistent://public/default/mid-topic
          output:
            topic: persistent://public/default/functionmesh-output-topic
          pulsar:
            pulsarConfig: "mesh-test-pulsar"
          java:
            jar: pulsar-functions-api-examples.jar
            jarLocation: public/default/nlu-test-functionmesh-ex2
          # following value must be provided if no auto-filling is enabled
          forwardSourceMessageProperty: true
          autoAck: true
          resources:
            requests:
              cpu: "0.1"
              memory: 1G
            limits:
              cpu: "0.2"
              memory: 1.1G
          clusterName: mesh-test-pulsar
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: mesh-test-pulsar
    data:
      webServiceURL: http://test-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://test-pulsar-broker.default.svc.cluster.local:6650
    ```

    For details about fields used for creating the Function Mesh, see [available fields](#available-fields).

2. Apply the YAML file to create the Function Mesh.

    ```shell
    kubectl apply -f /path/to/functionmesh-sample.yaml
    ```

3. Check whether the Function Mesh is created successfully.

    ```shell
    kubectl get all
    ```

    **Output**

    ```
    NAME                            READY   STATUS    RESTARTS   AGE
    pod/functionmesh-sample-ex1-0   1/1     Running   0          13s
    pod/functionmesh-sample-ex2-0   1/1     Running   0          13s

    NAME                              TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    service/functionmesh-sample-ex1   ClusterIP   None         <none>        9093/TCP   13s
    service/functionmesh-sample-ex2   ClusterIP   None         <none>        9093/TCP   13s
    service/kubernetes                ClusterIP   10.12.0.1    <none>        443/TCP    2d19h

    NAME                                       READY   AGE
    statefulset.apps/functionmesh-sample-ex1   1/1     14s
    statefulset.apps/functionmesh-sample-ex2   1/1     14s

    NAME                                                          REFERENCE                          TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
    horizontalpodautoscaler.autoscaling/functionmesh-sample-ex1   Function/functionmesh-sample-ex1   <unknown>/80%   1         1         0          14s
    horizontalpodautoscaler.autoscaling/functionmesh-sample-ex2   Function/functionmesh-sample-ex2   <unknown>/80%   1         1         0          14s
    ```

## Available fields

The specifications about a Function Mesh are a combination of specifications about Pulsar Functions, source, and sink. For detailed specifications about Pulsar Functions, source, and sink, check the following links.

- [Available fields for Pulsar Functions](/configure/pulsar-functions.md#available-fields)
- [Available fields for source and sink](/configure/pulsar-connector.md#available-fields)