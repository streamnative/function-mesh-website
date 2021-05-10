import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Real-time',
    description: (
      <>
        Build serverless event streaming applications that respond immediately to events. Craft materialized views using stateful functions or sink connectors.
      </>
    ),
  },
  {
    title: 'Kubernetes-native',
    description: (
      <>
        Seamlessly leverage your existing Kubernetes infrastructure to deploy <a href="http://pulsar.apache.org/docs/en/next/functions-overview/">Pulsar Functions</a>, <a href="http://pulsar.apache.org/docs/en/next/io-overview/">Pulsar IO connectors</a>,
        and event streaming workloads, and bring powerful new cloud-native capabilities to your applications.
      </>
    ),
  },
  {
    title: 'Your favorite language',
    description: (
      <>
        Build event streaming applications using your favorite languages, such as Java, Python, and Go.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const bannerBackground = 'image/background_line.png'
  return (
    <Layout
      title={`Orchestrating Pulsar Functions for Serverless Event Streaming`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <img src={bannerBackground} />
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
