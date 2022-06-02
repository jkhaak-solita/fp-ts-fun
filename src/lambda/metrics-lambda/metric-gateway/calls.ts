import CloudWatch, { GetMetricStatisticsInput, GetMetricStatisticsOutput } from 'aws-sdk/clients/cloudwatch'

const cloudwatch = new CloudWatch({ region: 'eu-west-1' })

export async function getCloudWatchMetrics (params: GetMetricStatisticsInput): Promise<GetMetricStatisticsOutput> {
  return await cloudwatch.getMetricStatistics(params).promise()
}
