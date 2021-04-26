module.exports = {
  docs: [
    'overview',
    'install-function-mesh',
    {
      type: 'category',
      label: 'Functions',
      items: [
        'functions/function-overview',
        'functions/function-crd',
        {
          type: 'category',
          label: 'Run Pulsar Functions',
          items: [
            'functions/run-function/run-java-function',
            'functions/run-function/run-python-function',
            'functions/run-function/run-go-function',
          ],
        },
        'functions/function-monitor', 
        'functions/function-debug'
      ],
    },
    {
      type: 'category',
      label: 'Connectors',
      items: [
        'connectors/pulsar-io-overview',
        {
          type: 'category',
          label: 'Pulsar connector CRD configurations',
          items: [
            'connectors/io-crd-config/source-crd-config', 
            'connectors/io-crd-config/sink-crd-config'
          ],
        },
        'connectors/run-connector',
        'connectors/pulsar-io-monitoring',
        'connectors/pulsar-io-debug',
      ]
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
  ],
}
