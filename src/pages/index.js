import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Easy to Use',
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        <ul>
          <li>Be easily deployed directly on Kubernetes clusters, including{' '} <a href="https://github.com/kubernetes/minikube">Minikube</a> and{' '} <a href="https://kind.sigs.k8s.io/docs/user/quick-start/">Kind</a>.</li>
          <li>Allow one function to talk to multiple different Pulsar clusters, which are defined as config maps.</li>
          <li>Support function registry for function package management. We are going to introduce the Pulsar registry in Pulsar 2.8.0 for function package management. Then, the function package can be reused by different functions.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Integrated with Kubernetes',
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        <ul>
          <li>Integrate with Kubernetes secrets seamlessly to read secrets directly.</li>
          <li>Leverage the Kubernetes’s auto-scaler to auto-scale instances for functions based on the CPU usage. In future, Function Mesh will support auto-scaling based on the backlog.</li>
          <li>Utilize the full power scheduling capability provided by Kubernetes. Therefore, users do not need to write any customized codes to communicate with the Kubernetes API server.</li>
        </ul>
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
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
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
