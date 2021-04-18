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
      items: ['connectors/pulsar-io-overview'],
    },   
    {
      type: 'category',
      label: 'Function Mesh',
      items: ['function-mesh/run-function-mesh'],
    },
    'scaling',
  ],
}
