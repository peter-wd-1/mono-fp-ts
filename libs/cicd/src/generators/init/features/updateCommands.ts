import { names, ProjectConfiguration, readProjectConfiguration, Tree } from '@nrwl/devkit'
import { pipe } from 'fp-ts/lib/function'
import { execute, writeJsonFileFP } from '../lib'
import { TSGeneratorOptions } from '../types'

const addTarget = (projConfig: ProjectConfiguration) => {
  return pipe(projConfig, (projConfig) => ({
    ...projConfig,
    targets: {
      ...projConfig.targets,
      ...getTarget(projConfig.root, projConfig.projectType || 'application'),
    },
  }))
}

const getTarget = (root: string, projectType: string) =>
  Object.assign(
    {
      ['type-check']: {
        executor: '@nrwl/js:tsc',
        options: {
          main: `${root}/src/main.ts`,
          outputPath: `dist/${root}`,
          tsConfig: `${root}/tsconfig.${projectType === 'application' ? 'app' : 'lib'}.json`,
        },
      },
    },
    projectType === 'application'
      ? {
          ['dev']: {
            executor: '@rfiready/cicd:cd',
            outputs: ['{options.outputPath}'],
            option: {
              env: 'development',
            },
          },
          ['deploy']: {
            executor: '@rfiready/cicd:cd',
            outputs: ['{options.outputPath}'],
            option: {
              env: 'production',
            },
          },
          ['docker-dev']: {
            executor: 'nx:run-commands',
            options: {
              command: `docker compose -f ${root}/docker/docker-compose.dev.yml up -d`,
            },
          },
          ['push-deploy']: {
            executor: 'nx:run-commands',
            options: {
              command: `docker compose -f ${root}/docker/docker-compose.yml build && docker-compose -f ${root}/docker/docker-compose.yml push`,
            },
          },
          ['mark-deploy']: {
            executor: 'nx:run-commands',
            options: {
              command: `mkdir -p tmp/deploy && cp ${root}/docker/docker-compose.yml tmp/deploy/docker-compose.${root
                .split('/')
                .slice(-1)}.yml`,
            },
          },
        }
      : {},
  )

export const addTsProjCommands = (tree: Tree, schema: TSGeneratorOptions) =>
  pipe(
    readProjectConfiguration(tree, names(schema.name).fileName),
    addTarget,
    (projCfg) =>
      writeJsonFileFP({ _path: projCfg.root, filename: 'project.json', content: projCfg }),
    execute,
  )
