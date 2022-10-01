import { IOEither } from 'fp-ts/IOEither'

export type IOETry<T> = IOEither<Error, T>
