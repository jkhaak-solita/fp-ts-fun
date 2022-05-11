import { Monoid, concatAll, struct } from 'fp-ts/Monoid'
import { MonoidSum } from 'fp-ts/number'
import { HttpResult, Metric, ReducedStats, StatsResult, StatsSumResult, Status } from '../util/types'
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

const statsSumToStatusAndMessage = (invokes: number) => (s: StatsSumResult) => {
  let status: Status = 'OK'
  let message = ''

  switch (s.metric) {
    case 'Invocations': {
      status = invokes === 0 ? 'WARN' : 'OK'
      message = invokes === 0 ? 'not invoked' : 'invokes ok'
    }
      break
    case 'Errors': {
      const percentage = invokes !== 0 ? s.sum / invokes * 100 : 0
      status = percentage >= 5 ? 'ERR' : 'OK'
      message = percentage >= 5 ? 'throwing errors' : 'no errors'
    }
      break
    case 'Throttles': {
      const percentage = invokes !== 0 ? s.sum / invokes * 100 : 0
      status = percentage >= 1 ? 'WARN' : 'OK'
      message = percentage >= 1 ? 'being throttled' : 'no throttles'
    }
      break
    default:
      const _exhaustiveCheck: never = s.metric
      return _exhaustiveCheck
  }
  return {
    status,
    message
  }
}

const statusMonoid: Monoid<Status> = {
  concat: (x, y) => x === 'ERR' || y === 'ERR' ? 'ERR' : (x === 'WARN' || y === 'WARN' ? 'WARN' : 'OK'),
  empty: 'OK'
}

const messageMonoid: Monoid<string> = {
  concat: (x, y) => `${x} ${y}`.trim(),
  empty: ''
}

const ReducedStatsMonoid: Monoid<ReducedStats> = struct({
  status: statusMonoid,
  message: messageMonoid
})

export const statsReducer = (results: readonly StatsSumResult[]): ReducedStats => {
  const invocations = results
    .filter(m => m.metric === 'Invocations')
    .map(m => m.sum)
    .shift() || 0

  const singleStatsSumMapper = statsSumToStatusAndMessage(invocations)

  return concatAll(ReducedStatsMonoid)(results.map(singleStatsSumMapper))
}

export const httpResultFromStats = (result: ReducedStats): HttpResult => ({
  statusCode: 200,
  body: JSON.stringify(result),
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})
