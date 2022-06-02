import { APIGatewayProxyResult } from 'aws-lambda'
import { generateConfig } from '../util/config'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { httpResultFromStats, reducedStatsForFailure, statsReducer, statsResultToStatsSumResult } from '../transformations/transformations'
import { Config, ReducedStats } from '../util/types'
import { retrieveMetrics } from '../helpers/entrypoint'
import { METRICS } from '../util/constants'

function checkLambda (config: Config): T.Task<ReducedStats> {
  return pipe(
    retrieveMetrics(config.between, METRICS)(config.functionName),
    TE.map(statsResultToStatsSumResult),
    TE.map(statsReducer),
    TE.fold(
      (message) => T.of(reducedStatsForFailure(message)),
      T.of
    )
  )
}

export async function handler (): Promise<APIGatewayProxyResult> {
  return await pipe(
    generateConfig(),
    T.fromIO,
    T.chain(checkLambda),
    T.map(httpResultFromStats)
  )()
}
