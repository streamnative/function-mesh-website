# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

## Installation

```console
yarn install
```

## Local Development

```console
yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

## Build

```console
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

```console
GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Doc release process

This section describes how to publish Function Mesh docs for a specific release to the Function Mesh website.

### Prerequisites

- All docs and images are updated to the `docs` folder.

### Steps

1. Create a branch based on the `main` branch.
2. Run the `yarn run docusaurus docs:version <release version>` command to release docs for the target release. This command is used for automatically updating or creating all docs required for the target releases, including the `sidebar.js`, the versioned-docs, and the `versions.json` file.
    This example releases docs for Function Mesh v0.1.6.

    ```bash
    yarn run docusaurus docs:version 0.1.6
    ```
3. Run the `node replace.js` command to update the release version in the installation guide.
4. Save the updates and summit the PR.
    1. `git add -A`: save doc updates.
    2. `git commit -m ""`: confirm your updates.
    3. `git push origin <your-branch>`: submit the PR.

5. Ask the stakeholders to review the PR and check your doc updates through the preview-link.
6. If no more comments or updates, merge the PR. The docs are updated to the Function Mesh document website automatically.
