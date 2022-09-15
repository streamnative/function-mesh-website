---
title: Produce function logs
category: functions
id: produce-function-log
---

Logs can help you understand how your function is used to prevent inappropriate behavior that causes any potential errors.

This document describes how to set log levels and produce logs for Pulsar functions.

## Set log levels

A [log level](/functions/function-crd.md#log-levels) is a piece of information that indicates how important a given log message is. By default, the log level for Pulsar functions is `info`. If you want to check logs at different levels, you can configure the log levels for different Pulsar function runtimes.

You can use the `spec.log.level` option to specify a particular log level. Or, you can customize a log configuration file based on your requirements and reference to the log configuration file by using the `spec.log.logConfig` option.

This example shows how to specify a `debug` log level by using the `spec.log.level` option.

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  name: function-sample
  namespace: default
spec:
  java:                     --- [1]
    log:                    --- [2]
      level: "debug"        --- [3]
```

- [1] `java`: represents the runtime with a specific programming language. Currently, available options include the Java runtime, the Python runtime, and the Go runtime.
- [2] `log`: represents the log configurations for a Pulsar function.
- [3] `level`: represents the [log levels](/functions/function-crd.md#log-levels) available for a Pulsar function.

This example shows how to specify a `debug` log level by using the customized configuration file.

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  name: function-sample
  namespace: default
spec:
  java:                                 --- [1]
    log:                                --- [2]
      logConfig:                        --- [3]
        name: "java-log-config-cm"
        key: "java-config-xml"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: java-log-config-cm
data:
  java-config-xml: |
    <Configuration>
        <name>pulsar-functions-kubernetes-instance</name>
        <monitorInterval>30</monitorInterval>
        <Properties>
            <Property>                   --- [4]
                <name>pulsar.log.level</name>       
                <value>DEBUG</value>
            </Property>
            <Property>
                <name>bk.log.level</name>
                <value>DEBUG</value>
            </Property>
        </Properties>
        <Appenders>                      --- [5]
            <Console>
                <name>Console</name>          
                <target>SYSTEM_OUT</target>
                <PatternLayout>
                    <Pattern>%d{ISO8601_OFFSET_DATE_TIME_HHMM} [%t] %-5level %logger{36} - %msg%n</Pattern>
                </PatternLayout>
            </Console>
        </Appenders>
        <Loggers>            
            <Logger>                     --- [6]
                <name>org.apache.pulsar.functions.runtime.shaded.org.apache.bookkeeper</name>
                <level>${sys:bk.log.level}</level>
                <additivity>false</additivity>              --- [7]
                <AppenderRef>                               --- [8]
                    <ref>Console</ref>
                </AppenderRef>
            </Logger>
            <Root>
                <level>${sys:pulsar.log.level}</level>
                <AppenderRef>
                    <ref>Console</ref>
                    <level>${sys:pulsar.log.level}</level>
                </AppenderRef>
            </Root>
        </Loggers>
    </Configuration>
```

- [1] `java`: represents the runtime with a specific programming language. Currently, available options include the Java runtime, the Python runtime, and the Go runtime.
- [2] `log`: represents the log configurations for a Pulsar function.
- [3] `logConfig`: represents the log configuration file in a format of [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/).
- [4] `Property`: it is a name-value pair that represents the [log levels](/functions/function-crd.md#log-levels) available for a Pulsar function.
- [5] `Appenders`: represents the destination that the logs are delivered to.
- [6] `Loggers`: represents a class or module type that is used to perform logging.
- [7] `additivity`:indicates whether log messages will be duplicated if multiple `<Logger>` entries overlap. If it is set to `false`, it means to prevent duplication of log messages when one or more `<Logger>` entries contain classes or modules that overlap.
- [8] `AppenderRef`: allows you to output the log to a destination that is specified in the `Appender` section.

## Produce logs for Pulsar functions

To produce logs for a Pulsar functions, follow these steps.


::: tabs

@@@ Java

1. Specify a log topic when you run a Java function.

    This example specify the `persistent://public/default/logging-function-logs` as the log topic for the Java function.

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
    ...
    ```

2. Set a log level. 

    For details, see [set log levels](#set-log-levels).

3. Apply the YAML file to run the Java function.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

    After the Jave function runs successfully, you can check the log content, which is similar to: 

    ```
    2022-08-25T00:32:34,112+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.channel.MultithreadEventLoopGroup - -Dio.netty.eventLoopThreads: 2
    2022-08-25T00:32:35,012+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.util.internal.InternalThreadLocalMap - -Dio.netty.threadLocalMap.stringBuilder.initialSize: 1024
    2022-08-25T00:32:35,012+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.util.internal.InternalThreadLocalMap - -Dio.netty.threadLocalMap.stringBuilder.maxSize: 4096
    2022-08-25T00:32:35,115+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.util.internal.PlatformDependent - org.jctools-core.MpscChunkedArrayQueue: available
    2022-08-25T00:32:35,511+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.util.ResourceLeakDetector - -Dio.grpc.netty.shaded.io.netty.leakDetection.level: simple
    2022-08-25T00:32:35,512+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.util.ResourceLeakDetector - -Dio.grpc.netty.shaded.io.netty.leakDetection.targetRecords: 4
    2022-08-25T00:32:35,513+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.numHeapArenas: 2
    2022-08-25T00:32:35,513+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.numDirectArenas: 2
    2022-08-25T00:32:35,513+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.pageSize: 8192
    2022-08-25T00:32:35,513+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.maxOrder: 11
    2022-08-25T00:32:35,513+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.chunkSize: 16777216
    2022-08-25T00:32:35,513+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.smallCacheSize: 256
    2022-08-25T00:32:35,513+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.normalCacheSize: 64
    2022-08-25T00:32:35,514+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.maxCachedBufferCapacity: 32768
    2022-08-25T00:32:35,514+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.cacheTrimInterval: 8192
    2022-08-25T00:32:35,514+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.cacheTrimIntervalMillis: 0
    2022-08-25T00:32:35,514+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.useCacheForAllThreads: true
    2022-08-25T00:32:35,514+0000 [main] DEBUG io.grpc.netty.shaded.io.netty.buffer.PooledByteBufAllocator - -Dio.netty.allocator.maxCachedByteBuffersPerChunk: 1023
    2022-08-25T00:32:35,815+0000 [grpc-default-boss-ELG-1-1] DEBUG io.grpc.netty.shaded.io.netty.channel.DefaultChannelId - -Dio.netty.processId: 1 (auto-detected)
    2022-08-25T00:32:35,818+0000 [grpc-default-boss-ELG-1-1] DEBUG io.grpc.netty.shaded.io.netty.channel.DefaultChannelId - -Dio.netty.machineId: 5a:b8:c7:ff:fe:93:26:86 (auto-detected)
    2022-08-25T00:32:36,215+0000 [grpc-default-boss-ELG-1-1] DEBUG io.grpc.netty.shaded.io.netty.buffer.ByteBufUtil - -Dio.netty.allocator.type: pooled
    2022-08-25T00:32:36,215+0000 [grpc-default-boss-ELG-1-1] DEBUG io.grpc.netty.shaded.io.netty.buffer.ByteBufUtil - -Dio.netty.threadLocalDirectBufferSize: 0
    2022-08-25T00:32:36,307+0000 [grpc-default-boss-ELG-1-1] DEBUG io.grpc.netty.shaded.io.netty.buffer.ByteBufUtil - -Dio.netty.maxThreadLocalCharBufferSize: 16384
    2022-08-25T00:32:36,415+0000 [main] INFO  org.apache.pulsar.functions.runtime.JavaInstanceStarter - JavaInstance Server started, listening on 9093
    2022-08-25T00:32:36,416+0000 [main] INFO  org.apache.pulsar.functions.runtime.JavaInstanceStarter - Starting runtimeSpawner
    ```

@@@

@@@ Python

1. Specify a log topic when you run a Python function.

    This example specify the `persistent://public/default/logging-function-logs` as the log topic for the Python function.

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
    ...
    ```

2. Set a log level.

    For details, see [set log levels](#set-log-levels).

3. Apply the YAML file to run the Python function.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

    After the Python function runs successfully, you can check the log content, which is similar to: 

    ```
    [2022-08-25 00:35:18 +0000] [INFO] python_instance_main.py: Starting Python instance with Namespace(client_auth_params=None, client_auth_plugin=None, cluster_name='test', dependency_repository=None, expected_healthcheck_interval=-1, extra_dependency_repository=None, function_details='{"tenant":"public","namesp
    [2022-08-25 00:35:18 +0000] [DEBUG] util.py: Trying to import secretsprovider.EnvironmentBasedSecretsProvider from path /pulsar/instances/python-instance
    [2022-08-25 00:35:18 +0000] [INFO] log.py: Setting up producer for log topic persistent://public/default/py-function-logs
    2022-08-25 00:35:18.425 INFO  [140709055104768] ExecutorService:41 | Run io_service in a single thread
    2022-08-25 00:35:18.426 INFO  [140709113706304] ClientConnection:189 | [<none> -> pulsar://sn-platform-pulsar-broker.default.svc.cluster.local:6650] Create ClientConnection, timeout=10000
    2022-08-25 00:35:18.426 INFO  [140709113706304] ConnectionPool:96 | Created connection for pulsar://sn-platform-pulsar-broker.default.svc.cluster.local:6650
    2022-08-25 00:35:18.438 INFO  [140709055104768] ClientConnection:375 | [10.233.106.150:37296 -> 10.233.106.118:6650] Connected to broker
    2022-08-25 00:35:18.443 INFO  [140709055104768] HandlerBase:64 | [persistent://public/default/py-function-logs, ] Getting connection from pool
    2022-08-25 00:35:18.473 INFO  [140709055104768] ClientConnection:189 | [<none> -> pulsar://sn-platform-pulsar-broker-0.sn-platform-pulsar-broker.default.svc.cluster.local:6650] Create ClientConnection, timeout=10000
    2022-08-25 00:35:18.473 INFO  [140709055104768] ConnectionPool:96 | Created connection for pulsar://sn-platform-pulsar-broker-0.sn-platform-pulsar-broker.default.svc.cluster.local:6650
    2022-08-25 00:35:18.476 INFO  [140709055104768] ClientConnection:375 | [10.233.106.150:37298 -> 10.233.106.118:6650] Connected to broker
    2022-08-25 00:35:18.561 INFO  [140709055104768] ProducerImpl:188 | [persistent://public/default/py-function-logs, ] Created producer on broker [10.233.106.150:37298 -> 10.233.106.118:6650]
    [2022-08-25 00:35:18 +0000] [DEBUG] util.py: Trying to import serde.IdentitySerDe from path /pulsar/examples/python-examples
    [2022-08-25 00:35:18 +0000] [DEBUG] util.py: Add a new dependency to the path: /pulsar/examples/python-examples
    [2022-08-25 00:35:18 +0000] [DEBUG] util.py: Trying to import serde.IdentitySerDe from path /pulsar/instances/python-instance/pulsar/functions
    [2022-08-25 00:35:18 +0000] [DEBUG] util.py: Add a new dependency to the path: /pulsar/instances/python-instance/pulsar/functions
    [2022-08-25 00:35:18 +0000] [DEBUG] python_instance.py: Setting up consumer for topic persistent://public/default/input-python-log-level-topic with subname public/default/python-log-config
    2022-08-25 00:35:18.568 INFO  [140709113706304] Client:88 | Subscribing on Topic :persistent://public/default/input-python-log-level-topic
    2022-08-25 00:35:18.601 INFO  [140709055104768] HandlerBase:64 | [persistent://public/default/input-python-log-level-topic, public/default/python-log-config, 0] Getting connection from pool
    2022-08-25 00:35:18.601 INFO  [140708958693120] ExecutorService:41 | Run io_service in a single thread
    2022-08-25 00:35:18.691 INFO  [140709055104768] ConsumerImpl:222 | [persistent://public/default/input-python-log-level-topic, public/default/python-log-config, 0] Created consumer on broker [10.233.106.150:37298 -> 10.233.106.118:6650]
    [2022-08-25 00:35:18 +0000] [DEBUG] util.py: Trying to import exclamation_function.ExclamationFunction from path /pulsar/examples/python-examples
    [2022-08-25 00:35:18 +0000] [DEBUG] python_instance.py: Started Thread for executing the function
    [2022-08-25 00:35:18 +0000] [INFO] server.py: Serving InstanceCommunication on port 9093
    ```

@@@

@@@ Go

1. Specify a log topic when you run a Go function.

    This example specify the `persistent://public/default/logging-function-logs` as the log topic for the Go function.

    ```yaml
    apiVersion: compute.functionmesh.io/v1alpha1
    kind: Function
    metadata:
      name: go-function-sample
      namespace: default
    spec:
      image: streamnative/pulsar-functions-go-runner:2.7.1 # using go function runner
      className: exclamation_function.ExclamationFunction
      forwardSourceMessageProperty: true
      maxPendingAsyncRequests: 1000
      replicas: 1
      maxReplicas: 5
      logTopic: persistent://public/default/logging-function-logs
    ...
    ```

2. Set a log level.

    For details, see [set log levels](#set-log-levels).

3. Apply the YAML file to run the Go function.

    ```bash
    kubectl apply -f /path/to/YAML/file
    ```

After the Go function runs successfully, you can check the log content, which is similar to: 

@@@

:::

## Next step

- [Debug Pulsar Functions](/functions/function-debug.md)
