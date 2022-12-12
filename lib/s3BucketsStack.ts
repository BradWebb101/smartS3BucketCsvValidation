import * as cdk from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

export class S3BucketCsvSchemaValStack extends cdk.Stack {
  inputBucket: Bucket;
  passedValBucket: Bucket;
  failedValBucket: Bucket;
  bucketName: string;

  constructor(scope: Construct, id: string, props?: any) {
    super(scope, id, props);

    const { bucketName } = props

    this.inputBucket = new Bucket(this, 'InputBucket', {
      bucketName: `${bucketName}in`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    this.passedValBucket = new Bucket(this, 'passedValBucket', {
      bucketName: `${bucketName}passedval`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.failedValBucket = new Bucket(this, 'failedValBucket', {
      bucketName: `${bucketName}failedval`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

