module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Overview',
      items: ['overview/overview', 'overview/why-function-mesh'],
    },
    'install-function-mesh',
    {
      type: 'category',
      label: 'Functions',
      items: [
        'functions/function-overview',
        {
          type: 'category',
          label: 'Package Pulsar Functions',
          items: [
            'functions/package-function/package-function-overview',
            'functions/package-function/package-function-java',
            'functions/package-function/package-function-python',
            'functions/package-function/package-function-go'
          ],
        },
        {
          type: 'category',
          label: 'Run Pulsar Functions',
          items: [
            'functions/run-function/run-java-function',
            'functions/run-function/run-python-function',
            'functions/run-function/run-go-function',
            'functions/run-function/run-stateful-function',
            'functions/run-function/run-window-function'
          ],
        },
        'functions/function-monitor', 
        'functions/produce-function-log',
        'functions/function-debug'
      ],
    },
    {
      type: 'category',
      label: 'Connectors',
      items: [
        'connectors/pulsar-io-overview',
        'connectors/run-connector',
        'connectors/pulsar-io-monitoring',
        'connectors/pulsar-io-debug'
      ]
    },
    {
      type: 'category',
      label: 'Meshes',
      items: ['function-mesh/function-mesh-overview', 'function-mesh/run-function-mesh'],
    },
    {
      type: 'category',
      label: 'Function Mesh Worker',
      items: ['function-mesh-worker/function-mesh-worker-overview', 'function-mesh-worker/deploy-mesh-worker', 'function-mesh-worker/manage-builtin-connectors']
    },
    'scaling',
    {
      type: 'category',
      label: 'Migration',
      items: ['migration/migrate-function'],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/function-mesh-config',
        {
          type: 'category',
          label: 'CRD configurations',
          items: [
            'reference/crd-config/function-crd',
            'reference/crd-config/source-crd-config',
            'reference/crd-config/sink-crd-config',
            'reference/crd-config/function-mesh-crd'
          ],
        },
        {
          type: 'category',
          label: 'Function Mesh Worker configurations',
          items: [
            'reference/function-mesh-worker/general-option',
            'reference/function-mesh-worker/customizable-option',
            'reference/function-mesh-worker/rest-api'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Release Notes',
      items: ['releases/release-note-0-13-0','releases/release-note-0-12-0','releases/release-note-0-11-0', 'releases/release-note-0-10-0', 'releases/release-note-0-9-0', 'releases/release-note-0-8-0', 'releases/release-note-0-7-0', 'releases/release-note-0-6-0', 'releases/release-note-0-5-0', 'releases/release-note-0-4-0', 'releases/release-note-0-3-0', 'releases/release-note-0-2-0', 'releases/release-note-0-1-11', 'releases/release-note-0-1-9', 'releases/release-note-0-1-8','releases/release-note-0-1-7','releases/release-note-0-1-6','releases/release-note-0-1-5','releases/release-note-0-1-4'],
    }
  ],
}
