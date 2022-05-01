import { APIGatewayProxyResult } from 'aws-lambda'

export async function handler (): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: 'howdy world',
    headers: { 'content-type': 'text/plain' }
  }
}
