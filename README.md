# Rfiready

## Features 

- Add Command `type-check` for ts project. 
- Add docker folder and its files to project
- Husky for conventional commit + service deployment from commit
- Support ts-auto-mock

# Workflow

## Development

### Initialize 

1. Pull repository `git clone`
2. Create feature branch `git checkout -b feature/lib`

### Generate a service

Run `yarn create-service my-service-name` to generate an application.
This will creates standard ts-lib but also adds commands and boilerplate for CICD.

### Generate a library

Run `yarn create-lib my-lib` to generate a library.
Libraries are shareable across libraries and applications. They can be imported from `@rfiready/libname`.

### Development server

You can run multiple dev server.
Run `yarn nx run cicd:dev` | `yarn nx dev cicd` for a dev server. The app will automatically reload if you change any of the source files.

### Test /Test Affected, Lint /Lint Affected

## Deployment

### commit 
### push
### release

## Branch strategy
[How it works](,/IMPL.md)
