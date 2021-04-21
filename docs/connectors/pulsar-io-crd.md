---
title: Pulsar connector CRD configurations
category: connectors
id: pulsar-io-crd
---
This document lists CRD configurations available for Pulsar IO (source and sink connectors).

## Source CRD configurations

The source CRD configurations consist of source connector configurations and the common CRD configurations.

### Source configurations

This table lists source configurations.

| Field | Description |
| --- | --- |
| `name` | The name of a source connector. |  
| `classname` | The class name of a source connector. | 
| `tenant` | The tenant of a source connector. |  
| `Replicas`| The number of Pulsar instances that you want to run this source connector. |
| `MaxReplicas`| The maximum number of Pulsar instances that you want to run for this source connector. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the source controller automatically scales the source connector based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `LogTopic` | The topic to which the logs of a source connector are produced. |  
| `SourceConfig` | The map to a ConfigMap specifying the configuration of a source connector. |
| `ProcessingGuarantee` | The processing guarantees (delivery semantics) applied to the source connector. Available values: `ATLEAST_ONCE`, `ATMOST_ONCE`, `EFFECTIVELY_ONCE`.|

### Common source CRD configurations

For details, see [Common CRD configurations](/functions/function-crd.md#common-crd-configurations).

## Sink CRD configurations

The sink CRD configurations consist of source connector configurations and the common CRD configurations.

### Sink configurations

This table lists sink configurations.

| Field | Description |
| --- | --- |
| `name` | The name of a sink connector. |  
| `classname` | The class name of a sink connector. | 
| `tenant` | The tenant of a sink connector. |  
| `Replicas`| The number of Pulsar instances that you want to run this sink connector. |
| `MaxReplicas`| The maximum number of Pulsar instances that you want to run for this sink connector. When the value of the `maxReplicas` parameter is greater than the value of `replicas`, it indicates that the sink controller automatically scales the sink connector based on the CPU usage. By default, `maxReplicas` is set to 0, which indicates that auto-scaling is disabled. |
| `LogTopic` | The topic to which the logs of a sink connector are produced. |  
| `SinkConfig` | The map to a ConfigMap specifying the configuration of a sink connector. |
| `Timeout` | The message timeout in milliseconds. |
| `NegativeAckRedeliveryDelayMs`| 	The number of redelivered messages due to negative acknowledgement. |
| `AutoAck` | Whether or not the framework acknowledges messages automatically. |
| `MaxMessageRetry` | How many times to process a message before giving up. |  
| `ProcessingGuarantee` | The processing guarantees (delivery semantics) applied to the source connector. Available values: `ATLEAST_ONCE`, `ATMOST_ONCE`, `EFFECTIVELY_ONCE`.| 
| `RetainOrdering` | The sink connector consumes and processes messages in order. |  
| `DeadLetterTopic` | The topic where all messages that were not processed successfully are sent. | 
| SubscriptionName | The subscription name of the sink connector if you want a specific subscription-name for the input-topic consumer. |  
| `CleanupSubscription` | Configure whether to clean up subscriptions. |
| `SubscriptionPosition` | The subscription position. |

### Common sink CRD configurations

For details, see [Common CRD configurations](/functions/function-crd.md#common-crd-configurations).
