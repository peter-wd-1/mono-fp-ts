import { workspaceRoot } from '@nrwl/devkit'
import { execute, matchElem, readJsonFileFP, writeJsonFileFP } from '../lib'
import * as E from 'fp-ts/Either'
import * as AP from 'fp-ts/Apply'
import * as SE from 'fp-ts/Semigroup'
import * as Eq from 'fp-ts/Eq'
import * as IO from 'fp-ts/IO'
import * as string from 'fp-ts/string'
import { pipe } from 'fp-ts/lib/function'
import { ServiceConfiguration, ServiceConfigValue, UserCfg } from '../types'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

// validate user input port
// if its already exist under other service name in config.
// 1) generate config with userinput
// 2) write json with user input

// get serivce config schema input from user
// port = none default
// name = folder name
// serviceName = docker service name
// deployEnv = deployment stage
const serviceConfigFileName = 'service.config.json'

const mapErrorMsg = (err: NonEmptyArray<Error>) => err.map((x) => x.message)

export const eqPort: Eq.Eq<ServiceConfigValue> = Eq.struct<ServiceConfigValue>({
  PORT: string.Eq,
})

export const eqServiceName: Eq.Eq<{ SERVICE_NAME: string }> = Eq.struct<{ SERVICE_NAME: string }>({
  SERVICE_NAME: string.Eq,
})

export const matchServiceName = matchElem(eqServiceName)

export const matchPort = matchElem(eqPort)

export const getRootServiceCfg = () =>
  pipe(
    readJsonFileFP<ServiceConfiguration>({ _path: workspaceRoot, filename: serviceConfigFileName }),
    execute,
  )

export const getFindPortFromCfg = (port: string) =>
  pipe(
    getRootServiceCfg(),
    E.chain((cfg) => matchPort(cfg)({ PORT: port })),
  )

export const validatePort = (port: string): E.Either<Error, string> =>
  pipe(
    getFindPortFromCfg(port),
    E.fold(
      () => E.right(port),
      (c) => E.left(new Error(`Service : ${c[0].SERVICE_NAME} is using port ${port}`)),
    ),
  )

export const validateServiceName = (name: string) =>
  pipe(
    getRootServiceCfg(),
    E.map((cfg) => cfg.map((val) => ({ SERVICE_NAME: val.SERVICE_NAME! }))),
    E.chain((cfg) =>
      matchServiceName(cfg as NonEmptyArray<{ SERVICE_NAME: string }>)({ SERVICE_NAME: name }),
    ),
    E.fold(
      () => E.right(name),
      (c) => E.left(new Error(`Service : ${c[0].SERVICE_NAME} is already exist`)),
    ),
  )

export function liftNonEmpA<E, A>(
  f: (a: A) => E.Either<E, A>,
): (a: A) => E.Either<NonEmptyArray<E>, A> {
  return (a) =>
    pipe(
      f(a),
      E.mapLeft((a) => [a]),
    )
}

// seqenceT is for [ data, data ]
// E.getSemigroup(pipe(string.Semigroup)) // either string addition.
const validateErrorSemigroup: SE.Semigroup<NonEmptyArray<Error>> = {
  concat: (x, y) => {
    return [...x, ...y] as NonEmptyArray<Error>
  },
}

// service Name is validated when user input nx command
export const validateUserConfiguration = (userCfg: UserCfg) =>
  pipe(
    AP.sequenceS(E.getApplicativeValidation(validateErrorSemigroup))({
      PORT: liftNonEmpA(validatePort)(userCfg.port!.toString()),
      SERVICE_NAME: liftNonEmpA(validateServiceName)(userCfg.serviceName),
    }),
    E.mapLeft(mapErrorMsg),
  )

export const liftEToError = <T>(e: E.Either<any, T>) =>
  pipe(
    e,
    E.mapLeft((err) => new Error(err)),
  )

export const getNewRootConfig = (userCfg: UserCfg) =>
  pipe(
    E.Do,
    E.bind('input', () => liftEToError(validateUserConfiguration(userCfg))),
    E.bind('oldCfg', () => getRootServiceCfg()),
    E.map(({ input, oldCfg }) => [...oldCfg, { ...input }]),
  )

export const updateRootConfig = (userCfg: UserCfg) =>
  pipe(
    getNewRootConfig(userCfg),
    E.chain((cfg) =>
      pipe(
        writeJsonFileFP({
          _path: workspaceRoot,
          filename: serviceConfigFileName,
          content: cfg,
        }),
        execute,
        E.map(() => userCfg),
      ),
    ),
  )
