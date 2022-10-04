import { ExecutorContext, runExecutor } from '@nrwl/devkit'
import { TaskEither } from 'fp-ts/lib/TaskEither'
export interface ProjectExecutable {
  _tag: 'ProjectExecutable'
  executables: Array<TaskEither<Error, Awaited<ReturnType<typeof runExecutor>>>>
}

export enum Env {
  DEV = 'dev',
  PROD = 'prod',
}

export interface ProjectExecutableArgs {
  projects: string[]
  overrides: ObjBlob<any>
  context: ExecutorContext
  env: Env
}

export interface ObjBlob<T = any> {
  [x: string]: T
}
