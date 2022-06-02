import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as path from 'path'

export class MetricsAppStack extends Stack {
  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const hello = new lambda.Function(this, 'Hello', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../../dist')),
      handler: 'index.handler',
      environment: {
        FUNCTION_NAME: 'monitoring-example-MetricsLambda-123456789'
      }
    })

    // eslint-disable-next-line no-new
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello
    })
  }
}
