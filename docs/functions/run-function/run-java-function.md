---
title: Run Java Functions
category: functions
id: run-java-function
---

After packaging your Pulsar function, you can submit your Pulsar function to a Pulsar cluster. This document describes how to submit a Java function through a function CRD. You can use the `image` field to specify the runner image for creating the Java function. You can also specify the location where the package or the image is stored.

1. Define a Java function by using a YAML file and save the YAML file.

   - This example shows how to publish a `java-function-sample` function to a Pulsar cluster by using a JAR package called `function://my-tenant/my-ns/my-function@0.1`.

     ```yaml
     apiVersion: compute.functionmesh.io/v1alpha1
     kind: Function
     metadata:
       name: java-function-sample
       namespace: default
     spec:
       image: streamnative/pulsar-functions-java-runner:2.7.1 # using java function runner
       className: exclamation_function.ExclamationFunction
       forwardSourceMessageProperty: true
       maxPendingAsyncRequests: 1000
       replicas: 1
       maxReplicas: 5
       logTopic: persistent://public/default/logging-function-logs
       input:
         topics:
         - persistent://public/default/java-function-input-topic
         typeClassName: java.lang.String
       output:
         topic: persistent://public/default/java-function-output-topic
         typeClassName: java.lang.String
       pulsar:
         pulsarConfig: "test-pulsar"
       java:
         extraDependenciesDir: random-dir/
         jar: my-function.jar # the package will download as this filename.
         jarLocation: function://my-tenant/my-ns/my-function@0.1 # function package URL
     ```

   - This example shows how to publish a `java-function-sample` function to a Pulsar cluster by using a Docker image.

     ```yaml
     apiVersion: compute.functionmesh.io/v1alpha1
     kind: Function
     metadata:
       name: java-function-sample
       namespace: default
     spec:
       image: streamnative/example-function-image:latest # using function image here
       className: exclamation_function.ExclamationFunction
       forwardSourceMessageProperty: true
       maxPendingAsyncRequests: 1000
       replicas: 1
       maxReplicas: 5
       logTopic: persistent://public/default/logging-function-logs
       input:
         topics:
         - persistent://public/default/java-function-input-topic
         typeClassName: java.lang.String
       output:
         topic: persistent://public/default/java-function-output-topic
         typeClassName: java.lang.String
       pulsar:
         pulsarConfig: "test-pulsar"
       java:
         extraDependenciesDir: random-dir/
         jar: /pulsar/example-function.jar # the package location in image
         jarLocation: "" # leave empty since we will not download package from Pulsar Packages
     ```

- This example shows how to publish a `java-exclamation-function` function to a Pulsar cluster by using the self-built image `java-exclamation-function:v1`.

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: Function
    metadata:
      name: java-exclamation-function
      namespace: default
    spec:
      image: java-exclamation-function:v1
      className: org.example.ExclamationFunction
      forwardSourceMessageProperty: true
      maxPendingAsyncRequests: 1000
      replicas: 1
      maxReplicas: 5
      logTopic: persistent://public/default/logging-function-logs
      input:
        topics:
        - persistent://public/default/input-java-topic
        typeClassName: java.lang.String
      output:
        topic: persistent://public/default/output-java-topic
        typeClassName: java.lang.String
      resources:
        requests:
          cpu: "0.1"
          memory: 1G
        limits:
          cpu: "0.2"
          memory: 1.1G
      secretsMap:
        "name":
            path: "test-secret"
            key: "username"
        "pwd":
            path: "test-secret"
            key: "password"
      pulsar:
        pulsarConfig: "test-pulsar"
      java:
        jar: /pulsar/java-function-1.0-SNAPSHOT.jar
      clusterName: test
      autoAck: true
    ---
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: test-pulsar
    data:
      webServiceURL: http://sn-platform-pulsar-broker.default.svc.cluster.local:8080
      brokerServiceURL: pulsar://sn-platform-pulsar-broker.default.svc.cluster.local:6650
    ---
    apiVersion: v1
    data:
      username: YWRtaW4=
      password: MWYyZDFlMmU2N2Rm
    kind: Secret
    metadata:
      name: test-secret
    type: Opaque
    ```

2. Apply the YAML file to create the Java function.

   ```bash
   kubectl apply -f /path/to/YAML/file
   ```

3. Check whether the Java function is created successfully.

   ```bash
   kubectl get all
   ```