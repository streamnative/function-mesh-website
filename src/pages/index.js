import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const oneSections = [
  {
    title: "Real-time",
    description: (
      <>
        Build serverless event streaming applications that respond immediately
        to events. Craft materialized views using stateful functions or sink
        connectors.
      </>
    ),
  },
  {
    title: "Kubernetes-native",
    description: (
      <>
        Seamlessly leverage your existing Kubernetes infrastructure to deploy{" "}
        <a href="http://pulsar.apache.org/docs/en/next/functions-overview/">
          Pulsar Functions
        </a>
        ,{" "}
        <a href="http://pulsar.apache.org/docs/en/next/io-overview/">
          Pulsar IO connectors
        </a>
        , and event streaming workloads, and bring powerful new cloud-native
        capabilities to your applications.
      </>
    ),
  },
  {
    title: "Your favorite language",
    description: (
      <>
        Build event streaming applications using your favorite languages, such
        as Java, Python, and Go.
      </>
    ),
  },
];

const twoSections = [
  {
    title: <>About Apache Pulsar</>,
    imgUrl: "img/about_pulsar.svg",
    description: (
      <>
        <p>
          <a href="https://pulsar.apache.org/" target="_blank">
            Apache Pulsar
          </a>{" "}
          is a cloud-native messaging and event-streaming pla tform built for
          Kubernetes. It is widely adopted for messaging applications and
          data-streaming applications and for companies moving to multi-cloud
          and hybrid cloud strategies.{" "}
        </p>
        <div>
          Apache Pulsar is known for its super-set of built-in features,
          including:
        </div>
        <ul>
          <li>Multi-tenancy</li>
          <li>Scalability</li>
          <li>Geo-replication</li>
          <li>Unified Messaging</li>
          <li>Durability</li>
        </ul>
        <p>
          Apache Pulsar is often adopted to replace monolithic, single-tenant
          technologies such as Apache Kafka, Amazon Kinesis, RabbitMQ, Active
          MW, and more.
        </p>
      </>
    ),
  },
  {
    title: <>About Pulsar Functions</>,
    imgUrl: "img/pulsar_functions.svg",
    description: (
      <>
        <p>
          <a
            href="http://pulsar.apache.org/docs/en/next/functions-overview/"
            target="_blank"
          >
            Pulsar Functions
          </a>{" "}
          is a computing infrastructure native to Pulsar. It enables the
          creation of complex processing logic on a per message basis and brings
          simplicity and serverless concepts to event streaming, thereby
          eliminating the need to deploy a separate system such as Apache Spark
          or Apache Flink.
        </p>
        <p>
          Pulsar Functions is not intended to be a full-power streaming
          processing engine nor a computation abstraction layer, rather, the
          benefits of Pulsar Functions are in its simplicity.
        </p>
        <p>
          Pulsar Functions supports multiple languages and developers do not
          need to learn new APIs, which increase development productivity.
          Common use cases of Pulsar Functions include simple ETL jobs,
          real-time aggregation, microservices, reactive services, and event
          routing.
        </p>
      </>
    ),
    reverse: true,
  },
  {
    title: <>What is Function Mesh?</>,
    imgUrl: "img/functions_mesh.svg",
    description: (
      <>
        <ul>
          <li>
            A Kubernetes Operator to run Pulsar Functions and I/O connectors
            natively on Kubernetes, unlocking the full power of Kubernetes’
            application deployment, scaling and management.
          </li>
          <li>
            A serverless framework to orchestrate multiple Pulsar Functions and
            I/O connectors for complex streaming jobs in a simple way.
          </li>
        </ul>
        <h3>Why use Function Mesh?</h3>
        <ul>
          <li>
            Streamline the management of Pulsar Functions and connectors,
            particularly when multiple instances of Functions and connectors are
            used together.
          </li>
          <li>
            Utilize the full power of Kubernetes Scheduler, including
            deployment, scaling and management, to manage and scale Pulsar
            Functions and connectors.
          </li>
          <li>
            Enable Pulsar Functions and connectors to run natively in the cloud
            environment, which leads to greater possibilities when more
            resources become available in the cloud.
          </li>
          <li>
            Enable Pulsar Functions to work with different messaging systems and
            to integrate with existing tools in the cloud environment (Function
            Mesh runs Pulsar Functions and connectors independently from
            Pulsar).
          </li>
        </ul>
      </>
    ),
  },
];

function SectionOne({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.sectionOneImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function SectionTwo({ imgUrl, title, description, reverse }) {
  return (
    <div
      className={clsx(
        "row",
        styles.sectionTwo,
        reverse ? styles.sectionTwoReverse : ""
      )}
    >
      <div className="col col--6">
        <div className="text--center">
          {imgUrl && (
            <img
              className={styles.sectionTwoImage}
              src={useBaseUrl(imgUrl)}
              alt={title}
            />
          )}
        </div>
      </div>
      <div className={clsx("col col--6", styles.sectionTwoDesc)}>
        <div>
          <h3>{title}</h3>
          <div>{description}</div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const bannerBackground = "image/background_line.png";
  return (
    <Layout
      title={`Orchestrating Pulsar Functions for Serverless Event Streaming`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <img src={bannerBackground} />
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {oneSections && oneSections.length > 0 && (
          <section className={styles.oneSections}>
            <div className="container">
              <div className="row">
                {oneSections.map((props, idx) => (
                  <SectionOne key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <div className={clsx("hero", styles.hero)}>
        <div className="container text--center">
          <h2 className="hero__subtitle">
            How Function Mesh Works with Apache Pulsar and Pulsar Functions
          </h2>
        </div>
      </div>

      <main className={clsx("hero", styles.hero)}>
        <div className="container">
          <section className={styles.sectionTwo}>
            <div className="container">
              {twoSections.map((f, idx) => (
                <SectionTwo key={idx} {...f} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <div className={clsx("hero", styles.hero)}>
        <div className="container text--center">
          <h3>Function Mesh & StreamNative</h3>
          <div className="container">
            Function Mesh was open-sourced by StreamNative to enable Pulsar
            Functions users to streamline operations and achieve new use cases.
            StreamNative was founded by the original developers of Apache Pulsar
            and provides a real-time streaming platform powered by Apache Pulsar
            and Apache Flink. StreamNative Cloud, provides a cloud-native,
            real-time messaging and streaming platform to support multi-cloud
            and hybrid cloud strategies. Find out more about StreamNative Cloud.
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
