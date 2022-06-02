import * as TE from 'fp-ts/lib/TaskEither'
import * as A from 'fp-ts/Array'

import { Between, Metric, StatsResult } from '../util/types'
import { generateCloudWatchMetricStatisticsParams } from '../metric-gateway/params'
import { metricsToStatsResult } from '../transformations/transformations'
import { flow } from 'fp-ts/function'
import { getCloudWatchMetrics } from '../metric-gateway/calls'

const getMetricInfo = (between: Between, functionName: string) => (metricName: Metric): TE.TaskEither<string, StatsResult> => {
  const paramsForCloudWatch = generateCloudWatchMetricStatisticsParams(metricName, between)
  const metricToStatsResult = metricsToStatsResult(functionName, metricName)

  return flow(
    paramsForCloudWatch,
    p => TE.tryCatch(async () => await getCloudWatchMetrics(p), String),
    TE.map(metricToStatsResult)
  )(functionName)
}

export const retrieveMetrics = (between: Between, metrics: readonly Metric[]) => (fn: string): TE.TaskEither<string, StatsResult[]> => {
  return A.sequence(TE.ApplicativeSeq)(metrics.map(getMetricInfo(between, fn)))
}
