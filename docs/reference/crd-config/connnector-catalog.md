---
title: Connector catalog CRD configurations
category: reference
id: connnector-catalog
---

The connector catelog CRD is only used to store metadata about built-in connectors in StreamNative Cloud. This table outlines the configurable fields of built-in connectors.

## Built-in connectors in StreamNative Cloud

| Field | Description |
| ---|---|
| `id` | The ID of the connector. |
| `name` | The name of the connector type. |
| `description` | The description that is used for user help. |
| `sourceClass` | The class name for the connector source implementation. If not defined, it assumes that the connector cannot act as a data source. |
| `sinkClass` | The class name for the connector sink implementation. If not defined, it assumes that the connector cannot act as a data sink. |
| `sourceConfigClass` | The class name for the source configuration implementation. If not defined, the framework cannot do any submission time checks. |
| `sinkConfigClass` | The class name for the sink configuration implementation. If not defined, the framework cannot do any submission time checks. |
| `version` | The version of the connector. |
| `imageRegistry` | The image registry that hosts the connector image. By default, the image registry is empty, which means that it uses the Docker Hub (`docker.io/`) to host the connector image. |
| `imageRepository` | The image repository to the connector. Usually, it is in a format of NAMESPACE/REPOSITORY. |
| `imageTag` | The tag to the connector image. By default, it aligns with Pulsar's version. |
| `typeClassName` | The type class name of the connector or function. By default, it is set to `'[B'`.|
| `sourceTypeClassName` | The type class name of the source connector. If not set, it will inherit the value from the `typeClassName` field. |
| `sinkTypeClassName` |  The type class name of the sink connector. If not set, it will inherit the value from the `typeClassName` field. |
| `jarFullName` | Optional. The JAR or NAR package name of the connector. If not set, it is generated based on the connector ID and connector version.| 
| `defaultSchemaType` |  Optional. The default schema type of the connector's topic. |
| `defaultSerdeClassName` | Optional. The default serde class name of the connector's topic. |

## Sample YAML file

This sample YAML file lists configurations of all StreamNative distributed built-in connectors.

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: ConnectorCatalog
metadata:
  labels:
    app.kubernetes.io/name: connectorcatalog
    app.kubernetes.io/instance: connectorcatalog-sample
    app.kubernetes.io/part-of: function-mesh
    app.kubernetes.io/managed-by: kustomize
    app.kubernetes.io/created-by: function-mesh
  name: connectorcatalog-sample
spec:
  connectorDefinitions:
    - id: pulsar-io-data-generator
      name: data-generator
      description: Test data generator connector
      sourceClass: org.apache.pulsar.io.datagenerator.DataGeneratorSource
      sourceConfigClass: org.apache.pulsar.io.datagenerator.DataGeneratorSourceConfig
      sinkClass: org.apache.pulsar.io.datagenerator.DataGeneratorPrintSink
      imageRepository: streamnative/pulsar-io-data-generator
      version: 2.9.2.17
      imageTag: 2.9.2.17
      typeClassName: org.apache.pulsar.io.datagenerator.Person
      configFieldDefinitions:
        - fieldName: sleepBetweenMessages
          typeName: long
          attributes:
              help: "How long to sleep between emitting messages"
              defaultValue: "50"
              sensitive: "false"
              required: "true"
    - id: pulsar-io-kafka
      name: kafka
      description: Kafka Source
      sourceClass: org.apache.pulsar.io.kafka.KafkaBytesSource
      imageRepository: streamnative/pulsar-io-kafka
      version: 2.9.2.17
      imageTag: 2.9.2.17
      sourceConfigClass: org.apache.pulsar.io.kafka.KafkaSourceConfig
      sourceTypeClassName: java.nio.ByteBuffer
    - id: pulsar-io-cloud-storage
      name: cloud-storage
      description: Cloud storage Sink
      sinkClass: org.apache.pulsar.io.jcloud.sink.CloudStorageGenericRecordSink
      sinkConfigClass: org.apache.pulsar.io.jcloud.sink.CloudStorageSinkConfig
      imageRepository: streamnative/pulsar-io-cloud-storage
      version: 2.9.2.17
      imageTag: 2.9.2.17
      typeClassName: org.apache.pulsar.client.api.schema.GenericRecord
```