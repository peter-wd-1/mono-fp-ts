
# Table of Contents

1.  [Dev Ops with NX.🔥](#orgf7495f8)
    1.  [Development](#org69892a2)
        1.  [Emacs settup note](#org249a13d)
        2.  [Creating New libs and services](#org3ef1f17)
        3.  [Create branch and keep rebase main from created branch](#org19c79fe)
        4.  [Run dev server container for all services dev wants](#org1323840)
        5.  [Run dev server for current service on development](#org6b52dde)
    2.  [Deployment](#org2896719)
        1.  [Registry can restrict access to push/pull images from the registry](#org1bd85ad)
        2.  [Commit changes with conventional commit and automatic version bump to keep tracking changes.](#org73156f7)
        3.  [Push changes whitout Deployment to update code base and share current changes.(optional)](#org727ec16)
        4.  [Creatae PR to deploy all affected services](#orgeaf8331)
        5.  [Creatae PR to deploy some services dev wants](#org5b77eac)
        6.  [From local create PR to Deploy all affected services with releasing current version with change logs on git hub](#org8dd2ef4)
        7.  [From local create PR to Deploy some services dev wants with releasing current version with change logs on git hub](#orgd25b170)
    3.  [Migration](#org1f4e9cf)
        1.  [Migrate current services.](#org6c5a20e)
    4.  [Issues](#org7ed04a2)
        1.  [Connot use some packages for jest that uses ESM modules](#org6182844)
        2.  [Connot use pure EMS modules pakcages.](#org78dc345)



<a id="orgf7495f8"></a>

# Dev Ops with NX.🔥


<a id="org69892a2"></a>

## Development

Dev needs to regularly commit for update latest code. and push to share code or to deploy. Dev only can suggest deploy by creating PR, and authority should approve the PR to deploy on production.


<a id="org249a13d"></a>

### Emacs settup note

Use flycheck javascript-eslint checker to get a eslint message.


<a id="org3ef1f17"></a>

### Creating New libs and services

1.  DONE create generator for creating files in libs/apps

2.  DONE jest auto mock setup in root workspace without setting up in every libs and services

3.  TODO generate default command

    1.  TODO add commands generator `deploy`
    
        1.  push docker image with current realease version
    
    2.  TODO add commands generator `docker-serve`
    
        1.  runs docker swarm deploy for service with current realease version
    
    3.  DONE add commands generator `docker-dev`

4.  DONE generate jest, ts types include.

    1.  DONE create global type in root so that every libs/apps can use it by adding d.ts in their tsconfig and tsconfig.spac
    
    2.  DONE make this process in tsprojgen generator


<a id="org19c79fe"></a>

### Create branch and keep rebase main from created branch

1.  DONE trigger `pull origin main --rebase` to rebase after new commit using husky.

    check .husky/post-commit


<a id="org1323840"></a>

### Run dev server container for all services dev wants

this is only be executed on dev&rsquo;s local machine.
dev can exec command `start dev` to start docker dev containers.

1.  DONE create nx plugin called CICD.

2.  DONE Add `start dev` command package.json for created plugin to be executed.

3.  DONE grab workspace.json and extract all projects and create array of path of each project.

4.  DONE use inquery for asking which project to be docker compose build and up.

5.  DONE use array of input of dev&rsquo;s choice for execution of docker compose.

6.  DONE execute docker compose up -d with the paths given.


<a id="org6b52dde"></a>

### Run dev server for current service on development

This will be left now automated since dev can choose their own terminal and visibility of logs their own.

1.  DONE make nx plugin Receive service name as arg and use it to chain command `nx lint, test, build, serve <service name>` with watch option.


<a id="org2896719"></a>

## Deployment

CI has moved to local since husky can trigger CI on local.


<a id="org1bd85ad"></a>

### Registry can restrict access to push/pull images from the registry

so only git hub action and admin can actually push/pull images and deploy on production.

1.  TODO deploy registry with basic auth

    <https://docs.docker.com/registry/deploying/#deploy-your-registry-using-a-compose-file>

2.  TODO add password to git hub repo secrets.

3.  TODO write workflow to login docker `docker login myregistrydomain.com:5000` with password in git hub secret


<a id="org73156f7"></a>

### Commit changes with conventional commit and automatic version bump to keep tracking changes.

this dose not trigger deployment on production. only merge PR on github wil trigger deploy. Services on production can have diff version of monorepo.

1.  TODO use husky pre-commit to trigger lint, test all affected code

2.  TODO add yarn command for cz commit

3.  TODO trigger cz bump after commit

4.  TODO create cz change logs


<a id="org727ec16"></a>

### Push changes whitout Deployment to update code base and share current changes.(optional)

1.  TODO add yarn command git push


<a id="orgeaf8331"></a>

### Creatae PR to deploy all affected services

PR message has all deploy flag, and this will copy/past merge message manually if dev decided to dpeloy. Git action will detect merge message has all deploy exec immediately deploy script for all affected.

1.  TODO take user input for header message and generate flag message &rsquo;CD All&rsquo;

2.  TODO execute git-hub cli command for creating PR with generated message

3.  TODO write git workflow to check merge message if it has &rsquo;CD All&rsquo; and exec `nx affected:deploy` (push docker image)

4.  TODO generate deploy script that executes `nx affected:docker-servce` that runs docker swarm deploy for service

5.  TODO write git workflow to send the script to main server

6.  TODO aws codedeploy runs the script


<a id="org5b77eac"></a>

### Creatae PR to deploy some services dev wants

PR message has lift of services that needs to be deployed. And this will copy/past merge message manually if dev decided to dpeloy. Git action will detect merge message has deploy flag for some and parse merge message, pass it to deploy script.

1.  TODO use services array to and use it as a PR message

2.  TODO write workflow to detect &rsquo;CD&rsquo; to


<a id="org8dd2ef4"></a>

### From local create PR to Deploy all affected services with releasing current version with change logs on git hub

PR message has flag for all


<a id="orgd25b170"></a>

### From local create PR to Deploy some services dev wants with releasing current version with change logs on git hub


<a id="org1f4e9cf"></a>

## Migration


<a id="org6c5a20e"></a>

### Migrate current services.

1.  TODO move libs

2.  TODO change import paths

3.  TODO creat auth admin server repo and move all files


<a id="org7ed04a2"></a>

## Issues


<a id="org6182844"></a>

### Connot use some packages for jest that uses ESM modules


<a id="org78dc345"></a>

### Connot use pure EMS modules pakcages.

1.  TODO try this link(use ESM from typescript project) <https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c>

