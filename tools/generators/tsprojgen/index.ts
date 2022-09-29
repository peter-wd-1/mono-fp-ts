import { logger, Tree } from '@nrwl/devkit'
import * as E from 'fp-ts/Either'
import { TSGeneratorOptions } from './types'
import { pipe } from 'fp-ts/lib/function'
import { addTsProjCommands } from './features/addCommands'
import { updateDokCompose } from './features/generateDockerCompose'
import { updateRootConfig } from './features/serviceConfig'
import { execute, generateFilesFP } from './lib'
import './test'

export default async function (tree: Tree, schema: TSGeneratorOptions) {
  pipe(
    updateRootConfig({ port: schema.port, serviceName: schema.service }),
    E.chain(() =>
      updateDokCompose({ tree, schema, paths: [__dirname, './files/docker/docker-compose.yml'] }),
    ),
    E.chain(() =>
      updateDokCompose({
        tree,
        schema,
        paths: [__dirname, './files/docker/docker-compose.dev.yml'],
      }),
    ),
    E.chain(() => addTsProjCommands(tree, schema)),
    E.chain(() => pipe(generateFilesFP(tree, schema), execute)),
    E.mapLeft((err) => logger.error(`error : ${err.message} \n`)),
  )
}
