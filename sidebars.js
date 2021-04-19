module.exports = {
  docs: [
    'overview',
    'install-function-mesh',
    {
      type: 'category',
      label: 'Functions',
      items: ['functions/function-overview'],
    },
    {
      type: 'category',
      label: 'Connectors',
      items: ['connectors/pulsar-io-overview', 'connectors/pulsar-io-monitoring', 'connectors/pulsar-io-debug'],
    },   
    {
      type: 'category',
      label: 'Configuration',
      items: ['configure/pulsar-functions', 'configure/pulsar-connector', 'configure/function-mesh'],
    },
    'scaling',
  ],
}
