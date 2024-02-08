# Workflows
When you create a PR on on main or merge to github workflows will be triggered. Never merge anything before all workflows have passed. You can find all github workflows in .github/workflows folder.

## Testing
We have a testing workflow that runs the [testes](../Testing/Testing.md). (NOT IMPLEMENTED)

## Build
The build workflow just builds projectnext and then deploys the container for production. It uses the default env variables to do this. 

## Linting
We have a linting workflow that needs to pass before merging any PR. Remember that linting can be autofixed to a degree using:
```bash
    npm run lint -- --fix
```
Avoid using thing like lint-ignore to fix your issues.

## Versioning and pull on prod
When a new version is ready you should create a PR from main on prod (NOT IMPLEMENTED)

## CD
When a new version is realized on prod the CD pipeline starts.

## Dependabot
We have configured dependabot to chack deps in projectnext and prismaservice. Merging deps upgrades should be prioritized. Merging a dependabot PR is done in the 

## Upgrading node.js
We upgrade node.js when new LTS version cgets relased (that is: even numbered versions). Do this by changing all layers of Dockerfiles (projectnext and prismaservice) to use that node version. And change your own systems node-version to avoid conflicts.