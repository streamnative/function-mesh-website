module.exports = {
  title: 'Function Mesh',
  tagline: 'The serverless framework purpose-built for event streaming applications',
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
      logo: {
        alt: 'FUnction Mesh Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
        },
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
              label: 'Email',
              href: 'mailto:function-mesh@streamnative.io',
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
    algolia: {
      apiKey: '06b1278e604c2d3e61ac0410591143ed',
      indexName: 'functionmesh',
      contextualSearch: false
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
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
