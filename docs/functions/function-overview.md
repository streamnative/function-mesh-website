---
title: Pulsar Functions overview
category: Functions
id: function-overview
---

**Pulsar Functions** are lightweight compute processes that can perform the following operations:

- consume messages from one or more Pulsar topics.

- apply a user-supplied processing logic to each message.

- publish the results of the computation to another topic.

Pulsar Functions are computing infrastructure of Pulsar messaging system. With Pulsar Functions, you can create complex processing logic without deploying a separate neighboring system, such as [Apache Storm](http://storm.apache.org/), [Apache Heron](https://heron.incubator.apache.org/), or [Apache Flink](https://flink.apache.org/).  

Pulsar Functions can be described as [Lambda](https://aws.amazon.com/lambda/)-style functions that are specifically designed to use Pulsar as a message bus.

## Programming model

Pulsar Functions provide a wide range of functionality, and the core programming model is simple. Functions receive messages from one or more **input topics**. After a message is received, the function completes the following tasks.

- Apply a processing logic to the input messages and write output messages to an **output topic** in Pulsar.

- Write logs to a **log topic**, which is mainly used for debugging issues.

![](../static/image/pulsar-functions-overview.png)

## Processing guarantees

Pulsar Functions provide three different messaging semantics that you can apply to any function.

| Delivery semantics | Description |
| ------------------| ------- |
| **At-most-once**  | The message sent to the function is processed at most once. Therefore, there is a chance that the message is not processed.  |
| **At-least-once**  | The message sent to the function is processed more than once. Therefore, there is a chance that the message is processed redundantly. |
| **Effectively-once**  | The message sent to the function is processed only once and has one output associated with it. |

## Supported languages

Currently, you can write Pulsar Functions in Java, Python, and Go. For details, refer to [functions examples](https://github.com/streamnative/function-mesh/tree/master/config/samples).

## Pulsar Functions APIs

Pulsar Functions APIs are used to manage Pulsar Functions. For details, see [Functions APIs](https://pulsar.apache.org/functions-rest-api/).
