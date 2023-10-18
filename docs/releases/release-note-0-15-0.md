---
title: Release notes v0.15.0
category: releases
id: release-note-0-15-0
---

Here are some highlights of this release. For a full list of updates available for Release v0.15.0, check out the [Function Mesh change log](https://github.com/streamnative/function-mesh/releases/tag/v0.15.0).

## Support YAML config for java runtime

A new field `javaLog4JConfigFileType` is added to the `log` field:

```yaml
  java:
    log:
      javaLog4JConfigFileType: "yaml" # or xml
```

When yaml is set, the log4j2 configuration file will be generated in the YAML format. Otherwise, the log4j2 configuration file will be generated in the XML format.

## Support log format json for java and python

A new field `format` is added to the `log` field:

```yaml
  java:
    log:
      format: "json" # or text
```

When json is set, the log will be formatted in the JSON format. Otherwise, the log will be formatted in the text format.
Supported for java and python function.