import { logger, Tree } from '@nrwl/devkit'
import * as E from 'fp-ts/Either'
import { TSGeneratorOptions } from './types'
import { pipe } from 'fp-ts/lib/function'
import { addTsProjCommands } from './features/updateCommands'
import {
  addTypeToJestTsconfig,
  addTypeToTsconfig,
  bindRootAndProjType,
} from './features/updateConfigs'
import { updateDokCompose } from './features/generateDockerCompose'
import { updateRootConfig } from './features/generateServiceConfig'
import { execute, generateFilesFP } from './lib'
import chalk from 'chalk'

// TODO convert it to seqences.
export default async function (tree: Tree, schema: TSGeneratorOptions) {
  pipe(
    bindRootAndProjType(tree, schema),
    E.chain(({ projectType }) =>
      projectType === 'application'
        ? pipe(
            updateRootConfig({ port: schema.port, serviceName: schema.service }),
            E.chain(() =>
              updateDokCompose({
                tree,
                schema,
                paths: [__dirname, './files/docker/docker-compose.yml'],
              }),
            ),
            E.chain(() =>
              updateDokCompose({
                tree,
                schema,
                paths: [__dirname, './files/docker/docker-compose.dev.yml'],
              }),
            ),
            E.chain(() => pipe(generateFilesFP(tree, schema), execute)),
          )
        : E.right(null),
    ),
    E.chain(() => addTsProjCommands(tree, schema)),
    E.chain(() => addTypeToJestTsconfig(tree, schema)),
    E.chain(() => addTypeToTsconfig(tree, schema)),
    E.fold(
      (err) => logger.error(`error: ${err.message} \n`),
      () => {
        logger.log(
          `Successfully added ${chalk.yellowBright.bold('special source')}✨ to the project\n`,
        )
        logger.log(
          ' - various project commands \n',
          '- docker bolierplate in case of service \n',
          '- root service config \n',
          '- global type configuration \n',
        )
      },
    ),
  )
}
