import { names, readProjectConfiguration, Tree } from '@nrwl/devkit'
import { pipe } from 'fp-ts/lib/function'
import { execute, readJsonFileFP, writeJsonFileFP } from '../lib'
import { TSGeneratorOptions } from '../types'
import { Tsconfig } from 'tsconfig-type'
import * as E from 'fp-ts/Either'

const addGlobalType = (tsconfig: Tsconfig): Tsconfig => ({
  ...tsconfig,
  include: [...tsconfig.include!, '../../types/**.*.ts'],
})

export const getJestJson = (projectType: string) =>
  `tsconfig.${projectType === 'application' ? 'app' : 'lib'}.json`

export const bindRootAndProjType = (tree: Tree, schema: TSGeneratorOptions) =>
  pipe(
    readProjectConfiguration(tree, names(schema.name).fileName),
    E.of,
    E.bindTo('projCfg'),
    E.bind('root', ({ projCfg }) => E.right(projCfg.root)),
    E.bind('projectType', ({ projCfg }) =>
      projCfg.projectType
        ? E.right(projCfg.projectType)
        : E.left(new Error('project type dose not exist')),
    ),
  )

export const getGlobalTypeInclude = (root: string) => (tsCfgFileName: string) =>
  pipe(
    E.Do,
    E.bind('tsConfig', () =>
      pipe(
        readJsonFileFP<Tsconfig>({
          _path: root,
          filename: tsCfgFileName, // `tsconfig.${projCfg.projectType === 'application' ? 'app' : 'lib'}.json`
        }),
        execute,
        E.map(addGlobalType),
      ),
    ),
    E.chain(({ tsConfig }) =>
      pipe(
        writeJsonFileFP({
          _path: root,
          filename: tsCfgFileName, //`tsconfig.${projCfg.projectType === 'application' ? 'app' : 'lib'}.json`,
          content: tsConfig,
        }),
        execute,
      ),
    ),
  )

export const addTypeToTsconfig = (tree: Tree, schema: TSGeneratorOptions) =>
  pipe(
    bindRootAndProjType(tree, schema),
    E.chain(({ root, projectType }) =>
      pipe(
        `tsconfig.${projectType === 'application' ? 'app' : 'lib'}.json`,
        getGlobalTypeInclude(root),
      ),
    ),
  )

export const addTypeToJestTsconfig = (tree: Tree, schema: TSGeneratorOptions) =>
  pipe(
    bindRootAndProjType(tree, schema),
    E.chain(({ root }) => pipe('tsconfig.spec.json', getGlobalTypeInclude(root))),
  )
