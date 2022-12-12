import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'

export class LambdaStack extends cdk.Stack {
  passedValBuckeNamet: string;
  failedValBucketName: string;
  
  constructor(scope: Construct, id: string, props?: any) {

    super(scope, id, props);

    const { passedValBucketName, failedValBucketName } = props

    const lambdaFunction = new lambda.Function(this, 'MyLambda', {
        code: lambda.Code.fromDockerBuild('./asset', {

        }
        ),
        handler: 'index.main',
        runtime: lambda.Runtime.PYTHON_3_9,
        environment: {
          PASSEDVALBUCKETNAME: passedValBucketName,
          FAILEDVALBUCKETNAME: failedValBucketName,
        }
      }
      );
  }
};