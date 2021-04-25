---
title: Monitor Pulsar Functions
category: functions
id: function-monitor
---

This document describes how to monitor Pulsar functions with Prometheus and `pulsar-admin` commands.

## Monitoring with Prometheus

Prometheus is a monitoring and alerting system. It handles the multi-dimensional data. When you deploy Function Mesh in a Kubernetes cluster, the monitoring is setup automatically.

### Pulsar Function metrics

All the Pulsar Functions metrics are labelled with the following labels:

- *cluster*: `cluster=${pulsar_cluster}`. `${pulsar_cluster}` is the cluster name that you have configured in the `broker.conf` file.
- *namespace*: `namespace=${pulsar_namespace}`. `${pulsar_namespace}` is the namespace name.

| Name | Type | Description |
|---|---|---|
| pulsar_function_processed_successfully_total | Counter | The total number of messages processed successfully. |
| pulsar_function_processed_successfully_total_1min | Counter | The total number of messages processed successfully in the last 1 minute. |
| pulsar_function_system_exceptions_total | Counter | The total number of system exceptions. |
| pulsar_function_system_exceptions_total_1min | Counter | The total number of system exceptions in the last 1 minute. |
| pulsar_function_user_exceptions_total | Counter | The total number of user exceptions. |
| pulsar_function_user_exceptions_total_1min | Counter | The total number of user exceptions in the last 1 minute. |
| pulsar_function_process_latency_ms | Summary | The process latency in milliseconds. |
| pulsar_function_process_latency_ms_1min | Summary | The process latency in milliseconds in the last 1 minute. |
| pulsar_function_last_invocation | Gauge | The timestamp of the last invocation of the function. |
| pulsar_function_received_total | Counter | The total number of messages received from source. |
| pulsar_function_received_total_1min | Counter | The total number of messages received from source in the last 1 minute. |
pulsar_function_user_metric_ | Summary|The user-defined metrics.

## Monitoring with `pulsar-admin` CLI tool

> **Note**
>
> To use the `pulsar-admin` CLI tool to monitor Pulsar functions and connectors, you should start Mesh Worker service in advance. For details, see [work with `pulsar-admin` CLI tool](/install-function-mesh.md#work-with-pulsar-admin-cli-tool).

To monitor a Pulsar function, you can perform the following operations.

* [Get the information of a Pulsar function](#get).

* [Get a list of running Pulsar functions](#list).

* [Get the current status of a Pulsar function](#status).

* [Get the current stats of a Pulsar function](#stats).

For more information, see [Pulsar Functions CLIs](http://pulsar.apache.org/tools/pulsar-admin/2.8.0-SNAPSHOT/#functions).

### `get`

The `pulsar-admin functions get` command is used to get information about a Pulsar Function.

```bash
pulsar-admin functions get options
```

### `list`

The `pulsar-admin functions list` command is used to lists all running Pulsar functions.

```bash
pulsar-admin functions list options
```

### `status`

The `pulsar-admin functions status` command is used to check the current status of a Pulsar function.

```bash
pulsar-admin functions status options
```

### `stats`

The `pulsar-admin functions stats` command is used to get the current stats of a Pulsar Function.

```bash
pulsar-admin functions stats options
```