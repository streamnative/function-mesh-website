module.exports = {
  docs: [
    'overview',
    'install-function-mesh',
    {
      type: 'category',
      label: 'Functions',
      items: ['functions/function-overview', 'functions/function-crd', 'functions/run-function', 'functions/function-monitor', 'functions/function-debug'],
    },
    {
      type: 'category',
      label: 'Connectors',
      items: ['connectors/pulsar-io-overview', 'connectors/pulsar-io-crd', 'connectors/run-connector', 'connectors/pulsar-io-monitoring', 'connectors/pulsar-io-debug'],
    },   
    {
      type: 'category',
      label: 'Function Mesh',
      items: ['function-mesh/function-mesh-crd', 'function-mesh/run-function-mesh'],
    },
    'scaling',
    {
      type: 'category',
      label: 'Migration',
      items: ['migration/migrate-function'],
    },
    {
      type: 'category',
      label: 'Tab',
      collapsed: false,
      items: [
        'tab/tab-test',
        {
          type: 'category',
          label: 'Test Docs',
          items: ['tab/test-doc/doc1', 'tab/test-doc/doc2', 'tab/test-doc/markdown-doc3'],
        },
      ],
    },
  ],
}
