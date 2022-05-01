import { Metric, StatsResult } from '../util/types'
import { GetMetricStatisticsOutput } from 'aws-sdk/clients/cloudwatch'

export const metricsToStatsResult = (functionName: string, metricName: Metric) => (d: GetMetricStatisticsOutput): StatsResult => {
  return { functionName, metric: metricName, data: d.Datapoints }
}
