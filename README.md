# Rfiready

## Features 

- Add Command `type-check` for ts project. 
- Add docker folder and its files to project
- Husky for conventional commit + service deployment from commit

## Workflow

Consider our new developer trying to create an new service. This would be complete process from creation to deployment on production. 

### Initialize 

1. Pull repository
2. Create feature branch
3. Create service with name & port : will generate command and docker folder 

### Development

4. Start development infrastructure
   will start run-command | execute nx executor
   will check current service project from `workspace.json` and ask which to run 
   you can check all the services that will be running on docker | 
   then this will docker up every docker-compose in the check projects.
   dockerfile dev has volume connected to its src so if you changes code it can still watch the changes
5. Start to watch : executes whenever file changes
   - dev server 
   - linter
   - unit test
   
### Deployment

6. Use CZ semantic for version control 
7. Use affected:commit if you want to deploy all the changes. 
   this will trigger affected:deploy command and this will find affected project and build docker image.
   to push to the registry 
   this will be done on marge pull request in github action.
   when ever you deploy the changes on production. 
   this will trigger bump of the version and release it on git   hub with change logs.
   

## Generate an docker folder and ts-command

Run `yarn nx workspace-generator tsprojgen <folder name> --service <service name> --port <port number>`

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.
Libraries are shareable across libraries and applications. They can be imported from `@rfiready/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.
