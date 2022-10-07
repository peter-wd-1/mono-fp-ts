import { readJsonFile, writeJsonFile } from '@nrwl/devkit'
import { IOETry } from '../types'
import { Lazy, pipe } from 'fp-ts/lib/function'
import * as IOEither from 'fp-ts/IOEither'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/Array'
import path from 'path'
import { Eq } from 'fp-ts/lib/Eq'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

export const run = <A>(eff: TE.TaskEither<Error, A>): void => {
  eff()
    .then(
      E.fold(
        (e) => {
          throw e
        },
        (_) => {
          process.exitCode = 0
        },
      ),
    )
    .catch((e) => {
      console.error(e)
      process.exitCode = 1
    })
}

export const execute = <T>(f: () => T): T => f()

export const merge = <A, B>(a: A, b: B) => Object.assign(a, b)

export const tryCatch = <T>(fn: Lazy<T>): IOETry<T> => IOEither.tryCatch(fn, E.toError)

export const readJsonFileFP = <T extends object = any>({
  _path,
  filename,
}: {
  _path: string
  filename: string
}): IOETry<T> => tryCatch(() => readJsonFile<T>(path.join(_path, filename)))

export const writeJsonFileFP = <T extends object = any>({
  _path,
  filename,
  content,
}: {
  _path: string
  filename: string
  content: T
}): IOETry<void> => tryCatch(() => writeJsonFile<T>(path.join(_path, filename), content))

/**
 * filter by using equality
 * this pattern is simply, you define equality logic with Eq class.
 * any pass to qe args. Then you get Either the obj you want or error.
 *
 * @example
 * //same as
 * export const eqPort = Eq.contramap((cfg: ServiceConfigValue) => cfg.PORT)(S.Eq)
 * //example
 * export const eqPort: Eq.Eq<ServiceConfigValue> = Eq.struct<ServiceConfigValue>({
 *   PORT: S.Eq,
 * })
 * export const findPortFromCfg = matchElem(eqPort)
 * export const validatePort =
 *   (cfgCtx: ServiceConfiguration) =>
 *   (port: string): E.Either<Error, string> =>
 *     pipe(
 *       findPortFromCfg({ PORT: port } as ServiceConfigValue, cfgCtx),
 *       E.fold(
 *         () => E.right(port),
 *         (c) => E.left(new Error(`Service : ${c[0].SERVICE_NAME} is using port ${port}`)),
 *       ),
 *     )
 */
type MatchElem = <A>(
  eq: Eq<A>,
) => (as: NonEmptyArray<A>) => (a: A) => E.Either<Error, NonEmptyArray<A>>
export const matchElem: MatchElem = (eq) => (as) => (a) =>
  pipe(
    as,
    A.filter((item) => eq.equals(item, a)),
    E.fromPredicate(A.isNonEmpty, () => new Error('given array do not have a match')),
  )
