import { names, readProjectConfiguration, Tree } from '@nrwl/devkit'
import { pipe } from 'fp-ts/lib/function'
import { execute, writeJsonFileFP } from '../lib'
import { TSGeneratorOptions } from '../types'
import { GetTarget, ProjConfigUnary } from '../types'

const addTarget: ProjConfigUnary = (projConfig) => {
  return pipe(projConfig, (projConfig) => ({
    ...projConfig,
    targets: {
      ...projConfig.targets,
      ...getTarget(projConfig.root),
    },
  }))
}

const getTarget: GetTarget = (root) => ({
  ['type-check']: {
    executor: 'nx:run-commands',
    options: {
      command: `tsc -p ${root}/tsconfig.json`,
    },
  },
})

export const addTsProjCommands = (tree: Tree, schema: TSGeneratorOptions) =>
  pipe(
    readProjectConfiguration(tree, names(schema.name).fileName),
    addTarget,
    (projCfg) =>
      writeJsonFileFP({ _path: projCfg.root, filename: 'project.json', content: projCfg }),
    execute,
  )
