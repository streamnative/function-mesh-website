module.exports = {
  title: 'Functionmesh.io',
  tagline: 'Collaborating Pulsar Functions in Cloud-Native way',
  url: 'https://functionmesh.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'function-mesh', // Usually your GitHub org/user name.
  projectName: 'functionmesh.io/', // Usually your repo name.
  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
    navbar: {
      title: 'Function Mesh',
      logo: {
        alt: 'FUnction Mesh Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Documentation',
          position: 'left',
        },
        {
          href: 'https://github.com/streamnative/function-mesh',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Installation Guide',
              to: 'https://functionmesh.io/docs/install-function-mesh',
            },
            {
              label: 'Configuration Guide',
              to: 'https://functionmesh.io/docs/function-mesh/run-function-mesh',
            },            
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Google Group',
              href: 'https://groups.google.com/a/streamnative.io/g/function-mesh',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/streamnative/function-mesh',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} StreamNative, Inc.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          id: 'product',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/streamnative/function-mesh-website/tree/main',
            
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
