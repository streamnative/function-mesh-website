module.exports = {
  docs: [
    'overview',
    'install-function-mesh',
    {
      type: 'category',
      label: 'Functions',
      items: ['functions/function-overview', 'functions/function-monitor', 'functions/function-debug'],
    },
    {
      type: 'category',
      label: 'Connectors',
      items: ['connectors/pulsar-io-overview', 'connectors/run-connector', 'connectors/pulsar-io-monitoring', 'connectors/pulsar-io-debug'],
    },   
    {
      type: 'category',
      label: 'Configuration',
      items: ['configure/pulsar-functions', 'configure/pulsar-connector', 'configure/function-mesh'],
    },
    {
      type: 'category',
      label: 'Migration',
      items: ['migration/migrate-function'],
    },
    'scaling',
  ],
}
