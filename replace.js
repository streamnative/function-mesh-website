const replace = require('replace-in-file');
const fs = require('fs')
const CWD = process.cwd()
const docsDir = `${CWD}/versioned_docs`

function getVersions() {
  return JSON.parse(require('fs').readFileSync(`${CWD}/versions.json`, 'utf8'));
}

function doReplace(options) {
  replace(options)
    .then(changes => {
      console.log(changes)
      if (options.dry) {
        console.log('Modified files:');
        console.log(changes.join('\n'))
      }
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });
}

const versions = getVersions();
const latestVersion = versions[0];

for (v of versions) {
  const file = `${docsDir}/version-${v}`
  const options = {
    files: [
      `${file}/*.md`,
      `${file}/**/*.md`
    ],
    from: /{{functionmesh_version}}/g,
    to: `v${v}`,
    dry: false
  };
  
  doReplace(options);
}
