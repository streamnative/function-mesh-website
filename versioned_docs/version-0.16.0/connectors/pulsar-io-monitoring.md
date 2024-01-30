---
title: Monitor Pulsar connectors
category: connectors
id: pulsar-io-monitoring
---

This document describes how to monitor Pulsar connectors (sources and sinks) with Prometheus.

## Monitoring with Prometheus

Prometheus is a monitoring and alerting system. It handles the multi-dimensional data. When you deploy Function Mesh in a Kubernetes cluster, the monitoring is setup automatically.

All the Pulsar connector metrics are labelled with the following labels:

- *cluster*: `cluster=${pulsar_cluster}`. `${pulsar_cluster}` is the cluster name that you have configured in the `broker.conf` file.
- *namespace*: `namespace=${pulsar_namespace}`. `${pulsar_namespace}` is the namespace name.

Pulsar connector metrics contain **source** metrics and **sink** metrics.

### Source metrics

| Name | Type | Description |
|---|---|---|
pulsar_source_written_total|Counter|The total number of records written to a Pulsar topic.
pulsar_source_written_total_1min|Counter|The total number of records written to a Pulsar topic in the last 1 minute.
pulsar_source_received_total|Counter|The total number of records received from source.
pulsar_source_received_total_1min|Counter|The total number of records received from source in the last 1 minute.
pulsar_source_last_invocation|Gauge|The timestamp of the last invocation of the source.
pulsar_source_source_exception|Gauge|The exception from a source.
pulsar_source_source_exceptions_total|Counter|The total number of source exceptions.
pulsar_source_source_exceptions_total_1min |Counter|The total number of source exceptions in the last 1 minute.
pulsar_source_system_exception|Gauge|The exception from system code.
pulsar_source_system_exceptions_total|Counter|The total number of system exceptions.
pulsar_source_system_exceptions_total_1min|Counter|The total number of system exceptions in the last 1 minute.
pulsar_source_user_metric_ | Summary|The user-defined metrics.

### Sink metrics

| Name | Type | Description |
|---|---|---|
pulsar_sink_written_total|Counter| The total number of records processed by a sink.
pulsar_sink_written_total_1min|Counter| The total number of records processed by a sink in the last 1 minute.
pulsar_sink_received_total_1min|Counter| The total number of messages that a sink has received from Pulsar topics in the last 1 minute. 
pulsar_sink_received_total|Counter| The total number of records that a sink has received from Pulsar topics. 
pulsar_sink_last_invocation|Gauge|The timestamp of the last invocation of the sink.
pulsar_sink_sink_exception|Gauge|The exception from a sink.
pulsar_sink_sink_exceptions_total|Counter|The total number of sink exceptions.
pulsar_sink_sink_exceptions_total_1min |Counter|The total number of sink exceptions in the last 1 minute.
pulsar_sink_system_exception|Gauge|The exception from system code.
pulsar_sink_system_exceptions_total|Counter|The total number of system exceptions.
pulsar_sink_system_exceptions_total_1min|Counter|The total number of system exceptions in the last 1 minute.
pulsar_sink_user_metric_ | Summary|The user-defined metrics.