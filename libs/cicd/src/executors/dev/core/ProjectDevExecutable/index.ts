import { ExecutorContext, runExecutor } from '@nrwl/devkit'
import { ObjBlob, ProjectDevExecutable, ProjectDevExecutableArgs } from '../../types'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'

export const getRunExecutorTE =
  (target: string) => (overrides: ObjBlob<any>, context: ExecutorContext) => (project: string) =>
    TE.tryCatch(() => runExecutor({ project, target }, overrides, context), E.toError)

export const getDevExecutorTE = getRunExecutorTE('docker-dev')

export const of = (args: ProjectDevExecutableArgs): ProjectDevExecutable => ({
  _tag: 'ProjectDevExecutable',
  executables: pipe(args.projects, A.map(getDevExecutorTE(args.overrides, args.context))),
})

export const exectableSeq = (projExecs: ProjectDevExecutable) =>
  pipe(projExecs.executables, A.sequence(TE.ApplicativeSeq))
