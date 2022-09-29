import { pipe } from 'fp-ts/function'
import fs from 'fs'
import path from 'path'
import * as IOEither from 'fp-ts/IOEither'
import * as A from 'fp-ts/Array'
import { IOETry, ServiceConfiguration, ServiceConfigValue, TSGeneratorOptions } from '../types'
import { names, readProjectConfiguration, Tree, workspaceRoot } from '@nrwl/devkit'
import { execute, merge, readJsonFileFP, tryCatch } from '../lib'

const readDokCompose = (paths: string[]): IOETry<string> =>
  tryCatch(() => fs.readFileSync(path.join(...paths), 'utf-8'))

const writeDokCompose =
  (paths: string[]) =>
  (data: string): IOETry<void> =>
    tryCatch(() => {
      fs.writeFileSync(path.join(...paths), data, 'utf-8')
    })

const replaceConfigFile =
  (paths: string[]) =>
  (cfg: ServiceConfigValue) =>
  (target: string): IOETry<void> =>
    pipe(
      Object.keys(cfg),
      (keys) =>
        keys.reduce(
          (prevKey, curKey) => prevKey.replaceAll('${' + curKey + '}', (cfg as any)[curKey]),
          target,
        ),
      writeDokCompose(paths),
    )

const updateDokFile =
  (paths: string[]) =>
  (fn: (d: string) => IOETry<void>): IOETry<void> =>
    pipe(readDokCompose(paths), IOEither.chain(fn))

const getConfig = (tree: Tree, schema: TSGeneratorOptions) => {
  return {
    DEPLOY_ENV: 'prod',
    PROJECT_ROOT: readProjectConfiguration(tree, names(schema.name).fileName).root,
  }
}

export const updateDokCompose = ({
  tree,
  schema,
  paths,
}: {
  tree: Tree
  schema: TSGeneratorOptions
  paths: string[]
}) => {
  const serviceName = schema.service || schema.name
  const newCfg = getConfig(tree, schema)

  return pipe(
    readJsonFileFP<ServiceConfiguration>({ _path: workspaceRoot, filename: 'service.config.json' }),
    IOEither.chain((cfg) =>
      pipe(
        cfg,
        A.findFirst((cfg) => cfg.SERVICE_NAME === serviceName),
        IOEither.fromOption(
          () =>
            new Error(
              `Service Name: ${serviceName} is not available. 1. check service.config.ts file. 2. check if service exist. 3. Typo`,
            ),
        ),
        IOEither.chain((cfg) =>
          pipe(merge(cfg, newCfg), replaceConfigFile(paths), updateDokFile(paths)),
        ),
      ),
    ),
    execute,
  )
}
