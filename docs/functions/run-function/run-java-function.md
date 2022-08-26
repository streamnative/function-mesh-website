---
title: Run Java Functions
category: functions
id: run-java-function
---

Pulsar Functions is a succinct computing abstraction that Apache Pulsar enables users to express simple ETL and streaming tasks. Currently, Function Mesh supports using Java, Python, or Go programming language to define a YAML file of the Functions.

This document describes how to run Java Functions. To run a Java Functions in Function Mesh, you need to package the Functions and then submit it to a Pulsar cluster.

## Package Java Functions

After developing and testing your Pulsar Functions , you need to package it so that it can be submitted to a Pulsar cluster. You can package Java Functions to NAR/JAR packages or Docker images.

### Java Functions packages

This section describes how to package a Java Functions and upload it to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

#### Build Java Functions packages

This section describes how to build packages for Java Functions.

##### Prerequisites

- Apache Pulsar 2.8.0 or higher
- Function Mesh v0.1.3 or higher

##### Steps

To package a Functions in Java, follow these steps.

1. Create a new Maven project with a `pom.xml` file. In the following code sample, the value of `mainClass` is your package name.

   ```Java
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
       <modelVersion>4.0.0</modelVersion>
   
       <groupId>java-function</groupId>
       <artifactId>java-function</artifactId>
       <version>1.0-SNAPSHOT</version>
   
       <dependencies>
           <dependency>
               <groupId>org.apache.pulsar</groupId>
               <artifactId>pulsar-functions-api</artifactId>
               <version>2.6.0</version>
           </dependency>
       </dependencies>
   
       <build>
           <plugins>
               <plugin>
                   <artifactId>maven-assembly-plugin</artifactId>
                   <configuration>
                       <appendAssemblyId>false</appendAssemblyId>
                       <descriptorRefs>
                           <descriptorRef>jar-with-dependencies</descriptorRef>
                       </descriptorRefs>
                       <archive>
                       <manifest>
                           <mainClass>org.example.test.ExclamationFunction</mainClass>
                       </manifest>
                   </archive>
                   </configuration>
                   <executions>
                       <execution>
                           <id>make-assembly</id>
                           <phase>package</phase>
                           <goals>
                               <goal>assembly</goal>
                           </goals>
                       </execution>
                   </executions>
               </plugin>
               <plugin>
                   <groupId>org.apache.maven.plugins</groupId>
                   <artifactId>maven-compiler-plugin</artifactId>
                   <configuration>
                       <source>8</source>
                       <target>8</target>
                   </configuration>
               </plugin>
           </plugins>
       </build>
   
   </project>
   ```

2. Write a Java Functions.

   ```java
   package org.example.test;
   
   import java.util.function.Function;
   
   public class ExclamationFunction implements Function<String, String> {
       @Override
       public String apply(String s) {
           return "This is my function!";
       }
   }
   ```

3. Package the Java Functions.

   ```bash
   mvn package
   ```

   After the Java Functions is packaged, a `target` directory is created automatically. Open the `target` directory to check if there is a JAR package similar to `java-function-1.0-SNAPSHOT.jar`.

#### Upload Java Functions packages

Use the `pulsar-admin` CLI tool to upload the package to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

> **Note**
>
> Before uploading the package to Pulsar package management service, you need to enable the package management service in the `broker.config` file.

This example shows how to upload the package of the `my-function@0.1` Functions to the [Pulsar package management service](http://pulsar.apache.org/docs/en/next/admin-api-packages/).

```bash
bin/pulsar-admin packages upload function://my-tenant/my-ns/my-function@0.1 --path "/path/to/package-file" --description PACKAGE_DESCRIPTION
```

Then, you can define Functions CRDs by specifying the uploaded Functions package.

### Docker images

This section describes how to package a Pulsar Functions to a Docker image.

#### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher

#### Build Docker images

To build a Docker image, follow these steps.

1. Package your Pulsar function. For details, see [package Pulsar functions](#package-pulsar-functions).

2. Define a `Dockerfile`.

   This example shows how to define a `Dockerfile` with a JAR package (`example-function.jar`) of the Java Functions.

   ```dockerfile
   # Use pulsar-functions-java-runner since we pack Java function
   FROM streamnative/pulsar-functions-java-runner:2.7.1
   # Copy function JAR package into /pulsar directory  
   COPY example-function.jar /pulsar/
   ```

Then, you can push the Functions Docker image into an image registry (such as the [Docker Hub](https://hub.docker.com/), or any private registry) and use the Functions Docker image to configure and submit the Functions to a Pulsar cluster.

### Buildpacks

This tutorial will help you go through the FunctionMesh Buildpacks by building a Java function image.

#### Prerequisites

- Apache Pulsar 2.7.0 or higher
- Function Mesh v0.1.3 or higher
- [Pack](https://buildpacks.io/docs/tools/pack/#install), CLI tools for manipulating Cloud Native Buildpacks

#### Directory structure

```
.
|-- builders
|   `-- java-builder
|       `-- builder.toml
|-- buildpacks
|   `-- java-maven
|       |-- bin
|       |   |-- build
|       |   `-- detect
|       `-- buildpack.toml
`-- stack
    |-- stack.build.Dockerfile
    `-- stack.java-runner.run.Dockerfile
```

#### Stack

The Stack is the basic building and running environment for an application (in this case, a Java function).

According to the usage case, we divide the Stack into Build image and Run image.

##### Build Image

The Build image provides the OS environment for the application during the building phase.

Note that we set the stack ID: `io.functionmesh.stack`

***stack.build.Dockerfile***

```dockerfile
FROM ubuntu:20.04

ARG pulsar_uid=10000
ARG pulsar_gid=10001
ARG stack_id="io.functionmesh.stack"

RUN apt-get update && \
  apt-get install -y xz-utils ca-certificates git wget jq gcc && \
  rm -rf /var/lib/apt/lists/* && \
  wget -O /usr/local/bin/yj https://github.com/bruceadams/yj/releases/download/v1.2.2/yj.linux.x86_64 && \
  chmod +x /usr/local/bin/yj

LABEL io.buildpacks.stack.id=${stack_id}

RUN groupadd pulsar --gid ${pulsar_gid} && \
  useradd --uid ${pulsar_uid} --gid ${pulsar_gid} -m -s /bin/bash pulsar

ENV CNB_USER_ID=${pulsar_uid}
ENV CNB_GROUP_ID=${pulsar_gid}
ENV CNB_STACK_ID=${stack_id}

USER ${CNB_USER_ID}:${CNB_GROUP_ID}
```

Use the following command to create it.

```shell
docker build -t fm-stack-build:v1 -f ./stack.build.Dockerfile .
```

##### Run Image

The Run image provides the OS environment for the application during the running phase.

***stack.run.Dockerfile***

> **Note**
>
> Here we use the `streamnative/pulsar-functions-java-runner:2.9.2.23` as the base image. You can also switch the version of the base image according to your needs.

```dockerfile
FROM streamnative/pulsar-functions-java-runner:2.9.2.23

ARG pulsar_uid=10000
ARG pulsar_gid=10001
ARG stack_id="io.functionmesh.stack"
LABEL io.buildpacks.stack.id=${stack_id}

ENV CNB_USER_ID=${pulsar_uid}
ENV CNB_GROUP_ID=${pulsar_gid}
ENV CNB_STACK_ID=${stack_id}
```

Use the following command to create it.

```shell
docker build -t fm-stack-java-runner-run:v1 -f ./stack.java-runner.run.Dockerfile .
```

#### Buildpacks

In this case, we need a Buildpack to determine if the Java files (with the suffix ".java") and the required items (e.g. "pom.xml") exist, and if so, build the target artifact (usually a ".jar" file) with Maven and move it to `/pulsar`.

We can use the following command to create the buildpack.

Note that we set the Buildpack ID:  `functionmesh/java-maven`

```shell
pack buildpack new functionmesh/java-maven \
    --api 0.7 \
    --path java-maven \
    --version 0.0.1 \
    --stacks io.functionmesh.stack
```

After the above command has successfully executed, we can find a directory named "java-maven" is created.

```
`-- java-maven
    |-- bin
    |   |-- build
    |   `-- detect
    `-- buildpack.toml
```

***buildpack.toml***

The `buildpack.toml` is the configuration file for the buildpack, which contains the `buildpack id`, `stack id`, and other information.

```toml
api = "0.7"

[buildpack]
  id = "functionmesh/java-maven"
  version = "0.0.1"

[[stacks]]
  id = "io.functionmesh.stack"
```

***bin/detect***

```bash
#!/usr/bin/env bash

set -eo pipefail

# Detect the presence of Java files here
java_num=$(find . -name "*.java" | wc -l)
if [[ ${java_num} -eq 0 ]]; then
    echo "no java files found"
    exit 100
fi

# Detect the presence of required items here
requires=("pom.xml")
require_met=false
for r in ${requires[*]}; do 
    ls ${r}
    if [ $? -eq 0 ]; then
        require_met=true
        break
    fi
done

if [[ !${require_met} ]]; then
    echo "no required items found"
    exit 100
fi

exit 0
```

***bin/build***

```bash
#!/usr/bin/env bash

set -eo pipefail

layers_dir="$1"
env_dir="$2/env"
plan_path="$3"

# LOAD USER-PROVIDED BUILD-TIME ENVIRONMENT VARIABLES
if compgen -G "${env_dir}/*" > /dev/null; then
  for var in ${env_dir}/*; do
    declare "$(basename ${var})=$(<${var})"
  done
fi

# Download Java runtime, default version is jdk 17
jdk_url="https://cdn.azul.com/zulu/bin/zulu17.36.13-ca-jdk17.0.4-linux_x64.tar.gz"
jdk_version="1.17.0_4"

maven_url="https://dlcdn.apache.org/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz"
maven_version="3.8.6"

cached_jdk_url=""
jdk_layer_dir=${layers_dir}/jdk
if [[ -f ${jdk_layer_dir}.toml ]]; then
    cached_jdk_url=$(cat "${jdk_layer_dir}.toml" | yj -t | jq -r .metadata.url 2>/dev/null || echo 'JDK TOML parsing failed')
fi

if [[ ${jdk_url} != ${cached_jdk_url} ]] ; then
    rm -rf "$layers_dir"/jdk
    mkdir -p "$layers_dir"/jdk/env
    wget -q -O - "$jdk_url" | tar pxz -C "${jdk_layer_dir}" --strip-components=1

    # here we use the function-runner image as the run image, so we set the `launch = false`
    cat > "${jdk_layer_dir}.toml" << EOF
[types]
launch = false
build = true
cache = true
[metadata]
version = "${jdk_version}"
url = "${jdk_url}"
EOF

    echo "$layers_dir"/jdk > "$layers_dir"/jdk/env/JAVA_HOME
    if [[ -z ${LD_LIBRARY_PATH} ]]; then
        echo "${JAVA_HOME}/jre/lib/amd64/server" > ${jdk_layer_dir}/env/LD_LIBRARY_PATH
    else
        echo "${JAVA_HOME}/jre/lib/amd64/server:${LD_LIBRARY_PATH}" > ${jdk_layer_dir}/env/LD_LIBRARY_PATH
    fi

    mkdir -p ${jdk_layer_dir}/profile.d
    cat > "${jdk_layer_dir}/profile.d/jdk.sh" << EOF
export JAVA_HOME=${jdk_layer_dir}
if [[ -z \$LD_LIBRARY_PATH ]]; then
    export LD_LIBRARY_PATH="\$JAVA_HOME/jre/lib/amd64/server"
else
    export LD_LIBRARY_PATH="\$JAVA_HOME/jre/lib/amd64/server:${LD_LIBRARY_PATH}"
fi
EOF
fi

# Set env variables to make jdk accessible
for var in "$layers_dir"/jdk/env/*; do
    declare "$(basename "$var")=$(<"$var")"
done
export PATH=${jdk_layer_dir}/bin:$PATH

# MAKE MAVEN M2 CACHE LAYER
m2_layer_dir="${layers_dir}/maven_m2"
if [[ ! -d ${m2_layer_dir} ]]; then
    mkdir -p ${m2_layer_dir}
    cat > "${m2_layer_dir}.toml" << EOF
[types]
cache = true
EOF

fi
ln -s ${m2_layer_dir} $HOME/.m2

# RUN BUILD
MAVEN_OPTS="${MAVEN_OPTS:-"-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap"}"

if [[ -x mvnw ]]; then
    echo "---> Running Maven Wrapper"
    ./mvnw clean install -B -DskipTests
else
    maven_layer_dir=${layers_dir}/maven
    if [[ -f ${layers_dir}/maven.toml ]]; then
        cached_maven_url=$(cat "${maven_layer_dir}.toml" | yj -t | jq -r .metadata.url 2>/dev/null || echo 'Maven TOML parsing failed')
    fi
    if [[ ${maven_url} != ${cached_maven_url} ]] ; then
        echo "---> Installing Maven"
        rm -rf "${maven_layer_dir}"
        mkdir -p "${maven_layer_dir}"
        wget -q -O - "${maven_url}" | tar pxz -C "${maven_layer_dir}" --strip-components=1
        cat > "${maven_layer_dir}.toml" << EOF
[types]
launch = false
build = true
cache = true
[metadata]
version = "${maven_version}"
url = "${maven_url}"
EOF
    fi
    export PATH="${PATH}:${layers_dir}/maven/bin"

    echo "---> Running Maven"
    mvn clean install -B -DskipTests
fi

# clear source
target_dir="target"
ls | grep -v ${target_dir} | xargs rm -rf
for jar_file in $(find "$target_dir" -maxdepth 1 -name "*.jar" -type f); do
    mv ${jar_file} .
done
rm -rf ${target_dir}

exit 0
```

#### Builder

A Builder is an image that contains all the components necessary to execute a build.

***builder.toml***

```toml
# Buildpacks to include in builder
[[buildpacks]]
uri = "../../buildpacks/java-maven"

# Order used for detection
[[order]]
    # This buildpack will display build-time information (as a dependency)
    [[order.group]]
    id = "functionmesh/java-maven"
    version = "0.0.1"

# Stack that will be used by the builder
[stack]
id = "io.functionmesh.stack"
# This image is used at runtime
run-image = "fm-stack-java-runner-run:v1"
# This image is used at build-time
build-image = "fm-stack-build:v1"
```

Use the following command to create it.

```shell
pack builder create fm-java-maven-builder:v1 \
    --config ./builder.toml \
    --pull-policy if-not-present
```

#### Usage

First, let's see what we have prepared.

- A Stack build image - fm-stack-build:v1
- A Stack run image - fm-stack-java-runner-run:v1
- A Builder image - fm-java-maven-builder:v1

Now let's write a Java function file.

***Package directory structure***

```
.
|-- pom.xml
`-- src/
    `-- main/
        `-- java/
            `-- org.example/
                `-- ExclamationFunction.java
```

***ExclamationFunction.java***

```java
package org.example;

import org.apache.pulsar.functions.api.Context;
import org.apache.pulsar.functions.api.Function;
import org.slf4j.Logger;

public class ExclamationFunction implements Function<String, String> {
    @Override
    public String process(String input, Context context) {
        Logger LOG = context.getLogger();
        LOG.debug("My exclamation function");
        return String.format("%s!", input);
    }
}
```

Build the function image in the current directory using the following command.

```shell
pack build java-exclamation-function:v1 \
    --builder fm-java-maven-builder:v1 \
    --workspace /pulsar \
    --pull-policy if-not-present
```

The output is as follows.

```shell
$ pack build java-exclamation-function:v1 \
    --builder fm-java-maven-builder:v1 \
    --workspace /pulsar \
    --pull-policy if-not-present
===> ANALYZING
[analyzer] Previous image with name "java-exclamation-function:v1" not found
===> DETECTING
[detector] functionmesh/java-maven 0.0.1
===> RESTORING
===> BUILDING
[builder] ---> Installing Maven
[builder] ---> Running Maven
[builder] [INFO] Scanning for projects...
[builder] [WARNING]
[builder] [WARNING] Some problems were encountered while building the effective model for java-function:java-function:jar:1.0-SNAPSHOT
[builder] [WARNING] 'build.plugins.plugin.version' for org.apache.maven.plugins:maven-compiler-plugin is missing. @ line 44, column 15
[builder] [WARNING]
[builder] [WARNING] It is highly recommended to fix these problems because they threaten the stability of your build.
[builder] [WARNING]
[builder] [WARNING] For this reason, future Maven versions might no longer support building such malformed projects.
[builder] [WARNING]
[builder] [INFO]
[builder] [INFO] --------------------< java-function:java-function >---------------------
[builder] [INFO] Building java-function 1.0-SNAPSHOT
[builder] [INFO] --------------------------------[ jar ]---------------------------------
[builder] [INFO] Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-clean-plugin/2.5/maven-clean-plugin-2.5.pom
[builder] [INFO] Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-clean-plugin/2.5/maven-clean-plugin-2.5.pom (3.9 kB at 3.7 kB/s)
[builder] [INFO] Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-plugins/22/maven-plugins-22.pom
[builder] [INFO] Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-plugins/22/maven-plugins-22.pom (13 kB at 53 kB/s)
[builder] [INFO] Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/21/maven-parent-21.pom
...
...
...
[builder] [INFO] Installing /pulsar/target/java-function-1.0-SNAPSHOT.jar to /home/pulsar/.m2/repository/java-function/java-function/1.0-SNAPSHOT/java-function-1.0-SNAPSHOT.jar
[builder] [INFO] Installing /pulsar/pom.xml to /home/pulsar/.m2/repository/java-function/java-function/1.0-SNAPSHOT/java-function-1.0-SNAPSHOT.pom
[builder] [INFO] ------------------------------------------------------------------------
[builder] [INFO] BUILD SUCCESS
[builder] [INFO] ------------------------------------------------------------------------
[builder] [INFO] Total time:  01:15 min
[builder] [INFO] Finished at: 2022-08-22T12:21:48Z
[builder] [INFO] ------------------------------------------------------------------------
===> EXPORTING
[exporter] Adding layer 'launch.sbom'
[exporter] Adding 1/1 app layer(s)
[exporter] Adding layer 'launcher'
[exporter] Adding layer 'config'
[exporter] Adding label 'io.buildpacks.lifecycle.metadata'
[exporter] Adding label 'io.buildpacks.build.metadata'
[exporter] Adding label 'io.buildpacks.project.metadata'
[exporter] no default process type
[exporter] Saving java-exclamation-function:v1...
[exporter] *** Images (f9f06af32790):
[exporter]       java-exclamation-function:v1
[exporter] Adding cache layer 'functionmesh/java-maven:jdk'
[exporter] Adding cache layer 'functionmesh/java-maven:maven'
[exporter] Adding cache layer 'functionmesh/java-maven:maven_m2'
Successfully built image java-exclamation-function:v1
```

Use the image `java-exclamation-function:v1` to create Function.

***exlcamation_function.yaml***

```yaml
apiVersion: compute.functionmesh.io/v1alpha1
kind: Function
metadata:
  name: java-exclamation-function
  namespace: default
spec:
  image: java-exclamation-function:v1
  className: org.example.ExclamationFunction
  forwardSourceMessageProperty: true
  maxPendingAsyncRequests: 1000
  replicas: 1
  maxReplicas: 5
  logTopic: persistent://public/default/logging-function-logs
  input:
    topics:
    - persistent://public/default/input-java-topic
    typeClassName: java.lang.String
  output:
    topic: persistent://public/default/output-java-topic
    typeClassName: java.lang.String
  resources:
    requests:
      cpu: "0.1"
      memory: 1G
    limits:
      cpu: "0.2"
      memory: 1.1G
  secretsMap:
    "name":
        path: "test-secret"
        key: "username"
    "pwd":
        path: "test-secret"
        key: "password"
  pulsar:
    pulsarConfig: "test-pulsar"
  java:
    jar: /pulsar/java-function-1.0-SNAPSHOT.jar
  clusterName: test
  autoAck: true
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: test-pulsar
data:
  webServiceURL: http://sn-platform-pulsar-broker.default.svc.cluster.local:8080
  brokerServiceURL: pulsar://sn-platform-pulsar-broker.default.svc.cluster.local:6650
---
apiVersion: v1
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
kind: Secret
metadata:
  name: test-secret
type: Opaque
```

## Submit Java Functions

After packaging your Pulsar Functions, you can submit your Pulsar Functions to a Pulsar cluster. This section describes how to submit a Java Functions through a Functions CRD. You can use the `image` field to specify the runner image use for creating the Java Functions. You can also specify the location where the package or the Docker image is stored.

1. Define a Java Functions by using a YAML file and save the YAML file.

   - This example shows how to publish a `java-function-sample` Functions to a Pulsar cluster by using a JAR package called `function://my-tenant/my-ns/my-function@0.1`.

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
       input:
         topics:
         - persistent://public/default/java-function-input-topic
         typeClassName: java.lang.String
       output:
         topic: persistent://public/default/java-function-output-topic
         typeClassName: java.lang.String
       pulsar:
         pulsarConfig: "test-pulsar"
       java:
         extraDependenciesDir: random-dir/
         jar: my-function.jar # the package will download as this filename.
         jarLocation: function://my-tenant/my-ns/my-function@0.1 # function package URL
     ```

   - This example shows how to publish a `java-function-sample` Functions to a Pulsar cluster by using a Docker image.

     ```yaml
     apiVersion: compute.functionmesh.io/v1alpha1
     kind: Function
     metadata:
       name: java-function-sample
       namespace: default
     spec:
       image: streamnative/example-function-image:latest # using function image here
       className: exclamation_function.ExclamationFunction
       forwardSourceMessageProperty: true
       maxPendingAsyncRequests: 1000
       replicas: 1
       maxReplicas: 5
       logTopic: persistent://public/default/logging-function-logs
       input:
         topics:
         - persistent://public/default/java-function-input-topic
         typeClassName: java.lang.String
       output:
         topic: persistent://public/default/java-function-output-topic
         typeClassName: java.lang.String
       pulsar:
         pulsarConfig: "test-pulsar"
       java:
         extraDependenciesDir: random-dir/
         jar: /pulsar/example-function.jar # the package location in image
         jarLocation: "" # leave empty since we will not download package from Pulsar Packages
     ```

2. Apply the YAML file to create the Java Functions.

   ```bash
   kubectl apply -f /path/to/YAML/file
   ```

3. Check whether the Java Functions is created successfully.

   ```bash
   kubectl get all
   ```