---
title: Release notes v0.1.7
category: releases
id: release-note-0-1-7
---

Here are some highlights of this release. For a full list of updates available for Release v0.1.7, check out [here](https://github.com/streamnative/function-mesh/releases/tag/v0.1.7).

## YAML configuration supports multiple values

In previous releases, the Pulsar Function or connector configurations were declared as `map[string]string`, and nested or complex configurations shown below were not supported.

```yaml
sinkConfig:
    topics:
        a: xxx
        b: xxxx
    settings:
        x: 123
        y: foo
```

In this release, multiple values for related parameters are supported. You can define untyped Pulsar Function or connector configurations in the YAML format, as shown below.

```yaml
sinkConfig:
  topics:
    players:
      operation:
        type: write
        total-timeout: 0
      mapping:
        bins:
          type: multi-bins
          map:
            name:
              source: value-field
              field-name: name
        key-field:
          source: key
        namespace:
          mode: dynamic
          source: value-field
          field-name: namespace
        ttl:
          mode: dynamic
          source: value-field
          field-name: ttl
    retired-players:
      operation:
        type: delete
      mapping:
        key-field:
          source: key
        namespace:
          mode: static
          value: test
    services:
      use-services-alternate: true
```

## Pulsar source connectors can pass message properties to a target topic

In previous releases, Pulsar source connectors could not pass message properties to a target topic because the `forwardSourceMessageProperty` was not applied to the source connector.

In this release, the `forwardSourceMessageProperty` parameter is added to the source connectors. You can use Function Mesh to pass message properties to the target topic.

## Function Mesh provides multiple options for auto-scaling the number of Pods

In previous releases, Function Mesh supported scaling Pods (Function instances or Connector instances) based on the CPU utilization automatically.

In this release, Function Mesh auto-scales the number of Pods based on the CPU usage, memory usage, and metrics.

- CPU usage: auto-scale the number of Pods based on 80%, 50% or 20% CPU utilization. 
- Memory usage: auto-scale the number of Pods based on 80%, 50% or 20% memory utilization.
- Metrics: auto-scale the number of Pods based on a single metric.

For details, see [scaling](/scaling.md).