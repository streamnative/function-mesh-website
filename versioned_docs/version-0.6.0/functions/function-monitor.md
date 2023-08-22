---
title: Monitor Pulsar Functions
category: functions
id: function-monitor
---

This document describes how to monitor Pulsar functions with Prometheus.

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