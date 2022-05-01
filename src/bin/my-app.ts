#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { MyAppStack } from '../lib/my-app-stack'

const app = new cdk.App()

// eslint-disable-next-line no-new
new MyAppStack(app, 'MyAppStack', {})
