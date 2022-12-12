#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3BucketCsvSchemaValStack } from '../lib/s3BucketsStack';
import { LambdaStack } from '../lib/lambdaStack';
import { DynamoDBStack } from '../lib/dynamoDBStack';

const app = new cdk.App();

const GLOBALS = {

  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  bucketName: 'testschemavalidationbucket',

};

const s3BucketsStack = new S3BucketCsvSchemaValStack(app, 'S3BucketCsvSchemaValStack', {
  ...GLOBALS,
});

const dynamoTable = new DynamoDBStack(app, 'dynamoTableSchemaValStack', {
  ...GLOBALS,
});

const lambdaFunction = new LambdaStack(app, 'lambdaFunctionSchemaValStack',{
  ...GLOBALS,
  passedValBucketName: s3BucketsStack.passedValBucket.bucketName,
  failedValBucketName: s3BucketsStack.failedValBucket.bucketName,
});

