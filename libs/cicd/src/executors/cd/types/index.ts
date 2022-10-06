import { ExecutorContext, runExecutor } from '@nrwl/devkit'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { DevExecutorSchema } from '../schema'
export interface ProjectExecutable {
  _tag: 'ProjectExecutable'
  executables: ReadonlyArray<TaskEither<Error, Awaited<ReturnType<typeof runExecutor>>>>
}

export enum Env {
  DEV = 'dev',
  PROD = 'prod',
}

export enum Action {
  DEPLOY = 'deploy',
  MAKE = 'make',
  PUSH = 'push',
  SERVE = 'serve',
  NULL = 'null',
  DEV = 'dev',
}

export interface ProjectExecutableArgs {
  projects: string[]
  overrides: ObjBlob<any>
  context: ExecutorContext
  options: DevExecutorSchema
}

export interface ObjBlob<T = any> {
  [x: string]: T
}
