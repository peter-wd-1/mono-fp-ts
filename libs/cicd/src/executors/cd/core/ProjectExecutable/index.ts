import { ExecutorContext, runExecutor } from '@nrwl/devkit'
import { Action, Env, ObjBlob, ProjectExecutable, ProjectExecutableArgs } from '../../types'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import * as RA from 'fp-ts/ReadonlyArray'

// type GetRunExecutorTE = (target:string) => (overrides : ObjBlob<any>, context: ExecutorContext) =>
//   (project :string) => TE.TaskEither<Error>>
//
// TODO exeperimental feature tool
// export const Applicative: Applicative1<O.URI> = {
//   URI: O.URI,
//   map: (fa, f) =>
//     pipe(
//       fa,
//       O.map((as: any) => (a: any) => pipe(as, A.append(a))),
//     ),
//   of: O.of,
//   ap: (fab, fa) => pipe(fab, O.ap(fa)),
// }

export const getRunExecutorTE =
  (target: string) => (overrides: ObjBlob<any>, context: ExecutorContext) => (project: string) =>
    TE.tryCatch(() => runExecutor({ project, target }, overrides, context), E.toError)

export const matchCommand =
  (targetAction: Action, target: string) =>
  (action: Action): O.Option<ReturnType<typeof getRunExecutorTE>> =>
    action === targetAction ? O.some(getRunExecutorTE(target)) : O.none

export const getPushDeployExecutorTE = matchCommand(Action.PUSH, 'puah-deploy')
export const getServeDeployExecutorTE = matchCommand(Action.SERVE, 'serve-deploy')
export const getDevExecutorTE = matchCommand(Action.DEV, 'docker-dev')
export const getNullExecutorTE = getRunExecutorTE('null')

export const executorReducer =
  (overrides: ObjBlob<any>, context: ExecutorContext) => (action: Action) =>
    pipe(
      action,
      R.sequenceArray([getPushDeployExecutorTE, getServeDeployExecutorTE, getDevExecutorTE]),
      // TODO fold it with monoid to return only exeisting Option's value. need empty executor that dose nothing.
      RA.map(O.map((exector) => exector(overrides, context))),
    )

export const ap = <A, B>(fab: Array<(a: A) => B>, fa: Array<A>): Array<B> =>
  A.flatten(fab.map((f) => fa.map(f)))

export const of = (args: ProjectExecutableArgs): ProjectExecutable => {
  return {
    _tag: 'ProjectExecutable',
    executables: pipe(
      args.projects,
      RA.chain((project) =>
        pipe(
          executorReducer(args.overrides, args.context)(args.options.action),
          RA.map((executorOption) =>
            pipe(
              executorOption,
              O.fold(
                () => getNullExecutorTE({}, args.context)('cicd'),
                (executor) => executor(project),
              ),
            ),
          ),
        ),
      ),
    ),
  }
}

export const exectableSeq = (projExecs: ProjectExecutable) =>
  pipe(projExecs.executables, RA.sequence(TE.ApplicativeSeq))
