import { ExecutorContext, runExecutor } from '@nrwl/devkit'
import { Action, Env, ObjBlob, ProjectExecutable, ProjectExecutableArgs } from '../../types'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'

export const getRunExecutorTE =
  (target: string) => (overrides: ObjBlob<any>, context: ExecutorContext) => (project: string) =>
    TE.tryCatch(() => runExecutor({ project, target }, overrides, context), E.toError)

export const pushReduce = (action: Action): O.Option<ReturnType<typeof getRunExecutorTE>> =>
  action === Action.PUSH ? O.some(getPushDeployExecutorTE) : O.none

export const getDevExecutorTE = getRunExecutorTE('docker-dev')
export const getMarkDeployExecutorTE = getRunExecutorTE('mark-deploy')
export const getPushDeployExecutorTE = getRunExecutorTE('push-deploy')
export const getCommitExecutorTE = getRunExecutorTE('cz')

// writeJsonFileFP({ _path: workspaceRoot, filename: 'deploy.json', projects })
export const ap = <A, B>(fab: Array<(a: A) => B>, fa: Array<A>): Array<B> =>
  A.flatten(fab.map((f) => fa.map(f)))

export const of = (args: ProjectExecutableArgs): ProjectExecutable => {
  const env: O.Option<number> = args.env === Env.PROD ? O.some(1) : O.none
  return {
    _tag: 'ProjectExecutable',
    executables: pipe(
      env,
      O.fold(
        () => pipe(args.projects, A.map(getDevExecutorTE(args.overrides, args.context))),
        () => ap([getPushDeployExecutorTE(args.overrides, args.context)], args.projects),
      ),
    ),
  }
}

export const exectableSeq = (projExecs: ProjectExecutable) =>
  pipe(projExecs.executables, A.sequence(TE.ApplicativeSeq))
