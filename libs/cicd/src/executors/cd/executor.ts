import { DevExecutorSchema } from './schema'
import fuzzy from 'fuzzy'
import { inquirer } from './inquirer'
import { ExecutorContext, logger, workspaceRoot } from '@nrwl/devkit'
import { flow, pipe } from 'fp-ts/lib/function'
import chalk from 'chalk'
import * as PDE from './core/ProjectExecutable'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import { Action, Env } from './types'
import { execute, readJsonFileFP, writeJsonFileFP } from '../../generators/init/lib'

const promptSourceFn = (choices: string[]) => (_: any, input: string) =>
  pipe(
    T.of(input || ''),
    T.map((input) =>
      pipe(fuzzy.filter(input, choices), (selected) => selected.map((item) => item.original)),
    ),
  )()

export const getTargetProjects =
  (options: DevExecutorSchema) =>
  (choices: string[]): TE.TaskEither<Error, { projects: string[] }> =>
    TE.tryCatch(
      () =>
        inquirer.prompt([
          {
            type: 'checkbox-plus',
            name: 'projects',
            pageSize: 10,
            highlight: true,
            searchable: true,
            message:
              options.action === Action.MAKE
                ? 'Choose services you want to deploy. You can choose nothing if you don not want to deploy service'
                : 'Select the projects you want execute the command on.' +
                  chalk.cyan(' <space> ') +
                  'to select projects' +
                  '\n' +
                  chalk.green('🔎 Type to search.'),
            source: promptSourceFn(choices),
          },
        ]),
      E.toError,
    )

export const writeDeployList = (projects: string[]) =>
  pipe(
    writeJsonFileFP({ _path: workspaceRoot, filename: 'deploylist.json', content: projects }),
    execute,
  )

export const readDeployList = () =>
  pipe(
    readJsonFileFP<Array<string>>({ _path: workspaceRoot, filename: 'deploylist.json' }),
    execute,
  )

export const PDEpipeline = flow(PDE.of, PDE.exectableSeq)

export const mainPipeline = (options: DevExecutorSchema, context: ExecutorContext) => {
  const env: O.Option<number> = options.env === Env.PROD ? O.some(1) : O.none
  return pipe(
    env,
    O.fold(
      () =>
        pipe(
          Object.keys(context.workspace.projects),
          A.filter(
            (projName) => context.workspace.projects[projName]!.projectType! === 'application',
          ),
          getTargetProjects(options),
          TE.map(({ projects }) => {
            options.action !== Action.DEV && writeDeployList(projects)
            return projects
          }),
        ),
      () => pipe(readDeployList(), TE.fromEither),
    ),
    TE.chain((projects) =>
      PDEpipeline({
        projects,
        overrides: {},
        context,
        options,
      }),
    ),
    TE.fold(
      (error) => {
        logger.error(error.message)
        return T.of({
          success: false,
        })
      },
      () => {
        logger.log('Done.')
        return T.of({
          success: true,
        })
      },
    ),
  )
}

/**
 * This executor runs selected projects docker-compose up and run CI watch for current project.
 */
export default async function runDevExecutor(options: DevExecutorSchema, context: ExecutorContext) {
  return await mainPipeline(options, context)()
}
