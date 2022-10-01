import { DevExecutorSchema } from './schema'
import fuzzy from 'fuzzy'
import { inquirer } from './inquirer'
import { ExecutorContext, logger, runExecutor } from '@nrwl/devkit'
import { flow, pipe } from 'fp-ts/lib/function'
import chalk from 'chalk'
import * as PDE from '@rfiready/cicd/data/ProjectDevExecutable'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'

const promptSourceFn = (choices: string[]) => (_: any, input: string) =>
  pipe(
    T.of(input || ''),
    T.map((input) =>
      pipe(fuzzy.filter(input, choices), (selected) => selected.map((item) => item.original)),
    ),
  )()

export const getTargetProjects = (
  choices: string[],
): TE.TaskEither<Error, { projects: string[] }> =>
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
            'Select the projects you want to run on local.' +
            chalk.cyan(' <space> ') +
            'to select projects' +
            '\n' +
            chalk.green('🔎 Type to search.'),
          source: promptSourceFn(choices),
        },
      ]),
    E.toError,
  )

export const PDEpipeline = flow(PDE.of, PDE.exectableSeq)

/**
 * This executor runs selected projects docker-compose up and run CI watch for current project.
 */
export default async function runDevExecutor(options: DevExecutorSchema, context: ExecutorContext) {
  return await pipe(
    Object.keys(context.workspace.projects),
    A.filter((projName) => context.workspace.projects[projName]!.projectType! === 'application'),
    getTargetProjects,
    // now know which project to run docker-compose up.
    // runExecutor of each project's target dockerDev command.
    // and run serve w/watch mode current project.
    TE.chain(({ projects }) => PDEpipeline({ projects, overrides: { watch: true }, context })),
    TE.fold(
      (error) => {
        logger.error(error.message)
        return T.of({
          success: false,
        })
      },
      () => {
        logger.log('success')
        return T.of({
          success: true,
        })
      },
    ),
  )()
}
