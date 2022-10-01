import { ExecutorContext, runExecutor } from '@nrwl/devkit'
import { Task } from 'fp-ts/lib/Task'
import { TaskEither } from 'fp-ts/lib/TaskEither'
export interface ProjectDevExecutable {
  _tag: 'ProjectDevExecutable'
  executables: Array<TaskEither<Error, Awaited<ReturnType<typeof runExecutor>>>>
}

export interface ProjectDevExecutableArgs {
  projects: string[]
  overrides: ObjBlob<any>
  context: ExecutorContext
}

export interface ObjBlob<T = any> {
  [x: string]: T
}
