import { METRICS } from './constants'
import { Datapoints } from 'aws-sdk/clients/cloudwatch'

export type Between = {
  readonly startTime: Date
  readonly endTime: Date
}

export type Metric = (typeof METRICS)[number]

export type StatsResult = {
  readonly functionName: string
  readonly metric: Metric
  readonly data?: Datapoints
}

export type StatsSumResult = {
  readonly functionName: string
  readonly metric: Metric
  readonly sum: number
}
