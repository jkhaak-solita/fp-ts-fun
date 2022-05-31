import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as path from 'path'

export class MyAppStack extends Stack {
  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const hello = new lambda.NodejsFunction(this, 'Hello', {
      entry: path.join(__dirname, '../lambda/index.ts'),
      handler: 'handler',
      bundling: {
        environment: {
          FUNCTION_NAME: 'monitoring-example-MetricsLambda-123456789'
        }
      }
    })

    // eslint-disable-next-line no-new
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello
    })
  }
}
