import { createMock } from 'ts-auto-mock'
import { ExecutorContext } from '@nrwl/devkit'
import { of } from '.'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { Env } from '../../types'

describe('ProjectDevExecutable', () => {
  it('can construct executables', async () => {
    const r = of({
      projects: ['test1', 'test2'],
      overrides: {},
      context: createMock<ExecutorContext>(),
      env: Env.DEV,
    })
    const testpipe = await pipe(
      r.executables[0]!,
      TE.fold(
        (e) => T.of(e.message),
        () => T.of('sucess'),
      ),
    )()
    expect(testpipe).toBe('Could not find project "test1"')
  })
})
