import IO, { io, IO as TIO, map } from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'
import { Between, Config } from './types'
import { sequenceT } from 'fp-ts/Apply'
import { dateToBetween } from './time'
import { create } from 'fp-ts/Date'

const addToConfig = (between: Between, functionName?: string): Config => ({
  between,
  functionName: functionName === undefined ? '' : functionName
})

export const generateConfig = (): TIO<Config> => {
  return pipe(
    sequenceT(io)(
      map(dateToBetween)(create),
      () => process.env.FUNCTION_NAME
    ),
    map(([a, b]) => addToConfig(a, b))
  )
}
