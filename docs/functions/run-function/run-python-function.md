---
title: Run Python Functions
category: functions
id: run-python-function
---

After packaging your Pulsar function, you can submit your Pulsar function to a Pulsar cluster. This section describes how to submit a Python function through a function CRD. You can use the `image` field to specify the runner image use for creating the Python function. You can also specify the location where the package or the Docker image is stored.

1. Define a Python function by using a YAML file and save the YAML file.

   - This example shows how to publish a `python-function-sample` function to a Pulsar cluster by using a JAR package called `function://my-tenant/my-ns/my-function@0.1`.

        ```yaml
        apiVersion: compute.functionmesh.io/v1alpha1
        kind: Function
        metadata:
          name: python-function-sample
          namespace: default
        spec:
          image: streamnative/pulsar-functions-python-runner:2.7.1 # using python function runner
          className: exclamation_function.ExclamationFunction
          forwardSourceMessageProperty: true
          maxPendingAsyncRequests: 1000
          replicas: 1
          maxReplicas: 5
          logTopic: persistent://public/default/logging-function-logs
          input:
            topics:
            - persistent://public/default/python-function-input-topic
            typeClassName: java.lang.String
          output:
            topic: persistent://public/default/python-function-output-topic
            typeClassName: java.lang.String
          pulsar:
            pulsarConfig: "test-pulsar"
          python:
              py: exclamation_function.py
              pyLocation: ""
              # use package name:
              # pyLocation: function://public/default/nul-py-test-function@v1
          # to be delete & use admission hook
        ```

   - This example shows how to publish a `python-function-sample` function to a Pulsar cluster by using a Docker image.

      ```yaml
      apiVersion: compute.functionmesh.io/v1alpha1
      kind: Function
      metadata:
        name: python-function-sample
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
          - persistent://public/default/python-function-input-topic
          typeClassName: java.lang.String
        output:
          topic: persistent://public/default/python-function-output-topic
          typeClassName: java.lang.String
        pulsar:
          pulsarConfig: "test-pulsar"
        python:
            py: exclamation_function.py
            pyLocation: ""
            # use package name:
            # pyLocation: function://public/default/nul-py-test-function@v1
            # to be delete & use admission hook
      ```

- This example shows how to publish a `python-exclamation-function` function to a Pulsar cluster by using the self-built image `python-exclamation-function:v1`.

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: Function
    metadata:
      name: python-exclamation-function
      namespace: default
    spec:
      image: python-exclamation-function:v1
      className: exclamation_example.ExclamationFunction
      forwardSourceMessageProperty: true
      maxPendingAsyncRequests: 1000
      replicas: 1
      maxReplicas: 5
      logTopic: persistent://public/default/logging-function-logs
      input:
        topics:
        - persistent://public/default/input-python-topic
      output:
        topic: persistent://public/default/output-python-topic
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
      python:
        py: /pulsar/exclamation_example.py
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

2. Apply the YAML file to create the Python function.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

3. Check whether the Python function is created successfully.

    ```bash
    kubectl get all
    ```
