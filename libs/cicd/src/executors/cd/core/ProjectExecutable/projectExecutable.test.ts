import { createMock } from 'ts-auto-mock'
import { ExecutorContext } from '@nrwl/devkit'
import { of } from '.'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as E from 'fp-ts/Either'
import { readDeployList, writeDeployList } from '../../executor'
import { DevExecutorSchema } from '../../schema'

describe('ProjectDevExecutable', () => {
  it('can construct executables', async () => {
    const r = of({
      projects: ['test1', 'test2'],
      overrides: {},
      context: createMock<ExecutorContext>(),
      options: createMock<DevExecutorSchema>(),
    })
    const testpipe = await pipe(
      r.executables[0]!,
      TE.fold(
        (e) => T.of(e.message),
        () => T.of('sucess'),
      ),
    )()
    expect(testpipe).toBe('Could not find project "cicd"')
  })
})

describe('readwrite', () => {
  it('read and write', () => {
    pipe(
      writeDeployList(['test1', 'test2', 'test3']),
      E.map(() => console.log(readDeployList())),
    )
  })
})

// describe('action', () => {
//   const action: Action = Action.DEPLOY
//   const context = createMock<ExecutorContext>({})
//   it('can switch case action', () => {
//     // ap([getPushDeployExecutorTE, getServeDeployExecutorTE, getCommitExecutorTE, getReleaseExecutorTE], )
//     // pipe(
//     //   getPushDeployExecutorTE(Action.PUSH),
//     //   O.map(async (result) => {
//     //     // const r = await result({}, context)('test')()
//     //     // expect(r).toStrictEqual({
//     //     //   _tag: 'Left',
//     //     //   left: 'Error: Could not find project "test"',
//     //     // })
//     //     return result
//     //   }),
//     expect(
//       pipe(
//         Action.COMMIT,
//         R.sequenceArray([getPushDeployExecutorTE, getServeDeployExecutorTE, getCommitExecutorTE]),
//         RA.map(
//           O.map((exector) => {
//             exector({}, context)
//           }),
//         ),
//       ),
//     ).toBe(true)
//   })
// })
