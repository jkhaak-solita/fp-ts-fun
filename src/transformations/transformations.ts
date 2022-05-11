import { concatAll } from 'fp-ts/Monoid'
import { MonoidSum } from 'fp-ts/number'
import { Metric, StatsResult, StatsSumResult } from '../util/types'
import { GetMetricStatisticsOutput } from 'aws-sdk/clients/cloudwatch'

export const metricsToStatsResult = (functionName: string, metricName: Metric) => (d: GetMetricStatisticsOutput): StatsResult => {
  return { functionName, metric: metricName, data: d.Datapoints }
}

export const statsResultToStatsSumResult = (results: readonly StatsResult[]): StatsSumResult[] => {
  return results.map(r => ({
    functionName: r.functionName,
    metric: r.metric,
    sum: concatAll(MonoidSum)(r.data === undefined
      ? []
      : r.data.map(d => d.Sum === undefined ? 0 : d.Sum))
  }))
}
