---
title: Debug Pulsar Functions
category: functions
id: function-debug
---

This document describes how to debug Pulsar functions through Pod logs and log topics.

## Use Pod logs

Logs in Kubernetes give you insight into resources such as nodes, Pods, containers, deployments and replica sets. This insight allows you to observe the interactions between those resources and see the effects that one action has on another. Pod logs record events happening in a cluster, which can be very useful for debugging. Before debugging a Pod, you need to ensure the Pod is already scheduled and running.

The built-in way to check logs on your Kubernetes cluster is with `kubectl` CLI commands. You can use the `kubectl logs pod POD_NAME -n NAMESPACE_NAME` to check logs of the affected container. In addition, you can use `kubectl logs pod POD_NAME -n NAMESPACE_NAME --previous` to retrieve logs from a previous instantiation of a container.

In addition, you can use the following command to check the specific Pod.

- `kubectl get pod POD_NAME -n NAMESPACE_NAME`: check Pod status.

- `kubectl describe pod POD_NAME -n NAMESPACE_NAME`: check the current state of the Pod and recent events.

For the use of `kubectl` commands, see [here](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands).

## Use log topic

In Pulsar Functions, you can generate log information defined in functions to a specified log topic. You can configure consumers to consume messages from a specified log topic to check the log information.

![Pulsar Functions core programming model](../assets/pulsar-functions-overview.png)

**Example**

```java
import org.apache.pulsar.functions.api.Context;
import org.apache.pulsar.functions.api.Function;
import org.slf4j.Logger;

public class LoggingFunction implements Function<String, Void> {
    @Override
    public void apply(String input, Context context) {
        Logger LOG = context.getLogger();
        String messageId = new String(context.getMessageId());

        if (input.contains("danger")) {
            LOG.warn("A warning was received in message {}", messageId);
        } else {
            LOG.info("Message {} received\nContent: {}", messageId, input);
        }

        return null;
    }
}
```

As shown in the example above, you can get the logger via `context.getLogger()` and assign the logger to the `LOG` variable of `slf4j`, so you can define your desired log information in a function using the `LOG` variable. Meanwhile, you need to specify the topic to which the log information is produced.

This example shows how to specify the log topic through the CRD.

```yaml
apiVersion: cloud.streamnative.io/v1alpha1
kind: Function
metadata:
  name: java-function-sample
  namespace: default
spec:
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
  # Other function configs
```