import { TargetConfiguration } from '@nrwl/devkit'
import { IOEither } from 'fp-ts/IOEither'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

export type GetTarget = (
  root: string,
  projectType: string,
) => {
  [x: string]: TargetConfiguration<any>
}

export type ReplaceConfigData = (
  cfg: ServiceConfigValue,
) => (targetFile: string) => IOEither<Error, string>

export interface ServiceConfigValue {
  SERVICE_NAME?: string
  PORT: string
}
export type ServiceConfiguration = NonEmptyArray<ServiceConfigValue>

export interface TSGeneratorOptions {
  name: string
  service: string
  port: number
}

export interface UserCfg {
  serviceName: string
  port: number
}
