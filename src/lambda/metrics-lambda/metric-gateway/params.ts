import { Between, Metric } from '../util/types'
import { THREE_HOURS_IN_SECONDS } from '../util/constants'

export const generateCloudWatchMetricStatisticsParams = (metricName: Metric, between: Between) => (fn: string) => {
  return {
    StartTime: between.startTime,
    EndTime: between.endTime,
    MetricName: metricName,
    Namespace: 'AWS/Lambda',
    Period: THREE_HOURS_IN_SECONDS,
    Dimensions: [
      {
        Name: 'FunctionName',
        Value: fn
      }
    ],
    Statistics: ['Sum']
  }
}
