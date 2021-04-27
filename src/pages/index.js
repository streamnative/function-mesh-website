import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import PickVersion from '../components/PickVersion'

const features = [
  {
    title: 'Easy to Use',
    imageUrl: 'img/undraw_docusaurus_mountain.png',
    description: (
      <>
        <ul>
          <li>Easy deployment to Kubernetes clusters, including{' '} <a href="https://github.com/kubernetes/minikube">Minikube</a> and{' '} <a href="https://kind.sigs.k8s.io/docs/user/quick-start/">Kind</a>.</li>
          <li>Directly talking to multiple Pulsar clusters, with config maps defined.</li>
          <li>Future Supporting function registry for function package management.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Integrated with Kubernetes',
    imageUrl: 'img/undraw_docusaurus_react.png',
    description: (
      <>
        <ul>
          <li>Leverage the Kubernetes's auto-scaler to auto-scale instances for functions based on the CPU usage and more.</li>
          <li>Utilize the full scheduling capability provided by Kubernetes to be high available.</li>
          <li>Integrate with Kubernetes secrets seamlessly to read secrets directly.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Great Tools at hand',
    imageUrl: 'img/undraw_docusaurus_tree.png',
    description: (
      <>
        <ul>
          <li>Manage multiple functions in one place with the FunctionMesh{' '}<a href="https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/">CustomResourceDefinitions</a>{' '}(CRD). </li>
          <li>Support multiple language runtime, including Java, Python, Golang and more.</li>
          <li>Provide rich connectors talking to various data systems.</li>
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
  const bannerBackground = 'image/background_line.png'
  return (
    <Layout
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
