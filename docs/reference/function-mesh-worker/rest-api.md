---
title: REST APIs
category: function-mesh-worker
id: rest-api
---

A REST API, also known as a RESTful API (Representational State Transfer Application Programming Interface), is a set of definitions and protocols for building and integrating application software. It follows the REST standards and uses HTTP requests to GET, PUT, POST, and DELETE data. In geneal, a REST API is a set of remote calls that uses standard methods to request and return data in a specific format between two systems.

The Function Mesh Worker service supports most of Functions, Sources, and Sinks REST APIs that are provided by Pulsar. For details, see the following Pulsar documentation.

- [Functions APIs](https://pulsar.apache.org/functions-rest-api/?version=master#tag/functions)
- [Sources APIs](https://pulsar.apache.org/source-rest-api/?version=master#tag/sources)
- [Sinks APIs](https://pulsar.apache.org/sink-rest-api/?version=master#tag/sinks)

Currently, the Function Mesh Worker service does not support the following Functions, Sources, and Sinks REST APIs.

<table>
  <tr>
    <th>REST API category</th>
    <th>Unsupported APIs</th>
  </tr>
  <tr>
    <th rowspan="9">Functions APIs</th>
    <td>Fetch the list of built-in Pulsar functions.</td>
  </tr>
  <tr>
    <td>Reload the built-in Pulsar functions.</td>
  </tr>
  <tr>
    <td>Restart all instances of a Pulsar function.</td>
  </tr>
  <tr>
    <td>Start all instances of a Pulsar function.</td>
  </tr>
  <tr>
    <td>Stop all instances of a Pulsar function. </td>
  </tr>
  <tr>
    <td>Trigger a Pulsar function with a user-specified value or with data from a file. </td>
  </tr>
  <tr>
    <td> Restart an instance of a Pulsar function. </td>
  </tr>
  <tr>
    <td> Start an instance of a Pulsar function. </td>
  </tr>
  <tr>
    <td> Stop an instance of a Pulsar function. </td>
  </tr>
  <tr>
    <th rowspan="6">Sources APIs</th>
    <td>Restart all instances of a Source. </td>
  </tr>
  <tr>
    <td>Start all instances of a Source. </td>
  </tr>
  <tr>
    <td>Stop all instances of a Source. </td>
  </tr>
  <tr>
    <td>Restart an instance of a Source. </td>
  </tr>
  <tr>
    <td>Start an instance of a Source. </td>
  </tr>
  <tr>
    <td>Stop an instance of a Source. </td>
  </tr>
  <tr>
    <th rowspan="6">Sinks APIs</th>
    <td>Restart all instances of a Sink. </td>
  </tr>
  <tr>
    <td>Start all instances of a Sink. </td>
  </tr>
  <tr>
    <td>Stop all instances of a Sink. </td>
  </tr>
  <tr>
    <td>Restart an instance of a Sink. </td>
  </tr>
  <tr>
    <td>Start an instance of a Sink. </td>
  </tr>
  <tr>
    <td>Stop an instance of a Sink. </td>
  </tr>
</table>
