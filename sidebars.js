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
      items: ['connectors/pulsar-io-overview'],
    },   
    {
      type: 'category',
      label: 'Configuration',
      items: ['configure/pulsar-functions', 'configure/pulsar-connector', 'configure/function-mesh'],
    },
  ],
}
