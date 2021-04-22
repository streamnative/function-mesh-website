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
      items: ['function-mesh/run-function-mesh'],
    },
    'scaling',
    {
      type: 'category',
      label: 'Migration',
      items: ['migration/migrate-function'],
    },
  ],
}
